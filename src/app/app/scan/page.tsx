"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ScanLine,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import type { RiskScan, EvidenceCard } from "@/types";
import type { IntegrationMode } from "@/types";
import { DangerScoreGauge } from "@/components/dashboard/DangerScoreGauge";
import { RiskFactorCard } from "@/components/dashboard/RiskFactorCard";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

type ScanState = "idle" | "scanning" | "done" | "error";

type ScanResponse = {
  scan: RiskScan;
  evidenceCards: EvidenceCard[];
  dataMode: { sosovalue: IntegrationMode; sodex: IntegrationMode };
};

// ─── Idle ────────────────────────────────────────────────────────────

function IdleState({ onRun }: { onRun: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-6 py-20 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
        <ScanLine className="h-8 w-8 text-[#9ca3af]" />
      </div>
      <div className="space-y-2 max-w-sm">
        <p className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Ready to scan your portfolio
        </p>
        <p className="text-sm text-[#9ca3af]">
          The Convexity engine will score 5 risk factors using SoSoValue
          intelligence and SoDEX market data, then calculate your Danger Score.
        </p>
      </div>
      <PrimaryButton size="lg" onClick={onRun}>
        <ScanLine className="h-4 w-4" />
        Run Convexity Scan
      </PrimaryButton>
      <p className="font-mono text-[10px] text-[#4b5563]">
        Using demo portfolio · SoSoValue + SoDEX fallback data
      </p>
    </motion.div>
  );
}

// ─── Scanning ────────────────────────────────────────────────────────

const SCAN_STEPS = [
  "Loading demo portfolio…",
  "Fetching SoSoValue intelligence…",
  "Fetching SoDEX market data…",
  "Scoring 5 risk factors…",
  "Calculating Danger Score…",
];

function ScanningState() {
  const [step] = useState(0);
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <ScanLine className="h-10 w-10 text-[#7cffb2]" />
      </motion.div>
      <div className="space-y-4">
        <p className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Scanning portfolio…
        </p>
        <div className="space-y-2">
          {SCAN_STEPS.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= step ? 1 : 0.25, x: 0 }}
              transition={{ delay: i * 0.18 }}
              className="flex items-center gap-2 justify-center"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${i <= step ? "bg-[#7cffb2]" : "bg-[#374151]"}`}
              />
              <span className="font-mono text-xs text-[#9ca3af]">{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Evidence mini-card ───────────────────────────────────────────────

function EvidenceItem({ card }: { card: EvidenceCard }) {
  const dotColor =
    card.severity === "high" ? "#ef4444" : card.severity === "medium" ? "#f59e0b" : "#9ca3af";
  return (
    <div
      className="flex gap-3 rounded-xl border p-3"
      style={{
        borderColor: `${dotColor}18`,
        backgroundColor: `${dotColor}05`,
      }}
    >
      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-semibold text-white leading-snug">{card.title}</p>
        <p className="text-xs text-[#9ca3af] leading-relaxed line-clamp-2">{card.description}</p>
        <div className="flex flex-wrap gap-1 pt-0.5">
          <Badge variant={card.source === "SoSoValue" ? "blue" : card.source === "SoDEX" ? "primary" : "mock"}>
            {card.source}
          </Badge>
          {card.sentiment && (
            <Badge variant={card.sentiment === "bearish" ? "danger" : card.sentiment === "bullish" ? "success" : "default"}>
              {card.sentiment}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Results ─────────────────────────────────────────────────────────

function ResultsState({
  result,
  onRescan,
}: {
  result: ScanResponse;
  onRescan: () => void;
}) {
  const { scan, evidenceCards, dataMode } = result;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Scan Complete
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            {new Date(scan.createdAt).toLocaleString()} · Demo portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRescan}
            className="flex items-center gap-1.5 rounded-lg border border-[#1f2937] px-3 py-2 text-xs text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Re-scan
          </button>
          <PrimaryButton href="/app/hedge" size="md">
            Generate Hedge Plan <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>

      {/* Top row: gauge + summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gauge */}
        <CardShell
          variant={scan.dangerScore >= 75 ? "danger" : scan.dangerScore >= 50 ? "warning" : "default"}
          className="flex flex-col items-center justify-center gap-4 py-6"
        >
          <DangerScoreGauge score={scan.dangerScore} riskLevel={scan.riskLevel} />
          <div className="flex gap-2">
            <Badge variant={dataMode.sosovalue === "live" ? "live" : "fallback"} dot>
              SoSoValue {dataMode.sosovalue}
            </Badge>
            <Badge variant={dataMode.sodex === "live" ? "live" : "fallback"} dot>
              SoDEX {dataMode.sodex}
            </Badge>
          </div>
        </CardShell>

        {/* Summary */}
        <CardShell variant="default" className="lg:col-span-2 space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Risk Summary
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
              {scan.summary}
            </p>
          </div>

          {scan.dangerScore >= 50 && (
            <div className="flex items-start gap-3 rounded-lg border border-[#f59e0b]/20 bg-[#f59e0b]/[0.04] p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
              <p className="text-xs text-[#9ca3af]">
                Danger Score of{" "}
                <span className="font-semibold text-white">{scan.dangerScore}/100</span> suggests
                reviewing hedge options.{" "}
                <Link href="/app/hedge" className="text-[#7cffb2] hover:underline">
                  Generate hedge plan →
                </Link>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-5">
            {scan.factors.map((f) => (
              <div key={f.key} className="text-center">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#4b5563] truncate">
                  {f.label.split(" ")[0]}
                </p>
                <p
                  className="font-mono text-lg font-bold leading-none mt-1"
                  style={{
                    color:
                      f.score >= 75 ? "#ef4444" : f.score >= 50 ? "#f59e0b" : f.score >= 25 ? "#60a5fa" : "#22c55e",
                  }}
                >
                  {f.score}
                </p>
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      {/* Risk factor breakdown */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
          Risk Factor Breakdown
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {scan.factors.map((factor) => (
            <RiskFactorCard key={factor.key} factor={factor} />
          ))}
        </div>
      </div>

      {/* Evidence */}
      {evidenceCards.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Evidence ({evidenceCards.length} signals)
            </p>
            <Link
              href="/app/scan"
              className="flex items-center gap-1 font-mono text-[10px] text-[#7cffb2] hover:text-[#5cefaa] transition-colors"
              onClick={onRescan}
            >
              Refresh <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {evidenceCards.map((card) => (
              <EvidenceItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center justify-between rounded-xl border border-[#7cffb2]/20 bg-[#7cffb2]/[0.04] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Danger Score {scan.dangerScore}/100 —{" "}
            <span className={scan.dangerScore >= 75 ? "text-[#ef4444]" : "text-[#f59e0b]"}>
              {scan.riskLevel}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Generate an approval-gated hedge plan based on this scan result.
          </p>
        </div>
        <PrimaryButton href="/app/hedge" size="md">
          Hedge Plan <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────

export default function ScanPage() {
  const [state, setState] = useState<ScanState>("idle");
  const [result, setResult] = useState<ScanResponse | null>(null);

  const runScan = async () => {
    setState("scanning");
    try {
      const res = await fetch("/api/scan/run", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as ScanResponse;
      setResult(data);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Risk Scan
        </h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Convexity Danger Score · 5 weighted risk factors · SoSoValue + SoDEX data
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" exit={{ opacity: 0 }}>
            <IdleState onRun={runScan} />
          </motion.div>
        )}
        {state === "scanning" && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScanningState />
          </motion.div>
        )}
        {state === "done" && result && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultsState result={result} onRescan={() => setState("idle")} />
          </motion.div>
        )}
        {state === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardShell variant="danger" className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-sm font-semibold text-white">Scan failed</p>
              <p className="text-xs text-[#9ca3af]">Could not reach the scan API. Check the browser console for details.</p>
              <button
                onClick={runScan}
                className="flex items-center gap-2 rounded-lg border border-[#1f2937] px-4 py-2 text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
              >
                <RefreshCw className="h-4 w-4" /> Try again
              </button>
            </CardShell>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
