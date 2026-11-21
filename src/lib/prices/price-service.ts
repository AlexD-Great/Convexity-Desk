/**
 * Live price service — server-side only.
 *
 * Resolution order per symbol:
 *   1. USDC → $1.00 peg (it is SoDEX's quote currency; labelled "peg")
 *   2. SoDEX mainnet perp ticker   ("BTC-USD", "1000PEPE-USD" ÷ 1000)
 *   3. SoDEX mainnet spot ticker   ("vSOL_vUSDC", "WSOSO_vUSDC")
 *   4. SoSoValue currency snapshot (top ~20 assets only — last resort)
 *
 * A symbol nobody prices returns null. Nothing is ever invented.
 */

import { getSoDEXDailyCloses, getSoDEXTickers, type RawTicker, type SoDEXVenue } from "@/lib/adapters/sodex";
import { getCurrencies, getCurrencySnapshot, getSoSoValueConfig } from "@/lib/adapters/sosovalue-client";

/** "alchemy" is only assigned by the wallet reader, never by getPrices(). */
export type PriceSource = "sodex-perp" | "sodex-spot" | "sosovalue" | "peg" | "alchemy";

export type PriceQuote = {
  symbol: string;
  priceUsd: number;
  change24hPct: number;
  source: PriceSource;
  /** Market the price came from, for klines / display */
  venueSymbol?: string;
  venue?: SoDEXVenue;
  /** Price multiplier for scaled contracts like 1000PEPE */
  multiplier?: number;
  asOf: string;
};

// Wrapped / staked tokens priced via their underlying.
const ALIASES: Record<string, string> = {
  WETH: "ETH",
  WBTC: "BTC",
  CBBTC: "BTC",
  STETH: "ETH",
  WSTETH: "ETH",
  WSOSO: "SOSO",
  WSOL: "SOL",
  // Aave v3 receipt tokens track the underlying 1:1
  AWETH: "ETH",
  AETHWETH: "ETH",
  AWBTC: "BTC",
  AETHWBTC: "BTC",
  AUSDC: "USDC",
  AETHUSDC: "USDC",
};

const PEGGED = new Set(["USDC"]);

export function canonicalSymbol(symbol: string): string {
  const s = symbol.trim().toUpperCase();
  return ALIASES[s] ?? s;
}

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function perpBase(sym: string): { base: string; multiplier: number } | null {
  const m = /^(\d+)?([A-Z0-9]+)-USD$/.exec(sym.toUpperCase());
  if (!m) return null;
  const scale = m[1] ? Number(m[1]) : 1;
  return { base: m[2], multiplier: 1 / scale };
}

function spotBase(sym: string): string | null {
  const [rawBase, rawQuote] = sym.split("_");
  if (!rawBase || rawQuote !== "vUSDC") return null;
  // SoDEX spot prefixes bridged assets with lowercase "v" (vBTC) or "W" (WSOSO).
  const base = rawBase.startsWith("v") ? rawBase.slice(1) : rawBase;
  return canonicalSymbol(base);
}

function quoteFromTicker(
  symbol: string,
  t: RawTicker,
  venue: SoDEXVenue,
  multiplier = 1
): PriceQuote | null {
  const price = num(t.lastPx) || (num(t.bidPx) + num(t.askPx)) / 2;
  if (price <= 0) return null;
  return {
    symbol,
    priceUsd: price * multiplier,
    change24hPct: Math.round(num(t.changePct) * 100) / 100,
    source: venue === "perps" ? "sodex-perp" : "sodex-spot",
    venueSymbol: t.symbol,
    venue,
    multiplier: multiplier !== 1 ? multiplier : undefined,
    asOf: new Date().toISOString(),
  };
}

async function sodexIndex(): Promise<Map<string, PriceQuote>> {
  const index = new Map<string, PriceQuote>();
  const [perps, spot] = await Promise.all([
    getSoDEXTickers("perps").catch(() => [] as RawTicker[]),
    getSoDEXTickers("spot").catch(() => [] as RawTicker[]),
  ]);

  // Unscaled perps first, then scaled (1000PEPE), then spot fills gaps.
  const scaled: Array<[string, RawTicker, number]> = [];
  for (const t of perps) {
    const p = perpBase(t.symbol);
    if (!p) continue;
    const sym = canonicalSymbol(p.base);
    if (p.multiplier !== 1) {
      scaled.push([sym, t, p.multiplier]);
      continue;
    }
    const q = quoteFromTicker(sym, t, "perps");
    if (q && !index.has(sym)) index.set(sym, q);
  }
  for (const t of spot) {
    const sym = spotBase(t.symbol);
    if (!sym || index.has(sym)) continue;
    const q = quoteFromTicker(sym, t, "spot");
    if (q) index.set(sym, q);
  }
  for (const [sym, t, mult] of scaled) {
    if (index.has(sym)) continue;
    const q = quoteFromTicker(sym, t, "perps", mult);
    if (q) index.set(sym, q);
  }
  return index;
}

// ─────────────────────────────────────────────
// SoSoValue fallback (cached; quota-aware)
// ─────────────────────────────────────────────

let _ssvIds: { map: Map<string, string>; expiresAt: number } | null = null;
const _ssvQuotes = new Map<string, { quote: PriceQuote; expiresAt: number }>();

async function sosovalueQuote(symbol: string): Promise<PriceQuote | null> {
  if (!getSoSoValueConfig().configured) return null;

  const cached = _ssvQuotes.get(symbol);
  if (cached && Date.now() < cached.expiresAt) return cached.quote;

  try {
    if (!_ssvIds || Date.now() > _ssvIds.expiresAt) {
      const list = await getCurrencies();
      _ssvIds = {
        map: new Map(list.map((c) => [c.symbol.toUpperCase(), c.currency_id])),
        expiresAt: Date.now() + 24 * 60 * 60_000,
      };
    }
    const id = _ssvIds.map.get(symbol);
    if (!id) return null;
    const snap = await getCurrencySnapshot(id);
    const quote: PriceQuote = {
      symbol,
      priceUsd: num(snap.price),
      change24hPct: Math.round(num(snap.change_pct_24h) * 10_000) / 100,
      source: "sosovalue",
      asOf: new Date().toISOString(),
    };
    if (quote.priceUsd <= 0) return null;
    _ssvQuotes.set(symbol, { quote, expiresAt: Date.now() + 5 * 60_000 });
    return quote;
  } catch (err) {
    console.warn(`[prices] SoSoValue fallback for ${symbol} failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

/**
 * SoSoValue allows 20 req/min, shared with the ETF/news/macro feeds, so the
 * fallback is capped per call and can be disabled entirely (wallet scans pass
 * it only for trusted tokens, never for arbitrary airdropped spam).
 */
const MAX_SOSOVALUE_FALLBACKS_PER_CALL = 5;

/** Live quotes keyed by the symbol as requested (upper-cased). */
export async function getPrices(
  symbols: string[],
  opts: { sosovalueFallback?: boolean } = {}
): Promise<Record<string, PriceQuote | null>> {
  const allowFallback = opts.sosovalueFallback ?? true;
  const wanted = [...new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean))];
  const index = await sodexIndex();
  const out: Record<string, PriceQuote | null> = {};
  const needFallback: string[] = [];

  for (const requested of wanted) {
    const sym = canonicalSymbol(requested);
    if (PEGGED.has(sym)) {
      out[requested] = { symbol: requested, priceUsd: 1, change24hPct: 0, source: "peg", asOf: new Date().toISOString() };
      continue;
    }
    const hit = index.get(sym);
    if (hit) out[requested] = { ...hit, symbol: requested };
    else {
      out[requested] = null;
      if (allowFallback) needFallback.push(requested);
    }
  }

  await Promise.all(
    needFallback.slice(0, MAX_SOSOVALUE_FALLBACKS_PER_CALL).map(async (requested) => {
      const quote = await sosovalueQuote(canonicalSymbol(requested));
      if (quote) out[requested] = { ...quote, symbol: requested };
    })
  );
  return out;
}

/**
 * Annualised 30-day realised volatility from SoDEX daily closes
 * (stdev of daily log returns × √365). Null when history is unavailable.
 */
export async function getRealizedVol(quote: PriceQuote | null): Promise<number | null> {
  if (!quote) return null;
  if (quote.source === "peg") return 0;
  if (!quote.venueSymbol || !quote.venue) return null;
  try {
    const closes = await getSoDEXDailyCloses(quote.venueSymbol, quote.venue, 31);
    if (closes.length < 10) return null;
    const rets: number[] = [];
    for (let i = 1; i < closes.length; i++) rets.push(Math.log(closes[i] / closes[i - 1]));
    const mean = rets.reduce((s, r) => s + r, 0) / rets.length;
    const variance = rets.reduce((s, r) => s + (r - mean) ** 2, 0) / (rets.length - 1);
    return Math.sqrt(variance) * Math.sqrt(365);
  } catch (err) {
    console.warn(`[prices] klines for ${quote.venueSymbol} failed: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}
