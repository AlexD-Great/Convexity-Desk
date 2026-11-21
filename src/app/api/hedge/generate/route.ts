import { NextResponse } from "next/server";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import { calculateDangerScore } from "@/lib/risk/convexity-score";
import { composeHedgePlan, buildPreview } from "@/lib/hedge/hedge-composer";
import { PortfolioError, readJsonBody, resolvePortfolio, scanTargetFrom } from "@/lib/portfolio/resolve-portfolio";
import type { RiskProfile } from "@/types";

export const dynamic = "force-dynamic";

const PROFILES: RiskProfile[] = ["conservative", "balanced", "aggressive"];
const clampNum = (v: unknown, lo: number, hi: number, dflt: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
};

/**
 * POST body (all optional):
 *   address        — wallet to analyse (omit for demo holdings)
 *   riskProfile    — conservative | balanced | aggressive
 *   maxHedgePct    — cap as % of non-stablecoin exposure (5–100)
 *   maxSlippageBps — preview warns above this (1–200)
 */
export async function POST(request: Request) {
  const body = await readJsonBody(request);
  const target = scanTargetFrom(body);
  const profile: RiskProfile = PROFILES.includes(body.riskProfile as RiskProfile)
    ? (body.riskProfile as RiskProfile)
    : "balanced";
  const limits = {
    maxHedgePct: clampNum(body.maxHedgePct, 5, 100, 50),
    maxSlippageBps: clampNum(body.maxSlippageBps, 1, 200, 25),
  };
  let resolved;
  try {
    resolved = await resolvePortfolio(target);
  } catch (err) {
    const status = err instanceof PortfolioError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status });
  }
  const { portfolio } = resolved;

  const [intelligenceResult, marketResult] = await Promise.all([
    getSoSoValueIntelligence(),
    getSoDEXMarketData(),
  ]);

  const scan = calculateDangerScore(
    portfolio,
    intelligenceResult.data,
    marketResult.data
  );

  const plan = composeHedgePlan(portfolio, scan, profile, { maxHedgePct: limits.maxHedgePct });
  const preview = buildPreview(plan, marketResult.data, marketResult.mode, {
    maxSlippageBps: limits.maxSlippageBps,
  });

  return NextResponse.json({
    scan,
    portfolio,
    portfolioSource: resolved.source,
    wallet: resolved.wallet,
    preferences: { riskProfile: profile, ...limits },
    evidenceCards: intelligenceResult.data.evidenceCards,
    hedgePlan: plan,
    executionPreview: preview,
    dataMode: {
      sosovalue: intelligenceResult.mode,
      sodex: marketResult.mode,
    },
    dataStatus: {
      sosovalue: {
        mode: intelligenceResult.mode,
        label:
          intelligenceResult.mode === "live"
            ? "SoSoValue: Live"
            : process.env.SOSOVALUE_API_KEY?.trim()
            ? "SoSoValue: Fallback — live read failed."
            : "SoSoValue: Fallback — API key not configured.",
        reason:
          intelligenceResult.reason ??
          "API key not configured. Set SOSOVALUE_API_KEY to enable live SoSoValue reads.",
        endpoint: intelligenceResult.endpoint,
      },
      sodex: {
        mode: marketResult.mode,
        label:
          marketResult.mode === "live"
            ? `SoDEX: Live ${marketResult.data.network} market data`
            : "SoDEX: Fallback sample data",
        reason: marketResult.reason,
        endpoint: marketResult.endpoint,
      },
    },
  });
}
