import { ClipboardList } from "lucide-react";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";

export default function OutcomesPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Outcome Ledger
        </h2>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Track every hedge proposal and its result
        </p>
      </div>

      <CardShell variant="default" className="flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1f2937] bg-[#111827]">
          <ClipboardList className="h-7 w-7 text-[#9ca3af]" />
        </div>
        <div className="space-y-2">
          <p
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Outcome ledger coming in Phase 11
          </p>
          <p className="max-w-sm text-sm text-[#9ca3af]">
            Date, portfolio state, Danger Score, hedge taken, simulated order ID,
            coverage before/after, and result status: Useful, Neutral, Avoided Loss, or Missed Hedge.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="success" dot>Avoided Loss</Badge>
          <Badge variant="warning" dot>Neutral</Badge>
          <Badge variant="danger" dot>Missed Hedge</Badge>
        </div>
      </CardShell>
    </div>
  );
}
