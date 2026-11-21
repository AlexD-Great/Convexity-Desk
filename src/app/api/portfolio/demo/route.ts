import { NextResponse } from "next/server";
import { getDemoPortfolio } from "@/lib/data/demo-portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getDemoPortfolio());
}
