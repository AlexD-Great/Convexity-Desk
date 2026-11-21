/**
 * Demo portfolio — fixed sample *amounts*, valued at live prices.
 * Server-side only (pricing hits SoDEX / SoSoValue).
 */

import type { Portfolio } from "@/types";
import { buildPortfolio, type Holding } from "@/lib/portfolio/build-portfolio";

export const DEMO_HOLDINGS: Holding[] = [
  { symbol: "BTC", name: "Bitcoin", amount: 0.432, betaBucket: "BTC_BETA", hedgeable: true },
  { symbol: "ETH", name: "Ethereum", amount: 4.12, betaBucket: "ETH_BETA", hedgeable: true },
  { symbol: "SOL", name: "Solana", amount: 31.5, betaBucket: "HIGH_BETA_ALT", hedgeable: true },
  { symbol: "SOSO", name: "SoSoValue", amount: 4600, betaBucket: "HIGH_BETA_ALT", hedgeable: false },
  { symbol: "USDC", name: "USD Coin", amount: 7750, betaBucket: "STABLE", hedgeable: false },
];

export function getDemoPortfolio(): Promise<Portfolio> {
  return buildPortfolio(DEMO_HOLDINGS, { id: "demo-portfolio-1", mode: "demo" });
}
