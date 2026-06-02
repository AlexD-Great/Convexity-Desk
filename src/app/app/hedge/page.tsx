import { ShieldCheck } from "lucide-react";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";

export default function HedgePage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Hedge Plan
        </h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Hedge recommendation · SoDEX execution preview · Confirmation gate
        </p>
      </div>

      <CardShell variant="default" className="flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
          <ShieldCheck className="h-7 w-7 text-[#9ca3af]" />
        </div>
        <div className="space-y-2">
          <p
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Hedge composer coming in Phase 10
          </p>
          <p className="max-w-sm text-sm text-[#9ca3af]">
            Instrument, direction, suggested size, coverage %, confidence score, estimated slippage,
            SoDEX orderbook preview, risk warnings, and human confirmation gate.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="primary">Short BTC-PERP · $12K · 42%</Badge>
          <Badge variant="default">Phase 10–11</Badge>
        </div>
      </CardShell>
    </div>
  );
}
