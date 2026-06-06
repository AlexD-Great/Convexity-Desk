"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ScanLine,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Layers,
  BarChart3,
  ShieldCheck,
  Wallet,
  RefreshCw,
} from "lucide-react";
import { getDemoPortfolio } from "@/lib/data/demo-portfolio";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { useWalletHoldings } from "@/hooks/use-wallet-holdings";
import type { BetaBucket } from "@/types";
import type { WalletHolding } from "@/lib/wallet/wallet-holdings";

const BUCKET_META: Record<BetaBucket, { label: string; color: string }> = {
  BTC_BETA:      { label: "BTC Beta",        color: "#f59e0b" },
  ETH_BETA:      { label: "ETH Beta",         color: "#60a5fa" },
  HIGH_BETA_ALT: { label: "High Beta Alts",   color: "#a78bfa" },
  STABLE:        { label: "Stablecoins",      color: "#22c55e" },
  SSI_INDEX:     { label: "SSI / Index",      color: "#7cffb2" },
};

const BUCKET_ORDER: BetaBucket[] = [
  "BTC_BETA", "ETH_BETA", "HIGH_BETA_ALT", "STABLE", "SSI_INDEX",
];

type PortfolioMode = "demo" | "wallet";

function HoldingRow({ holding }: { holding: WalletHolding }) {
  return (
    <tr className="border-b border-[#1f2937] last:border-b-0">
      <td className="px-4 py-3">
        <div>
          <p className="font-semibold text-white">{holding.symbol}</p>
          <p className="font-mono text-[10px] text-[#6b7280]">{holding.name}</p>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-[#9ca3af]">
        {holding.balanceFormatted}
      </td>
      <td className="px-4 py-3">
        <Badge variant={holding.source === "native" ? "primary" : "blue"}>
          {holding.source === "native" ? "Native" : "Allowlist ERC20"}
        </Badge>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-white">
        {holding.estimatedValueUsd === undefined
          ? "Price unavailable"
          : `$${holding.estimatedValueUsd.toLocaleString()}`}
      </td>
      <td className="px-4 py-3 font-mono text-[10px] text-[#6b7280]">
        {holding.priceSource === "fallback" ? "Fallback price" : "No price"}
      </td>
    </tr>
  );
}

export default function PortfolioPage() {
  const [mode, setMode] = useState<PortfolioMode>("demo");
  const wallet = useWalletHoldings();
  const portfolio = getDemoPortfolio();
  const { assets, totalValueUsd } = portfolio;

  const buckets = BUCKET_ORDER.map((bucket) => {
    const bucketAssets = assets.filter((a) => a.betaBucket === bucket);
    const value = bucketAssets.reduce((s, a) => s + a.valueUsd, 0);
    const weight = Math.round((value / totalValueUsd) * 1000) / 10;
    return { bucket, value, weight, meta: BUCKET_META[bucket] };
  });

  const btcWeight = assets.find((a) => a.symbol === "BTC")?.weight ?? 0;
  const highBetaWeight = assets
    .filter((a) => a.betaBucket === "HIGH_BETA_ALT")
    .reduce((s, a) => s + a.weight, 0);
  const hedgeableValue = assets
    .filter((a) => a.hedgeable)
    .reduce((s, a) => s + a.valueUsd, 0);

  const walletHoldings = [
    ...(wallet.preview.native ? [wallet.preview.native] : []),
    ...wallet.preview.tokens,
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Demo portfolio or connected wallet preview. Risk scan remains demo-first in Wave 2.
          </p>
        </div>
        <PrimaryButton href="/app/scan" size="md">
          <ScanLine className="h-4 w-4" />
          Run Convexity Scan
        </PrimaryButton>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: "demo" as const, label: "Demo Portfolio" },
          { value: "wallet" as const, label: "Connected Wallet" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className="rounded-full border px-4 py-2 text-sm transition-colors"
            style={{
              borderColor: mode === item.value ? "#7cffb240" : "#1f2937",
              backgroundColor: mode === item.value ? "#7cffb212" : "#0b1020",
              color: mode === item.value ? "#7cffb2" : "#9ca3af",
            }}
          >
            {item.label}
          </button>
        ))}
        <Badge variant={mode === "wallet" ? "primary" : "demo"} dot>
          {mode === "wallet" ? "Wallet Preview" : "Demo Data"}
        </Badge>
        {mode === "wallet" && <Badge variant="fallback">Basic holdings only</Badge>}
      </div>

      {mode === "wallet" ? (
        <div className="space-y-4">
          {!wallet.isConnected ? (
            <CardShell variant="default" className="flex flex-col items-center gap-5 py-14 text-center">
              <Wallet className="h-10 w-10 text-[#7cffb2]" />
              <div className="space-y-2">
                <p className="font-semibold text-white">Connect a wallet to preview basic holdings.</p>
                <p className="max-w-md text-sm leading-relaxed text-[#9ca3af]">
                  The full risk scan currently uses the demo portfolio unless connected holdings are complete enough. Wave 2 wallet mode reads native balance and allowlisted ERC20 balances only.
                </p>
              </div>
              <WalletConnectButton />
            </CardShell>
          ) : (
            <>
              <CardShell variant="glow" className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#7cffb2]">
                      Connected Wallet Preview
                    </p>
                    <p className="mt-2 break-all font-mono text-sm text-white">{wallet.preview.address}</p>
                    <p className="mt-1 text-xs text-[#9ca3af]">
                      Network: {wallet.preview.chainName}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary" dot>Wallet Preview</Badge>
                    <Badge variant="fallback">Basic holdings only</Badge>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    label="Native Balance"
                    value={
                      wallet.preview.native
                        ? `${wallet.preview.native.balanceFormatted} ${wallet.preview.native.symbol}`
                        : "Unavailable"
                    }
                    sublabel="Native token read via wallet RPC"
                    accent="#7cffb2"
                    icon={Wallet}
                  />
                  <MetricCard
                    label="Allowlisted ERC20s"
                    value={String(wallet.preview.tokens.length)}
                    sublabel="USDC/WETH on Ethereum mainnet"
                    accent="#60a5fa"
                    icon={Layers}
                  />
                  <MetricCard
                    label="Estimated Value"
                    value={
                      wallet.preview.totalEstimatedValueUsd === undefined
                        ? "Partial"
                        : `$${wallet.preview.totalEstimatedValueUsd.toLocaleString()}`
                    }
                    sublabel="Fallback prices where available"
                    accent="#f59e0b"
                    icon={DollarSign}
                  />
                </div>
                <p className="text-xs leading-relaxed text-[#9ca3af]">
                  {wallet.preview.limitation} If price data is unavailable, balances are shown without USD value.
                </p>
              </CardShell>

              <CardShell variant="default" padding="none">
                <div className="flex items-center justify-between border-b border-[#1f2937] px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                    Basic Holdings ({walletHoldings.length})
                  </p>
                  <button
                    type="button"
                    onClick={wallet.refetch}
                    className="flex items-center gap-1.5 rounded-md border border-[#1f2937] px-2.5 py-1.5 text-xs text-[#9ca3af] hover:bg-[#1f2937] hover:text-white"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1f2937] bg-[#111827]">
                        {["Asset", "Balance", "Source", "Estimated USD", "Price"].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#6b7280]"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {walletHoldings.map((holding) => (
                        <HoldingRow key={`${holding.source}-${holding.symbol}`} holding={holding} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardShell>
            </>
          )}
        </div>
      ) : (
        <>
          {btcWeight > 40 && (
            <CardShell variant="warning" padding="sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Concentration Warning - BTC at {btcWeight}%
                  </p>
                  <p className="mt-0.5 text-xs text-[#9ca3af]">
                    BTC allocation exceeds the 40% safe-concentration threshold. This raises the Portfolio
                    Concentration factor in the Danger Score.{" "}
                    <Link href="/app/scan" className="text-[#7cffb2] hover:underline">
                      Run a scan to quantify the risk
                    </Link>
                  </p>
                </div>
              </div>
            </CardShell>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Total Value" value={`$${totalValueUsd.toLocaleString()}`} sublabel={`${assets.length} assets`} accent="#f9fafb" icon={DollarSign} />
            <MetricCard label="Largest Position" value={`BTC - ${btcWeight}%`} sublabel={`$${assets.find((a) => a.symbol === "BTC")?.valueUsd.toLocaleString()}`} accent="#f59e0b" icon={BarChart3} />
            <MetricCard label="Hedgeable Exposure" value={`$${hedgeableValue.toLocaleString()}`} sublabel={`${Math.round((hedgeableValue / totalValueUsd) * 100)}% of portfolio`} accent="#7cffb2" icon={ShieldCheck} />
            <MetricCard label="High Beta Exposure" value={`${Math.round(highBetaWeight + btcWeight)}%`} sublabel="BTC Beta + High Beta Alts" accent={highBetaWeight + btcWeight > 50 ? "#ef4444" : "#f59e0b"} icon={Layers} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CardShell variant="default" className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                  Allocation
                </p>
                <Badge variant="demo" dot>Demo Data</Badge>
              </div>
              <AllocationChart assets={assets} />
            </CardShell>

            <CardShell variant="default" className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                Exposure Buckets
              </p>
              <div className="space-y-4">
                {buckets.map(({ bucket, value, weight, meta }) => (
                  <div key={bucket} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
                        <span className="text-sm text-[#9ca3af]">{meta.label}</span>
                        {bucket === "BTC_BETA" && weight > 40 && <Badge variant="warning">Above threshold</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="font-mono text-xs text-[#6b7280]">{value > 0 ? `$${value.toLocaleString()}` : "-"}</span>
                        <span className="w-10 font-mono text-xs font-semibold text-white">{weight > 0 ? `${weight}%` : "0%"}</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${weight}%`, backgroundColor: meta.color, opacity: weight > 0 ? 0.8 : 0 }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="pt-1 text-xs text-[#6b7280]">
                SSI / Index exposure: $0 - no index holdings in demo portfolio.
              </p>
            </CardShell>
          </div>

          <CardShell variant="default" padding="none">
            <div className="flex items-center justify-between border-b border-[#1f2937] px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                Assets ({assets.length})
              </p>
              <Badge variant="demo" dot>Demo Portfolio</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f2937] bg-[#111827]">
                    {["Asset", "Amount", "Price", "Value", "Weight", "Risk Contrib.", "Bucket", "Hedgeable"].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {assets.map((asset) => {
                    const { color } = BUCKET_META[asset.betaBucket];
                    return (
                      <tr key={asset.symbol} className="transition-colors hover:bg-[#111827]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                            <div>
                              <p className="font-semibold text-white">{asset.symbol}</p>
                              <p className="font-mono text-[10px] text-[#6b7280]">{asset.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[#9ca3af]">{asset.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#9ca3af]">${asset.priceUsd.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-white">${asset.valueUsd.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded-full bg-[#1f2937]">
                              <div className="h-full rounded-full" style={{ width: `${asset.weight}%`, backgroundColor: color, opacity: 0.7 }} />
                            </div>
                            <span className="font-mono text-xs text-white">{asset.weight}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs" style={{ color: asset.riskContribution > 20 ? "#ef4444" : asset.riskContribution > 10 ? "#f59e0b" : "#22c55e" }}>{asset.riskContribution}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide" style={{ borderColor: `${color}30`, color, backgroundColor: `${color}10` }}>
                            {BUCKET_META[asset.betaBucket].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {asset.hedgeable ? <CheckCircle2 className="h-4 w-4 text-[#22c55e]" /> : <XCircle className="h-4 w-4 text-[#4b5563]" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardShell>
        </>
      )}

      <div className="flex items-center justify-between rounded-xl border border-[#1f2937] bg-[#0b1020] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">Ready to scan for risk?</p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Wave 2 scanning uses the demo portfolio for the complete end-to-end risk flow. Wallet-based risk scanning is planned for Wave 3 unless holdings can be safely converted.
          </p>
        </div>
        <Link href="/app/scan" className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#7cffb2] transition-colors hover:text-[#5cefaa]">
          Run Scan <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
