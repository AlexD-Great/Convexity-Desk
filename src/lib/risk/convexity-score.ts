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
import {
  computeNarrativePressure,
  computeInstitutionalFlowPressure,
} from "@/lib/data/fallback-evidence";

// ─────────────────────────────────────────────────────────────────────
// Factor calculators
// ─────────────────────────────────────────────────────────────────────

function calcPortfolioConcentration(portfolio: Portfolio): number {
  let score = 25; // base

  for (const asset of portfolio.assets) {
    if (asset.betaBucket === "BTC_BETA") {
      if (asset.weight > 40) score += Math.min(45, (asset.weight - 40) * 9);
      else if (asset.weight > 30) score += Math.min(20, (asset.weight - 30) * 4);
    } else if (asset.betaBucket === "ETH_BETA") {
      if (asset.weight > 35) score += Math.min(15, (asset.weight - 35) * 3);
    } else if (asset.betaBucket === "HIGH_BETA_ALT") {
      if (asset.weight > 10)
        score += Math.min(12, (asset.weight - 10) * 1.2);
    } else if (asset.betaBucket === "STABLE") {
      if (asset.weight > 25) score -= Math.min(10, (asset.weight - 25) * 1);
    }
  }

  // Penalise high combined high-beta exposure
  const highBetaTotal = portfolio.assets
    .filter((a) =>
      (["BTC_BETA", "ETH_BETA", "HIGH_BETA_ALT"] as const).includes(a.betaBucket as never)
    )
    .reduce((s, a) => s + a.weight, 0);
  if (highBetaTotal > 70)
    score += Math.min(15, (highBetaTotal - 70) * 1.5);

  return clamp(score);
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

function calcEventProximity(cards: EvidenceCard[]): number {
  const macroCards = cards.filter((c) => c.category === "Macro");
  if (macroCards.length === 0) return 25;
  const high = macroCards.filter((c) => c.severity === "high").length;
  const med = macroCards.filter((c) => c.severity === "medium").length;
  return clamp(35 + high * 20 + med * 8);
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

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
  cards: EvidenceCard[]
): string {
  switch (key) {
    case "institutional_flow": {
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
      const btcW = portfolio.assets.find((a) => a.symbol === "BTC")?.weight ?? 0;
      if (btcW > 40)
        return `BTC allocation at ${btcW}% exceeds the 40% concentration threshold. Single-asset risk is elevated.`;
      const highBeta = portfolio.assets
        .filter((a) => a.betaBucket === "HIGH_BETA_ALT")
        .reduce((s, a) => s + a.weight, 0);
      if (highBeta > 25)
        return `High-beta alt exposure at ${highBeta.toFixed(1)}% adds downside amplification risk.`;
      return "Portfolio concentration is within acceptable bounds.";
    }
    case "market_microstructure": {
      if (score >= 60)
        return "SoDEX orderbook spread is widening and liquidity is thinning. Execution conditions are stressed.";
      if (score >= 40)
        return "Market microstructure shows moderate stress. Spread is above average.";
      return "Market microstructure is healthy. Spreads and liquidity are normal.";
    }
    case "event_proximity": {
      const macro = cards.filter((c) => c.category === "Macro");
      if (macro.length > 0)
        return `${macro.length} macro event${macro.length !== 1 ? "s" : ""} detected within proximity window. High-impact events increase volatility risk.`;
      return "No major macro events detected within the proximity window.";
    }
  }
}

function buildSummary(score: number, level: RiskLevel, portfolio: Portfolio): string {
  const btcW = portfolio.assets.find((a) => a.symbol === "BTC")?.weight ?? 0;
  if (score >= 75)
    return `Your portfolio is at ${level.toUpperCase()} with a Danger Score of ${score}/100. BTC allocation (${btcW}%) is above the safe threshold, institutional flow pressure is elevated, and market microstructure shows stress. Consider hedging BTC beta exposure before conditions deteriorate further.`;
  if (score >= 50)
    return `Your portfolio is at ${level.toUpperCase()} with a Danger Score of ${score}/100. Risk is building across multiple factors. Monitor closely and consider a partial hedge.`;
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

  const instFlow = computeInstitutionalFlowPressure(cards);
  const narrative = computeNarrativePressure(cards);
  const concentration = calcPortfolioConcentration(portfolio);
  const microstructure = calcMicrostructureStress(marketData);
  const eventProx = calcEventProximity(cards);

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
    explanation: factorExplanation(key, score, portfolio, cards),
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
    summary: buildSummary(dangerScore, level, portfolio),
    createdAt: new Date().toISOString(),
  };
}
