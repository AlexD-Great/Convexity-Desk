/**
 * Turns raw holdings (symbol + amount) into a fully priced Portfolio.
 * Server-side only. Shared by the demo portfolio and (later) wallet scans.
 *
 *   price           live, from the price service (SoDEX → SoSoValue)
 *   value / weight  amount × price; unpriced assets are valued at $0 and
 *                   listed in `pricing.missing`
 *   risk contrib.   wᵢσᵢ / Σ wⱼσⱼ  — each asset's share of standalone
 *                   volatility, σ = 30-day realised vol from SoDEX klines.
 *                   Assumes perfect correlation (a conservative, common
 *                   simplification for crypto books).
 */

import type { BetaBucket, Portfolio, PortfolioAsset } from "@/types";
import { getPrices, getRealizedVol } from "@/lib/prices/price-service";

export type Holding = {
  symbol: string;
  name: string;
  amount: number;
  betaBucket: BetaBucket;
  hedgeable: boolean;
};

/** Used only when an asset has no kline history. */
const BUCKET_VOL: Record<BetaBucket, number> = {
  BTC_BETA: 0.5,
  ETH_BETA: 0.65,
  HIGH_BETA_ALT: 0.9,
  SSI_INDEX: 0.6,
  STABLE: 0.01,
};

const round = (n: number, dp: number) => Math.round(n * 10 ** dp) / 10 ** dp;

export async function buildPortfolio(
  holdings: Holding[],
  meta: { id: string; mode: Portfolio["mode"]; ownerAddress?: string }
): Promise<Portfolio> {
  const quotes = await getPrices(holdings.map((h) => h.symbol));

  const priced = await Promise.all(
    holdings.map(async (h) => {
      const quote = quotes[h.symbol.toUpperCase()] ?? null;
      const realized = await getRealizedVol(quote);
      const vol = realized ?? BUCKET_VOL[h.betaBucket];
      const priceUsd = quote?.priceUsd ?? 0;
      return {
        h,
        quote,
        priceUsd,
        valueUsd: h.amount * priceUsd,
        vol,
        volSource: (realized !== null ? "realized" : "bucket") as PortfolioAsset["volatilitySource"],
      };
    })
  );

  const total = priced.reduce((s, p) => s + p.valueUsd, 0);
  const riskMass = priced.reduce((s, p) => s + p.valueUsd * p.vol, 0);

  const assets: PortfolioAsset[] = priced.map((p) => ({
    symbol: p.h.symbol,
    name: p.h.name,
    amount: p.h.amount,
    priceUsd: p.priceUsd < 1 ? round(p.priceUsd, 6) : round(p.priceUsd, 2),
    valueUsd: round(p.valueUsd, 2),
    weight: total > 0 ? round((p.valueUsd / total) * 100, 1) : 0,
    riskContribution: riskMass > 0 ? round(((p.valueUsd * p.vol) / riskMass) * 100, 1) : 0,
    betaBucket: p.h.betaBucket,
    hedgeable: p.h.hedgeable,
    priceSource: p.quote?.source ?? "unavailable",
    change24hPct: p.quote?.change24hPct,
    volatility30d: round(p.vol, 3),
    volatilitySource: p.volSource,
  }));

  return {
    id: meta.id,
    ownerAddress: meta.ownerAddress,
    mode: meta.mode,
    totalValueUsd: round(total, 2),
    assets: assets.sort((a, b) => b.valueUsd - a.valueUsd),
    updatedAt: new Date().toISOString(),
    pricing: {
      asOf: new Date().toISOString(),
      missing: priced.filter((p) => !p.quote).map((p) => p.h.symbol),
    },
  };
}
