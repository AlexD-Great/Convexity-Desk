/**
 * SoDEX Market Data Adapter - server-side only.
 * Never import this in client components.
 *
 * Public market-data reads are unsigned. The adapter tries documented SoDEX
 * testnet/public endpoints first, then returns typed fallback data if the
 * gateway is unavailable or the response shape is not usable.
 *
 * No live trade execution is implemented here.
 */

import type { AdapterResponse } from "@/types";

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
  /** How many times wider than a healthy 4 bps reference spread. */
  spreadMultiple: number;
  /** 0-100, higher = more liquid */
  liquidityScore: number;
  /** 0-100, higher = more stressed (used in microstructure risk factor) */
  microstructureStress: number;
};

export type SoDEXMarketData = {
  markets: SoDEXMarket[];
  /** Weighted average microstructure stress across all markets */
  overallMicrostructureStress: number;
  lastUpdatedAt: string;
};

type SoDEXEndpointRoot = {
  baseUrl: string;
  venue: "perps" | "spot";
  label: string;
};

const DEFAULT_TESTNET_BASE_URL = "https://testnet-gw.sodex.dev/api/v1";
const DEFAULT_MAINNET_BASE_URL = "https://mainnet-gw.sodex.dev/api/v1";

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
    spreadMultiple: 1.6,
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
    spreadMultiple: 2.2,
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
    spreadMultiple: 3.1,
    liquidityScore: 38,
    microstructureStress: 71,
  },
];

let _cache: { result: AdapterResponse<SoDEXMarketData>; expiresAt: number } | null = null;

function trimSlash(url: string): string {
  return url.trim().replace(/\/$/, "");
}

function normalizeRoot(url: string): string {
  const root = trimSlash(url);
  if (root.endsWith("/api/v1")) return root;
  return `${root}/api/v1`;
}

function uniqueRoots(roots: SoDEXEndpointRoot[]): SoDEXEndpointRoot[] {
  const seen = new Set<string>();
  return roots.filter((root) => {
    const key = `${root.baseUrl}:${root.venue}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getEndpointRoots(): SoDEXEndpointRoot[] {
  const configuredBase = process.env.SODEX_BASE_URL?.trim();
  const configuredTestnet = process.env.SODEX_TESTNET_BASE_URL?.trim();
  const roots: SoDEXEndpointRoot[] = [];

  for (const rawUrl of [configuredTestnet, configuredBase].filter(Boolean) as string[]) {
    const normalized = normalizeRoot(rawUrl);
    roots.push(
      { baseUrl: `${normalized}/perps`, venue: "perps", label: "configured perps" },
      { baseUrl: `${normalized}/spot`, venue: "spot", label: "configured spot" }
    );
  }

  roots.push(
    { baseUrl: `${DEFAULT_TESTNET_BASE_URL}/perps`, venue: "perps", label: "SoDEX testnet perps" },
    { baseUrl: `${DEFAULT_TESTNET_BASE_URL}/spot`, venue: "spot", label: "SoDEX testnet spot" },
    { baseUrl: `${DEFAULT_MAINNET_BASE_URL}/perps`, venue: "perps", label: "SoDEX mainnet perps" },
    { baseUrl: `${DEFAULT_MAINNET_BASE_URL}/spot`, venue: "spot", label: "SoDEX mainnet spot" }
  );

  return uniqueRoots(roots);
}

function buildMarketData(markets: SoDEXMarket[]): SoDEXMarketData {
  const overall =
    markets.length > 0
      ? Math.round(markets.reduce((s, m) => s + m.microstructureStress, 0) / markets.length)
      : 50;

  return {
    markets,
    overallMicrostructureStress: overall,
    lastUpdatedAt: new Date().toISOString(),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function numberFrom(...values: unknown[]): number {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function listFromEnvelope(raw: unknown): unknown[] {
  const data = asRecord(raw);
  if (!data) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.markets)) return data.markets;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

function symbolParts(symbol: string, venue: "perps" | "spot"): {
  displaySymbol: string;
  baseAsset: string;
  quoteAsset: string;
} {
  const cleaned = symbol.toUpperCase();

  if (venue === "perps") {
    const base = cleaned.split("-")[0]?.replace(/^V/, "") || "BTC";
    const quote = cleaned.split("-")[1]?.replace("USD", "USDC") || "USDC";
    return {
      displaySymbol: `${base}-PERP`,
      baseAsset: base,
      quoteAsset: quote,
    };
  }

  const [rawBase = "BTC", rawQuote = "USDC"] = cleaned.split("_");
  const base = rawBase.replace(/^V/, "");
  const quote = rawQuote.replace(/^V/, "");
  return {
    displaySymbol: `${base}/${quote}`,
    baseAsset: base,
    quoteAsset: quote,
  };
}

function computeSpreadBps(bid: number, ask: number): number {
  if (bid <= 0 || ask <= 0) return 10;
  const mid = (bid + ask) / 2;
  return Math.round(((ask - bid) / mid) * 100_000) / 10;
}

function computeLiquidityScore(spreadBps: number, bidQty: number, askQty: number): number {
  const depth = Math.max(0, bidQty + askQty);
  const depthBonus = Math.min(35, Math.log10(depth + 1) * 9);
  return Math.max(10, Math.min(100, Math.round(88 - spreadBps * 3 + depthBonus)));
}

function computeStress(spreadBps: number, liquidityScore: number): number {
  const spreadStress = Math.min(100, spreadBps * 6);
  const liquidityStress = Math.max(0, 100 - liquidityScore);
  return Math.round(spreadStress * 0.6 + liquidityStress * 0.4);
}

async function fetchJson(endpoint: string, signal: AbortSignal): Promise<unknown> {
  const res = await fetch(endpoint, {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`${endpoint} returned HTTP ${res.status}`);
  }

  return res.json() as Promise<unknown>;
}

function normalizeFromTickerPair(
  tickerItem: Record<string, unknown>,
  bookItem: Record<string, unknown> | undefined,
  venue: "perps" | "spot"
): SoDEXMarket | null {
  const rawSymbol = String(
    tickerItem.symbol ?? bookItem?.symbol ?? tickerItem.market ?? bookItem?.market ?? ""
  );
  if (!rawSymbol) return null;

  const bid = numberFrom(
    bookItem?.bidPrice,
    bookItem?.bidPx,
    bookItem?.bid,
    bookItem?.bestBidPrice,
    tickerItem.bidPrice,
    tickerItem.bidPx,
    tickerItem.bid
  );
  const ask = numberFrom(
    bookItem?.askPrice,
    bookItem?.askPx,
    bookItem?.ask,
    bookItem?.bestAskPrice,
    tickerItem.askPrice,
    tickerItem.askPx,
    tickerItem.ask
  );
  const bidQty = numberFrom(bookItem?.bidQty, bookItem?.bidSz, bookItem?.bidQuantity, bookItem?.bestBidQty, tickerItem.bidSz);
  const askQty = numberFrom(bookItem?.askQty, bookItem?.askSz, bookItem?.askQuantity, bookItem?.bestAskQty, tickerItem.askSz);
  const last = numberFrom(
    tickerItem.lastPrice,
    tickerItem.lastPx,
    tickerItem.lastTradePrice,
    tickerItem.last,
    tickerItem.price,
    tickerItem.markPrice,
    bid > 0 && ask > 0 ? (bid + ask) / 2 : 0
  );

  if (last <= 0 && bid <= 0 && ask <= 0) return null;

  const spreadBps = computeSpreadBps(bid || last * 0.9995, ask || last * 1.0005);
  const liquidityScore = computeLiquidityScore(spreadBps, bidQty, askQty);
  const { displaySymbol, baseAsset, quoteAsset } = symbolParts(rawSymbol, venue);

  return {
    symbol: displaySymbol,
    baseAsset,
    quoteAsset,
    lastPrice: Math.round(last * 100) / 100,
    priceChangePercent: numberFrom(
      tickerItem.priceChangePercent,
      tickerItem.priceChangePct,
      tickerItem.changePct,
      tickerItem.change24h,
      tickerItem.priceChange
    ),
    volume24hUsd: numberFrom(tickerItem.volume24h, tickerItem.quoteVolume, tickerItem.volume),
    bidPrice: Math.round((bid || last * 0.9995) * 100) / 100,
    askPrice: Math.round((ask || last * 1.0005) * 100) / 100,
    spreadBps,
    spreadMultiple: Math.round((spreadBps / 4) * 10) / 10,
    liquidityScore,
    microstructureStress: computeStress(spreadBps, liquidityScore),
  };
}

async function readMarketRoot(
  root: SoDEXEndpointRoot,
  signal: AbortSignal
): Promise<{ markets: SoDEXMarket[]; endpoint: string } | null> {
  const tickersEndpoint = `${root.baseUrl}/markets/tickers`;
  const bookTickersEndpoint = `${root.baseUrl}/markets/bookTickers`;

  const [tickersRaw, bookTickersRaw] = await Promise.all([
    fetchJson(tickersEndpoint, signal),
    fetchJson(bookTickersEndpoint, signal).catch(() => null),
  ]);

  const tickers = listFromEnvelope(tickersRaw).filter(
    (item): item is Record<string, unknown> => !!item && typeof item === "object"
  );
  const bookTickers = listFromEnvelope(bookTickersRaw).filter(
    (item): item is Record<string, unknown> => !!item && typeof item === "object"
  );

  const bookBySymbol = new Map<string, Record<string, unknown>>();
  for (const item of bookTickers) {
    const symbol = String(item.symbol ?? item.market ?? "");
    if (symbol) bookBySymbol.set(symbol, item);
  }

  const targetBases = new Set(["BTC", "ETH", "SOL"]);
  const markets = tickers
    .map((ticker) => {
      const symbol = String(ticker.symbol ?? ticker.market ?? "");
      return normalizeFromTickerPair(ticker, bookBySymbol.get(symbol), root.venue);
    })
    .filter((market): market is SoDEXMarket => {
      if (!market) return false;
      return targetBases.has(market.baseAsset);
    })
    .slice(0, 6);

  if (markets.length === 0) return null;
  return {
    markets,
    endpoint: `${tickersEndpoint} + ${bookTickersEndpoint}`,
  };
}

function fallbackResult(reason: string): AdapterResponse<SoDEXMarketData> {
  return {
    data: buildMarketData(FALLBACK_MARKETS),
    mode: "fallback",
    fetchedAt: new Date().toISOString(),
    reason,
    endpoint: DEFAULT_TESTNET_BASE_URL,
  };
}

export async function getSoDEXMarketData(): Promise<AdapterResponse<SoDEXMarketData>> {
  if (_cache && Date.now() < _cache.expiresAt) {
    return _cache.result;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7_000);
  const failures: string[] = [];

  try {
    for (const root of getEndpointRoots()) {
      try {
        const result = await readMarketRoot(root, controller.signal);
        if (result) {
          clearTimeout(timer);
          const response: AdapterResponse<SoDEXMarketData> = {
            data: buildMarketData(result.markets),
            mode: "live",
            fetchedAt: new Date().toISOString(),
            reason: `Unsigned public market read succeeded via ${root.label}.`,
            endpoint: result.endpoint,
          };
          _cache = { result: response, expiresAt: Date.now() + 60_000 };
          return response;
        }
        failures.push(`${root.label}: no usable BTC/ETH/SOL market data`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        failures.push(`${root.label}: ${message}`);
      }
    }

    throw new Error(failures.join(" | "));
  } catch (err) {
    clearTimeout(timer);
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[SoDEX Adapter] Public read failed; using fallback. Reason: ${message}`);

    const response = fallbackResult(
      `SoDEX public/testnet market read failed; using typed fallback data. ${message}`
    );
    _cache = { result: response, expiresAt: Date.now() + 30_000 };
    return response;
  }
}
