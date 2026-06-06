import type { SupportedToken } from "./supported-tokens";

export type WalletHolding = {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
  tokenAddress?: `0x${string}`;
  estimatedValueUsd?: number;
  priceSource: "fallback" | "unavailable";
  source: "native" | "erc20_allowlist";
};

export type WalletHoldingsPreview = {
  address?: `0x${string}`;
  chainId?: number;
  chainName: string;
  native?: WalletHolding;
  tokens: WalletHolding[];
  totalEstimatedValueUsd?: number;
  mode: "not_connected" | "basic_holdings_only";
  limitation: string;
};

export function estimateValueUsd(balance: number, token: Pick<SupportedToken, "priceFallbackUsd">): number | undefined {
  if (token.priceFallbackUsd === undefined) return undefined;
  return Math.round(balance * token.priceFallbackUsd * 100) / 100;
}
