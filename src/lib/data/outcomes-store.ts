/**
 * Outcome ledger store — in memory.
 *
 * Holds only hedges the user actually confirmed. Nothing is pre-seeded.
 * Limitation: entries live in server memory, so they reset on restart and are
 * not shared across serverless instances. Durable storage is the next step.
 */

import type { OutcomeLedgerEntry } from "@/types";

const _store: OutcomeLedgerEntry[] = [];

export function getOutcomes(): OutcomeLedgerEntry[] {
  return [..._store].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addOutcome(entry: OutcomeLedgerEntry): void {
  _store.push(entry);
}

/** Reference for a confirmed paper hedge (no exchange order exists). */
export function generatePaperRef(baseAsset: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(_store.length + 1).padStart(3, "0");
  return `PAPER-${date}-${baseAsset.toUpperCase()}-${seq}`;
}
