import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Phase 7 will implement this route", route: "/api/market/sodex" });
}
