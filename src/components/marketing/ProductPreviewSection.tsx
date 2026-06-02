"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/shared/Badge";

const RISK_FACTORS = [
  { label: "Institutional Flow Pressure", score: 81, weight: "30%" },
  { label: "Narrative / News Pressure", score: 74, weight: "20%" },
  { label: "Portfolio Concentration", score: 68, weight: "25%" },
  { label: "Market Microstructure Stress", score: 62, weight: "15%" },
  { label: "Event Proximity", score: 55, weight: "10%" },
];

const EVIDENCE = [
  { severity: "high", text: "BTC spot ETF cumulative outflows hit $620M — 3rd consecutive negative week.", source: "SoSoValue" },
  { severity: "high", text: "Open interest on BTC perpetuals compressed 18% in 48h.", source: "SoSoValue" },
  { severity: "medium", text: "SoDEX BTC-PERP bid-ask spread at 2.3× 30-day average.", source: "SoDEX" },
  { severity: "high", text: "BTC allocation at 43.2% — above 40% concentration warning threshold.", source: "Internal" },
];

export function ProductPreviewSection() {
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
            eyebrow="Risk Scan"
            title="See every risk factor. Understand the evidence."
            subtitle="The Danger Score is not a black box. Every factor is weighted, explained, and backed by data from SoSoValue or SoDEX."
            align="center"
          />
        </motion.div>

        {/* Large mock panel */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="relative mt-14 mx-auto max-w-4xl"
        >
          {/* Glow */}
          <div
            className="pointer-events-none absolute -inset-8 rounded-3xl opacity-50"
            style={{ background: "radial-gradient(ellipse at center, rgba(124,255,178,0.06) 0%, transparent 70%)" }}
          />

          <div className="relative overflow-hidden rounded-2xl border border-[#1f2937] bg-[#0b1020] shadow-2xl">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[#1f2937] px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/50" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/50" />
                </div>
                <span className="font-mono text-xs text-[#6b7280]">Risk Scan · Demo Portfolio · $42,850</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="fallback" dot>Fallback Mode</Badge>
                <Badge variant="demo" dot>DEMO</Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#1f2937]">

              {/* Left: Score + factors */}
              <div className="p-6 space-y-6">

                {/* Danger Score */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Convexity Danger Score</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className="text-6xl font-bold text-[#ef4444] leading-none"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        78
                      </span>
                      <span className="text-xl text-[#4b5563]">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="danger" dot>HIGH RISK</Badge>
                    <p className="mt-1.5 font-mono text-[10px] text-[#6b7280]">Hedge 35% BTC beta</p>
                  </div>
                </div>

                {/* Score bar */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1f2937]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: "78%", background: "linear-gradient(to right, #f59e0b, #ef4444)" }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-[#6b7280]">
                    <span>Normal</span>
                    <span>Watch</span>
                    <span>Elevated</span>
                    <span className="text-[#ef4444]">High Risk ←</span>
                  </div>
                </div>

                {/* Risk factor breakdown */}
                <div className="space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Factor Breakdown</p>
                  {RISK_FACTORS.map(({ label, score, weight }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#9ca3af]">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#6b7280]">{weight}</span>
                          <span className="font-mono text-xs font-semibold text-white">{score}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${score}%`,
                            backgroundColor: score >= 75 ? "#ef4444" : score >= 60 ? "#f59e0b" : "#22c55e",
                            opacity: 0.75,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Evidence cards */}
              <div className="p-6 space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                  Evidence ({EVIDENCE.length} signals)
                </p>
                <div className="space-y-3">
                  {EVIDENCE.map(({ severity, text, source }) => (
                    <div
                      key={text}
                      className={`flex gap-3 rounded-xl border p-4 ${
                        severity === "high"
                          ? "border-[#ef4444]/15 bg-[#ef4444]/[0.04]"
                          : "border-[#f59e0b]/15 bg-[#f59e0b]/[0.04]"
                      }`}
                    >
                      <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${severity === "high" ? "bg-[#ef4444]" : "bg-[#f59e0b]"}`} />
                      <div className="space-y-1">
                        <p className="text-sm text-white leading-snug">{text}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#6b7280]">{source}</span>
                          <span className="font-mono text-[10px] text-[#374151]">·</span>
                          <span className="font-mono text-[10px] text-[#6b7280]">
                            {source === "SoSoValue" || source === "SoDEX" ? "Fallback" : "Internal"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-4 space-y-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">Plain English Summary</p>
                  <p className="text-sm text-[#9ca3af] leading-relaxed">
                    Your portfolio carries elevated downside risk. BTC concentration is above threshold, institutional
                    flow data is negative, and SoDEX market structure shows stress. Consider hedging BTC beta exposure.
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
