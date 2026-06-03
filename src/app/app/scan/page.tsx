import { ScanLine, ArrowRight } from "lucide-react";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SoDEXMarketPreview } from "@/components/dashboard/SoDEXMarketPreview";

export default function ScanPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Risk Scan
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Danger Score · 5 risk factors · Evidence cards
          </p>
        </div>
        <Badge variant="default">Scan engine coming in Phase 9</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Scan coming soon */}
        <CardShell variant="default" className="flex flex-col items-center justify-center py-14 gap-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
            <ScanLine className="h-7 w-7 text-[#9ca3af]" />
          </div>
          <div className="space-y-2">
            <p
              className="text-base font-semibold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Danger Score engine coming in Phase 9
            </p>
            <p className="max-w-xs text-sm text-[#9ca3af]">
              Weighted scoring across 5 factors using SoSoValue intelligence,
              SoDEX market structure, and portfolio data.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">
              0.30 × Institutional Flow
            </Badge>
            <Badge variant="default">
              0.25 × Concentration
            </Badge>
            <Badge variant="default">
              0.20 × Narrative
            </Badge>
            <Badge variant="default">
              0.15 × Microstructure
            </Badge>
            <Badge variant="default">
              0.10 × Event Proximity
            </Badge>
          </div>
          <PrimaryButton href="/app/portfolio" size="md">
            View Portfolio First
            <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </CardShell>

        {/* SoDEX market data — live now */}
        <CardShell variant="default">
          <SoDEXMarketPreview />
        </CardShell>
      </div>
    </div>
  );
}
