import { NextResponse } from "next/server";
import type { IntegrationStatus } from "@/types";

export async function GET() {
  const status: IntegrationStatus = {
    sosovalue: "mock",
    sodex: "mock",
    mode: "demo",
    lastCheckedAt: new Date().toISOString(),
  };
  return NextResponse.json(status);
}
