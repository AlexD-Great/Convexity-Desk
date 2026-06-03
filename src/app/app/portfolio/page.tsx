import Link from "next/link";
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
} from "lucide-react";
import { getDemoPortfolio } from "@/lib/data/demo-portfolio";
import { AllocationChart } from "@/components/dashboard/AllocationChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import type { BetaBucket } from "@/types";

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

export default function PortfolioPage() {
  const portfolio = getDemoPortfolio();
  const { assets, totalValueUsd } = portfolio;

  // Compute bucket totals
  const buckets = BUCKET_ORDER.map((bucket) => {
    const bucketAssets = assets.filter((a) => a.betaBucket === bucket);
    const value = bucketAssets.reduce((s, a) => s + a.valueUsd, 0);
    const weight = Math.round((value / totalValueUsd) * 1000) / 10;
    return { bucket, value, weight, meta: BUCKET_META[bucket] };
  });

  // Concentration check
  const btcWeight = assets.find((a) => a.symbol === "BTC")?.weight ?? 0;
  const highBetaWeight = assets
    .filter((a) => a.betaBucket === "HIGH_BETA_ALT")
    .reduce((s, a) => s + a.weight, 0);
  const hedgeableValue = assets
    .filter((a) => a.hedgeable)
    .reduce((s, a) => s + a.valueUsd, 0);

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Demo portfolio · {assets.length} assets · Updated just now
          </p>
        </div>
        <PrimaryButton href="/app/scan" size="md">
          <ScanLine className="h-4 w-4" />
          Run Convexity Scan
        </PrimaryButton>
      </div>

      {/* Concentration warning */}
      {btcWeight > 40 && (
        <CardShell variant="warning" padding="sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
            <div>
              <p className="text-sm font-semibold text-white">
                Concentration Warning — BTC at {btcWeight}%
              </p>
              <p className="mt-0.5 text-xs text-[#9ca3af]">
                BTC allocation exceeds the 40% safe-concentration threshold. This raises the Portfolio
                Concentration factor in the Danger Score.{" "}
                <Link href="/app/scan" className="text-[#7cffb2] hover:underline">
                  Run a scan to quantify the risk →
                </Link>
              </p>
            </div>
          </div>
        </CardShell>
      )}

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Value"
          value={`$${totalValueUsd.toLocaleString()}`}
          sublabel={`${assets.length} assets`}
          accent="#f9fafb"
          icon={DollarSign}
        />
        <MetricCard
          label="Largest Position"
          value={`BTC — ${btcWeight}%`}
          sublabel={`$${assets.find((a) => a.symbol === "BTC")?.valueUsd.toLocaleString()}`}
          accent="#f59e0b"
          icon={BarChart3}
        />
        <MetricCard
          label="Hedgeable Exposure"
          value={`$${hedgeableValue.toLocaleString()}`}
          sublabel={`${Math.round((hedgeableValue / totalValueUsd) * 100)}% of portfolio`}
          accent="#7cffb2"
          icon={ShieldCheck}
        />
        <MetricCard
          label="High Beta Exposure"
          value={`${Math.round(highBetaWeight + btcWeight)}%`}
          sublabel="BTC Beta + High Beta Alts"
          accent={highBetaWeight + btcWeight > 50 ? "#ef4444" : "#f59e0b"}
          icon={Layers}
        />
      </div>

      {/* Chart + Exposure buckets */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Allocation chart */}
        <CardShell variant="default" className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Allocation
            </p>
            <Badge variant="demo" dot>Demo Data</Badge>
          </div>
          <AllocationChart assets={assets} />
        </CardShell>

        {/* Exposure buckets */}
        <CardShell variant="default" className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
            Exposure Buckets
          </p>
          <div className="space-y-4">
            {buckets.map(({ bucket, value, weight, meta }) => (
              <div key={bucket} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="text-sm text-[#9ca3af]">{meta.label}</span>
                    {bucket === "BTC_BETA" && weight > 40 && (
                      <Badge variant="warning">Above threshold</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="font-mono text-xs text-[#6b7280]">
                      {value > 0 ? `$${value.toLocaleString()}` : "—"}
                    </span>
                    <span className="font-mono text-xs font-semibold text-white w-10">
                      {weight > 0 ? `${weight}%` : "0%"}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${weight}%`,
                      backgroundColor: meta.color,
                      opacity: weight > 0 ? 0.8 : 0,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#6b7280] pt-1">
            SSI / Index exposure: $0 — no index holdings in demo portfolio.
          </p>
        </CardShell>
      </div>

      {/* Asset table */}
      <CardShell variant="default" padding="none">
        <div className="px-5 py-4 border-b border-[#1f2937] flex items-center justify-between">
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
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-widest text-[#6b7280] whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {assets.map((asset) => {
                const { color } = BUCKET_META[asset.betaBucket];
                return (
                  <tr key={asset.symbol} className="hover:bg-[#111827] transition-colors">
                    {/* Asset */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="inline-block h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="font-semibold text-white">{asset.symbol}</p>
                          <p className="font-mono text-[10px] text-[#6b7280]">{asset.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-[#9ca3af]">
                        {asset.amount.toLocaleString()}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-[#9ca3af]">
                        ${asset.priceUsd.toLocaleString()}
                      </p>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-semibold text-white">
                        ${asset.valueUsd.toLocaleString()}
                      </p>
                    </td>

                    {/* Weight */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-[#1f2937]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${asset.weight}%`, backgroundColor: color, opacity: 0.7 }}
                          />
                        </div>
                        <span className="font-mono text-xs text-white">{asset.weight}%</span>
                      </div>
                    </td>

                    {/* Risk contribution */}
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs"
                        style={{ color: asset.riskContribution > 20 ? "#ef4444" : asset.riskContribution > 10 ? "#f59e0b" : "#22c55e" }}
                      >
                        {asset.riskContribution}%
                      </span>
                    </td>

                    {/* Beta bucket */}
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide whitespace-nowrap"
                        style={{ borderColor: `${color}30`, color, backgroundColor: `${color}10` }}
                      >
                        {BUCKET_META[asset.betaBucket].label}
                      </span>
                    </td>

                    {/* Hedgeable */}
                    <td className="px-4 py-3">
                      {asset.hedgeable ? (
                        <CheckCircle2 className="h-4 w-4 text-[#22c55e]" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#4b5563]" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardShell>

      {/* CTA */}
      <div className="flex items-center justify-between rounded-xl border border-[#1f2937] bg-[#0b1020] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">Ready to scan for risk?</p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Run the Convexity Scan to get your Danger Score and hedge recommendation.
          </p>
        </div>
        <Link
          href="/app/scan"
          className="flex items-center gap-1.5 shrink-0 text-sm text-[#7cffb2] hover:text-[#5cefaa] transition-colors font-medium"
        >
          Run Scan <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}
