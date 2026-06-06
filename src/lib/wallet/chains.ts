import { mainnet, sepolia } from "wagmi/chains";

export const SUPPORTED_WALLET_CHAINS = [mainnet, sepolia] as const;

export function configuredWalletChainId(): number {
  const parsed = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? mainnet.id);
  if (SUPPORTED_WALLET_CHAINS.some((chain) => chain.id === parsed)) {
    return parsed;
  }
  return mainnet.id;
}

export function chainLabel(chainId?: number): string {
  const chain = SUPPORTED_WALLET_CHAINS.find((item) => item.id === chainId);
  return chain?.name ?? (chainId ? `Unsupported chain ${chainId}` : "Not connected");
}
