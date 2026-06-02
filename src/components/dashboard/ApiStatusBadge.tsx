"use client";

import { useEffect, useState } from "react";
import type { IntegrationStatus } from "@/types";

export function ApiStatusBadge() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  if (!status) {
    return (
      <span className="h-5 w-16 animate-pulse rounded bg-[#1f2937] font-mono text-xs" />
    );
  }

  const modeColor =
    status.mode === "live"
      ? "#22c55e"
      : status.mode === "mixed"
      ? "#f59e0b"
      : "#9ca3af";

  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: modeColor }}
      />
      <span
        className="font-mono text-[10px] uppercase tracking-wide"
        style={{ color: modeColor }}
      >
        {status.mode}
      </span>
    </div>
  );
}
