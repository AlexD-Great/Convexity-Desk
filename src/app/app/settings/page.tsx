"use client";

import {
  CheckCircle2,
  DatabaseZap,
  Gauge,
  Loader2,
  RefreshCw,
  RotateCcw,
  Shield,
  ToggleLeft,
  Wallet,
} from "lucide-react";
import type { IntegrationMode, RiskProfile } from "@/types";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { PortfolioSourceToggle } from "@/components/dashboard/PortfolioSourceToggle";
import { usePortfolioSource } from "@/hooks/use-portfolio-source";
import { MODE_LABEL, useIntegrationStatus } from "@/hooks/use-integration-status";
import { DEFAULT_HEDGE_PREFERENCES, useHedgePreferences } from "@/hooks/use-hedge-preferences";

const RISK_PROFILES: Array<{ value: RiskProfile; label: string; multiplier: string; detail: string }> = [
  { value: "conservative", label: "Conservative", multiplier: "1.2x", detail: "Larger hedges when risk is elevated." },
  { value: "balanced", label: "Balanced", multiplier: "1.0x", detail: "Default sizing." },
  { value: "aggressive", label: "Aggressive", multiplier: "0.7x", detail: "Smaller hedges to preserve upside." },
];

function modeVariant(mode?: IntegrationMode) {
  if (mode === "live") return "live" as const;
  if (mode === "error") return "danger" as const;
  return "fallback" as const;
}

function StatusRow({ label, mode, detail }: { label: string; mode?: IntegrationMode; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-0.5 text-xs text-[#6b7280]">{detail}</p>
      </div>
      <Badge variant={modeVariant(mode)} dot>
        {mode ?? "checking"}
      </Badge>
    </div>
  );
}

function SegmentedButton<T extends string>({
  value,
  active,
  label,
  sublabel,
  onClick,
}: {
  value: T;
  active: boolean;
  label: string;
  sublabel?: string;
  onClick: (value: T) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="rounded-lg border p-3 text-left transition-colors"
      style={{
        borderColor: active ? "#7cffb240" : "#1f2937",
        backgroundColor: active ? "#7cffb212" : "#111827",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{label}</p>
        {active && <CheckCircle2 className="h-4 w-4 text-[#7cffb2]" />}
      </div>
      {sublabel && <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">{sublabel}</p>}
    </button>
  );
}

function SectionHeader({ icon: Icon, title, detail }: { icon: typeof Shield; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">
        <Icon className="h-4 w-4 text-[#7cffb2]" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-[#6b7280]">{detail}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const status = useIntegrationStatus();
  const { source, canUseWallet, address } = usePortfolioSource();
  const { prefs, update } = useHedgePreferences();
  const selectedProfile = RISK_PROFILES.find((p) => p.value === prefs.riskProfile);
  const isDefault =
    prefs.riskProfile === DEFAULT_HEDGE_PREFERENCES.riskProfile &&
    prefs.maxHedgePct === DEFAULT_HEDGE_PREFERENCES.maxHedgePct &&
    prefs.maxSlippageBps === DEFAULT_HEDGE_PREFERENCES.maxSlippageBps;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Settings
          </h2>
          <p className="mt-1 text-sm text-[#9ca3af]">
            What to analyse, data source health, and how hedges are sized.
          </p>
        </div>
        <button
          type="button"
          onClick={() => status.refetch()}
          className="flex items-center gap-2 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2 text-sm text-[#9ca3af] transition-colors hover:bg-[#1f2937] hover:text-white"
        >
          {status.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh status
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CardShell variant="default" className="space-y-5">
          <SectionHeader icon={Wallet} title="Portfolio source" detail="Used by the overview, portfolio, scan and hedge pages." />
          <PortfolioSourceToggle />
          <p className="text-xs leading-relaxed text-[#9ca3af]">
            {source === "wallet" && address
              ? `Analysing ${address}. Holdings are read on Ethereum, Base, Arbitrum and Optimism and valued at live prices.`
              : canUseWallet
              ? "Analysing the sample demo holdings. Switch to your wallet to analyse your own."
              : "Analysing the sample demo holdings. Connect a browser wallet to analyse your own."}
          </p>
        </CardShell>

        <CardShell variant="elevated" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SectionHeader icon={DatabaseZap} title="Data sources" detail="Checked every 2 minutes." />
            {status.data && (
              <Badge variant={status.data.mode === "live" ? "live" : status.data.mode === "mixed" ? "warning" : "danger"} dot>
                {MODE_LABEL[status.data.mode]}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <StatusRow
              label="SoSoValue — ETF flows, news, macro calendar"
              mode={status.data?.sosovalue}
              detail={status.data?.details.sosovalue.reason ?? "Checking…"}
            />
            <StatusRow
              label="SoDEX — prices, order books, volatility"
              mode={status.data?.sodex}
              detail={status.data?.details.sodex.reason ?? "Checking…"}
            />
          </div>
          {status.data?.lastCheckedAt && (
            <p className="font-mono text-[10px] text-[#6b7280]">
              Last checked {new Date(status.data.lastCheckedAt).toLocaleTimeString()}
            </p>
          )}
        </CardShell>
      </div>

      <CardShell variant="default" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeader icon={Shield} title="Hedge preferences" detail="Saved in this browser and applied to every hedge plan." />
          {!isDefault && (
            <button
              type="button"
              onClick={() => update(DEFAULT_HEDGE_PREFERENCES)}
              className="flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset to defaults
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {RISK_PROFILES.map(({ value, label, multiplier, detail }) => (
            <SegmentedButton
              key={value}
              value={value}
              active={prefs.riskProfile === value}
              label={`${label} ${multiplier}`}
              sublabel={detail}
              onClick={(v) => update({ riskProfile: v })}
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Max hedge size</p>
              <span className="font-mono text-sm text-[#7cffb2]">{prefs.maxHedgePct}%</span>
            </div>
            <input
              aria-label="Maximum hedge size"
              type="range"
              min={10}
              max={100}
              step={5}
              value={prefs.maxHedgePct}
              onChange={(e) => update({ maxHedgePct: Number(e.target.value) })}
              className="w-full accent-[#7cffb2]"
            />
            <p className="mt-2 text-xs text-[#6b7280]">Hard cap on hedge notional, as a % of your non-stablecoin holdings.</p>
          </div>

          <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Max slippage</p>
              <span className="font-mono text-sm text-[#7cffb2]">{prefs.maxSlippageBps} bps</span>
            </div>
            <input
              aria-label="Maximum slippage"
              type="range"
              min={5}
              max={100}
              step={5}
              value={prefs.maxSlippageBps}
              onChange={(e) => update({ maxSlippageBps: Number(e.target.value) })}
              className="w-full accent-[#7cffb2]"
            />
            <p className="mt-2 text-xs text-[#6b7280]">Execution previews warn when the estimated fill exceeds this.</p>
          </div>
        </div>

        <CardShell variant="glow" padding="sm">
          <div className="flex items-start gap-3">
            <Gauge className="mt-1 h-4 w-4 shrink-0 text-[#7cffb2]" />
            <p className="text-xs leading-relaxed text-[#9ca3af]">
              {selectedProfile?.label} profile ({selectedProfile?.multiplier} sizing), hedges capped at {prefs.maxHedgePct}% of
              risky holdings, slippage warnings above {prefs.maxSlippageBps} bps.
            </p>
          </div>
        </CardShell>
      </CardShell>

      <CardShell variant="elevated" padding="sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ToggleLeft className="mt-0.5 h-4 w-4 shrink-0 text-[#6b7280]" />
            <p className="text-xs leading-relaxed text-[#9ca3af]">
              <span className="text-white">Order placement is not enabled.</span> Confirming a plan records a paper hedge in the
              outcome ledger; nothing is sent to an exchange.
            </p>
          </div>
          <PrimaryButton href="/app/hedge" size="sm">
            Generate hedge plan
          </PrimaryButton>
        </div>
      </CardShell>
    </div>
  );
}
