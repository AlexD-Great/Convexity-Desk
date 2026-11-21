/**
 * Wallet holdings → priced Holding[] for buildPortfolio. Server-side only.
 *
 * Discovery
 *   ALCHEMY_API_KEY set → Alchemy Portfolio API (every ERC-20 + native across
 *                         Ethereum, Base, Arbitrum, Optimism in one call)
 *   otherwise           → public RPC multicall over the curated token list
 *
 * Pricing / trust (blocks spam tokens that copy "USDC", "ETH", …)
 *   native token or curated contract  → priced by symbol (SoDEX → SoSoValue)
 *   other token with an Alchemy price → our price if within 25% of Alchemy's,
 *                                       otherwise Alchemy's own price
 *   other token, no price anywhere    → excluded ("unpriced")
 *   aggregate value < $1               → excluded ("dust")
 */

import { createPublicClient, erc20Abi, fallback, formatUnits, http, isAddress, type Chain } from "viem";
import { arbitrum, base, mainnet, optimism } from "viem/chains";
import type { BetaBucket } from "@/types";
import { canonicalSymbol, getPrices, type PriceQuote } from "@/lib/prices/price-service";
import { classifyAsset } from "@/lib/portfolio/classify";
import type { Holding } from "@/lib/portfolio/build-portfolio";
import { CHAINS, CURATED_TOKENS, isTrustedToken, type ChainKey } from "./token-lists";

export type WalletProvider = "alchemy" | "rpc";

export type RawBalance = {
  chain: ChainKey;
  tokenAddress: string | null; // null = native
  symbol: string;
  name: string;
  amount: number;
  alchemyPriceUsd?: number;
};

export type ExcludedHolding = {
  symbol: string;
  chain: string;
  reason: "unpriced" | "dust";
  valueUsd?: number;
};

export type WalletScanMeta = {
  address: string;
  provider: WalletProvider;
  chains: Array<{ chain: string; ok: boolean; error?: string }>;
  excluded: ExcludedHolding[];
  fetchedAt: string;
};

const DUST_USD = 1;
const CACHE_TTL_MS = 60_000;

// ─────────────────────────────────────────────
// Alchemy Portfolio API
// ─────────────────────────────────────────────

type AlchemyToken = {
  network: string;
  tokenAddress: string | null;
  tokenBalance: string | null;
  tokenMetadata?: { decimals?: number | null; name?: string | null; symbol?: string | null } | null;
  tokenPrices?: Array<{ currency: string; value: string }> | null;
  error?: string | null;
};

type AlchemyResponse = {
  data?: { tokens?: AlchemyToken[]; pageKey?: string | null };
  error?: { message?: string; partialErrors?: Array<{ network: string; message: string }> };
};

const NETWORK_TO_CHAIN = Object.fromEntries(
  (Object.entries(CHAINS) as Array<[ChainKey, (typeof CHAINS)[ChainKey]]>).map(([k, c]) => [c.alchemyNetwork, k])
) as Record<string, ChainKey>;

function parseRawBalance(raw: string | null | undefined): bigint | null {
  if (!raw) return null;
  try {
    return BigInt(raw); // handles "0x…" hex and plain decimal strings
  } catch {
    return null;
  }
}

async function alchemyBalances(address: string, apiKey: string) {
  const url = `https://api.g.alchemy.com/data/v1/${encodeURIComponent(apiKey)}/assets/tokens/by-address`;
  const allNetworks = Object.values(CHAINS).map((c) => c.alchemyNetwork);

  const post = async (networks: string[], pageKey?: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        addresses: [{ address, networks }],
        withMetadata: true,
        withPrices: true,
        includeNativeTokens: true,
        includeErc20Tokens: true,
        ...(pageKey ? { pageKey } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as AlchemyResponse;
    return { status: res.status, json };
  };

  let networks = allNetworks;
  let first = await post(networks);
  // If a network slug is rejected, fall back to the slugs Alchemy documents explicitly.
  if (first.status === 400) {
    networks = ["eth-mainnet", "base-mainnet"];
    first = await post(networks);
  }
  if (first.status === 401 || first.status === 403) throw new Error("Alchemy rejected the API key");
  if (first.status === 429) throw new Error("Alchemy rate limit hit");
  if (first.status !== 200) throw new Error(`Alchemy HTTP ${first.status}: ${first.json.error?.message ?? ""}`.trim());

  const tokens: AlchemyToken[] = [...(first.json.data?.tokens ?? [])];
  const partial = new Map((first.json.error?.partialErrors ?? []).map((e) => [e.network, e.message]));

  let pageKey = first.json.data?.pageKey ?? undefined;
  for (let page = 0; pageKey && page < 4; page++) {
    const next = await post(networks, pageKey);
    if (next.status !== 200) break;
    tokens.push(...(next.json.data?.tokens ?? []));
    pageKey = next.json.data?.pageKey ?? undefined;
  }

  const balances: RawBalance[] = [];
  for (const t of tokens) {
    const chain = NETWORK_TO_CHAIN[t.network];
    if (!chain) continue;
    const decimals = t.tokenMetadata?.decimals ?? (t.tokenAddress === null ? 18 : null);
    const raw = parseRawBalance(t.tokenBalance);
    if (decimals === null || decimals === undefined || raw === null || raw === BigInt(0)) continue;
    const amount = Number(formatUnits(raw, decimals));
    if (!(amount > 0)) continue;
    const usd = t.tokenPrices?.find((p) => p.currency?.toLowerCase() === "usd");
    balances.push({
      chain,
      tokenAddress: t.tokenAddress,
      symbol: (t.tokenMetadata?.symbol || (t.tokenAddress === null ? "ETH" : "")).trim(),
      name: (t.tokenMetadata?.name || t.tokenMetadata?.symbol || "").trim(),
      amount,
      alchemyPriceUsd: usd ? Number(usd.value) || undefined : undefined,
    });
  }

  const chains = networks
    .filter((n) => NETWORK_TO_CHAIN[n])
    .map((n) => ({ chain: CHAINS[NETWORK_TO_CHAIN[n]].label, ok: !partial.has(n), error: partial.get(n) }));

  return { balances: balances.filter((b) => b.symbol), chains };
}

// ─────────────────────────────────────────────
// RPC fallback (curated list only)
// ─────────────────────────────────────────────

const VIEM_CHAINS: Record<ChainKey, Chain> = { eth: mainnet, base, arb: arbitrum, op: optimism };
const RPC_ENV: Record<ChainKey, string> = {
  eth: "RPC_URL_ETHEREUM",
  base: "RPC_URL_BASE",
  arb: "RPC_URL_ARBITRUM",
  op: "RPC_URL_OPTIMISM",
};
// Several keyless public endpoints per chain: a rate-limited one (429) fails
// over to the next immediately instead of retrying with backoff.
const PUBLIC_RPCS: Record<ChainKey, string[]> = {
  eth: ["https://ethereum-rpc.publicnode.com", "https://1rpc.io/eth", "https://eth.merkle.io"],
  base: ["https://base-rpc.publicnode.com", "https://mainnet.base.org", "https://1rpc.io/base"],
  arb: ["https://arbitrum-one-rpc.publicnode.com", "https://arb1.arbitrum.io/rpc", "https://1rpc.io/arb"],
  op: ["https://optimism-rpc.publicnode.com", "https://mainnet.optimism.io", "https://1rpc.io/op"],
};
const CHAIN_DEADLINE_MS = 12_000;

function withDeadline<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

async function rpcChainBalances(address: `0x${string}`, chain: ChainKey): Promise<RawBalance[]> {
  const custom = process.env[RPC_ENV[chain]]?.trim();
  const urls = custom ? [custom, ...PUBLIC_RPCS[chain]] : PUBLIC_RPCS[chain];
  const client = createPublicClient({
    chain: VIEM_CHAINS[chain],
    transport: fallback(
      urls.map((u) => http(u, { timeout: 6_000, retryCount: 0 })),
      { retryCount: 1 }
    ),
  });
  const tokens = CURATED_TOKENS[chain];

  const [native, results] = await Promise.all([
    client.getBalance({ address }),
    client.multicall({
      allowFailure: true,
      contracts: tokens.flatMap((t) => [
        { address: t.address, abi: erc20Abi, functionName: "balanceOf", args: [address] } as const,
        { address: t.address, abi: erc20Abi, functionName: "decimals" } as const,
      ]),
    }),
  ]);

  const out: RawBalance[] = [];
  if (native > BigInt(0)) {
    out.push({ chain, tokenAddress: null, symbol: "ETH", name: "Ether", amount: Number(formatUnits(native, 18)) });
  }
  tokens.forEach((t, i) => {
    const bal = results[i * 2];
    const dec = results[i * 2 + 1];
    if (bal.status !== "success" || dec.status !== "success") return;
    const raw = bal.result as bigint;
    if (raw === BigInt(0)) return;
    out.push({
      chain,
      tokenAddress: t.address,
      symbol: t.symbol,
      name: t.symbol,
      amount: Number(formatUnits(raw, Number(dec.result))),
    });
  });
  return out;
}

async function rpcBalances(address: `0x${string}`) {
  const keys = Object.keys(CHAINS) as ChainKey[];
  const settled = await Promise.allSettled(
    keys.map((k) => withDeadline(rpcChainBalances(address, k), CHAIN_DEADLINE_MS, CHAINS[k].label))
  );
  const balances: RawBalance[] = [];
  const chains = settled.map((s, i) => {
    if (s.status === "fulfilled") {
      balances.push(...s.value);
      return { chain: CHAINS[keys[i]].label, ok: true };
    }
    const msg = s.reason instanceof Error ? s.reason.message.split("\n")[0] : String(s.reason);
    return { chain: CHAINS[keys[i]].label, ok: false, error: msg.slice(0, 160) };
  });
  return { balances, chains };
}

// ─────────────────────────────────────────────
// Pricing, trust and aggregation
// ─────────────────────────────────────────────

const _cache = new Map<string, { value: { holdings: Holding[]; meta: WalletScanMeta }; expiresAt: number }>();

export async function getWalletHoldings(address: string): Promise<{ holdings: Holding[]; meta: WalletScanMeta }> {
  if (!isAddress(address)) throw new Error("Invalid wallet address");
  const key = address.toLowerCase();
  const hit = _cache.get(key);
  if (hit && Date.now() < hit.expiresAt) return hit.value;

  const apiKey = process.env.ALCHEMY_API_KEY?.trim();
  const provider: WalletProvider = apiKey ? "alchemy" : "rpc";
  const { balances, chains } = apiKey
    ? await alchemyBalances(address, apiKey)
    : await rpcBalances(address as `0x${string}`);

  if (chains.length > 0 && chains.every((c) => !c.ok)) {
    throw new Error(`Could not read the wallet on any chain: ${chains[0].error ?? "unknown error"}`);
  }

  const isTrusted = (b: RawBalance) =>
    b.tokenAddress === null || provider === "rpc" || isTrustedToken(b.chain, b.tokenAddress);

  // SoDEX covers everything in one cached call. SoSoValue (quota-limited) is
  // only consulted for trusted tokens SoDEX doesn't list — never for spam.
  const symbols = new Set<string>();
  const trustedSymbols = new Set<string>();
  for (const b of balances) {
    symbols.add(b.symbol.toUpperCase());
    symbols.add(canonicalSymbol(b.symbol));
    if (isTrusted(b)) trustedSymbols.add(canonicalSymbol(b.symbol));
  }
  const quotes = await getPrices([...symbols], { sosovalueFallback: false });
  const unpricedTrusted = [...trustedSymbols].filter((s) => !quotes[s]);
  if (unpricedTrusted.length > 0) {
    Object.assign(quotes, await getPrices(unpricedTrusted, { sosovalueFallback: true }));
  }

  const excluded: ExcludedHolding[] = [];
  type Agg = {
    symbol: string;
    name: string;
    amount: number;
    valueUsd: number;
    sources: Set<PriceQuote["source"]>;
    change24h?: number;
    chains: Set<string>;
  };
  const agg = new Map<string, Agg>();

  for (const b of balances) {
    const quote = quotes[b.symbol.toUpperCase()] ?? quotes[canonicalSymbol(b.symbol)] ?? null;
    const trusted = isTrusted(b);

    let price: number | undefined;
    let source: PriceQuote["source"] | undefined;
    if (trusted && quote) {
      price = quote.priceUsd;
      source = quote.source;
    } else if (b.alchemyPriceUsd) {
      const agrees = quote && Math.abs(quote.priceUsd / b.alchemyPriceUsd - 1) < 0.25;
      price = agrees ? quote!.priceUsd : b.alchemyPriceUsd;
      source = agrees ? quote!.source : "alchemy";
    }

    if (price === undefined || source === undefined) {
      excluded.push({ symbol: b.symbol, chain: CHAINS[b.chain].label, reason: "unpriced" });
      continue;
    }

    // Wrapped/staked forms (WETH, stETH, cbBTC…) roll up into their underlying,
    // but only when we actually priced them as that underlying.
    const canon = canonicalSymbol(b.symbol);
    const sym = source === "alchemy" ? b.symbol.toUpperCase() : canon;
    const entry = agg.get(sym) ?? {
      symbol: sym,
      name: sym === canon && canon !== b.symbol.toUpperCase() ? canon : b.name || b.symbol,
      amount: 0,
      valueUsd: 0,
      sources: new Set(),
      chains: new Set(),
    };
    entry.amount += b.amount;
    entry.valueUsd += b.amount * price;
    entry.sources.add(source);
    entry.chains.add(CHAINS[b.chain].label);
    if (source !== "alchemy" && quote) entry.change24h = quotes[canon]?.change24hPct ?? quote.change24hPct;
    agg.set(sym, entry);
  }

  const holdings: Holding[] = [];
  for (const a of agg.values()) {
    if (a.valueUsd < DUST_USD) {
      excluded.push({ symbol: a.symbol, chain: [...a.chains].join(", "), reason: "dust", valueUsd: a.valueUsd });
      continue;
    }
    const bucket: BetaBucket = classifyAsset(a.symbol);
    const canonQuote = quotes[a.symbol] ?? null;
    const primarySource = [...a.sources].find((s) => s !== "alchemy") ?? "alchemy";
    holdings.push({
      symbol: a.symbol,
      name: a.name,
      amount: a.amount,
      betaBucket: bucket,
      hedgeable: canonQuote?.source === "sodex-perp" && bucket !== "STABLE",
      chains: [...a.chains],
      quote: {
        ...(canonQuote ?? {}),
        symbol: a.symbol,
        priceUsd: a.valueUsd / a.amount,
        change24hPct: a.change24h ?? 0,
        source: primarySource,
        asOf: new Date().toISOString(),
      },
    });
  }

  const value = {
    holdings,
    meta: { address, provider, chains, excluded, fetchedAt: new Date().toISOString() },
  };
  _cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  return value;
}
