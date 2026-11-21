/**
 * SoSoValue Intelligence Adapter — server-side only.
 * Never import this in client components.
 *
 * Pulls four live SoSoValue sources in parallel and turns them into
 * risk-engine inputs:
 *
 *   ETF flows   (/etfs/summary-history BTC+ETH)  → institutional flow score
 *   News + hot  (/news, /news/hot)               → narrative pressure score
 *   Macro       (/macro/events)                  → event proximity score
 *
 * Each source has its own cache TTL (sized to the 100k/month quota) and
 * fails independently. A failed source contributes a neutral score of 50
 * and is reported in `sources` — it is never replaced with invented data.
 * Only when the key is missing or *every* source fails does the adapter
 * return the typed fallback set, labelled mode: "fallback".
 */

import type { AdapterResponse, EvidenceCard } from "@/types";
import {
  FALLBACK_EVIDENCE,
  computeNarrativePressure,
  computeInstitutionalFlowPressure,
} from "@/lib/data/fallback-evidence";
import {
  getEtfSummaryHistory,
  getHotNews,
  getMacroCalendar,
  getNews,
  getSoSoValueConfig,
  SoSoValueError,
  type EtfSummaryDay,
  type HotNewsItem,
  type MacroCalendarDay,
  type NewsItem,
} from "./sosovalue-client";

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export type EtfFlowSummary = {
  symbol: "BTC" | "ETH";
  latestDate: string;
  latestNetInflowUsd: number;
  /** Sum of net inflow over the last 5 trading days */
  netInflow5dUsd: number;
  totalNetAssetsUsd: number;
  /** 5-day net flow as % of total net assets (negative = outflow) */
  flow5dPctOfAum: number;
  /** Consecutive trading days of net outflow (0 if latest day was an inflow) */
  outflowStreakDays: number;
};

export type MacroEventSummary = {
  date: string;
  name: string;
  impact: "high" | "medium" | "low";
  daysAway: number;
};

export type SourceStatus = { ok: boolean; fetchedAt: string; error?: string };

export type SoSoValueIntelligence = {
  evidenceCards: EvidenceCard[];
  /** 0–100, feeds into risk engine narrative factor */
  narrativePressureScore: number;
  /** 0–100, feeds into risk engine institutional flow factor */
  institutionalFlowScore: number;
  /** 0–100, feeds into risk engine event proximity factor */
  eventProximityScore: number;
  sentimentSummary: string;
  etfFlows: EtfFlowSummary[];
  upcomingEvents: MacroEventSummary[];
  /** Per-source health; absent in fallback mode */
  sources?: { etf: SourceStatus; news: SourceStatus; macro: SourceStatus };
};

// ─────────────────────────────────────────────
// Per-source cache
// ─────────────────────────────────────────────

const TTL = {
  etf: 30 * 60_000, // daily data, settles T+1
  news: 5 * 60_000,
  macro: 6 * 60 * 60_000,
  failure: 60_000, // retry a failed source after 1 min
} as const;

type CacheEntry<T> = { value: T; fetchedAt: string; expiresAt: number };
const _cache = new Map<string, CacheEntry<unknown>>();
const _inflight = new Map<string, Promise<unknown>>();

async function cached<T>(key: string, ttl: number, load: () => Promise<T>): Promise<CacheEntry<T>> {
  const hit = _cache.get(key) as CacheEntry<T> | undefined;
  if (hit && Date.now() < hit.expiresAt) return hit;

  // Collapse concurrent callers (scan + status + evidence fire together)
  let pending = _inflight.get(key) as Promise<T> | undefined;
  if (!pending) {
    pending = load();
    _inflight.set(key, pending);
  }
  try {
    const value = await pending;
    const entry = { value, fetchedAt: new Date().toISOString(), expiresAt: Date.now() + ttl };
    _cache.set(key, entry);
    return entry;
  } finally {
    _inflight.delete(key);
  }
}

type Settled<T> = { ok: true; value: T; fetchedAt: string } | { ok: false; error: string; fetchedAt: string };

const _failures = new Map<string, { error: string; until: number; fetchedAt: string }>();

async function settle<T>(key: string, ttl: number, load: () => Promise<T>): Promise<Settled<T>> {
  const failed = _failures.get(key);
  if (failed && Date.now() < failed.until) {
    return { ok: false, error: failed.error, fetchedAt: failed.fetchedAt };
  }
  try {
    const entry = await cached(key, ttl, load);
    _failures.delete(key);
    return { ok: true, value: entry.value, fetchedAt: entry.fetchedAt };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const fetchedAt = new Date().toISOString();
    // Back off harder on auth / rate-limit errors
    const backoff = err instanceof SoSoValueError && (err.isAuthError || err.isRateLimited) ? 5 * 60_000 : TTL.failure;
    _failures.set(key, { error, until: Date.now() + backoff, fetchedAt });
    console.warn(`[SoSoValue] ${key} failed: ${error}`);
    return { ok: false, error, fetchedAt };
  }
}

// ─────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────

function cleanText(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function toIso(ms: string | number): string {
  const n = Number(ms);
  return Number.isFinite(n) && n > 0 ? new Date(n).toISOString() : new Date().toISOString();
}

function fmtUsd(n: number): string {
  const sign = n < 0 ? "−" : "+";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// ─────────────────────────────────────────────
// Sentiment (keyword-based — SoSoValue does not return sentiment)
// ─────────────────────────────────────────────

const BEARISH_TERMS = [
  "outflow", "sell-off", "selloff", "sold", "dump", "decline", "drop", "fell", "falls", "plunge",
  "crash", "tumble", "slump", "below", "breaks down", "hack", "exploit", "lawsuit", "sues",
  "rate hike", "hawkish", "liquidat", "short", "bearish", "risk-off", "concern", "warning",
  "pressure", "restriction", "ban", "delist", "bankrupt", "insolven", "outage", "depeg",
];
const BULLISH_TERMS = [
  "inflow", "accumulat", "approval", "approved", "rally", "surge", "soar", "jump", "climb",
  "breaks above", "record high", "all-time high", "adoption", "bought", "buys", "treasury",
  "bullish", "dovish", "rate cut", "growth", "upgrade", "launch", "partnership",
];

function countTerms(text: string, terms: string[]): number {
  return terms.reduce((n, t) => (text.includes(t) ? n + 1 : n), 0);
}

export function sentimentFromText(text: string): NonNullable<EvidenceCard["sentiment"]> {
  const lower = text.toLowerCase();
  const bear = countTerms(lower, BEARISH_TERMS);
  const bull = countTerms(lower, BULLISH_TERMS);
  if (bear > bull) return "bearish";
  if (bull > bear) return "bullish";
  return "neutral";
}

// ─────────────────────────────────────────────
// ETF flows → institutional flow score
// ─────────────────────────────────────────────

export function summariseEtf(symbol: "BTC" | "ETH", days: EtfSummaryDay[]): EtfFlowSummary | null {
  // API returns newest first; skip unsettled rows with null/NaN flows.
  const rows = days.filter((d) => Number.isFinite(Number(d.total_net_inflow)));
  if (rows.length === 0) return null;

  const last5 = rows.slice(0, 5);
  const netInflow5dUsd = last5.reduce((s, d) => s + Number(d.total_net_inflow), 0);
  const totalNetAssetsUsd = Number(rows[0].total_net_assets) || 0;

  let outflowStreakDays = 0;
  for (const d of rows) {
    if (Number(d.total_net_inflow) < 0) outflowStreakDays++;
    else break;
  }

  return {
    symbol,
    latestDate: rows[0].date,
    latestNetInflowUsd: Number(rows[0].total_net_inflow),
    netInflow5dUsd,
    totalNetAssetsUsd,
    flow5dPctOfAum: totalNetAssetsUsd > 0 ? (netInflow5dUsd / totalNetAssetsUsd) * 100 : 0,
    outflowStreakDays,
  };
}

/**
 * Institutional flow pressure (0–100).
 *
 *   raw   = −pct × 25 + streak      (pct = BTC+ETH 5-day net flow as % of AUM;
 *                                    streak = 3 × outflow days on the larger complex, max 15)
 *   score = 50 + 50 × tanh(raw / 50)
 *
 * tanh keeps the score centred at 50 for flat flows and saturates softly, so
 * a −1.7% week (~89) still reads below a −3% capitulation week (~97).
 */
export function computeEtfFlowScore(flows: EtfFlowSummary[]): number {
  if (flows.length === 0) return 50;
  const aum = flows.reduce((s, f) => s + f.totalNetAssetsUsd, 0);
  const net = flows.reduce((s, f) => s + f.netInflow5dUsd, 0);
  const pct = aum > 0 ? (net / aum) * 100 : 0;
  const lead = [...flows].sort((a, b) => b.totalNetAssetsUsd - a.totalNetAssetsUsd)[0];
  const streak = Math.min(15, lead.outflowStreakDays * 3);
  const raw = -pct * 25 + streak;
  return clamp(50 + 50 * Math.tanh(raw / 50));
}

function etfCard(f: EtfFlowSummary): EvidenceCard {
  const out = f.latestNetInflowUsd < 0;
  const severity: EvidenceCard["severity"] =
    f.flow5dPctOfAum <= -1 || f.outflowStreakDays >= 4 ? "high" : out ? "medium" : "low";
  const streak = f.outflowStreakDays >= 2 ? ` ${f.outflowStreakDays} consecutive outflow days.` : "";
  return {
    id: `ev-ssv-etf-${f.symbol.toLowerCase()}`,
    source: "SoSoValue",
    title: `US ${f.symbol} spot ETFs: ${fmtUsd(f.latestNetInflowUsd)} net ${out ? "outflow" : "inflow"} (${f.latestDate})`,
    description: `5-day net flow ${fmtUsd(f.netInflow5dUsd)} (${f.flow5dPctOfAum.toFixed(2)}% of ${fmtUsd(f.totalNetAssetsUsd).slice(1)} AUM).${streak}`,
    asset: f.symbol,
    category: "ETF Flow",
    sentiment: f.netInflow5dUsd < 0 ? "bearish" : f.netInflow5dUsd > 0 ? "bullish" : "neutral",
    severity,
    timestamp: new Date(`${f.latestDate}T21:00:00Z`).toISOString(),
    url: "https://sosovalue.com/assets/etf/us-btc-spot",
  };
}

// ─────────────────────────────────────────────
// News → narrative pressure
// ─────────────────────────────────────────────

const TRACKED_ASSETS = new Set(["BTC", "ETH", "SOL", "SOSO"]);
// Hot news has no currency tags — fall back to the headline text.
const ASSET_PATTERNS: Array<[string, RegExp]> = [
  ["BTC", /\b(BTC|bitcoin)\b/i],
  ["ETH", /\b(ETH|ether|ethereum)\b/i],
  ["SOL", /\b(SOL|solana)\b/i],
  ["SOSO", /\bSOSO\b/i],
];

function newsCard(item: NewsItem | HotNewsItem, index: number, hot: boolean): EvidenceCard | null {
  const title = cleanText(item.title) || cleanText(item.content).slice(0, 120);
  if (!title) return null;
  const description = cleanText(item.content).slice(0, 400) || title;
  const sentiment = sentimentFromText(`${title} ${description}`);
  const matched = "matched_currencies" in item ? item.matched_currencies ?? [] : [];
  const asset =
    matched.map((c) => c.symbol.toUpperCase()).find((s) => TRACKED_ASSETS.has(s)) ??
    ASSET_PATTERNS.find(([, re]) => re.test(title))?.[0];

  return {
    id: `ev-ssv-${hot ? "hot" : "news"}-${item.id ?? index}`,
    source: "SoSoValue",
    title: title.slice(0, 160),
    description,
    asset,
    category: "News",
    sentiment,
    severity: sentiment === "bearish" ? (hot ? "high" : "medium") : "low",
    timestamp: toIso(item.release_time),
    url: item.source_link || undefined,
  };
}

// ─────────────────────────────────────────────
// Macro calendar → event proximity
// ─────────────────────────────────────────────

const HIGH_IMPACT = [/cpi/i, /pce/i, /nonfarm payrolls/i, /fomc/i, /fed.*rate|interest rate decision/i, /gdp/i, /unemployment rate/i];
const MEDIUM_IMPACT = [/ppi/i, /ism/i, /pmi/i, /jobless claims/i, /jolts/i, /retail sales/i, /adp/i];

function eventImpact(name: string): MacroEventSummary["impact"] {
  if (HIGH_IMPACT.some((r) => r.test(name))) return "high";
  if (MEDIUM_IMPACT.some((r) => r.test(name))) return "medium";
  return "low";
}

function utcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function summariseMacro(days: MacroCalendarDay[], now = new Date()): MacroEventSummary[] {
  const today = utcDay(now);
  const out: MacroEventSummary[] = [];
  for (const day of days) {
    const t = Date.parse(`${day.date}T00:00:00Z`);
    if (!Number.isFinite(t)) continue;
    const daysAway = Math.round((t - today) / 86_400_000);
    if (daysAway < 0 || daysAway > 14) continue;
    for (const raw of day.events ?? []) {
      const name = raw.trim();
      if (name) out.push({ date: day.date, name, impact: eventImpact(name), daysAway });
    }
  }
  return out.sort((a, b) => a.daysAway - b.daysAway);
}

/** "Core PCE Price Index (MoM)" and "(YoY)" are one release — collapse them. */
function releaseFamily(e: MacroEventSummary): string {
  return `${e.date}|${e.name.replace(/\s*\((mom|yoy|qoq)\)\s*/gi, "").trim().toLowerCase()}`;
}

/**
 * Event proximity (0–100) = 15 + 85 × (1 − e^(−load / 60))
 *   load   = Σ over distinct releases of impact × decay
 *   impact: high 30, medium 12, low 4
 *   decay:  0–1 days 1.0, 2–3 days 0.6, 4–7 days 0.3, later 0
 *
 * Saturating curve: one high-impact print tomorrow ≈ 50, a dense week ≈ 75.
 */
export function computeEventProximityScore(events: MacroEventSummary[]): number {
  const weight = { high: 30, medium: 12, low: 4 } as const;
  const decay = (d: number) => (d <= 1 ? 1 : d <= 3 ? 0.6 : d <= 7 ? 0.3 : 0);
  const seen = new Set<string>();
  let load = 0;
  for (const e of events) {
    const fam = releaseFamily(e);
    if (seen.has(fam)) continue;
    seen.add(fam);
    load += weight[e.impact] * decay(e.daysAway);
  }
  return clamp(15 + 85 * (1 - Math.exp(-load / 60)));
}

function macroCard(e: MacroEventSummary): EvidenceCard {
  const when = e.daysAway === 0 ? "today" : e.daysAway === 1 ? "tomorrow" : `in ${e.daysAway} days`;
  return {
    id: `ev-ssv-macro-${e.date}-${e.name.replace(/\W+/g, "-").toLowerCase()}`,
    source: "SoSoValue",
    title: `${e.name} — ${when} (${e.date})`,
    description: `${e.impact === "high" ? "High" : "Medium"}-impact US macro release. Volatility typically rises into and around the print.`,
    category: "Macro",
    sentiment: "neutral",
    severity:
      e.impact === "high" ? (e.daysAway <= 3 ? "high" : "medium")
      : e.daysAway <= 1 ? "medium"
      : "low",
    timestamp: new Date(`${e.date}T12:30:00Z`).toISOString(),
    url: "https://sosovalue.com/macro",
  };
}

// ─────────────────────────────────────────────
// Summary text
// ─────────────────────────────────────────────

function buildSentimentSummary(flows: EtfFlowSummary[], news: EvidenceCard[], events: MacroEventSummary[]): string {
  const parts: string[] = [];
  if (flows.length) {
    const net = flows.reduce((s, f) => s + f.netInflow5dUsd, 0);
    parts.push(`BTC+ETH spot ETFs ${fmtUsd(net)} over 5 days`);
  }
  if (news.length) {
    const bear = news.filter((c) => c.sentiment === "bearish").length;
    const bull = news.filter((c) => c.sentiment === "bullish").length;
    parts.push(`${bear} bearish / ${bull} bullish of ${news.length} headlines`);
  }
  const nextHigh = events.find((e) => e.impact === "high");
  if (nextHigh) parts.push(`next high-impact event: ${nextHigh.name} ${nextHigh.daysAway === 0 ? "today" : `in ${nextHigh.daysAway}d`}`);
  return parts.length ? `${parts.join(" · ")}.` : "No live SoSoValue signals available.";
}

// ─────────────────────────────────────────────
// Fallback
// ─────────────────────────────────────────────

function buildFallbackIntelligence(): SoSoValueIntelligence {
  return {
    evidenceCards: FALLBACK_EVIDENCE,
    narrativePressureScore: computeNarrativePressure(FALLBACK_EVIDENCE),
    institutionalFlowScore: computeInstitutionalFlowPressure(FALLBACK_EVIDENCE),
    eventProximityScore: 50,
    sentimentSummary: "Fallback sample data — not live. Configure SOSOVALUE_API_KEY for real signals.",
    etfFlows: [],
    upcomingEvents: [],
  };
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

export async function getSoSoValueIntelligence(): Promise<AdapterResponse<SoSoValueIntelligence>> {
  const { configured, baseUrl } = getSoSoValueConfig();

  if (!configured) {
    return {
      data: buildFallbackIntelligence(),
      mode: "fallback",
      fetchedAt: new Date().toISOString(),
      reason: "API key not configured. Set SOSOVALUE_API_KEY to enable live SoSoValue reads.",
      endpoint: baseUrl,
    };
  }

  const [btc, eth, news, hot, macro] = await Promise.all([
    settle("etf:BTC", TTL.etf, () => getEtfSummaryHistory("BTC", "US", 15)),
    settle("etf:ETH", TTL.etf, () => getEtfSummaryHistory("ETH", "US", 15)),
    settle("news", TTL.news, () => getNews({ category: 1, pageSize: 30 })),
    settle("news:hot", TTL.news, () => getHotNews({ pageSize: 15 })),
    settle("macro", TTL.macro, () => getMacroCalendar()),
  ]);

  // ETF
  const etfFlows = [
    btc.ok ? summariseEtf("BTC", btc.value) : null,
    eth.ok ? summariseEtf("ETH", eth.value) : null,
  ].filter((f): f is EtfFlowSummary => f !== null);
  const etfOk = etfFlows.length > 0;

  // News — hot first, de-duplicated by title
  const seen = new Set<string>();
  const newsCards: EvidenceCard[] = [];
  const pushUnique = (c: EvidenceCard | null) => {
    if (!c) return;
    const k = c.title.toLowerCase().slice(0, 60);
    if (seen.has(k)) return;
    seen.add(k);
    newsCards.push(c);
  };
  if (hot.ok) hot.value.list.forEach((n, i) => pushUnique(newsCard(n, i, true)));
  if (news.ok) news.value.list.forEach((n, i) => pushUnique(newsCard(n, i, false)));
  const newsOk = hot.ok || news.ok;

  // Macro
  const upcomingEvents = macro.ok ? summariseMacro(macro.value) : [];

  if (!etfOk && !newsOk && !macro.ok) {
    const errors = [btc, eth, news, hot, macro].filter((s) => !s.ok).map((s) => (s.ok ? "" : s.error));
    return {
      data: buildFallbackIntelligence(),
      mode: "fallback",
      fetchedAt: new Date().toISOString(),
      reason: `All SoSoValue reads failed; showing sample data. ${errors[0] ?? ""}`.trim(),
      endpoint: baseUrl,
    };
  }

  const institutionalFlowScore = etfOk ? computeEtfFlowScore(etfFlows) : 50;
  const narrativePressureScore = newsOk ? computeNarrativePressure(newsCards) : 50;
  const eventProximityScore = macro.ok ? computeEventProximityScore(upcomingEvents) : 50;

  const macroSeen = new Set<string>();
  const macroCards = upcomingEvents
    .filter((e) => e.impact !== "low" && e.daysAway <= 7)
    .filter((e) => {
      const fam = releaseFamily(e);
      if (macroSeen.has(fam)) return false;
      macroSeen.add(fam);
      return true;
    })
    .slice(0, 4)
    .map(macroCard);

  const evidenceCards = [...etfFlows.map(etfCard), ...macroCards, ...newsCards.slice(0, 10)];

  const status = (ok: boolean, s: Settled<unknown>[]): SourceStatus => {
    const failed = s.find((x) => !x.ok);
    return { ok, fetchedAt: s[0].fetchedAt, error: failed && !failed.ok ? failed.error : undefined };
  };
  const sources = {
    etf: status(etfOk, [btc, eth]),
    news: status(newsOk, [hot, news]),
    macro: status(macro.ok, [macro]),
  };
  const degraded = Object.entries(sources).filter(([, s]) => !s.ok).map(([k]) => k);

  return {
    data: {
      evidenceCards,
      narrativePressureScore,
      institutionalFlowScore,
      eventProximityScore,
      sentimentSummary: buildSentimentSummary(etfFlows, newsCards, upcomingEvents),
      etfFlows,
      upcomingEvents,
      sources,
    },
    mode: "live",
    fetchedAt: new Date().toISOString(),
    reason: degraded.length
      ? `Live SoSoValue read; ${degraded.join(", ")} unavailable (neutral score used).`
      : "Live SoSoValue read succeeded (ETF flows, news, macro calendar).",
    endpoint: baseUrl,
  };
}
