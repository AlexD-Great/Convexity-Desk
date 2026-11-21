"use client";

import { useQuery } from "@tanstack/react-query";
import type { IntegrationStatus } from "@/types";

/** Shared /api/status poll — one request feeds the topbar, sidebar, banner and settings. */
export function useIntegrationStatus() {
  return useQuery({
    queryKey: ["integration-status"],
    staleTime: 60_000,
    refetchInterval: 120_000,
    queryFn: async () => {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error(`status HTTP ${res.status}`);
      return (await res.json()) as IntegrationStatus;
    },
  });
}

export const MODE_LABEL: Record<IntegrationStatus["mode"], string> = {
  live: "Live",
  mixed: "Partial",
  fallback: "Offline",
};

export const MODE_COLOR: Record<IntegrationStatus["mode"], string> = {
  live: "#22c55e",
  mixed: "#f59e0b",
  fallback: "#ef4444",
};
