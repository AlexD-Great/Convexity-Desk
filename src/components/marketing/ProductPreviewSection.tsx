"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/shared/Badge";
import { scoreColor, useLiveSnapshot } from "@/hooks/use-live-snapshot";

const LEVELS = ["Normal", "Watch", "Elevated", "High Risk"] as const;

function Skeleton({ className }: { className: string }) {
  return <span className={`block animate-pulse rounded bg-[#1f2937] ${className}`} />;
}

export function ProductPreviewSection() {
  const { data, isError } = useLiveSnapshot();
  const scan = data?.scan;
  const plan = data?.hedgePlan;
  const evidence = data?.evidenceCards.filter((c) => c.severity !== "low").slice(0, 4) ?? [];
  const allLive = data && data.dataMode.sosovalue === "live" && data.dataMode.sodex === "live";
  const color = scan ? scoreColor(scan.dangerScore) : "#4b5563";

  return (
    <Section className="bg-[#05070d] border-t border-[#1f2937]/40" id="preview">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            eyebrow="Risk Scan · Live"
            title="See every risk factor. Understand the evidence."
            subtitle="This is the engine running right now on a sample portfolio — live SoSoValue flows and news, live SoDEX prices and order books. Every factor is weighted and explained."
            align="center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="relative mt-14 mx-auto max-w-4xl"
        >
          <div
            className="pointer-events-none absolute -inset-8 rounded-3xl opacity-50"
            style={{ background: "radial-gradient(ellipse at center, rgba(124,255,178,0.06) 0%, transparent 70%)" }}
          />

          <div className="relative overflow-hidden rounded-2xl border border-[#1f2937] bg-[#0b1020] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1f2937] px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/50" />
                </div>
                <span className="font-mono text-xs text-[#6b7280]">
                  Risk Scan · Sample portfolio
                  {data ? ` · $${Math.round(data.portfolio.totalValueUsd).toLocaleString()}` : ""}
                </span>
              </div>
              <Badge variant={allLive ? "live" : "fallback"} dot>
                {isError ? "Unavailable" : data ? (allLive ? "Live data" : "Partial live data") : "Loading"}
              </Badge>
            </div>

            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1f2937]">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Convexity Danger Score</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-6xl font-bold leading-none" style={{ fontFamily: "var(--font-space-grotesk)", color }}>
                        {scan ? scan.dangerScore : "—"}
                      </span>
                      <span className="text-xl text-[#4b5563]">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {scan && (
                      <Badge variant={scan.dangerScore >= 75 ? "danger" : scan.dangerScore >= 50 ? "warning" : "primary"} dot>
                        {scan.riskLevel.toUpperCase()}
                      </Badge>
                    )}
                    <p className="mt-1.5 font-mono text-[10px] text-[#6b7280]">
                      {plan && plan.suggestedSizeUsd > 0
                        ? `Hedge ${plan.coveragePercent}% ${plan.instrument.split("-")[0]} beta`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1f2937]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${scan?.dangerScore ?? 0}%`, background: "linear-gradient(to right, #f59e0b, #ef4444)" }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-[#6b7280]">
                    {LEVELS.map((l) => (
                      <span key={l} style={scan?.riskLevel === l ? { color } : undefined}>
                        {l}
                        {scan?.riskLevel === l ? " ←" : ""}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Factor Breakdown</p>
                  {scan
                    ? scan.factors.map(({ key, label, score, weight }) => (
                        <div key={key} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#9ca3af]">{label}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-[#6b7280]">{Math.round(weight * 100)}%</span>
                              <span className="font-mono text-xs font-semibold text-white">{score}</span>
                            </div>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                            <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: scoreColor(score), opacity: 0.75 }} />
                          </div>
                        </div>
                      ))
                    : [1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                  Evidence {data ? `(${evidence.length} signals)` : ""}
                </p>
                <div className="space-y-3">
                  {data
                    ? evidence.map(({ id, severity, title, source, category, url }) => (
                        <a
                          key={id}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex gap-3 rounded-xl border p-4 transition-colors hover:border-[#7cffb2]/30 ${
                            severity === "high" ? "border-[#ef4444]/15 bg-[#ef4444]/[0.04]" : "border-[#f59e0b]/15 bg-[#f59e0b]/[0.04]"
                          }`}
                        >
                          <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${severity === "high" ? "bg-[#ef4444]" : "bg-[#f59e0b]"}`} />
                          <div className="space-y-1">
                            <p className="text-sm text-white leading-snug">{title}</p>
                            <p className="font-mono text-[10px] text-[#6b7280]">
                              {source} · {category}
                            </p>
                          </div>
                        </a>
                      ))
                    : [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>

                <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-4 space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Plain English Summary</p>
                  <p className="text-sm text-[#9ca3af] leading-relaxed">
                    {scan?.summary ?? (isError ? "The live scan is temporarily unavailable." : "Running the live scan…")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
