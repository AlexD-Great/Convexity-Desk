import { NextResponse } from "next/server";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getSoSoValueIntelligence();
  return NextResponse.json({
    evidenceCards: result.data.evidenceCards,
    mode: result.mode,
    fetchedAt: result.fetchedAt,
  });
}
