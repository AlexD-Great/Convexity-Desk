"use client";

import { Badge } from "@/components/shared/Badge";
import { BUCKET_COLOR, scoreColor, useLiveSnapshot } from "@/hooks/use-live-snapshot";

const SHORT_LABEL: Record<string, string> = {
  institutional_flow: "Institutional Flow",
  narrative_pressure: "Narrative Pressure",
  portfolio_concentration: "Portfolio Conc.",
  market_microstructure: "Microstructure",
  event_proximity: "Event Proximity",
};

function Skeleton({ className }: { className: string }) {
  return <span className={`inline-block animate-pulse rounded bg-[#1f2937] ${className}`} />;
}

/** Live engine output for the sample holdings — not a mock. */
export function HeroDashboardPreview() {
  const { data, isError } = useLiveSnapshot();
  const scan = data?.scan;
  const plan = data?.hedgePlan;
  const preview = data?.executionPreview;

  const factors = scan
    ? [...scan.factors].sort((a, b) => b.score * b.weight - a.score * a.weight).slice(0, 4)
    : [];
  const holdings = data?.portfolio.assets.filter((a) => a.weight >= 1).slice(0, 5) ?? [];
  const evidence = data?.evidenceCards.filter((c) => c.severity !== "low").slice(0, 3) ?? [];
  const allLive = data && data.dataMode.sosovalue === "live" && data.dataMode.sodex === "live";
  const color = scan ? scoreColor(scan.dangerScore) : "#4b5563";

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-60"
        style={{ background: "radial-gradient(ellipse at center, rgba(124,255,178,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-[#1f2937] bg-[#0b1020] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1f2937] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/60" />
            </div>
            <span className="font-mono text-[11px] text-[#6b7280]">convexity-desk · risk-scan</span>
          </div>
          <Badge variant={allLive ? "live" : "fallback"} dot>
            {data ? (allLive ? "LIVE" : "PARTIAL") : "…"}
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Danger Score</p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span
                  className="text-[42px] font-bold leading-none"
                  style={{ fontFamily: "var(--font-space-grotesk)", color }}
                >
                  {scan ? scan.dangerScore : <Skeleton className="h-9 w-14 align-middle" />}
                </span>
                <span className="text-lg text-[#4b5563]">/100</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              {scan ? (
                <Badge variant={scan.dangerScore >= 75 ? "danger" : scan.dangerScore >= 50 ? "warning" : "primary"} dot>
                  {scan.riskLevel.toUpperCase()}
                </Badge>
              ) : (
                <Skeleton className="h-5 w-20" />
              )}
              <p className="font-mono text-[10px] text-[#6b7280]">
                {plan && plan.suggestedSizeUsd > 0
                  ? `Hedge ${plan.coveragePercent}% ${plan.instrument.split("-")[0]} beta`
                  : scan
                  ? "No hedge needed"
                  : ""}
              </p>
            </div>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${scan?.dangerScore ?? 0}%`, background: "linear-gradient(to right, #f59e0b, #ef4444)" }}
            />
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Top Risk Drivers</p>
            {scan
              ? factors.map(({ key, score }) => (
                  <div key={key} className="flex items-center gap-3">
                    <p className="w-32 shrink-0 text-[11px] text-[#9ca3af]">{SHORT_LABEL[key] ?? key}</p>
                    <div className="flex-1 h-1 overflow-hidden rounded-full bg-[#1f2937]">
                      <div className="h-full rounded-full opacity-70" style={{ width: `${score}%`, backgroundColor: scoreColor(score) }} />
                    </div>
                    <p className="w-5 text-right font-mono text-[11px] text-white">{score}</p>
                  </div>
                ))
              : [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-3 w-full" />)}
          </div>

          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Sample Portfolio · Live Prices</p>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#1f2937]">
              {holdings.map(({ symbol, weight, betaBucket }) => (
                <div
                  key={symbol}
                  className="h-full"
                  style={{ width: `${weight}%`, backgroundColor: BUCKET_COLOR[betaBucket] }}
                  title={`${symbol} ${weight}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {holdings.map(({ symbol, weight, betaBucket }) => (
                <div key={symbol} className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BUCKET_COLOR[betaBucket] }} />
                  <span className="font-mono text-[11px] text-[#9ca3af]">
                    {symbol} <span className="text-white">{weight}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Live Evidence</p>
            {data
              ? evidence.map(({ id, severity, title, source }) => (
                  <div key={id} className="flex items-start gap-2 rounded-lg bg-[#111827] px-3 py-2">
                    <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${severity === "high" ? "bg-[#ef4444]" : "bg-[#f59e0b]"}`} />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] text-white">{title}</p>
                      <p className="font-mono text-[10px] text-[#6b7280]">{source}</p>
                    </div>
                  </div>
                ))
              : [1, 2, 3].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
          </div>

          <div className="rounded-xl border border-[#7cffb2]/20 bg-[#7cffb2]/[0.04] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#7cffb2]">Hedge Plan</p>
              {plan && plan.suggestedSizeUsd > 0 && <Badge variant="primary">{plan.confidence}% confidence</Badge>}
            </div>
            {plan && plan.suggestedSizeUsd > 0 ? (
              <>
                <p className="text-sm font-semibold text-white">Short {plan.instrument.replace("/", " / ")}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-[11px] text-[#9ca3af]">${plan.suggestedSizeUsd.toLocaleString()}</span>
                  <span className="text-[#374151]">·</span>
                  <span className="font-mono text-[11px] text-[#7cffb2]">{plan.coveragePercent}% coverage</span>
                  {preview && (
                    <>
                      <span className="text-[#374151]">·</span>
                      <span className="font-mono text-[11px] text-[#9ca3af]">{preview.estimatedSlippageBps} bps slippage</span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-[#9ca3af]">{plan ? "No hedge suggested at this score." : <Skeleton className="h-4 w-40" />}</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#1f2937] pt-3">
            <p className="font-mono text-[10px] text-[#6b7280]">
              {isError
                ? "Live scan unavailable right now"
                : scan
                ? `Live scan · ${new Date(scan.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Running live scan…"}
            </p>
            <p className="font-mono text-[10px] text-[#6b7280]">SoSoValue · SoDEX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
