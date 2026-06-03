import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { ExecutionPreview } from "@/lib/hedge/hedge-composer";
import { Badge } from "@/components/shared/Badge";
import { CardShell } from "@/components/shared/CardShell";

interface ExecutionPreviewCardProps {
  preview: ExecutionPreview;
}

export function ExecutionPreviewCard({ preview }: ExecutionPreviewCardProps) {
  const modeVariant =
    preview.marketMode === "live" ? "live" : preview.marketMode === "error" ? "danger" : "fallback";

  const ROWS = [
    { label: "Instrument", value: preview.instrument },
    { label: "Direction", value: preview.direction.toUpperCase() },
    {
      label: "Suggested Size",
      value: `$${preview.suggestedSizeUsd.toLocaleString()}`,
    },
    {
      label: "Est. Entry Price",
      value: `$${preview.estimatedEntryPrice.toLocaleString()}`,
    },
    {
      label: "Bid / Ask",
      value: `$${preview.bidPrice.toLocaleString()} / $${preview.askPrice.toLocaleString()}`,
    },
    {
      label: "Spread",
      value: `${preview.spreadBps} bps ${preview.spreadMultiple > 1.5 ? `(${preview.spreadMultiple}× avg)` : ""}`,
    },
    {
      label: "Est. Slippage",
      value: `${preview.estimatedSlippageBps} bps`,
    },
    {
      label: "Est. Execution Cost",
      value: `~$${preview.estimatedCostUsd.toFixed(2)}`,
    },
    {
      label: "Liquidity Score",
      value: `${preview.liquidityScore} / 100`,
    },
    { label: "Order Type", value: preview.orderType.toUpperCase() },
  ];

  return (
    <CardShell variant="elevated" className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
            SoDEX Execution Preview
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Estimated market conditions — not a live quote
          </p>
        </div>
        <Badge variant={modeVariant} dot>
          SoDEX {preview.marketMode}
        </Badge>
      </div>

      {/* Data rows */}
      <div className="divide-y divide-[#1f2937] rounded-xl border border-[#1f2937] overflow-hidden">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between bg-[#111827] px-4 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">{label}</p>
            <p className="font-mono text-xs font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Liquidity score bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-[#6b7280]">Liquidity</p>
          <p
            className="font-mono text-[10px] font-semibold"
            style={{
              color:
                preview.liquidityScore >= 70
                  ? "#22c55e"
                  : preview.liquidityScore >= 40
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          >
            {preview.liquidityScore < 40 ? "Thin" : preview.liquidityScore < 70 ? "Moderate" : "Good"}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${preview.liquidityScore}%`,
              backgroundColor:
                preview.liquidityScore >= 70 ? "#22c55e" : preview.liquidityScore >= 40 ? "#f59e0b" : "#ef4444",
              opacity: 0.8,
            }}
          />
        </div>
      </div>

      {/* Warnings */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
          Warnings &amp; Notices
        </p>
        {preview.warnings.map((w, i) => {
          const isSimulation = w.toLowerCase().includes("simulat") || w.toLowerCase().includes("wave 2");
          return (
            <div key={i} className="flex items-start gap-2.5">
              {isSimulation ? (
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60a5fa]" />
              ) : (
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f59e0b]" />
              )}
              <p className="text-xs leading-relaxed text-[#9ca3af]">{w}</p>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}
