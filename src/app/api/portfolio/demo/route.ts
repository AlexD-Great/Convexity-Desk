import { NextResponse } from "next/server";
import { getDemoPortfolio } from "@/lib/data/demo-portfolio";

export async function GET() {
  return NextResponse.json(getDemoPortfolio());
}
