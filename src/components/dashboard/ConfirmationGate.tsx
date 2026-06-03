"use client";

import { useState } from "react";
import { ShieldAlert, CheckSquare, Square, Loader2 } from "lucide-react";
import type { HedgePlan } from "@/types";
import { Badge } from "@/components/shared/Badge";

const REQUIRED_CHECKS = [
  {
    id: "cb-hedge",
    label: "I understand this is a hedge, not guaranteed profit. It reduces downside exposure but does not eliminate it.",
  },
  {
    id: "cb-sim",
    label: "I understand this is a Wave 2 demo simulation. No real order will be placed, and no funds are at risk.",
  },
  {
    id: "cb-advice",
    label: "I understand Convexity Desk is not financial advice. I am responsible for all trading decisions.",
  },
];

interface ConfirmationGateProps {
  hedgePlan: HedgePlan;
  dangerScore: number;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmationGate({
  hedgePlan,
  dangerScore,
  onConfirm,
  onCancel,
}: ConfirmationGateProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const allChecked = checked.size === REQUIRED_CHECKS.length;

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = async () => {
    if (!allChecked || confirming) return;
    setConfirming(true);
    try {
      await onConfirm();
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-[#7cffb2]/20 bg-[#0b1020] p-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#7cffb2]/20 bg-[#7cffb2]/10">
          <ShieldAlert className="h-5 w-5 text-[#7cffb2]" />
        </div>
        <div>
          <p
            className="font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Confirmation Gate
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Read and acknowledge all statements before confirming.
          </p>
        </div>
        <Badge variant="demo" className="ml-auto shrink-0">
          Simulation
        </Badge>
      </div>

      {/* Hedge summary */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#1f2937] bg-[#111827] p-3 text-center">
        {[
          { label: "Instrument", value: hedgePlan.instrument },
          { label: "Size", value: `$${hedgePlan.suggestedSizeUsd.toLocaleString()}` },
          { label: "Coverage", value: `${hedgePlan.coveragePercent}%` },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#6b7280]">{label}</p>
            <p className="mt-0.5 font-mono text-xs font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Danger score context */}
      <p className="text-xs text-[#9ca3af]">
        This hedge was generated from a Danger Score of{" "}
        <span className="font-semibold text-[#ef4444]">{dangerScore}/100</span>. Conditions may have
        changed since the scan was run.
      </p>

      {/* Required checkboxes */}
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
          Required acknowledgements
        </p>
        {REQUIRED_CHECKS.map(({ id, label }) => {
          const isChecked = checked.has(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors"
              style={{
                borderColor: isChecked ? "#7cffb2" + "30" : "#1f2937",
                backgroundColor: isChecked ? "#7cffb2" + "08" : "#111827",
              }}
            >
              {isChecked ? (
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#7cffb2]" />
              ) : (
                <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#4b5563]" />
              )}
              <p
                className="text-xs leading-relaxed"
                style={{ color: isChecked ? "#e5e7eb" : "#9ca3af" }}
              >
                {label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="rounded-lg border border-[#1f2937] bg-[#111827] p-3 text-[11px] leading-relaxed text-[#6b7280]">
        Convexity Desk is a hackathon prototype. It is not financial advice. All hedge plans are for
        research, simulation, or testnet demonstration unless clearly stated otherwise.
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#1f2937] py-2.5 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!allChecked || confirming}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all"
          style={{
            backgroundColor: allChecked && !confirming ? "#7cffb2" : "#1f2937",
            color: allChecked && !confirming ? "#05070d" : "#4b5563",
            cursor: allChecked && !confirming ? "pointer" : "not-allowed",
          }}
        >
          {confirming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirming…
            </>
          ) : (
            `Confirm Hedge Preview ${!allChecked ? `(${REQUIRED_CHECKS.length - checked.size} left)` : ""}`
          )}
        </button>
      </div>
    </div>
  );
}
