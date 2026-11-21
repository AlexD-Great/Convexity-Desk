"use client";

import { useQuery } from "@tanstack/react-query";
import { erc20Abi, formatUnits } from "viem";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { chainLabel } from "@/lib/wallet/chains";
import { supportedTokensForChain } from "@/lib/wallet/supported-tokens";
import type { WalletHolding, WalletHoldingsPreview, WalletPriceSource } from "@/lib/wallet/wallet-holdings";

type PriceQuote = { priceUsd: number; source: WalletPriceSource } | null;

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

function valueWith(
  formatted: string,
  quote: PriceQuote | undefined,
  isTestnet: boolean
): Pick<WalletHolding, "estimatedValueUsd" | "priceUsd" | "priceSource"> {
  if (isTestnet) return { priceSource: "testnet" };
  if (!quote) return { priceSource: "unavailable" };
  return {
    priceUsd: quote.priceUsd,
    estimatedValueUsd: Math.round(numericBalance(formatted) * quote.priceUsd * 100) / 100,
    priceSource: quote.source,
  };
}

export function useWalletHoldings() {
  const account = useAccount();
  const tokens = supportedTokensForChain(account.chainId);
  const isTestnet = Boolean(account.chain?.testnet);

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

  const nativeSymbol = nativeBalance.data?.symbol;
  const priceSymbols = [nativeSymbol, ...tokens.map((t) => t.symbol)].filter(Boolean) as string[];

  const prices = useQuery({
    queryKey: ["prices", priceSymbols.join(",")],
    enabled: account.isConnected && !isTestnet && priceSymbols.length > 0,
    staleTime: 30_000,
    refetchInterval: 60_000,
    queryFn: async () => {
      const res = await fetch(`/api/prices?symbols=${encodeURIComponent(priceSymbols.join(","))}`);
      if (!res.ok) throw new Error(`prices HTTP ${res.status}`);
      const json = (await res.json()) as { prices: Record<string, PriceQuote> };
      return json.prices;
    },
  });

  const quoteFor = (symbol: string) => prices.data?.[symbol.toUpperCase()];

  const native: WalletHolding | undefined =
    nativeBalance.data && account.chain
      ? (() => {
          const formatted = formatUnits(nativeBalance.data.value, nativeBalance.data.decimals);
          return {
            symbol: nativeBalance.data.symbol,
            name: account.chain?.nativeCurrency.name ?? nativeBalance.data.symbol,
            balance: nativeBalance.data.value.toString(),
            balanceFormatted: formatBalance(formatted),
            decimals: nativeBalance.data.decimals,
            ...valueWith(formatted, quoteFor(nativeBalance.data.symbol), isTestnet),
            source: "native",
          };
        })()
      : undefined;

  const erc20Holdings: WalletHolding[] = tokens.map((token, index) => {
    const result = tokenBalances.data?.[index];
    const rawResult = result?.status === "success" ? result.result : undefined;
    const rawBalance = typeof rawResult === "bigint" ? rawResult : BigInt(0);
    const formatted = formatUnits(rawBalance, token.decimals);

    return {
      symbol: token.symbol,
      name: token.name,
      tokenAddress: token.address,
      balance: rawBalance.toString(),
      balanceFormatted: formatBalance(formatted),
      decimals: token.decimals,
      ...valueWith(formatted, quoteFor(token.symbol), isTestnet),
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
      "Reads the native balance plus USDC and WETH on Ethereum mainnet only. Broader token coverage is coming next.",
  };

  return {
    ...account,
    preview,
    supportedTokens: tokens,
    isLoading: nativeBalance.isLoading || tokenBalances.isLoading || prices.isLoading,
    isError: nativeBalance.isError || tokenBalances.isError || prices.isError,
    refetch: () => {
      void nativeBalance.refetch();
      void tokenBalances.refetch();
      void prices.refetch();
    },
  };
}
