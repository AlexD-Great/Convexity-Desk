/**
 * Curated token contracts per chain. Used two ways:
 *  - RPC fallback when no indexer key is configured (these are the only
 *    ERC-20s read), and
 *  - a trust list: an indexer-reported token whose contract is listed here is
 *    priced by symbol without further checks (blocks symbol-spoofing spam).
 * Decimals are read on-chain, not trusted from this file.
 */

export type ChainKey = "eth" | "base" | "arb" | "op";

export type CuratedToken = { symbol: string; address: `0x${string}` };

export const CHAINS: Record<ChainKey, { chainId: number; label: string; alchemyNetwork: string }> = {
  eth: { chainId: 1, label: "Ethereum", alchemyNetwork: "eth-mainnet" },
  base: { chainId: 8453, label: "Base", alchemyNetwork: "base-mainnet" },
  arb: { chainId: 42161, label: "Arbitrum", alchemyNetwork: "arb-mainnet" },
  op: { chainId: 10, label: "Optimism", alchemyNetwork: "opt-mainnet" },
};

export const CURATED_TOKENS: Record<ChainKey, CuratedToken[]> = {
  eth: [
    { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
    { symbol: "USDe", address: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3" },
    { symbol: "WETH", address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
    { symbol: "stETH", address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84" },
    { symbol: "wstETH", address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" },
    { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" },
    { symbol: "cbBTC", address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf" },
    { symbol: "LINK", address: "0x514910771AF9Ca656af840dff83E8264EcF986CA" },
    { symbol: "UNI", address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" },
    { symbol: "AAVE", address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9" },
    { symbol: "PEPE", address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933" },
    { symbol: "SHIB", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" },
  ],
  base: [
    { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
    { symbol: "DAI", address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb" },
    { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
    { symbol: "cbBTC", address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf" },
  ],
  arb: [
    { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831" },
    { symbol: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" },
    { symbol: "WETH", address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" },
    { symbol: "WBTC", address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f" },
    { symbol: "ARB", address: "0x912CE59144191C1204E64559FE8253a0e49E6548" },
    { symbol: "LINK", address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4" },
  ],
  op: [
    { symbol: "USDC", address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85" },
    { symbol: "USDT", address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58" },
    { symbol: "WETH", address: "0x4200000000000000000000000000000000000006" },
    { symbol: "OP", address: "0x4200000000000000000000000000000000000042" },
  ],
};

const TRUSTED = new Set(
  Object.entries(CURATED_TOKENS).flatMap(([chain, list]) =>
    list.map((t) => `${chain}:${t.address.toLowerCase()}`)
  )
);

export function isTrustedToken(chain: ChainKey, address: string): boolean {
  return TRUSTED.has(`${chain}:${address.toLowerCase()}`);
}
