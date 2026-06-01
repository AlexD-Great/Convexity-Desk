import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Phase 9 will implement this route", route: "/api/scan/run" });
}
