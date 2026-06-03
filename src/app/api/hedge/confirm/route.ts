import { NextResponse } from "next/server";
import { addOutcome, generateSimOrderId } from "@/lib/data/outcomes-store";
import type { HedgePlan, OutcomeLedgerEntry } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json() as {
    hedgePlan: HedgePlan;
    dangerScore: number;
  };

  const { hedgePlan, dangerScore } = body;
  const baseAsset = hedgePlan.instrument.split("-")[0].toUpperCase();
  const orderId = generateSimOrderId(baseAsset);

  const entry: OutcomeLedgerEntry = {
    id: `outcome-${Date.now()}`,
    hedgePlanId: hedgePlan.id,
    status: "pending",
    actionTaken: "simulated",
    orderId,
    coverageBefore: 0,
    coverageAfter: hedgePlan.coveragePercent,
    notes:
      `Simulated ${hedgePlan.direction} on ${hedgePlan.instrument}. ` +
      `Size: $${hedgePlan.suggestedSizeUsd.toLocaleString()}. ` +
      `Danger Score at entry: ${dangerScore}/100. ` +
      `Coverage: ${hedgePlan.coveragePercent}%. ` +
      `Wave 2 simulation — no real order placed.`,
    createdAt: new Date().toISOString(),
  };

  addOutcome(entry);

  return NextResponse.json({ success: true, entry, orderId });
}
