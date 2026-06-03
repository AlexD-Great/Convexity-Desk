import { NextResponse } from "next/server";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import type { IntegrationStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const [sodexResult, sosovalueResult] = await Promise.all([
    getSoDEXMarketData(),
    getSoSoValueIntelligence(),
  ]);

  const sodexMode: IntegrationStatus["sodex"] =
    sodexResult.mode === "live" ? "live"
    : sodexResult.mode === "error" ? "error"
    : "fallback";

  const sosovalueMode: IntegrationStatus["sosovalue"] =
    sosovalueResult.mode === "live" ? "live"
    : sosovalueResult.mode === "error" ? "error"
    : "fallback";

  const hasAnyLive = sodexMode === "live" || sosovalueMode === "live";
  const overallMode: IntegrationStatus["mode"] = hasAnyLive ? "mixed" : "demo";

  const status: IntegrationStatus = {
    sosovalue: sosovalueMode,
    sodex: sodexMode,
    mode: overallMode,
    lastCheckedAt: new Date().toISOString(),
  };

  return NextResponse.json(status);
}
