import { NextResponse } from "next/server";
import { getSoDEXMarketData } from "@/lib/adapters/sodex";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getSoDEXMarketData();
  return NextResponse.json(response);
}
