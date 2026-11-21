export type SupportedToken = {
  chainId: number;
  symbol: string;
  name: string;
  address?: `0x${string}`;
  decimals: number;
};

export const SUPPORTED_TOKENS: SupportedToken[] = [
  {
    chainId: 1,
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  {
    chainId: 1,
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
  },
];

export function supportedTokensForChain(chainId?: number): SupportedToken[] {
  if (!chainId) return [];
  return SUPPORTED_TOKENS.filter((token) => token.chainId === chainId && token.address);
}
