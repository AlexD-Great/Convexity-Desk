/**
 * Convexity Hedge Composer — server-side only.
 *
 * Responsibilities:
 *  1. Determine the best hedge instrument based on portfolio composition.
 *  2. Size the hedge based on Danger Score and risk profile.
 *  3. Build an execution preview using SoDEX market data (or fallback).
 *  4. Never auto-execute — always returns a plan for human confirmation.
 */

import type { Portfolio, HedgePlan, RiskScan, RiskProfile } from "@/types";
import type { SoDEXMarketData, SoDEXMarket } from "@/lib/adapters/sodex";

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export type ExecutionPreview = {
  hedgePlanId: string;
  instrument: string;
  direction: string;
  suggestedSizeUsd: number;
  /** Approximate entry price for the primary market */
  estimatedEntryPrice: number;
  estimatedSlippageBps: number;
  /** Dollar cost of slippage (slippageBps / 10000 × size) */
  estimatedCostUsd: number;
  coveragePercent: number;
  orderType: string;
  bidPrice: number;
  askPrice: number;
  spreadBps: number;
  liquidityScore: number;
  spreadMultiple: number;
  marketMode: "live" | "fallback" | "mock" | "error";
  warnings: string[];
};

// ─────────────────────────────────────────────
// Instrument selection
// ─────────────────────────────────────────────

function selectInstrument(
  portfolio: Portfolio
): { instrument: string; baseAsset: string } {
  const byBucket = (bucket: string) =>
    portfolio.assets
      .filter((a) => a.betaBucket === bucket)
      .reduce((s, a) => s + a.weight, 0);

  const btcW = byBucket("BTC_BETA");
  const ethW = byBucket("ETH_BETA");
  const altW = byBucket("HIGH_BETA_ALT");

  // Dominant exposure → hedge instrument
  if (btcW >= ethW && btcW >= altW) return { instrument: "BTC-PERP/USDC", baseAsset: "BTC" };
  if (ethW >= btcW && ethW >= altW) return { instrument: "ETH-PERP/USDC", baseAsset: "ETH" };
  // High beta alt-heavy → proxy hedge with BTC
  return { instrument: "BTC-PERP/USDC", baseAsset: "BTC" };
}

// ─────────────────────────────────────────────
// Hedge sizing
// ─────────────────────────────────────────────

const PROFILE_MULTIPLIER: Record<RiskProfile, number> = {
  conservative: 1.2,
  balanced: 1.0,
  aggressive: 0.7,
};

function dangerMultiplier(score: number): number {
  if (score < 50) return 0;
  // Interpolate 0.10 → 0.45 over 50–100
  return 0.10 + ((score - 50) / 50) * 0.35;
}

function hedgeSize(
  portfolio: Portfolio,
  dangerScore: number,
  profile: RiskProfile = "balanced"
): number {
  const raw =
    portfolio.totalValueUsd *
    dangerMultiplier(dangerScore) *
    PROFILE_MULTIPLIER[profile];
  // Round to nearest $1 000
  return Math.round(raw / 1000) * 1000;
}

// ─────────────────────────────────────────────
// Coverage calculation
// ─────────────────────────────────────────────

function computeCoverage(
  portfolio: Portfolio,
  sizeUsd: number,
  baseAsset: string
): number {
  // Coverage = hedge size / (BTC + ETH beta exposure)
  // — the portion of liquid, hedgeable beta the plan addresses
  const hedgeableUsd = portfolio.assets
    .filter((a) => a.betaBucket === "BTC_BETA" || a.betaBucket === "ETH_BETA")
    .reduce((s, a) => s + a.valueUsd, 0);
  if (hedgeableUsd === 0) return 0;
  return Math.min(100, Math.round((sizeUsd / hedgeableUsd) * 100));
}

// ─────────────────────────────────────────────
// Confidence score
// ─────────────────────────────────────────────

function computeConfidence(dangerScore: number, coverage: number): number {
  // Higher danger → more confident this hedge is needed
  // Higher coverage → more confident the plan is well-sized
  const score = 40 + dangerScore * 0.54 + coverage * 0.08;
  return Math.min(95, Math.round(score));
}

// ─────────────────────────────────────────────
// Rationale & risks
// ─────────────────────────────────────────────

function buildRationale(
  portfolio: Portfolio,
  dangerScore: number,
  instrument: string,
  baseAsset: string
): string {
  const btcW = portfolio.assets.find((a) => a.betaBucket === "BTC_BETA")?.weight ?? 0;
  return (
    `Danger Score of ${dangerScore}/100 with ${baseAsset} allocation at ${btcW}% ` +
    `exceeds the safe concentration threshold. A short ${instrument} position reduces ` +
    `portfolio beta exposure and provides downside protection without requiring a full exit.`
  );
}

function buildRisks(dangerScore: number, sizeUsd: number): string[] {
  const risks: string[] = [
    "This is a hedge, not a guaranteed profit. It reduces downside exposure but does not eliminate it.",
    "If the market rallies, the short hedge will offset gains from your existing holdings.",
  ];
  if (dangerScore >= 75)
    risks.push(
      "High Danger Score suggests conditions are already stressed. Slippage may be elevated."
    );
  if (sizeUsd >= 10_000)
    risks.push(
      "Position size is significant. Verify liquidity and slippage estimates before confirming."
    );
  return risks;
}

// ─────────────────────────────────────────────
// Execution preview builder
// ─────────────────────────────────────────────

function findMarket(
  marketData: SoDEXMarketData,
  baseAsset: string
): SoDEXMarket | undefined {
  return marketData.markets.find(
    (m) => m.baseAsset.toUpperCase() === baseAsset.toUpperCase()
  );
}

function buildExecutionPreview(
  plan: HedgePlan,
  marketData: SoDEXMarketData,
  marketMode: ExecutionPreview["marketMode"],
  baseAsset: string
): ExecutionPreview {
  const market = findMarket(marketData, baseAsset);
  const fallbackPrice = baseAsset === "BTC" ? 42_824 : baseAsset === "ETH" ? 2_233 : 162;

  const entryPrice = market?.lastPrice ?? fallbackPrice;
  const bidPrice = market?.bidPrice ?? entryPrice * 0.9997;
  const askPrice = market?.askPrice ?? entryPrice * 1.0003;
  const spreadBps = market?.spreadBps ?? 6.5;
  const slippageBps = Math.round(spreadBps * 1.85); // est. slippage ≈ 1.85× spread
  const costUsd = (slippageBps / 10_000) * plan.suggestedSizeUsd;
  const liquidityScore = market?.liquidityScore ?? 45;
  const spreadMultiple = market?.spreadMultiple ?? 2.3;

  const warnings: string[] = [];
  if (spreadMultiple > 1.5)
    warnings.push(`SoDEX spread is ${spreadMultiple}× the 30-day average. Consider using a limit order.`);
  if (liquidityScore < 50)
    warnings.push(`Liquidity score is ${liquidityScore}/100. Large orders may move the market.`);
  warnings.push("Wave 2: This is a simulated preview. No real order will be placed.");
  warnings.push(
    `Convexity Desk is not financial advice. Confirm only if you understand the hedge intent.`
  );

  return {
    hedgePlanId: plan.id,
    instrument: plan.instrument,
    direction: plan.direction,
    suggestedSizeUsd: plan.suggestedSizeUsd,
    estimatedEntryPrice: entryPrice,
    estimatedSlippageBps: slippageBps,
    estimatedCostUsd: Math.round(costUsd * 100) / 100,
    coveragePercent: plan.coveragePercent,
    orderType: plan.orderType,
    bidPrice: Math.round(bidPrice * 100) / 100,
    askPrice: Math.round(askPrice * 100) / 100,
    spreadBps,
    liquidityScore,
    spreadMultiple,
    marketMode,
    warnings,
  };
}

// ─────────────────────────────────────────────
// Main exports
// ─────────────────────────────────────────────

export function composeHedgePlan(
  portfolio: Portfolio,
  scan: RiskScan,
  profile: RiskProfile = "balanced"
): HedgePlan {
  const { instrument, baseAsset } = selectInstrument(portfolio);
  const sizeUsd = hedgeSize(portfolio, scan.dangerScore, profile);
  const coverage = computeCoverage(portfolio, sizeUsd, baseAsset);
  const confidence = computeConfidence(scan.dangerScore, coverage);
  const rationale = buildRationale(portfolio, scan.dangerScore, instrument, baseAsset);
  const risks = buildRisks(scan.dangerScore, sizeUsd);

  return {
    id: `hedge-${Date.now()}`,
    scanId: scan.id,
    instrument,
    direction: "short",
    suggestedSizeUsd: sizeUsd,
    coveragePercent: coverage,
    confidence,
    orderType: "simulation",
    estimatedSlippageBps: 0, // filled in execution preview
    rationale,
    risks,
    createdAt: new Date().toISOString(),
  };
}

export function buildPreview(
  plan: HedgePlan,
  marketData: SoDEXMarketData,
  marketMode: ExecutionPreview["marketMode"]
): ExecutionPreview {
  // Extract base asset from instrument (e.g. "BTC-PERP/USDC" → "BTC")
  const baseAsset = plan.instrument.split("-")[0].toUpperCase();
  return buildExecutionPreview(plan, marketData, marketMode, baseAsset);
}
