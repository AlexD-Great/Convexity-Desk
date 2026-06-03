import { NextResponse } from "next/server";
import { getSoSoValueIntelligence } from "@/lib/adapters/sosovalue";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getSoSoValueIntelligence();
  return NextResponse.json(response);
}
