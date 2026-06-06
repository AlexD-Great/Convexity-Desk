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

  const hasAnyLive = sodexMode === "live" || sosovalueMode === "live";
  const overallMode: IntegrationStatus["mode"] = hasAnyLive ? "mixed" : "demo";

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
        ? "SoDEX: Live public market read"
        : "SoDEX: Fallback public market data",
    reason:
      sodexResult.reason ??
      (sodexMode === "live"
        ? "Unsigned public SoDEX market read succeeded."
        : "SoDEX public/testnet market read failed; using typed fallback data."),
    configured: Boolean(
      process.env.SODEX_BASE_URL?.trim() || process.env.SODEX_TESTNET_BASE_URL?.trim()
    ),
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
