import { NextResponse } from "next/server";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";
import { buildPreview } from "@/lib/hedge/hedge-composer";
import type { HedgePlan } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json() as { hedgePlan: HedgePlan };
  const marketResult = await getSoDEXMarketData();
  const preview = buildPreview(body.hedgePlan, marketResult.data, marketResult.mode);
  return NextResponse.json(preview);
}
