import { NextResponse } from "next/server";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import type { IntegrationDetail, IntegrationStatus } from "@/types";

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

  const liveCount = [sodexMode, sosovalueMode].filter((m) => m === "live").length;
  const overallMode: IntegrationStatus["mode"] =
    liveCount === 2 ? "live" : liveCount === 1 ? "mixed" : "fallback";

  const hasSoSoValueKey = Boolean(process.env.SOSOVALUE_API_KEY?.trim());
  const sosovalueDetail: IntegrationDetail = {
    mode: sosovalueMode,
    label:
      sosovalueMode === "live"
        ? "SoSoValue: Live"
        : hasSoSoValueKey
        ? "SoSoValue: Fallback — live read failed."
        : "SoSoValue: Fallback — API key not configured.",
    reason:
      sosovalueResult.reason ??
      "API key not configured. Set SOSOVALUE_API_KEY to enable live SoSoValue reads.",
    configured: hasSoSoValueKey,
    endpoint: sosovalueResult.endpoint,
  };

  const sodexDetail: IntegrationDetail = {
    mode: sodexMode,
    label:
      sodexMode === "live"
        ? `SoDEX: Live ${sodexResult.data.network} market data${sodexResult.data.stale ? " (stale)" : ""}`
        : "SoDEX: Fallback sample data",
    reason:
      sodexResult.reason ??
      (sodexMode === "live"
        ? "Unsigned public SoDEX market read succeeded."
        : "SoDEX market read failed; showing sample data."),
    // Public market data needs no configuration (defaults to mainnet).
    configured: true,
    endpoint: sodexResult.endpoint,
  };

  const status: IntegrationStatus = {
    sosovalue: sosovalueMode,
    sodex: sodexMode,
    mode: overallMode,
    lastCheckedAt: new Date().toISOString(),
    details: {
      sosovalue: sosovalueDetail,
      sodex: sodexDetail,
    },
  };

  return NextResponse.json(status);
}
