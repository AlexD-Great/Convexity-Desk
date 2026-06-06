"use client";

import Link from "next/link";
import {
  DollarSign,
  Activity,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  ScanLine,
  Wallet,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWalletHoldings } from "@/hooks/use-wallet-holdings";

const METRICS = [
  {
    label: "Portfolio Value",
    value: "$42,850",
    sublabel: "Demo portfolio · 5 assets",
    accent: "#f9fafb",
    icon: DollarSign,
  },
  {
    label: "Danger Score",
    value: "78 / 100",
    sublabel: "High Risk — last scan: demo",
    accent: "#ef4444",
    icon: Activity,
  },
  {
    label: "Hedge Coverage",
    value: "22%",
    sublabel: "Suggested: 42% · Short BTC-PERP",
    accent: "#f59e0b",
    icon: ShieldCheck,
  },
  {
    label: "Top Risk Driver",
    value: "ETF Outflow",
    sublabel: "Institutional flow pressure 81/100",
    accent: "#60a5fa",
    icon: TrendingDown,
  },
];

const RISK_FACTORS = [
  { label: "Institutional Flow", score: 81, color: "#ef4444" },
  { label: "Narrative Pressure", score: 74, color: "#ef4444" },
  { label: "Portfolio Concentration", score: 68, color: "#f59e0b" },
  { label: "Microstructure Stress", score: 62, color: "#f59e0b" },
  { label: "Event Proximity", score: 55, color: "#f59e0b" },
];

export default function AppOverviewPage() {
  const wallet = useWalletHoldings();

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
            Demo portfolio · Last scan: not yet run
          </p>
        </div>
        <PrimaryButton href="/app/scan" size="md">
          <ScanLine className="h-4 w-4" />
          Run Scan
        </PrimaryButton>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((m) => (
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
                Danger Score: <span className="text-[#ef4444]">78 / 100</span>
              </p>
            </div>
            <Badge variant="danger" dot>High Risk</Badge>
          </div>

          <div className="space-y-3">
            {RISK_FACTORS.map(({ label, score, color }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#9ca3af]">{label}</p>
                  <p className="font-mono text-xs font-semibold text-white">{score}</p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                  <div
                    className="h-full rounded-full opacity-75"
                    style={{ width: `${score}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/app/scan"
            className="flex items-center gap-1.5 text-xs text-[#7cffb2] hover:text-[#5cefaa] transition-colors"
          >
            Run full scan for live data
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardShell>

        {/* Action prompt */}
        <div className="space-y-4">
          {/* Hedge suggestion */}
          <CardShell variant="glow" className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#7cffb2]">
              Suggested Action
            </p>
            <div>
              <p
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Hedge 35% BTC beta exposure
              </p>
              <p className="mt-1 text-xs text-[#9ca3af]">
                Short BTC-PERP · $12,000 · 42% portfolio coverage
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary">82% confidence</Badge>
              <Badge variant="fallback" dot>Fallback data</Badge>
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
                <Badge variant={wallet.isConnected ? "primary" : "default"} dot>
                  {wallet.isConnected ? "Wallet preview available" : "Demo scan"}
                </Badge>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">
                {wallet.isConnected
                  ? `${wallet.preview.address} on ${wallet.preview.chainName}. Portfolio Mode: Demo Scan / Wallet Preview Available.`
                  : "Connect a wallet to preview basic native and allowlisted ERC20 holdings. The risk scan remains demo-first in Wave 2."}
              </p>
            </div>
          </div>
          <WalletConnectButton />
        </div>
      </CardShell>

      {/* Wave notice */}
      <CardShell variant="elevated" padding="sm">
        <p className="text-xs text-[#6b7280]">
          <span className="text-[#9ca3af] font-medium">Wave 2 demo mode.</span>
          {" "}The dashboard now supports the full simulated workflow: portfolio, scan, evidence, hedge preview, confirmation, outcome ledger, methodology, docs, and settings.
          Values on this overview remain static demo summary values.
        </p>
      </CardShell>

    </div>
  );
}
