import { ScanLine } from "lucide-react";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";

export default function ScanPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Risk Scan
        </h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Convexity Danger Score · 5 risk factors · Evidence cards
        </p>
      </div>

      <CardShell variant="default" className="flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
          <ScanLine className="h-7 w-7 text-[#9ca3af]" />
        </div>
        <div className="space-y-2">
          <p
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Risk scan engine coming in Phase 9
          </p>
          <p className="max-w-sm text-sm text-[#9ca3af]">
            Danger Score gauge (0–100), 5 risk factor breakdown cards, SoSoValue evidence cards,
            plain English summary, and Generate Hedge Plan CTA.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="fallback" dot>SoSoValue Fallback</Badge>
          <Badge variant="fallback" dot>SoDEX Fallback</Badge>
          <Badge variant="default">Phase 9</Badge>
        </div>
      </CardShell>
    </div>
  );
}
