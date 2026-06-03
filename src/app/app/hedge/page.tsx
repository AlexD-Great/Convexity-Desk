"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import type { HedgePlan, RiskScan } from "@/types";
import type { ExecutionPreview } from "@/lib/hedge/hedge-composer";
import { HedgePlanCard } from "@/components/dashboard/HedgePlanCard";
import { ExecutionPreviewCard } from "@/components/dashboard/ExecutionPreviewCard";
import { DangerScoreGauge } from "@/components/dashboard/DangerScoreGauge";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

type PageState = "idle" | "generating" | "done" | "error";

type GenerateResponse = {
  scan: RiskScan;
  hedgePlan: HedgePlan;
  executionPreview: ExecutionPreview;
  dataMode: { sosovalue: string; sodex: string };
};

// ─── Idle ─────────────────────────────────────────────────────────────

function IdleState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-6 py-20 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
        <ShieldCheck className="h-8 w-8 text-[#9ca3af]" />
      </div>
      <div className="space-y-2 max-w-sm">
        <p className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Generate a hedge plan
        </p>
        <p className="text-sm text-[#9ca3af]">
          The hedge composer will run the risk scan, size a position based on your Danger Score,
          and prepare a SoDEX execution preview — all requiring your confirmation before anything happens.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <PrimaryButton size="lg" onClick={onGenerate}>
          <ShieldCheck className="h-4 w-4" />
          Generate Hedge Plan
        </PrimaryButton>
        <Link
          href="/app/scan"
          className="flex items-center gap-1.5 rounded-lg border border-[#1f2937] px-4 py-2.5 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
        >
          Run Scan First
        </Link>
      </div>
      <p className="font-mono text-[10px] text-[#4b5563]">
        Demo portfolio · Balanced risk profile · Simulation mode
      </p>
    </motion.div>
  );
}

// ─── Generating ────────────────────────────────────────────────────────

function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#7cffb2]" />
      <div className="space-y-3">
        <p className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Composing hedge plan…
        </p>
        {["Running risk scan on demo portfolio…",
          "Sizing hedge position…",
          "Fetching SoDEX execution preview…",
          "Building risk warnings…",
        ].map((step, i) => (
          <motion.p
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="font-mono text-xs text-[#9ca3af]"
          >
            {step}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

// ─── Results ───────────────────────────────────────────────────────────

function ResultsState({
  result,
  onRegenerate,
}: {
  result: GenerateResponse;
  onRegenerate: () => void;
}) {
  const { scan, hedgePlan, executionPreview, dataMode } = result;

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
            Hedge Plan Ready
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Based on Danger Score {scan.dangerScore}/100 · {scan.riskLevel} · Demo portfolio
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 rounded-lg border border-[#1f2937] px-3 py-2 text-xs text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </button>
          <PrimaryButton href="/app/outcomes" size="md">
            Confirm Hedge Preview <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>

      {/* Scan summary strip */}
      <CardShell variant="elevated" padding="sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <DangerScoreGauge score={scan.dangerScore} riskLevel={scan.riskLevel} animated={false} />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {scan.riskLevel} — {scan.dangerScore}/100
              </p>
              <p className="text-xs text-[#9ca3af] max-w-sm">{scan.summary}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant={dataMode.sosovalue === "live" ? "live" : "fallback"} dot>
              SoSoValue {dataMode.sosovalue}
            </Badge>
            <Badge variant={dataMode.sodex === "live" ? "live" : "fallback"} dot>
              SoDEX {dataMode.sodex}
            </Badge>
          </div>
        </div>
      </CardShell>

      {/* Hedge plan + execution preview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <HedgePlanCard plan={hedgePlan} dangerScore={scan.dangerScore} />
        <ExecutionPreviewCard preview={executionPreview} />
      </div>

      {/* Confirm CTA */}
      <div className="flex items-center justify-between rounded-xl border border-[#7cffb2]/20 bg-[#7cffb2]/[0.04] px-5 py-4 flex-wrap gap-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Ready to confirm this hedge preview?
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Confirmation gate, required disclaimers, and simulated execution — Phase 11.
            No real trade will be placed in Wave 2.
          </p>
        </div>
        <PrimaryButton href="/app/outcomes" size="md">
          Confirm Hedge Preview <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────

export default function HedgePage() {
  const [state, setState] = useState<PageState>("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const generate = async () => {
    setState("generating");
    try {
      const res = await fetch("/api/hedge/generate", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as GenerateResponse;
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
          Hedge Plan
        </h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Instrument · Direction · Size · Coverage · SoDEX execution preview
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div key="idle" exit={{ opacity: 0 }}>
            <IdleState onGenerate={generate} />
          </motion.div>
        )}
        {state === "generating" && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GeneratingState />
          </motion.div>
        )}
        {state === "done" && result && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultsState result={result} onRegenerate={() => setState("idle")} />
          </motion.div>
        )}
        {state === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardShell variant="danger" className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-sm font-semibold text-white">Failed to generate hedge plan</p>
              <p className="text-xs text-[#9ca3af]">Check the browser console for details.</p>
              <button
                onClick={generate}
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
