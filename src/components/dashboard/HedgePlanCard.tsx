import { TrendingDown, TrendingUp, Minus, AlertCircle } from "lucide-react";
import type { HedgePlan } from "@/types";
import { Badge } from "@/components/shared/Badge";
import { CardShell } from "@/components/shared/CardShell";

const DIRECTION_META = {
  short: { label: "SHORT", icon: TrendingDown, color: "#ef4444" },
  long:  { label: "LONG",  icon: TrendingUp,  color: "#22c55e" },
  reduce:{ label: "REDUCE",icon: TrendingDown, color: "#f59e0b" },
  hold:  { label: "HOLD",  icon: Minus,        color: "#9ca3af" },
};

interface HedgePlanCardProps {
  plan: HedgePlan;
  dangerScore: number;
}

export function HedgePlanCard({ plan, dangerScore }: HedgePlanCardProps) {
  const dir = DIRECTION_META[plan.direction];
  const DirIcon = dir.icon;
  const confidenceColor =
    plan.confidence >= 80 ? "#22c55e" : plan.confidence >= 60 ? "#f59e0b" : "#9ca3af";

  return (
    <CardShell variant="glow" className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
            Hedge Plan
          </p>
          <p
            className="mt-1 text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {plan.instrument}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div
            className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1"
            style={{ borderColor: `${dir.color}30`, backgroundColor: `${dir.color}12` }}
          >
            <DirIcon className="h-3.5 w-3.5" style={{ color: dir.color }} />
            <span className="font-mono text-xs font-bold" style={{ color: dir.color }}>
              {dir.label}
            </span>
          </div>
          <Badge variant="default">{plan.orderType.toUpperCase()}</Badge>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Size",
            value: `$${plan.suggestedSizeUsd.toLocaleString()}`,
            sub: `${Math.round((plan.suggestedSizeUsd / 42850) * 100)}% of portfolio`,
            color: "#f9fafb",
          },
          {
            label: "Coverage",
            value: `${plan.coveragePercent}%`,
            sub: "BTC+ETH beta hedged",
            color: "#7cffb2",
          },
          {
            label: "Confidence",
            value: `${plan.confidence}%`,
            sub: "Engine confidence",
            color: confidenceColor,
          },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-lg border border-[#1f2937] bg-[#111827] p-3 text-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-[#6b7280]">{label}</p>
            <p
              className="mt-1 text-xl font-bold leading-none"
              style={{ fontFamily: "var(--font-space-grotesk)", color }}
            >
              {value}
            </p>
            <p className="mt-1 font-mono text-[9px] text-[#4b5563]">{sub}</p>
          </div>
        ))}
      </div>

      {/* Coverage bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-[#6b7280]">Coverage of hedgeable exposure</p>
          <p className="font-mono text-[10px] text-white">{plan.coveragePercent}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1f2937]">
          <div
            className="h-full rounded-full bg-[#7cffb2] opacity-80 transition-all duration-700"
            style={{ width: `${plan.coveragePercent}%` }}
          />
        </div>
      </div>

      {/* Rationale */}
      <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-4 space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Rationale</p>
        <p className="text-xs leading-relaxed text-[#9ca3af]">{plan.rationale}</p>
      </div>

      {/* Risks */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Risk Considerations</p>
        {plan.risks.map((risk, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f59e0b]" />
            <p className="text-xs leading-relaxed text-[#9ca3af]">{risk}</p>
          </div>
        ))}
      </div>

      {/* Stop condition */}
      <div className="rounded-lg border border-[#1f2937] bg-[#0b1020] p-3">
        <p className="font-mono text-[10px] text-[#6b7280]">
          Stop condition: Exit hedge when Danger Score drops below 45, or if portfolio loss exceeds
          alert threshold.
        </p>
      </div>
    </CardShell>
  );
}
