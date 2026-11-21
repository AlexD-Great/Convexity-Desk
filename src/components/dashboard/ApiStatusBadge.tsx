"use client";

import { MODE_COLOR, MODE_LABEL, useIntegrationStatus } from "@/hooks/use-integration-status";

export function ApiStatusBadge() {
  const { data: status } = useIntegrationStatus();

  if (!status) {
    return <span className="h-5 w-16 animate-pulse rounded bg-[#1f2937] font-mono text-xs" />;
  }

  const color = MODE_COLOR[status.mode];
  return (
    <div
      className="flex items-center gap-1.5"
      title={`${status.details.sosovalue.label}\n${status.details.sodex.label}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color }}>
        Data: {MODE_LABEL[status.mode]}
      </span>
    </div>
  );
}
