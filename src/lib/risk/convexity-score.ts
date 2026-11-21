/**
 * Convexity Risk Scan Engine — server-side only.
 *
 * Danger Score = 0.30 × institutional_flow
 *              + 0.20 × narrative_pressure
 *              + 0.25 × portfolio_concentration
 *              + 0.15 × market_microstructure_stress
 *              + 0.10 × event_proximity
 *
 * Each factor is 0–100. The weighted sum produces a 0–100 Danger Score.
 * All inputs are typed; fallback values are used when live data is absent.
 */

import type { Portfolio, RiskFactor, RiskLevel, RiskScan, EvidenceCard } from "@/types";
import type { SoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import type { SoDEXMarketData } from "@/lib/adapters/sodex";

// ─────────────────────────────────────────────────────────────────────
// Factor calculators
// ─────────────────────────────────────────────────────────────────────

/**
 * Portfolio concentration (0–100), asset-agnostic:
 *   20 base
 *   + 1.3 × (largest risky position % − 25)      single-asset risk
 *   + 0.5 × (high-beta alt % − 10), max 20       alt amplification
 *   + 0.5 × (total risky % − 70),   max 15       little stablecoin cushion
 * "Risky" = everything except stablecoins.
 */
function largestRisky(portfolio: Portfolio) {
  return [...portfolio.assets]
    .filter((a) => a.betaBucket !== "STABLE")
    .sort((a, b) => b.weight - a.weight)[0];
}

function calcPortfolioConcentration(portfolio: Portfolio): number {
  const top = largestRisky(portfolio);
  const altW = portfolio.assets
    .filter((a) => a.betaBucket === "HIGH_BETA_ALT")
    .reduce((s, a) => s + a.weight, 0);
  const riskyW = portfolio.assets
    .filter((a) => a.betaBucket !== "STABLE")
    .reduce((s, a) => s + a.weight, 0);

  const single = Math.max(0, (top?.weight ?? 0) - 25) * 1.3;
  const alts = Math.min(20, Math.max(0, altW - 10) * 0.5);
  const cushion = Math.min(15, Math.max(0, riskyW - 70) * 0.5);
  return clamp(20 + single + alts + cushion);
}

function calcMicrostructureStress(market: SoDEXMarketData): number {
  const stress = market.overallMicrostructureStress;
  if (stress > 0) return clamp(stress);

  // Derive from per-market data if aggregate is missing
  if (market.markets.length === 0) return 50;
  const avg =
    market.markets.reduce((s, m) => s + m.microstructureStress, 0) /
    market.markets.length;
  return clamp(avg);
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function fmtUsdShort(n: number): string {
  const sign = n < 0 ? "−" : "+";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  return `${sign}$${(abs / 1e6).toFixed(0)}M`;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function riskLevel(score: number): RiskLevel {
  if (score >= 75) return "High Risk";
  if (score >= 50) return "Elevated";
  if (score >= 25) return "Watch";
  return "Normal";
}

function factorExplanation(
  key: RiskFactor["key"],
  score: number,
  portfolio: Portfolio,
  cards: EvidenceCard[],
  intel: SoSoValueIntelligence,
  market: SoDEXMarketData
): string {
  switch (key) {
    case "institutional_flow": {
      if (intel.etfFlows.length > 0) {
        const parts = intel.etfFlows.map(
          (f) =>
            `${f.symbol} ETFs ${fmtUsdShort(f.netInflow5dUsd)} over 5d (${f.flow5dPctOfAum.toFixed(2)}% of AUM${
              f.outflowStreakDays >= 2 ? `, ${f.outflowStreakDays}-day outflow streak` : ""
            })`
        );
        const tone =
          score >= 70 ? "Institutional outflow pressure is elevated."
          : score >= 40 ? "Institutional positioning is mixed."
          : "Institutional flows are supportive.";
        return `${parts.join("; ")}. ${tone}`;
      }
      const etfBearish = cards.filter(
        (c) => c.category === "ETF Flow" && c.sentiment === "bearish"
      ).length;
      if (score >= 70)
        return `${etfBearish} bearish ETF flow signal${etfBearish !== 1 ? "s" : ""} detected. Institutional outflow pressure is elevated.`;
      if (score >= 40)
        return "ETF flow data shows mixed signals. Institutional positioning is uncertain.";
      return "Institutional flow data is neutral or positive. Low pressure.";
    }
    case "narrative_pressure": {
      const bearish = cards.filter((c) => c.sentiment === "bearish").length;
      if (score >= 65)
        return `${bearish} bearish narrative signals active. Market sentiment is risk-off.`;
      if (score >= 40)
        return "Mixed narrative environment. Sentiment is cautious but not overwhelmingly negative.";
      return "Narrative signals are neutral or positive.";
    }
    case "portfolio_concentration": {
      const top = largestRisky(portfolio);
      const stableW = portfolio.assets
        .filter((a) => a.betaBucket === "STABLE")
        .reduce((s, a) => s + a.weight, 0);
      const highBeta = portfolio.assets
        .filter((a) => a.betaBucket === "HIGH_BETA_ALT")
        .reduce((s, a) => s + a.weight, 0);
      if (top && top.weight > 40)
        return `${top.symbol} is ${top.weight}% of the portfolio — above the 40% single-asset threshold. A move in ${top.symbol} drives most of your P&L.`;
      if (highBeta > 25)
        return `High-beta alt exposure at ${highBeta.toFixed(1)}% adds downside amplification risk.`;
      return `Largest risky position is ${top ? `${top.symbol} at ${top.weight}%` : "none"}, with ${stableW.toFixed(0)}% in stablecoins. Concentration is within acceptable bounds.`;
    }
    case "market_microstructure": {
      const btc = market.markets.find((m) => m.baseAsset === "BTC") ?? market.markets[0];
      if (btc && market.network !== "fallback") {
        const depth = Math.min(btc.depthBidUsd25bps, btc.depthAskUsd25bps);
        const depthTxt = depth >= 1e6 ? `$${(depth / 1e6).toFixed(1)}M` : `$${Math.round(depth / 1e3)}K`;
        const tone =
          score >= 60 ? "Execution conditions are stressed."
          : score >= 40 ? "Conditions are moderately stressed."
          : "Conditions are healthy.";
        return `SoDEX ${btc.symbol}: ${btc.range24hPct}% 24h range, ${btc.spreadBps} bps spread, ${depthTxt} resting within ±25 bps. ${tone}`;
      }
      if (score >= 60)
        return "SoDEX orderbook spread is widening and liquidity is thinning. Execution conditions are stressed.";
      if (score >= 40)
        return "Market microstructure shows moderate stress. Spread is above average.";
      return "Market microstructure is healthy. Spreads and liquidity are normal.";
    }
    case "event_proximity": {
      const soon = intel.upcomingEvents.filter((e) => e.impact !== "low" && e.daysAway <= 7);
      if (soon.length > 0) {
        const high = soon.filter((e) => e.impact === "high");
        const lead = high[0] ?? soon[0];
        const when = lead.daysAway === 0 ? "today" : lead.daysAway === 1 ? "tomorrow" : `in ${lead.daysAway} days`;
        return `${soon.length} market-moving US macro release${soon.length !== 1 ? "s" : ""} in the next 7 days (${high.length} high-impact). Next key print: ${lead.name} ${when}.`;
      }
      const macro = cards.filter((c) => c.category === "Macro");
      if (macro.length > 0)
        return `${macro.length} macro event${macro.length !== 1 ? "s" : ""} detected within proximity window. High-impact events increase volatility risk.`;
      return "No major macro events detected within the proximity window.";
    }
  }
}

function buildSummary(score: number, level: RiskLevel, portfolio: Portfolio, factors: RiskFactor[]): string {
  const drivers = [...factors]
    .sort((a, b) => b.score * b.weight - a.score * a.weight)
    .slice(0, 2)
    .map((f) => `${f.label.toLowerCase()} (${f.score})`)
    .join(" and ");
  const top = largestRisky(portfolio);
  const hedgeTarget = top?.betaBucket === "ETH_BETA" ? "ETH" : "BTC";
  if (score >= 75)
    return `Your portfolio is at ${level.toUpperCase()} with a Danger Score of ${score}/100, driven mainly by ${drivers}. Consider hedging ${hedgeTarget} beta exposure before conditions deteriorate further.`;
  if (score >= 50)
    return `Your portfolio is at ${level.toUpperCase()} with a Danger Score of ${score}/100. The biggest contributors are ${drivers}. Monitor closely and consider a partial hedge.`;
  if (score >= 25)
    return `Your portfolio is in ${level.toUpperCase()} territory (${score}/100). Risk is present but manageable. No immediate hedge is required.`;
  return `Your portfolio is at ${level.toUpperCase()} (${score}/100). Current conditions are benign.`;
}

// ─────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────

export function calculateDangerScore(
  portfolio: Portfolio,
  intelligence: SoSoValueIntelligence,
  marketData: SoDEXMarketData
): RiskScan {
  const cards = intelligence.evidenceCards;

  const instFlow = clamp(intelligence.institutionalFlowScore);
  const narrative = clamp(intelligence.narrativePressureScore);
  const concentration = calcPortfolioConcentration(portfolio);
  const microstructure = calcMicrostructureStress(marketData);
  const eventProx = clamp(intelligence.eventProximityScore);

  const dangerScore = clamp(
    instFlow * 0.3 +
      narrative * 0.2 +
      concentration * 0.25 +
      microstructure * 0.15 +
      eventProx * 0.1
  );

  const level = riskLevel(dangerScore);

  const FACTORS: Array<{ key: RiskFactor["key"]; weight: number; score: number }> = [
    { key: "institutional_flow", weight: 0.3, score: instFlow },
    { key: "narrative_pressure", weight: 0.2, score: narrative },
    { key: "portfolio_concentration", weight: 0.25, score: concentration },
    { key: "market_microstructure", weight: 0.15, score: microstructure },
    { key: "event_proximity", weight: 0.1, score: eventProx },
  ];

  const FACTOR_LABELS: Record<RiskFactor["key"], string> = {
    institutional_flow: "Institutional Flow Pressure",
    narrative_pressure: "Narrative / News Pressure",
    portfolio_concentration: "Portfolio Concentration",
    market_microstructure: "Market Microstructure Stress",
    event_proximity: "Event Proximity",
  };

  const factors: RiskFactor[] = FACTORS.map(({ key, weight, score }) => ({
    key,
    label: FACTOR_LABELS[key],
    score,
    weight,
    explanation: factorExplanation(key, score, portfolio, cards, intelligence, marketData),
    evidenceIds: cards
      .filter((c) => {
        if (key === "institutional_flow") return c.category === "ETF Flow";
        if (key === "narrative_pressure") return c.category === "Sentiment" || c.category === "News";
        if (key === "event_proximity") return c.category === "Macro";
        return false;
      })
      .map((c) => c.id),
  }));

  return {
    id: `scan-${Date.now()}`,
    portfolioId: portfolio.id,
    dangerScore,
    riskLevel: level,
    factors,
    summary: buildSummary(dangerScore, level, portfolio, factors),
    createdAt: new Date().toISOString(),
  };
}
