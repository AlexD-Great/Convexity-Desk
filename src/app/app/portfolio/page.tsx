import { BarChart3, ScanLine } from "lucide-react";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

export default function PortfolioPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Asset exposure, allocation chart, and risk buckets
          </p>
        </div>
        <PrimaryButton href="/app/scan" size="md">
          <ScanLine className="h-4 w-4" />
          Run Scan
        </PrimaryButton>
      </div>

      {/* Coming in Phase 6 */}
      <CardShell variant="default" className="flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
          <BarChart3 className="h-7 w-7 text-[#9ca3af]" />
        </div>
        <div className="space-y-2">
          <p
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio module coming in Phase 6
          </p>
          <p className="max-w-sm text-sm text-[#9ca3af]">
            Asset table, allocation donut chart, exposure buckets (BTC beta, ETH beta, high beta alts,
            stables, SSI index), and concentration warnings.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="demo" dot>Demo Data Ready</Badge>
          <Badge variant="default">Phase 6</Badge>
        </div>
      </CardShell>
    </div>
  );
}
