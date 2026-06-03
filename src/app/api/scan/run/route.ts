import { NextResponse } from "next/server";
import { getDemoPortfolio } from "@/lib/data/demo-portfolio";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import { calculateDangerScore } from "@/lib/risk/convexity-score";

export const dynamic = "force-dynamic";

export async function POST() {
  const [portfolio, intelligenceResult, marketResult] = await Promise.all([
    Promise.resolve(getDemoPortfolio()),
    getSoSoValueIntelligence(),
    getSoDEXMarketData(),
  ]);

  const scan = calculateDangerScore(
    portfolio,
    intelligenceResult.data,
    marketResult.data
  );

  return NextResponse.json({
    scan,
    evidenceCards: intelligenceResult.data.evidenceCards,
    dataMode: {
      sosovalue: intelligenceResult.mode,
      sodex: marketResult.mode,
    },
  });
}
