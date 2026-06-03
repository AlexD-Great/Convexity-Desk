import { NextResponse } from "next/server";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import type { IntegrationStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  // SoDEX: check adapter mode
  const sodexResult = await getSoDEXMarketData();

  // SoSoValue: not yet configured (Phase 8)
  const sosovalueMode: IntegrationStatus["sosovalue"] =
    process.env.SOSOVALUE_API_KEY?.trim() ? "fallback" : "mock";

  const overallMode: IntegrationStatus["mode"] =
    sodexResult.mode === "live" ? "mixed" : "demo";

  const status: IntegrationStatus = {
    sosovalue: sosovalueMode,
    sodex: sodexResult.mode === "live" ? "live" : sodexResult.mode === "error" ? "error" : "fallback",
    mode: overallMode,
    lastCheckedAt: new Date().toISOString(),
  };

  return NextResponse.json(status);
}
