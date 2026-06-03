/**
 * In-memory outcome ledger store — Wave 2.
 *
 * Wave 2 limitation: module-level state resets on server restart and may not
 * persist across serverless invocations in production (Vercel cold starts).
 * Wave 3 will replace this with Supabase persistence.
 *
 * The store is seeded with three demo entries so the ledger always has
 * content to display, even before the user confirms a hedge in the current session.
 */

import type { OutcomeLedgerEntry } from "@/types";

const _store: OutcomeLedgerEntry[] = [
  {
    id: "outcome-demo-1",
    hedgePlanId: "hedge-demo-001",
    status: "avoided_loss",
    actionTaken: "simulated",
    orderId: "SIM-20260518-BTC-001",
    coverageBefore: 0,
    coverageAfter: 42,
    notes:
      "BTC-PERP short entered at $46,200. BTC dropped 12.3% over the following 5 days. Hedge offset approximately 38% of portfolio downside. Closed at $40,510.",
    createdAt: "2026-05-18T09:14:32.000Z",
  },
  {
    id: "outcome-demo-2",
    hedgePlanId: "hedge-demo-002",
    status: "useful",
    actionTaken: "simulated",
    orderId: "SIM-20260525-ETH-001",
    coverageBefore: 0,
    coverageAfter: 28,
    notes:
      "ETH-PERP short entered after ETH ETF outflow signal. ETH declined 6.8% within 48 hours. Hedge provided moderate but meaningful downside protection.",
    createdAt: "2026-05-25T14:22:10.000Z",
  },
  {
    id: "outcome-demo-3",
    hedgePlanId: "hedge-demo-003",
    status: "neutral",
    actionTaken: "simulated",
    orderId: "SIM-20260530-BTC-002",
    coverageBefore: 0,
    coverageAfter: 35,
    notes:
      "BTC-PERP short entered on macro event proximity signal. Fed minutes were less hawkish than expected. Market remained flat. Hedge cost was ~12 bps with no net benefit.",
    createdAt: "2026-05-30T08:00:00.000Z",
  },
];

export function getOutcomes(): OutcomeLedgerEntry[] {
  return [..._store];
}

export function addOutcome(entry: OutcomeLedgerEntry): void {
  _store.push(entry);
}

export function generateSimOrderId(baseAsset: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(_store.length + 1).padStart(3, "0");
  return `SIM-${date}-${baseAsset.toUpperCase()}-${seq}`;
}
