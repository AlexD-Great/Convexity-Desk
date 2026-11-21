export type WalletPriceSource = "sodex-perp" | "sodex-spot" | "sosovalue" | "peg";

export type WalletHolding = {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  decimals: number;
  tokenAddress?: `0x${string}`;
  estimatedValueUsd?: number;
  priceUsd?: number;
  /** "live" source, "testnet" (no market value), or "unavailable" */
  priceSource: WalletPriceSource | "testnet" | "unavailable";
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

export const PRICE_SOURCE_LABEL: Record<WalletHolding["priceSource"], string> = {
  "sodex-perp": "Live · SoDEX perp",
  "sodex-spot": "Live · SoDEX spot",
  sosovalue: "Live · SoSoValue",
  peg: "$1 peg",
  testnet: "Testnet — no value",
  unavailable: "No price",
};
