"use client";

import { useQuery } from "@tanstack/react-query";
import type { EvidenceCard, HedgePlan, Portfolio, RiskScan } from "@/types";
import type { ExecutionPreview } from "@/lib/hedge/hedge-composer";

export type LiveSnapshot = {
  scan: RiskScan;
  portfolio: Portfolio;
  hedgePlan: HedgePlan;
  executionPreview: ExecutionPreview;
  evidenceCards: EvidenceCard[];
  dataMode: { sosovalue: string; sodex: string };
};

/**
 * Live scan + hedge plan for the demo holdings — used by the marketing
 * previews so they show the real engine output instead of mock numbers.
 */
export function useLiveSnapshot() {
  return useQuery({
    queryKey: ["live-snapshot", "demo"],
    staleTime: 120_000,
    refetchInterval: 300_000,
    retry: 1,
    queryFn: async () => {
      const res = await fetch("/api/hedge/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as LiveSnapshot;
    },
  });
}

export function scoreColor(score: number): string {
  return score >= 75 ? "#ef4444" : score >= 50 ? "#f59e0b" : score >= 25 ? "#60a5fa" : "#22c55e";
}

export const BUCKET_COLOR: Record<string, string> = {
  BTC_BETA: "#f59e0b",
  ETH_BETA: "#60a5fa",
  HIGH_BETA_ALT: "#a78bfa",
  STABLE: "#22c55e",
  SSI_INDEX: "#7cffb2",
};
