import type { OutcomeLedgerEntry, OutcomeStatus } from "@/types";
import { Badge } from "@/components/shared/Badge";

const STATUS_META: Record<
  OutcomeStatus,
  { label: string; variant: Parameters<typeof Badge>[0]["variant"] }
> = {
  pending:      { label: "Pending",      variant: "default" },
  useful:       { label: "Useful",       variant: "success" },
  neutral:      { label: "Neutral",      variant: "default" },
  wasteful:     { label: "Wasteful",     variant: "danger" },
  avoided_loss: { label: "Avoided Loss", variant: "primary" },
  missed_hedge: { label: "Missed Hedge", variant: "warning" },
};

interface OutcomeLedgerTableProps {
  entries: OutcomeLedgerEntry[];
}

export function OutcomeLedgerTable({ entries }: OutcomeLedgerTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-xl border border-[#1f2937] bg-[#0b1020]">
        <p className="text-sm font-semibold text-white">No hedge outcomes yet</p>
        <p className="text-xs text-[#9ca3af] max-w-xs">
          Confirm a hedge preview to create your first ledger entry. Entries persist for the current
          session.
        </p>
      </div>
    );
  }

  // Sort: newest first
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-[#1f2937]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1f2937] bg-[#111827]">
            {[
              "Date / Time",
              "Hedge Plan",
              "Action",
              "Order ID",
              "Coverage",
              "Status",
              "Notes",
            ].map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-[#6b7280]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1f2937]">
          {sorted.map((entry) => {
            const meta = STATUS_META[entry.status];
            const date = new Date(entry.createdAt);
            return (
              <tr key={entry.id} className="bg-[#0b1020] hover:bg-[#111827] transition-colors">
                {/* Date */}
                <td className="whitespace-nowrap px-4 py-3">
                  <p className="font-mono text-xs text-white">
                    {date.toLocaleDateString()}
                  </p>
                  <p className="font-mono text-[10px] text-[#6b7280]">
                    {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </td>

                {/* Hedge plan ID */}
                <td className="px-4 py-3">
                  <p className="font-mono text-[10px] text-[#6b7280] truncate max-w-[120px]">
                    {entry.hedgePlanId}
                  </p>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      entry.actionTaken === "testnet_executed"
                        ? "blue"
                        : entry.actionTaken === "cancelled"
                        ? "danger"
                        : "demo"
                    }
                    dot
                  >
                    {entry.actionTaken === "simulated"
                      ? "Simulated"
                      : entry.actionTaken === "testnet_executed"
                      ? "Testnet"
                      : "Cancelled"}
                  </Badge>
                </td>

                {/* Order ID */}
                <td className="px-4 py-3">
                  <p className="font-mono text-[10px] text-[#7cffb2]">
                    {entry.orderId ?? "—"}
                  </p>
                </td>

                {/* Coverage */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#9ca3af]">
                      {entry.coverageBefore}%
                    </span>
                    <span className="text-[#374151]">→</span>
                    <span className="font-mono text-xs font-semibold text-[#7cffb2]">
                      {entry.coverageAfter}%
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge variant={meta.variant} dot>
                    {meta.label}
                  </Badge>
                </td>

                {/* Notes */}
                <td className="px-4 py-3 max-w-[280px]">
                  <p className="text-xs text-[#9ca3af] leading-relaxed line-clamp-2">
                    {entry.notes}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
