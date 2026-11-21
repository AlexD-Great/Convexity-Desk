import { NextResponse } from "next/server";
import { addOutcome, generatePaperRef } from "@/lib/data/outcomes-store";
import type { HedgePlan, OutcomeLedgerEntry } from "@/types";

export const dynamic = "force-dynamic";

/** Records a confirmed hedge plan as a paper hedge. No exchange order is placed. */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    hedgePlan: HedgePlan;
    dangerScore: number;
  };

  const { hedgePlan, dangerScore } = body;
  const baseAsset = hedgePlan.instrument.split("-")[0].toUpperCase();
  const orderId = generatePaperRef(baseAsset);

  const entry: OutcomeLedgerEntry = {
    id: `outcome-${Date.now()}`,
    hedgePlanId: hedgePlan.id,
    status: "pending",
    actionTaken: "simulated",
    orderId,
    coverageBefore: 0,
    coverageAfter: hedgePlan.coveragePercent,
    notes:
      `Paper ${hedgePlan.direction} on ${hedgePlan.instrument}, ` +
      `$${hedgePlan.suggestedSizeUsd.toLocaleString()} notional. ` +
      `Danger Score at entry: ${dangerScore}/100. ` +
      `Coverage: ${hedgePlan.coveragePercent}%. No exchange order was placed.`,
    createdAt: new Date().toISOString(),
  };

  addOutcome(entry);

  return NextResponse.json({ success: true, entry, orderId });
}
