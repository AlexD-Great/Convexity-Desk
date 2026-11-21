import { NextResponse } from "next/server";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import { calculateDangerScore } from "@/lib/risk/convexity-score";
import { composeHedgePlan, buildPreview } from "@/lib/hedge/hedge-composer";
import { PortfolioError, readScanTarget, resolvePortfolio } from "@/lib/portfolio/resolve-portfolio";

export const dynamic = "force-dynamic";

/** POST body: {} for the demo holdings, or { address: "0x…" } for a wallet. */
export async function POST(request: Request) {
  const target = await readScanTarget(request);
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

  const plan = composeHedgePlan(portfolio, scan, "balanced");
  const preview = buildPreview(plan, marketResult.data, marketResult.mode);

  return NextResponse.json({
    scan,
    portfolio,
    portfolioSource: resolved.source,
    wallet: resolved.wallet,
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
