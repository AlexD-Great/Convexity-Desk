import type { RiskFactor } from "@/types";

const FACTOR_ICONS: Record<RiskFactor["key"], string> = {
  institutional_flow: "🏦",
  narrative_pressure: "📰",
  portfolio_concentration: "📊",
  market_microstructure: "📈",
  event_proximity: "📅",
};

function scoreColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  if (score >= 25) return "#60a5fa";
  return "#22c55e";
}

function scoreLabel(score: number): string {
  if (score >= 75) return "High";
  if (score >= 50) return "Elevated";
  if (score >= 25) return "Watch";
  return "Low";
}

interface RiskFactorCardProps {
  factor: RiskFactor;
}

export function RiskFactorCard({ factor }: RiskFactorCardProps) {
  const color = scoreColor(factor.score);
  const weightPct = Math.round(factor.weight * 100);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#1f2937] bg-[#0b1020] p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden>
            {FACTOR_ICONS[factor.key]}
          </span>
          <p className="text-sm font-semibold text-white leading-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {factor.label}
          </p>
        </div>
        <span className="font-mono text-[10px] text-[#6b7280] shrink-0">
          {weightPct}% weight
        </span>
      </div>

      {/* Score row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 overflow-hidden rounded-full bg-[#1f2937]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${factor.score}%`, backgroundColor: color, opacity: 0.85 }}
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {factor.score}
          </span>
          <span
            className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {scoreLabel(factor.score)}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs leading-relaxed text-[#9ca3af]">
        {factor.explanation}
      </p>

      {/* Contribution to Danger Score */}
      <p className="font-mono text-[10px] text-[#4b5563]">
        Contribution: {Math.round(factor.score * factor.weight)} pts
      </p>
    </div>
  );
}
