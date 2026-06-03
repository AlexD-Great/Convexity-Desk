"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ArrowRight } from "lucide-react";
import type { OutcomeLedgerEntry, OutcomeStatus } from "@/types";
import { OutcomeLedgerTable } from "@/components/dashboard/OutcomeLedgerTable";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import Link from "next/link";

type OutcomesResponse = {
  entries: OutcomeLedgerEntry[];
  total: number;
  mode: string;
  persistenceNote: string;
};

const STATUS_FILTER_OPTIONS: Array<{ value: OutcomeStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "avoided_loss", label: "Avoided Loss" },
  { value: "useful", label: "Useful" },
  { value: "neutral", label: "Neutral" },
  { value: "wasteful", label: "Wasteful" },
  { value: "missed_hedge", label: "Missed Hedge" },
];

export default function OutcomesPage() {
  const [data, setData] = useState<OutcomesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OutcomeStatus | "all">("all");

  useEffect(() => {
    fetch("/api/outcomes")
      .then((r) => r.json())
      .then((json: OutcomesResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const entries = data?.entries ?? [];
  const filtered = filter === "all" ? entries : entries.filter((e) => e.status === filter);

  // Stats
  const counts: Partial<Record<OutcomeStatus, number>> = {};
  for (const e of entries) counts[e.status] = (counts[e.status] ?? 0) + 1;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Outcome Ledger
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Every confirmed hedge preview — status tracked after confirmation
          </p>
        </div>
        <Link
          href="/app/hedge"
          className="flex items-center gap-1.5 rounded-lg border border-[#1f2937] px-3 py-2 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
        >
          New Hedge Plan <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Summary metric cards */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Entries"
            value={String(entries.length)}
            sublabel="All confirmed hedges"
            accent="#f9fafb"
            icon={ClipboardList}
          />
          <MetricCard
            label="Avoided Loss"
            value={String(counts.avoided_loss ?? 0)}
            sublabel="Hedge protected against drawdown"
            accent="#7cffb2"
          />
          <MetricCard
            label="Useful"
            value={String(counts.useful ?? 0)}
            sublabel="Hedge provided net benefit"
            accent="#22c55e"
          />
          <MetricCard
            label="Pending"
            value={String(counts.pending ?? 0)}
            sublabel="Awaiting resolution"
            accent="#9ca3af"
          />
        </div>
      )}

      {/* Status filter */}
      {!loading && entries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280] mr-1">
            Filter:
          </span>
          {STATUS_FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors"
              style={{
                borderColor: filter === value ? "#7cffb2" + "40" : "#1f2937",
                backgroundColor: filter === value ? "#7cffb2" + "12" : "transparent",
                color: filter === value ? "#7cffb2" : "#6b7280",
              }}
            >
              {label}
              {value !== "all" && counts[value as OutcomeStatus] !== undefined && (
                <span className="ml-1 opacity-60">({counts[value as OutcomeStatus]})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Ledger table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-[#0b1020]" />
          ))}
        </div>
      ) : (
        <OutcomeLedgerTable entries={filtered} />
      )}

      {/* Persistence notice */}
      <CardShell variant="elevated" padding="sm">
        <div className="flex items-start gap-2.5">
          <Badge variant="fallback" dot>Wave 2</Badge>
          <p className="text-xs text-[#6b7280] leading-relaxed">
            {data?.persistenceNote ?? "In-memory store — entries persist for the current server session only."}{" "}
            <Link href="/app/hedge" className="text-[#7cffb2] hover:underline">
              Confirm a new hedge →
            </Link>
          </p>
        </div>
      </CardShell>

      {/* CTA if empty */}
      {!loading && entries.length === 0 && (
        <CardShell variant="default" className="flex flex-col items-center gap-5 py-12 text-center">
          <ClipboardList className="h-10 w-10 text-[#9ca3af]" />
          <div className="space-y-1">
            <p className="font-semibold text-white">No hedge outcomes yet</p>
            <p className="text-sm text-[#9ca3af]">
              Go to Hedge Plan, generate a plan, open the Confirmation Gate, and confirm.
            </p>
          </div>
          <Link
            href="/app/hedge"
            className="flex items-center gap-2 rounded-lg bg-[#7cffb2] px-5 py-2.5 text-sm font-semibold text-[#05070d] hover:bg-[#5cefaa] transition-colors"
          >
            Generate Hedge Plan <ArrowRight className="h-4 w-4" />
          </Link>
        </CardShell>
      )}
    </div>
  );
}
