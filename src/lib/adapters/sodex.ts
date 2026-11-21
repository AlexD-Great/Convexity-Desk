/**
 * SoDEX Market Data Adapter — server-side only.
 * Never import this in client components.
 *
 * Reads unsigned public market data from SoDEX **mainnet** (real liquidity).
 * Testnet is reserved for order execution and is never used to measure the
 * market. Endpoints (verified 2026-11-21):
 *
 *   GET {base}/perps/markets/tickers                    all perp tickers
 *   GET {base}/perps/markets/{symbol}/orderbook?limit=N  L2 book, [price, size][]
 *
 * Envelope: { code: 0, timestamp, data }. Symbols look like "BTC-USD".
 *
 * Failure policy: last good live snapshot is served (marked stale) for up to
 * 10 minutes; only after that does the typed fallback set appear, labelled
 * mode: "fallback". No live trade execution is implemented here.
 */

import type { AdapterResponse } from "@/types";

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export type BookLevel = [price: number, size: number];

export type SoDEXMarket = {
  symbol: string; // display, e.g. "BTC-PERP"
  venueSymbol: string; // SoDEX symbol, e.g. "BTC-USD"
  baseAsset: string;
  quoteAsset: string;
  lastPrice: number;
  markPrice: number;
  indexPrice: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  /** (high − low) / open, % */
  range24hPct: number;
  volume24hUsd: number;
  openInterestUsd: number;
  /** Raw funding rate per funding interval (decimal, e.g. -0.00002) */
  fundingRate: number;
  bidPrice: number;
  askPrice: number;
  spreadBps: number;
  /** Spread relative to a 2 bps healthy reference for major perps */
  spreadMultiple: number;
  /** USD notional resting within ±25 bps of mid, per side */
  depthBidUsd25bps: number;
  depthAskUsd25bps: number;
  /** 0–100, higher = more liquid */
  liquidityScore: number;
  /** 0–100, higher = more stressed (feeds microstructure risk factor) */
  microstructureStress: number;
  /** Order book levels (best first), trimmed to ±2% of mid. Empty in fallback. */
  book: { bids: BookLevel[]; asks: BookLevel[] };
};

export type SoDEXMarketData = {
  markets: SoDEXMarket[];
  /** Volume-weighted microstructure stress across tracked markets */
  overallMicrostructureStress: number;
  lastUpdatedAt: string;
  network: "mainnet" | "testnet" | "fallback";
  /** True when serving a previous live snapshot because the latest read failed */
  stale?: boolean;
};

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const DEFAULT_MAINNET_BASE_URL = "https://mainnet-gw.sodex.dev/api/v1";
const TRACKED = ["BTC", "ETH", "SOL"] as const;
const REFERENCE_SPREAD_BPS = 2;
const CACHE_TTL_MS = 30_000;
const STALE_MAX_MS = 10 * 60_000;
const TIMEOUT_MS = 7_000;

function marketDataBaseUrl(): { baseUrl: string; network: "mainnet" | "testnet" } {
  const raw = (process.env.SODEX_BASE_URL?.trim() || DEFAULT_MAINNET_BASE_URL).replace(/\/+$/, "");
  const baseUrl = raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;
  return { baseUrl, network: /testnet/i.test(baseUrl) ? "testnet" : "mainnet" };
}

// ─────────────────────────────────────────────
// HTTP
// ─────────────────────────────────────────────

async function sodexGet<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const body = (await res.json()) as { code?: number; data?: T; msg?: string; message?: string };
  if (body.code !== undefined && body.code !== 0) {
    throw new Error(`${url} → code ${body.code} ${body.msg ?? body.message ?? ""}`.trim());
  }
  if (body.data === undefined) throw new Error(`${url} → missing data`);
  return body.data;
}

type RawTicker = {
  symbol: string;
  lastPx: string;
  openPx: string;
  highPx: string;
  lowPx: string;
  quoteVolume: string;
  changePct: number | string;
  askPx: string;
  bidPx: string;
  fundingRate?: string;
  indexPrice?: string;
  markPrice?: string;
  openInterest?: string;
};

type RawBook = { bids: [string, string][]; asks: [string, string][] };

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

// ─────────────────────────────────────────────
// Metrics
// ─────────────────────────────────────────────

function depthWithin(levels: BookLevel[], mid: number, bps: number, side: "bid" | "ask"): number {
  const limit = side === "bid" ? mid * (1 - bps / 10_000) : mid * (1 + bps / 10_000);
  return levels
    .filter(([p]) => (side === "bid" ? p >= limit : p <= limit))
    .reduce((s, [p, q]) => s + p * q, 0);
}

/**
 * Microstructure stress (0–100) = 0.40 × volatility + 0.35 × depth + 0.25 × spread
 *   volatility = range24h% × 10            (5% day → 50, 10% → 100)
 *   depth      = (6.7 − log10(min-side USD depth ±25bps)) × 50
 *                                          ($5M → 0, $500k → 50, $50k → 100)
 *   spread     = spreadBps × 10            (1 bp → 10, 10 bps → 100)
 */
export function computeMicrostructure(range24hPct: number, minDepthUsd: number, spreadBps: number) {
  const volStress = clamp(range24hPct * 10);
  const depthStress = clamp((6.7 - Math.log10(Math.max(1, minDepthUsd))) * 50);
  const spreadStress = clamp(spreadBps * 10);
  return {
    stress: clamp(volStress * 0.4 + depthStress * 0.35 + spreadStress * 0.25),
    liquidityScore: clamp(100 - depthStress * 0.7 - spreadStress * 0.3),
  };
}

function normalise(t: RawTicker, rawBook: RawBook | null): SoDEXMarket {
  const base = t.symbol.split("-")[0].toUpperCase();
  const last = num(t.lastPx);
  const open = num(t.openPx) || last;
  const high = num(t.highPx);
  const low = num(t.lowPx);

  const bids: BookLevel[] = (rawBook?.bids ?? []).map(([p, q]) => [num(p), num(q)]);
  const asks: BookLevel[] = (rawBook?.asks ?? []).map(([p, q]) => [num(p), num(q)]);
  const bid = bids[0]?.[0] || num(t.bidPx);
  const ask = asks[0]?.[0] || num(t.askPx);
  const mid = bid > 0 && ask > 0 ? (bid + ask) / 2 : last;

  const spreadBps = mid > 0 && ask > bid ? Math.round(((ask - bid) / mid) * 100_000) / 10 : 0;
  const range24hPct = open > 0 && high > 0 && low > 0 ? ((high - low) / open) * 100 : 0;
  const depthBidUsd25bps = Math.round(depthWithin(bids, mid, 25, "bid"));
  const depthAskUsd25bps = Math.round(depthWithin(asks, mid, 25, "ask"));
  const { stress, liquidityScore } = computeMicrostructure(
    range24hPct,
    Math.min(depthBidUsd25bps, depthAskUsd25bps),
    spreadBps
  );

  const lo = mid * 0.98;
  const hi = mid * 1.02;

  return {
    symbol: `${base}-PERP`,
    venueSymbol: t.symbol,
    baseAsset: base,
    quoteAsset: "USDC",
    lastPrice: last,
    markPrice: num(t.markPrice) || last,
    indexPrice: num(t.indexPrice) || last,
    priceChangePercent: Math.round(num(t.changePct) * 100) / 100,
    high24h: high,
    low24h: low,
    range24hPct: Math.round(range24hPct * 100) / 100,
    volume24hUsd: Math.round(num(t.quoteVolume)),
    openInterestUsd: Math.round(num(t.openInterest) * (num(t.markPrice) || last)),
    fundingRate: num(t.fundingRate),
    bidPrice: bid,
    askPrice: ask,
    spreadBps,
    spreadMultiple: Math.round((spreadBps / REFERENCE_SPREAD_BPS) * 10) / 10,
    depthBidUsd25bps,
    depthAskUsd25bps,
    liquidityScore,
    microstructureStress: stress,
    book: {
      bids: bids.filter(([p]) => p >= lo),
      asks: asks.filter(([p]) => p <= hi),
    },
  };
}

function aggregate(markets: SoDEXMarket[], network: SoDEXMarketData["network"]): SoDEXMarketData {
  const vol = markets.reduce((s, m) => s + m.volume24hUsd, 0);
  const overall =
    markets.length === 0
      ? 50
      : vol > 0
      ? markets.reduce((s, m) => s + m.microstructureStress * m.volume24hUsd, 0) / vol
      : markets.reduce((s, m) => s + m.microstructureStress, 0) / markets.length;
  return {
    markets,
    overallMicrostructureStress: clamp(overall),
    lastUpdatedAt: new Date().toISOString(),
    network,
  };
}

// ─────────────────────────────────────────────
// Execution helper — walk the book
// ─────────────────────────────────────────────

/**
 * Estimate average fill for a market order of `sizeUsd` against real book levels.
 * Sell orders (shorts) consume bids; buys consume asks.
 * Returns null when the book is empty; `filled` < 1 when depth is insufficient.
 */
export function estimateFill(market: SoDEXMarket, sizeUsd: number, side: "buy" | "sell") {
  const levels = side === "sell" ? market.book.bids : market.book.asks;
  if (levels.length === 0 || sizeUsd <= 0) return null;
  const mid = (market.bidPrice + market.askPrice) / 2 || market.lastPrice;

  let remainingUsd = sizeUsd;
  let qty = 0;
  let notional = 0;
  let worstPrice = levels[0][0];
  for (const [price, size] of levels) {
    const levelUsd = price * size;
    const takeUsd = Math.min(levelUsd, remainingUsd);
    qty += takeUsd / price;
    notional += takeUsd;
    remainingUsd -= takeUsd;
    worstPrice = price;
    if (remainingUsd <= 0) break;
  }
  const avgPrice = qty > 0 ? notional / qty : mid;
  const slippageBps = mid > 0 ? (Math.abs(avgPrice - mid) / mid) * 10_000 : 0;
  return {
    avgPrice,
    slippageBps: Math.round(slippageBps * 10) / 10,
    filled: Math.min(1, notional / sizeUsd),
    worstPrice,
  };
}

// ─────────────────────────────────────────────
// Fallback (labelled sample data — only when no live snapshot exists)
// ─────────────────────────────────────────────

function fallbackMarket(base: string, price: number, chg: number): SoDEXMarket {
  const spreadBps = 3;
  const { stress, liquidityScore } = computeMicrostructure(5, 500_000, spreadBps);
  return {
    symbol: `${base}-PERP`,
    venueSymbol: `${base}-USD`,
    baseAsset: base,
    quoteAsset: "USDC",
    lastPrice: price,
    markPrice: price,
    indexPrice: price,
    priceChangePercent: chg,
    high24h: price * 1.03,
    low24h: price * 0.98,
    range24hPct: 5,
    volume24hUsd: 0,
    openInterestUsd: 0,
    fundingRate: 0,
    bidPrice: price * (1 - spreadBps / 20_000),
    askPrice: price * (1 + spreadBps / 20_000),
    spreadBps,
    spreadMultiple: spreadBps / REFERENCE_SPREAD_BPS,
    depthBidUsd25bps: 500_000,
    depthAskUsd25bps: 500_000,
    liquidityScore,
    microstructureStress: stress,
    book: { bids: [], asks: [] },
  };
}

const FALLBACK_MARKETS: SoDEXMarket[] = [
  fallbackMarket("BTC", 60_000, 0),
  fallbackMarket("ETH", 1_700, 0),
  fallbackMarket("SOL", 70, 0),
];

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

let _lastGood: { result: AdapterResponse<SoDEXMarketData>; at: number } | null = null;
let _cache: { result: AdapterResponse<SoDEXMarketData>; expiresAt: number } | null = null;
let _inflight: Promise<AdapterResponse<SoDEXMarketData>> | null = null;

async function readLive(): Promise<AdapterResponse<SoDEXMarketData>> {
  const { baseUrl, network } = marketDataBaseUrl();
  const perps = `${baseUrl}/perps/markets`;

  const tickers = await sodexGet<RawTicker[]>(`${perps}/tickers`);
  const wanted = TRACKED.map((b) => tickers.find((t) => t.symbol === `${b}-USD`)).filter(
    (t): t is RawTicker => !!t
  );
  if (wanted.length === 0) throw new Error("no BTC/ETH/SOL perp tickers in response");

  const books = await Promise.all(
    wanted.map((t) =>
      sodexGet<RawBook>(`${perps}/${encodeURIComponent(t.symbol)}/orderbook?limit=200`).catch((err) => {
        console.warn(`[SoDEX] orderbook ${t.symbol} failed: ${err instanceof Error ? err.message : err}`);
        return null;
      })
    )
  );

  const markets = wanted.map((t, i) => normalise(t, books[i]));
  const missingBooks = wanted.filter((_, i) => !books[i]).map((t) => t.symbol);

  return {
    data: aggregate(markets, network),
    mode: "live",
    fetchedAt: new Date().toISOString(),
    reason:
      `Live SoDEX ${network} perps: tickers + order books for ${markets.map((m) => m.baseAsset).join("/")}.` +
      (missingBooks.length ? ` Order book unavailable for ${missingBooks.join(", ")} (top-of-book used).` : ""),
    endpoint: perps,
  };
}

export async function getSoDEXMarketData(): Promise<AdapterResponse<SoDEXMarketData>> {
  if (_cache && Date.now() < _cache.expiresAt) return _cache.result;
  if (_inflight) return _inflight;

  _inflight = (async () => {
    try {
      const result = await readLive();
      _lastGood = { result, at: Date.now() };
      _cache = { result, expiresAt: Date.now() + CACHE_TTL_MS };
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[SoDEX] live read failed: ${message}`);

      if (_lastGood && Date.now() - _lastGood.at < STALE_MAX_MS) {
        const ageS = Math.round((Date.now() - _lastGood.at) / 1000);
        const result: AdapterResponse<SoDEXMarketData> = {
          ..._lastGood.result,
          data: { ..._lastGood.result.data, stale: true },
          reason: `Latest SoDEX read failed (${message}); serving live snapshot from ${ageS}s ago.`,
        };
        _cache = { result, expiresAt: Date.now() + 15_000 };
        return result;
      }

      const result: AdapterResponse<SoDEXMarketData> = {
        data: aggregate(FALLBACK_MARKETS, "fallback"),
        mode: "fallback",
        fetchedAt: new Date().toISOString(),
        reason: `SoDEX market read failed; showing sample data, not live prices. ${message}`,
        endpoint: marketDataBaseUrl().baseUrl,
      };
      _cache = { result, expiresAt: Date.now() + 15_000 };
      return result;
    } finally {
      _inflight = null;
    }
  })();

  return _inflight;
}
