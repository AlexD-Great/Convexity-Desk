/**
 * Picks the portfolio a scan / hedge request should run on.
 *   { address: "0x…" } → the wallet's live holdings
 *   anything else       → the demo holdings
 */

import { isAddress } from "viem";
import type { Portfolio } from "@/types";
import { getDemoPortfolio } from "@/lib/data/demo-portfolio";
import { buildPortfolio } from "@/lib/portfolio/build-portfolio";
import { getWalletHoldings, type WalletScanMeta } from "@/lib/wallet/holdings-server";

export class PortfolioError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export type ResolvedPortfolio = {
  portfolio: Portfolio;
  source: "demo" | "wallet";
  wallet?: WalletScanMeta;
};

/** Parses a JSON request body; empty or invalid bodies become {}. */
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export function scanTargetFrom(body: Record<string, unknown>): { address?: string } {
  return typeof body.address === "string" && body.address.trim() ? { address: body.address.trim() } : {};
}

export async function readScanTarget(request: Request): Promise<{ address?: string }> {
  return scanTargetFrom(await readJsonBody(request));
}

export async function resolvePortfolio(target: { address?: string }): Promise<ResolvedPortfolio> {
  if (!target.address) {
    return { portfolio: await getDemoPortfolio(), source: "demo" };
  }
  if (!isAddress(target.address)) throw new PortfolioError("Invalid wallet address", 400);

  let result;
  try {
    result = await getWalletHoldings(target.address);
  } catch (err) {
    throw new PortfolioError(err instanceof Error ? err.message : String(err), 502);
  }

  const portfolio = await buildPortfolio(result.holdings, {
    id: `wallet-${target.address.toLowerCase()}`,
    mode: "wallet",
    ownerAddress: target.address,
  });

  if (portfolio.totalValueUsd <= 0) {
    throw new PortfolioError(
      "No priced holdings found in this wallet on Ethereum, Base, Arbitrum or Optimism.",
      422
    );
  }
  return { portfolio, source: "wallet", wallet: result.meta };
}
