/**
 * Typed fallback market context used when SoDEX adapter returns fallback mode.
 * Used by the risk scan engine (Phase 9) to calculate microstructure stress.
 */
export const FALLBACK_MARKET_CONTEXT = {
  btcSpreadMultiple: 2.3,
  ethSpreadMultiple: 1.9,
  solSpreadMultiple: 2.8,
  btcLiquidityScore: 42,
  ethLiquidityScore: 51,
  overallMicrostructureStress: 62,
  note: "Fallback data — SODEX_BASE_URL not configured",
};
