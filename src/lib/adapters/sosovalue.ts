/**
 * SoSoValue Intelligence Adapter — server-side only.
 * Never import this in client components.
 *
 * Behaviour:
 *  1. If SOSOVALUE_API_KEY is not set → return fallback immediately.
 *  2. If set → attempt live fetch with 6 s timeout (tries news + ETF flow endpoints).
 *  3. On any error → return typed fallback, log the failure.
 *  4. Always exposes { data, mode, fetchedAt } so callers know the source.
 */

import type { AdapterResponse, EvidenceCard } from "@/types";
import {
  FALLBACK_EVIDENCE,
  computeNarrativePressure,
  computeInstitutionalFlowPressure,
} from "@/lib/data/fallback-evidence";

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export type SoSoValueIntelligence = {
  evidenceCards: EvidenceCard[];
  /** 0–100, feeds into risk engine narrative factor */
  narrativePressureScore: number;
  /** 0–100, feeds into risk engine institutional flow factor */
  institutionalFlowScore: number;
  sentimentSummary: string;
};

// ─────────────────────────────────────────────
// In-memory cache (2-min TTL — news doesn't update frequently)
// ─────────────────────────────────────────────

let _cache: {
  result: AdapterResponse<SoSoValueIntelligence>;
  expiresAt: number;
} | null = null;

// ─────────────────────────────────────────────
// Response normalisers
// ─────────────────────────────────────────────

function sentimentFromText(text: string): EvidenceCard["sentiment"] {
  const lower = text.toLowerCase();
  const bearishTerms = [
    "outflow", "selloff", "sell", "decline", "drop", "crash", "hack",
    "exploit", "lawsuit", "rate hike", "whale selling", "liquidation",
    "bearish", "negative", "risk-off", "concern", "warning", "pressure",
    "congestion", "restriction",
  ];
  const bullishTerms = [
    "inflow", "accumulation", "approval", "rally", "adoption", "buy",
    "treasury", "bullish", "positive", "growth", "upgrade", "launch",
  ];
  const bearishScore = bearishTerms.filter((t) => lower.includes(t)).length;
  const bullishScore = bullishTerms.filter((t) => lower.includes(t)).length;
  if (bearishScore > bullishScore) return "bearish";
  if (bullishScore > bearishScore) return "bullish";
  return "neutral";
}

function severityFromSentiment(
  sentiment: EvidenceCard["sentiment"],
  isEtf: boolean
): EvidenceCard["severity"] {
  if (isEtf && sentiment === "bearish") return "high";
  if (sentiment === "bearish") return "medium";
  if (sentiment === "bullish") return "low";
  return "low";
}

function normaliseNewsItem(
  item: Record<string, unknown>,
  index: number,
  source: "SoSoValue"
): EvidenceCard {
  const title = String(
    item.title ?? item.headline ?? item.summary ?? item.content ?? "Market update"
  ).slice(0, 120);
  const description = String(
    item.content ?? item.body ?? item.description ?? item.summary ?? title
  ).slice(0, 400);
  const timestamp = String(
    item.publishedAt ?? item.createdAt ?? item.time ?? item.date ?? new Date().toISOString()
  );
  const asset = String(item.symbol ?? item.asset ?? item.ticker ?? "").toUpperCase() || undefined;
  const sentiment = sentimentFromText(`${title} ${description}`);
  const isEtf =
    title.toLowerCase().includes("etf") || (item.category as string ?? "").toLowerCase().includes("etf");

  return {
    id: `ev-ssv-${index}`,
    source,
    title,
    description,
    asset: asset || undefined,
    category: String(item.category ?? item.type ?? item.tag ?? "News"),
    sentiment,
    severity: severityFromSentiment(sentiment, isEtf),
    timestamp,
    url: item.url ? String(item.url) : undefined,
  };
}

function extractListFromResponse(raw: unknown): unknown[] {
  if (!raw || typeof raw !== "object") return [];
  const data = raw as Record<string, unknown>;
  if (Array.isArray(data)) return data;
  for (const key of ["data", "items", "news", "articles", "results", "list"]) {
    if (Array.isArray(data[key])) return data[key] as unknown[];
  }
  return [];
}

function buildFallbackIntelligence(): SoSoValueIntelligence {
  return {
    evidenceCards: FALLBACK_EVIDENCE,
    narrativePressureScore: computeNarrativePressure(FALLBACK_EVIDENCE),
    institutionalFlowScore: computeInstitutionalFlowPressure(FALLBACK_EVIDENCE),
    sentimentSummary:
      "Fallback data — multiple bearish signals detected including ETF outflows, OI compression, and macro event proximity.",
  };
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

export async function getSoSoValueIntelligence(): Promise<
  AdapterResponse<SoSoValueIntelligence>
> {
  // Serve from cache if fresh
  if (_cache && Date.now() < _cache.expiresAt) {
    return _cache.result;
  }

  const apiKey = process.env.SOSOVALUE_API_KEY?.trim();
  const baseUrl = (
    process.env.SOSOVALUE_BASE_URL ?? "https://openapi.sosovalue.com"
  ).replace(/\/$/, "");

  if (!apiKey) {
    const result: AdapterResponse<SoSoValueIntelligence> = {
      data: buildFallbackIntelligence(),
      mode: "fallback",
      fetchedAt: new Date().toISOString(),
    };
    _cache = { result, expiresAt: Date.now() + 120_000 };
    return result;
  }

  // Build auth headers — try both common patterns
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${apiKey}`,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6_000);

  // Endpoint candidates in priority order
  const newsEndpoints = [
    `${baseUrl}/api/v1/news/flash`,
    `${baseUrl}/openapi/v1/news`,
    `${baseUrl}/api/v1/news?limit=10`,
    `${baseUrl}/v1/news`,
  ];

  let liveCards: EvidenceCard[] = [];

  try {
    for (const endpoint of newsEndpoints) {
      try {
        const res = await fetch(endpoint, { signal: controller.signal, headers });
        if (res.ok) {
          const json = await res.json() as unknown;
          const list = extractListFromResponse(json);
          if (list.length > 0) {
            liveCards = list
              .slice(0, 10)
              .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
              .map((item, i) => normaliseNewsItem(item, i, "SoSoValue"));
            break;
          }
        }
      } catch {
        // try next endpoint
      }
    }

    clearTimeout(timer);

    if (liveCards.length === 0) {
      throw new Error("No usable news data returned from SoSoValue endpoints");
    }

    const intelligence: SoSoValueIntelligence = {
      evidenceCards: liveCards,
      narrativePressureScore: computeNarrativePressure(liveCards),
      institutionalFlowScore: computeInstitutionalFlowPressure(liveCards),
      sentimentSummary: buildSentimentSummary(liveCards),
    };

    const result: AdapterResponse<SoSoValueIntelligence> = {
      data: intelligence,
      mode: "live",
      fetchedAt: new Date().toISOString(),
    };
    _cache = { result, expiresAt: Date.now() + 120_000 };
    return result;
  } catch (err) {
    clearTimeout(timer);
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[SoSoValue Adapter] Live fetch failed — using fallback. Reason: ${message}`
    );

    const result: AdapterResponse<SoSoValueIntelligence> = {
      data: buildFallbackIntelligence(),
      mode: "fallback",
      fetchedAt: new Date().toISOString(),
    };
    _cache = { result, expiresAt: Date.now() + 60_000 };
    return result;
  }
}

function buildSentimentSummary(cards: EvidenceCard[]): string {
  const bearish = cards.filter((c) => c.sentiment === "bearish").length;
  const bullish = cards.filter((c) => c.sentiment === "bullish").length;
  const high = cards.filter((c) => c.severity === "high").length;

  if (bearish > bullish + 1) {
    return `${bearish} bearish signals detected${high > 0 ? `, including ${high} high-severity items` : ""}. Narrative pressure elevated.`;
  }
  if (bullish > bearish) {
    return `${bullish} bullish signals detected. Narrative pressure reduced.`;
  }
  return `Mixed signals — ${bearish} bearish, ${bullish} bullish. Narrative pressure neutral.`;
}
