/**
 * SoDEX Market Data Adapter — server-side only.
 * Never import this in client components.
 *
 * Behaviour:
 *  1. If SODEX_BASE_URL is not set → return fallback immediately.
 *  2. If set → attempt live fetch with 5 s timeout.
 *  3. On any error → return typed fallback, log the failure.
 *  4. Always expose { data, mode, fetchedAt } so callers know the source.
 */

import type { AdapterResponse } from "@/types";

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export type SoDEXMarket = {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: number;
  priceChangePercent: number;
  volume24hUsd: number;
  bidPrice: number;
  askPrice: number;
  spreadBps: number;
  /** How many times wider than the 30-day average spread */
  spreadMultiple: number;
  /** 0–100, higher = more liquid */
  liquidityScore: number;
  /** 0–100, higher = more stressed (used in microstructure risk factor) */
  microstructureStress: number;
};

export type SoDEXMarketData = {
  markets: SoDEXMarket[];
  /** Weighted average microstructure stress across all markets */
  overallMicrostructureStress: number;
  lastUpdatedAt: string;
};

// ─────────────────────────────────────────────
// Fallback data (typed, clearly labelled in responses)
// ─────────────────────────────────────────────

const FALLBACK_MARKETS: SoDEXMarket[] = [
  {
    symbol: "BTC-PERP",
    baseAsset: "BTC",
    quoteAsset: "USDC",
    lastPrice: 42_824,
    priceChangePercent: -2.3,
    volume24hUsd: 18_500_000,
    bidPrice: 42_810,
    askPrice: 42_838,
    spreadBps: 6.5,
    spreadMultiple: 2.3,
    liquidityScore: 42,
    microstructureStress: 62,
  },
  {
    symbol: "ETH-PERP",
    baseAsset: "ETH",
    quoteAsset: "USDC",
    lastPrice: 2_233,
    priceChangePercent: -1.8,
    volume24hUsd: 9_200_000,
    bidPrice: 2_231,
    askPrice: 2_235,
    spreadBps: 8.9,
    spreadMultiple: 1.9,
    liquidityScore: 51,
    microstructureStress: 54,
  },
  {
    symbol: "SOL-PERP",
    baseAsset: "SOL",
    quoteAsset: "USDC",
    lastPrice: 162,
    priceChangePercent: -3.1,
    volume24hUsd: 4_100_000,
    bidPrice: 161.6,
    askPrice: 162.4,
    spreadBps: 12.3,
    spreadMultiple: 2.8,
    liquidityScore: 38,
    microstructureStress: 71,
  },
];

function buildMarketData(markets: SoDEXMarket[]): SoDEXMarketData {
  const overall =
    markets.length > 0
      ? Math.round(
          markets.reduce((s, m) => s + m.microstructureStress, 0) / markets.length
        )
      : 50;
  return {
    markets,
    overallMicrostructureStress: overall,
    lastUpdatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────
// In-memory cache (60 s TTL to reduce live API calls)
// ─────────────────────────────────────────────

let _cache: { result: AdapterResponse<SoDEXMarketData>; expiresAt: number } | null = null;

// ─────────────────────────────────────────────
// Response normaliser (handles unknown API shapes)
// ─────────────────────────────────────────────

function computeStress(spreadBps: number, liquidityScore: number): number {
  const spreadStress = Math.min(100, spreadBps * 6);
  const liquidityStress = Math.max(0, 100 - liquidityScore);
  return Math.round(spreadStress * 0.6 + liquidityStress * 0.4);
}

function normalizeLiveResponse(raw: unknown): SoDEXMarket[] | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Record<string, unknown>;
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
    ? (data.data as unknown[])
    : Array.isArray(data.markets)
    ? (data.markets as unknown[])
    : Array.isArray(data.result)
    ? (data.result as unknown[])
    : [];

  if (list.length === 0) return null;

  return list.slice(0, 20).map((item) => {
    if (!item || typeof item !== "object") return FALLBACK_MARKETS[0];
    const m = item as Record<string, unknown>;

    const bid = Number(m.bid ?? m.bidPrice ?? m.best_bid ?? 0);
    const ask = Number(m.ask ?? m.askPrice ?? m.best_ask ?? 0);
    const last = Number(m.last ?? m.lastPrice ?? m.price ?? m.markPrice ?? 0);
    const rawSpread =
      bid > 0 && ask > 0 ? ((ask - bid) / ((bid + ask) / 2)) * 10_000 : 10;
    const spreadBps = Math.round(rawSpread * 10) / 10;
    const liquidityScore = Math.max(10, Math.min(100, Math.round(100 - spreadBps * 4)));

    return {
      symbol: String(m.symbol ?? m.market ?? m.pair ?? m.instrumentId ?? "UNKNOWN"),
      baseAsset: String(m.baseAsset ?? m.base ?? m.baseCurrency ?? ""),
      quoteAsset: String(m.quoteAsset ?? m.quote ?? m.quoteCurrency ?? "USDC"),
      lastPrice: last,
      priceChangePercent: Number(m.priceChangePercent ?? m.change24h ?? m.priceChange ?? 0),
      volume24hUsd: Number(m.volume24h ?? m.volume ?? m.quoteVolume ?? 0),
      bidPrice: bid,
      askPrice: ask,
      spreadBps,
      spreadMultiple: spreadBps > 8 ? 2.3 : spreadBps > 4 ? 1.5 : 1.0,
      liquidityScore,
      microstructureStress: computeStress(spreadBps, liquidityScore),
    };
  });
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

export async function getSoDEXMarketData(): Promise<AdapterResponse<SoDEXMarketData>> {
  // Serve from cache if fresh
  if (_cache && Date.now() < _cache.expiresAt) {
    return _cache.result;
  }

  const baseUrl = process.env.SODEX_BASE_URL?.trim();

  if (!baseUrl) {
    const result: AdapterResponse<SoDEXMarketData> = {
      data: buildMarketData(FALLBACK_MARKETS),
      mode: "fallback",
      fetchedAt: new Date().toISOString(),
    };
    _cache = { result, expiresAt: Date.now() + 60_000 };
    return result;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5_000);

    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env.SODEX_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.SODEX_API_KEY}`;
    }

    // Try common SoDEX market-data endpoint patterns
    const endpoints = [
      `${baseUrl}/api/v1/markets`,
      `${baseUrl}/api/v1/tickers`,
      `${baseUrl}/v1/markets`,
      `${baseUrl}/markets`,
    ];

    let liveData: SoDEXMarket[] | null = null;

    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, { signal: controller.signal, headers });
        if (res.ok) {
          const json = await res.json();
          liveData = normalizeLiveResponse(json);
          if (liveData && liveData.length > 0) break;
        }
      } catch {
        // try next endpoint
      }
    }

    clearTimeout(timer);

    if (!liveData || liveData.length === 0) {
      throw new Error("No usable market data returned from SoDEX endpoints");
    }

    const result: AdapterResponse<SoDEXMarketData> = {
      data: buildMarketData(liveData),
      mode: "live",
      fetchedAt: new Date().toISOString(),
    };
    _cache = { result, expiresAt: Date.now() + 60_000 };
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[SoDEX Adapter] Live fetch failed — using fallback. Reason: ${message}`);

    const result: AdapterResponse<SoDEXMarketData> = {
      data: buildMarketData(FALLBACK_MARKETS),
      mode: "fallback",
      fetchedAt: new Date().toISOString(),
    };
    _cache = { result, expiresAt: Date.now() + 30_000 };
    return result;
  }
}
