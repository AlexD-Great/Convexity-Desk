"use client";

import { erc20Abi, formatUnits } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { chainLabel } from "@/lib/wallet/chains";
import {
  NATIVE_TOKEN_PRICE_FALLBACK_USD,
  supportedTokensForChain,
} from "@/lib/wallet/supported-tokens";
import type { WalletHolding, WalletHoldingsPreview } from "@/lib/wallet/wallet-holdings";
import { estimateValueUsd } from "@/lib/wallet/wallet-holdings";

function numericBalance(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBalance(value: string): string {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  if (parsed === 0) return "0";
  if (parsed < 0.0001) return parsed.toExponential(2);
  return parsed.toLocaleString(undefined, {
    maximumFractionDigits: parsed < 1 ? 6 : 4,
  });
}

export function useWalletHoldings() {
  const account = useAccount();
  const tokens = supportedTokensForChain(account.chainId);

  const nativeBalance = useBalance({
    address: account.address,
    query: {
      enabled: account.isConnected && Boolean(account.address),
      staleTime: 30_000,
    },
  });

  const tokenBalances = useReadContracts({
    contracts: tokens.map((token) => ({
      address: token.address!,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [account.address!],
    })),
    query: {
      enabled: account.isConnected && Boolean(account.address) && tokens.length > 0,
      staleTime: 30_000,
    },
  });

  const native: WalletHolding | undefined =
    nativeBalance.data && account.chain
      ? (() => {
          const formatted = formatUnits(nativeBalance.data.value, nativeBalance.data.decimals);
          const fallbackPrice = NATIVE_TOKEN_PRICE_FALLBACK_USD[account.chainId ?? 0];
          return {
            symbol: nativeBalance.data.symbol,
            name: account.chain?.nativeCurrency.name ?? nativeBalance.data.symbol,
            balance: nativeBalance.data.value.toString(),
            balanceFormatted: formatBalance(formatted),
            decimals: nativeBalance.data.decimals,
            estimatedValueUsd:
              fallbackPrice === undefined
                ? undefined
                : Math.round(numericBalance(formatted) * fallbackPrice * 100) / 100,
            priceSource: fallbackPrice === undefined ? "unavailable" : "fallback",
            source: "native",
          };
        })()
      : undefined;

  const erc20Holdings: WalletHolding[] = tokens.map((token, index) => {
    const result = tokenBalances.data?.[index];
    const rawResult = result?.status === "success" ? result.result : undefined;
    const rawBalance = typeof rawResult === "bigint" ? rawResult : BigInt(0);
    const formatted = formatUnits(rawBalance, token.decimals);
    const estimatedValueUsd = estimateValueUsd(numericBalance(formatted), token);

    return {
      symbol: token.symbol,
      name: token.name,
      tokenAddress: token.address,
      balance: rawBalance.toString(),
      balanceFormatted: formatBalance(formatted),
      decimals: token.decimals,
      estimatedValueUsd,
      priceSource: estimatedValueUsd === undefined ? "unavailable" : "fallback",
      source: "erc20_allowlist",
    };
  });

  const values = [native?.estimatedValueUsd, ...erc20Holdings.map((holding) => holding.estimatedValueUsd)]
    .filter((value): value is number => typeof value === "number");
  const totalEstimatedValueUsd = values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) * 100) / 100
    : undefined;

  const preview: WalletHoldingsPreview = {
    address: account.address,
    chainId: account.chainId,
    chainName: chainLabel(account.chainId),
    native,
    tokens: erc20Holdings,
    totalEstimatedValueUsd,
    mode: account.isConnected ? "basic_holdings_only" : "not_connected",
    limitation:
      "Wave 2 reads native balance and allowlisted ERC20 balances only. Full wallet portfolio indexing is planned for Wave 3.",
  };

  return {
    ...account,
    preview,
    supportedTokens: tokens,
    isLoading: nativeBalance.isLoading || tokenBalances.isLoading,
    isError: nativeBalance.isError || tokenBalances.isError,
    refetch: () => {
      void nativeBalance.refetch();
      void tokenBalances.refetch();
    },
  };
}
