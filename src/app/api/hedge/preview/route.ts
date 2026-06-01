import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Phase 10 will implement this route", route: "/api/hedge/preview" });
}
