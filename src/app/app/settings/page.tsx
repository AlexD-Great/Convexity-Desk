"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  DatabaseZap,
  Gauge,
  Loader2,
  Radio,
  RefreshCw,
  Shield,
  ToggleLeft,
  Wallet,
} from "lucide-react";
import type { AppMode, IntegrationMode, IntegrationStatus, RiskProfile } from "@/types";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";

const APP_MODES: Array<{ value: AppMode; label: string; detail: string }> = [
  { value: "demo", label: "Demo", detail: "Use demo portfolio and labelled fallback data." },
  { value: "mixed", label: "Mixed", detail: "Attempt live adapters, fall back transparently." },
  { value: "live", label: "Live", detail: "Target live-only operation in a future release." },
];

const RISK_PROFILES: Array<{ value: RiskProfile; label: string; multiplier: string; detail: string }> = [
  { value: "conservative", label: "Conservative", multiplier: "1.2x", detail: "Larger hedges when risk is elevated." },
  { value: "balanced", label: "Balanced", multiplier: "1.0x", detail: "Default sizing for the Wave 2 demo." },
  { value: "aggressive", label: "Aggressive", multiplier: "0.7x", detail: "Smaller hedges to preserve upside." },
];

const ALERT_OPTIONS = [
  { key: "danger", label: "Danger Score above 70" },
  { key: "spread", label: "SoDEX spread above 20 bps" },
  { key: "flow", label: "Bearish institutional flow signal" },
  { key: "ledger", label: "Outcome entry remains pending" },
] as const;

type AlertKey = typeof ALERT_OPTIONS[number]["key"];

function modeVariant(mode?: IntegrationMode | AppMode) {
  if (mode === "live") return "live" as const;
  if (mode === "fallback") return "fallback" as const;
  if (mode === "mock") return "mock" as const;
  if (mode === "error") return "danger" as const;
  if (mode === "mixed") return "blue" as const;
  return "demo" as const;
}

function StatusRow({
  label,
  mode,
  detail,
}: {
  label: string;
  mode?: IntegrationMode | AppMode;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2.5">
      <div>
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

function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2.5 text-left transition-colors hover:border-[#7cffb2]/25"
    >
      <span className="text-sm text-[#d1d5db]">{label}</span>
      <span
        className="flex h-6 w-10 items-center rounded-full border p-0.5 transition-colors"
        style={{
          borderColor: enabled ? "#7cffb250" : "#374151",
          backgroundColor: enabled ? "#7cffb220" : "#0b1020",
        }}
      >
        <span
          className="h-[18px] w-[18px] rounded-full transition-transform"
          style={{
            backgroundColor: enabled ? "#7cffb2" : "#6b7280",
            transform: enabled ? "translateX(16px)" : "translateX(0)",
          }}
        />
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [appMode, setAppMode] = useState<AppMode>("demo");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("balanced");
  const [maxHedgeSize, setMaxHedgeSize] = useState(45);
  const [maxSlippage, setMaxSlippage] = useState(25);
  const [alerts, setAlerts] = useState<Record<AlertKey, boolean>>({
    danger: true,
    spread: true,
    flow: true,
    ledger: false,
  });

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json() as IntegrationStatus;
      setStatus(json);
      setAppMode(json.mode);
    } catch {
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    fetch("/api/status")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<IntegrationStatus>;
      })
      .then((json) => {
        if (cancelled) return;
        setStatus(json);
        setAppMode(json.mode);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingStatus(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const enabledAlertCount = useMemo(
    () => Object.values(alerts).filter(Boolean).length,
    [alerts]
  );

  const selectedProfile = RISK_PROFILES.find((profile) => profile.value === riskProfile);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Settings
            </h2>
            <Badge variant="demo">Phase 12</Badge>
          </div>
          <p className="mt-1 text-sm text-[#9ca3af]">
            Data mode, API status, risk preferences, alert rules, and Wave 3 readiness.
          </p>
        </div>
        <button
          type="button"
          onClick={loadStatus}
          className="flex items-center gap-2 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2 text-sm text-[#9ca3af] transition-colors hover:bg-[#1f2937] hover:text-white"
        >
          {loadingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh Status
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <CardShell variant="default" className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">
                <Radio className="h-4 w-4 text-[#7cffb2]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">App Mode</p>
                <p className="text-xs text-[#6b7280]">Local control surface for demo, mixed, and future live mode.</p>
              </div>
            </div>
            <Badge variant={modeVariant(appMode)} dot>{appMode}</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {APP_MODES.map(({ value, label, detail }) => (
              <SegmentedButton
                key={value}
                value={value}
                active={appMode === value}
                label={label}
                sublabel={detail}
                onClick={setAppMode}
              />
            ))}
          </div>
          <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-3">
            <p className="text-xs leading-relaxed text-[#9ca3af]">
              Phase 12 settings are client-local controls. Wave 3 will persist preferences and enforce live/testnet execution policy server-side.
            </p>
          </div>
        </CardShell>

        <CardShell variant="elevated" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#0b1020]">
                <DatabaseZap className="h-4 w-4 text-[#7cffb2]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Integration Status</p>
                <p className="text-xs text-[#6b7280]">Fetched from /api/status.</p>
              </div>
            </div>
            {loadingStatus && <Loader2 className="h-4 w-4 animate-spin text-[#7cffb2]" />}
          </div>

          <div className="space-y-2">
            <StatusRow
              label="SoSoValue"
              mode={status?.sosovalue}
              detail={
                status?.details.sosovalue.label ??
                "SoSoValue: Fallback — API key not configured."
              }
            />
            <StatusRow
              label="SoDEX"
              mode={status?.sodex}
              detail={
                status?.details.sodex.label ??
                "Market data, spread, liquidity, execution preview."
              }
            />
            <StatusRow
              label="Overall Mode"
              mode={status?.mode}
              detail={
                status?.lastCheckedAt
                  ? `Last checked ${new Date(status.lastCheckedAt).toLocaleString()}`
                  : "Waiting for status check."
              }
            />
          </div>
          {status && (
            <div className="space-y-2 rounded-lg border border-[#1f2937] bg-[#0b1020] p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                Integration notes
              </p>
              <p className="text-xs leading-relaxed text-[#f59e0b]">
                {status.details.sosovalue.reason}
              </p>
              <p className="text-xs leading-relaxed text-[#9ca3af]">
                {status.details.sodex.reason}
              </p>
              {status.details.sodex.endpoint && (
                <p className="break-all font-mono text-[10px] text-[#6b7280]">
                  SoDEX endpoint: {status.details.sodex.endpoint}
                </p>
              )}
            </div>
          )}
        </CardShell>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CardShell variant="default" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">
              <Shield className="h-4 w-4 text-[#7cffb2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Risk Preferences</p>
              <p className="text-xs text-[#6b7280]">Used to explain how hedge sizing will be governed.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {RISK_PROFILES.map(({ value, label, multiplier, detail }) => (
              <SegmentedButton
                key={value}
                value={value}
                active={riskProfile === value}
                label={`${label} ${multiplier}`}
                sublabel={detail}
                onClick={setRiskProfile}
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Max Hedge Size</p>
                <span className="font-mono text-sm text-[#7cffb2]">{maxHedgeSize}%</span>
              </div>
              <input
                aria-label="Maximum hedge size"
                type="range"
                min={10}
                max={60}
                step={5}
                value={maxHedgeSize}
                onChange={(event) => setMaxHedgeSize(Number(event.target.value))}
                className="w-full accent-[#7cffb2]"
              />
              <p className="mt-2 text-xs text-[#6b7280]">Upper bound for suggested hedge notional.</p>
            </div>

            <div className="rounded-lg border border-[#1f2937] bg-[#111827] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Max Slippage</p>
                <span className="font-mono text-sm text-[#7cffb2]">{maxSlippage} bps</span>
              </div>
              <input
                aria-label="Maximum slippage"
                type="range"
                min={5}
                max={50}
                step={5}
                value={maxSlippage}
                onChange={(event) => setMaxSlippage(Number(event.target.value))}
                className="w-full accent-[#7cffb2]"
              />
              <p className="mt-2 text-xs text-[#6b7280]">Warning threshold for execution previews.</p>
            </div>
          </div>

          <CardShell variant="glow" padding="sm">
            <div className="flex items-start gap-3">
              <Gauge className="mt-1 h-4 w-4 shrink-0 text-[#7cffb2]" />
              <p className="text-xs leading-relaxed text-[#9ca3af]">
                Current profile: {selectedProfile?.label} ({selectedProfile?.multiplier}). Max hedge size {maxHedgeSize}% and max slippage {maxSlippage} bps.
              </p>
            </div>
          </CardShell>
        </CardShell>

        <CardShell variant="default" className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">
              <Bell className="h-4 w-4 text-[#7cffb2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Alert Preferences</p>
              <p className="text-xs text-[#6b7280]">{enabledAlertCount} alert rules enabled locally.</p>
            </div>
          </div>

          <div className="space-y-2">
            {ALERT_OPTIONS.map(({ key, label }) => (
              <ToggleRow
                key={key}
                label={label}
                enabled={alerts[key]}
                onToggle={() => setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))}
              />
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CardShell variant="elevated" padding="sm">
              <div className="flex items-start gap-3">
                <Wallet className="mt-1 h-4 w-4 shrink-0 text-[#6b7280]" />
                <div>
                  <p className="text-sm font-semibold text-white">Wallet</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
                    Not connected. Wallet connection is planned for Wave 3.
                  </p>
                </div>
              </div>
            </CardShell>
            <CardShell variant="elevated" padding="sm">
              <div className="flex items-start gap-3">
                <ToggleLeft className="mt-1 h-4 w-4 shrink-0 text-[#6b7280]" />
                <div>
                  <p className="text-sm font-semibold text-white">Testnet Execution</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6b7280]">
                    Disabled in Wave 2. Confirmation remains simulation-only.
                  </p>
                </div>
              </div>
            </CardShell>
          </div>

          <div className="rounded-lg border border-[#f59e0b]/20 bg-[#f59e0b]/[0.04] p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
              <p className="text-xs leading-relaxed text-[#9ca3af]">
                These alert preferences are not persisted yet. They model the Wave 3 settings surface and keep the current demo honest about what is active.
              </p>
            </div>
          </div>
        </CardShell>
      </div>

      <CardShell variant="elevated" padding="sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-[#6b7280]">
            Phase 12 settings are now interactive for demo review. Persistence, wallet policy enforcement, and server-side risk preferences are planned for Wave 3.
          </p>
          <PrimaryButton href="/app/hedge" size="sm">
            Generate Hedge Plan
          </PrimaryButton>
        </div>
      </CardShell>
    </div>
  );
}
