"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  Activity,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  ScanLine,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWalletHoldings } from "@/hooks/use-wallet-holdings";
import { usePortfolioSource } from "@/hooks/use-portfolio-source";
import { PortfolioSourceToggle } from "@/components/dashboard/PortfolioSourceToggle";
import type { HedgePlan, RiskScan } from "@/types";

type GenerateResponse = {
  scan: RiskScan;
  hedgePlan: HedgePlan;
  dataMode: { sosovalue: string; sodex: string };
};

function scoreColor(score: number): string {
  return score >= 75 ? "#ef4444" : score >= 50 ? "#f59e0b" : score >= 25 ? "#60a5fa" : "#22c55e";
}

function levelVariant(level: RiskScan["riskLevel"]) {
  return level === "High Risk" ? "danger" : level === "Elevated" ? "warning" : "primary";
}

export default function AppOverviewPage() {
  const wallet = useWalletHoldings();
  const target = usePortfolioSource();
  const live = useQuery({
    queryKey: ["overview", "generate", target.source, target.address ?? ""],
    staleTime: 60_000,
    refetchInterval: 120_000,
    retry: 1,
    queryFn: async () => {
      const res = await fetch("/api/hedge/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: target.requestBody,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      return json as GenerateResponse;
    },
  });

  const scan = live.data?.scan;
  const plan = live.data?.hedgePlan;
  const topFactor = scan
    ? [...scan.factors].sort((a, b) => b.score * b.weight - a.score * a.weight)[0]
    : undefined;
  const allLive = live.data && live.data.dataMode.sosovalue === "live" && live.data.dataMode.sodex === "live";
  const updated = scan ? new Date(scan.createdAt).toLocaleTimeString() : null;

  const metrics = [
    {
      label: "Portfolio Value",
      value: plan?.portfolioValueUsd ? `$${Math.round(plan.portfolioValueUsd).toLocaleString()}` : "—",
      sublabel: `${target.label} · live prices`,
      accent: "#f9fafb",
      icon: DollarSign,
    },
    {
      label: "Danger Score",
      value: scan ? `${scan.dangerScore} / 100` : "—",
      sublabel: scan ? `${scan.riskLevel} · updated ${updated}` : "Scanning…",
      accent: scan ? scoreColor(scan.dangerScore) : "#6b7280",
      icon: Activity,
    },
    {
      label: "Suggested Hedge",
      value: plan ? `$${plan.suggestedSizeUsd.toLocaleString()}` : "—",
      sublabel: plan ? `${plan.direction.toUpperCase()} ${plan.instrument.split("/")[0]} · ${plan.coveragePercent}% coverage` : "",
      accent: "#f59e0b",
      icon: ShieldCheck,
    },
    {
      label: "Top Risk Driver",
      value: topFactor ? topFactor.label.replace(" Pressure", "").replace(" Stress", "") : "—",
      sublabel: topFactor ? `${topFactor.score}/100 · ${Math.round(topFactor.score * topFactor.weight)} pts of score` : "",
      accent: "#60a5fa",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio Overview
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            {target.label} · {updated ? `Live scan at ${updated}` : "Running live scan…"}
          </p>
          <div className="mt-3">
            <PortfolioSourceToggle showConnect={false} />
          </div>
        </div>
        <PrimaryButton href="/app/scan" size="md">
          <ScanLine className="h-4 w-4" />
          Run Scan
        </PrimaryButton>
      </div>

      {live.isError && (
        <CardShell variant="warning" padding="sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white">Live scan failed to load.</p>
              <p className="mt-0.5 text-xs text-[#9ca3af]">{(live.error as Error)?.message}</p>
            </div>
            <button type="button" onClick={() => live.refetch()} className="flex items-center gap-1.5 text-xs text-[#7cffb2] hover:underline">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        </CardShell>
      )}

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Two-column content */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Risk snapshot */}
        <CardShell variant="default" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                Risk Snapshot
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                Danger Score:{" "}
                <span style={{ color: scan ? scoreColor(scan.dangerScore) : "#6b7280" }}>
                  {scan ? `${scan.dangerScore} / 100` : "—"}
                </span>
              </p>
            </div>
            {scan && <Badge variant={levelVariant(scan.riskLevel)} dot>{scan.riskLevel}</Badge>}
          </div>

          <div className="space-y-3">
            {scan
              ? scan.factors.map(({ key, label, score }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#9ca3af]">{label}</p>
                      <p className="font-mono text-xs font-semibold text-white">{score}</p>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                      <div
                        className="h-full rounded-full opacity-75 transition-all duration-500"
                        style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
                      />
                    </div>
                  </div>
                ))
              : [1, 2, 3, 4, 5].map((i) => <div key={i} className="h-6 animate-pulse rounded bg-[#111827]" />)}
          </div>

          <Link
            href="/app/scan"
            className="flex items-center gap-1.5 text-xs text-[#7cffb2] hover:text-[#5cefaa] transition-colors"
          >
            See factor evidence
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardShell>

        {/* Action prompt */}
        <div className="space-y-4">
          <CardShell variant="glow" className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#7cffb2]">
              Suggested Action
            </p>
            {plan && plan.suggestedSizeUsd > 0 ? (
              <div>
                <p
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {plan.direction === "short" ? "Short" : plan.direction} {plan.instrument.split("/")[0]} · ${plan.suggestedSizeUsd.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-[#9ca3af]">
                  Covers {plan.coveragePercent}% of BTC+ETH beta exposure
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#9ca3af]">
                {plan ? "No hedge suggested at the current Danger Score." : "Computing…"}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {plan && plan.suggestedSizeUsd > 0 && <Badge variant="primary">{plan.confidence}% confidence</Badge>}
              {live.data && (
                <Badge variant={allLive ? "live" : "fallback"} dot>
                  {allLive ? "Live data" : "Partial live data"}
                </Badge>
              )}
            </div>
            <Link
              href="/app/hedge"
              className="flex items-center gap-1.5 text-xs text-[#7cffb2] hover:text-[#5cefaa] transition-colors"
            >
              View hedge plan
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardShell>

          {/* Quick links */}
          <CardShell variant="elevated" padding="sm" className="space-y-1">
            <p className="px-1 pb-1 font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Quick Links
            </p>
            {[
              { label: "View portfolio exposure", href: "/app/portfolio" },
              { label: "Run Convexity Risk Scan", href: "/app/scan" },
              { label: "Generate hedge plan", href: "/app/hedge" },
              { label: "View outcome ledger", href: "/app/outcomes" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
              >
                {label}
                <ArrowRight className="h-3.5 w-3.5 text-[#4b5563]" />
              </Link>
            ))}
          </CardShell>
        </div>
      </div>

      <CardShell variant={wallet.isConnected ? "glow" : "elevated"} padding="sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">
              <Wallet className={`h-4 w-4 ${wallet.isConnected ? "text-[#7cffb2]" : "text-[#6b7280]"}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-white">
                  Wallet: {wallet.isConnected ? "Connected" : "Not connected"}
                </p>
                <Badge variant={target.source === "wallet" ? "primary" : "default"} dot>
                  {target.source === "wallet" ? "Scanning your wallet" : "Scanning demo holdings"}
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">
                {wallet.isConnected
                  ? `${wallet.preview.address}. Holdings are read on Ethereum, Base, Arbitrum and Optimism.`
                  : "Connect a browser wallet to scan your own holdings at live prices."}
              </p>
            </div>
          </div>
          <WalletConnectButton />
        </div>
      </CardShell>

      <p className="text-[11px] text-[#6b7280]">
        Data: SoSoValue (ETF flows, news, macro calendar) · SoDEX mainnet (prices, order books). Refreshes every 2 minutes.
      </p>
    </div>
  );
}
