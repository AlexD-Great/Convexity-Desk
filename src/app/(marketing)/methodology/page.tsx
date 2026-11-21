import {
  AlertTriangle,
  BarChart3,
  DatabaseZap,
  FileSearch,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
} from "lucide-react";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";

const FORMULA_FACTORS = [
  {
    key: "Institutional Flow Pressure",
    weight: "30%",
    scoreKey: "institutional_flow",
    source: "SoSoValue US spot ETF flows",
    detail:
      "Combined BTC + ETH spot ETF net flow over the last 5 trading days as a % of AUM, plus a bonus for consecutive outflow days. Mapped through a soft curve: flat flows score 50, a −1.7% week about 89.",
    accent: "#60a5fa",
  },
  {
    key: "Narrative / News Pressure",
    weight: "20%",
    scoreKey: "narrative_pressure",
    source: "SoSoValue news + hot news",
    detail:
      "Share of bearish headlines, weighted up for high-severity (hot) items. Sentiment is deterministic keyword matching — SoSoValue does not supply a sentiment score.",
    accent: "#a78bfa",
  },
  {
    key: "Portfolio Concentration",
    weight: "25%",
    scoreKey: "portfolio_concentration",
    source: "Internal portfolio analysis",
    detail:
      "Driven by the largest risky position of any asset (above 25% of the portfolio), plus high-beta alt exposure and how little stablecoin cushion remains.",
    accent: "#f59e0b",
  },
  {
    key: "Market Microstructure Stress",
    weight: "15%",
    scoreKey: "market_microstructure",
    source: "SoDEX mainnet order books",
    detail:
      "40% 24h price range, 35% USD depth resting within ±25 bps of mid, 25% bid-ask spread — volume-weighted across BTC, ETH and SOL perps.",
    accent: "#ef4444",
  },
  {
    key: "Event Proximity",
    weight: "10%",
    scoreKey: "event_proximity",
    source: "SoSoValue US macro calendar",
    detail:
      "Upcoming releases weighted by impact (CPI, PCE, payrolls, GDP, FOMC high; PMIs, claims medium) and decayed by days away; paired releases like MoM/YoY count once.",
    accent: "#7cffb2",
  },
];

const RISK_LEVELS = [
  { range: "0-24", label: "Normal", action: "No hedge required", color: "#22c55e" },
  { range: "25-49", label: "Watch", action: "Monitor risk drivers", color: "#60a5fa" },
  { range: "50-74", label: "Elevated", action: "Consider partial hedge", color: "#f59e0b" },
  { range: "75-100", label: "High Risk", action: "Review hedge plan", color: "#ef4444" },
];

const HEDGE_RULES = [
  {
    label: "Instrument selection",
    value: "Dominant beta exposure",
    detail: "BTC-heavy portfolios map to BTC-PERP, ETH-heavy portfolios map to ETH-PERP, and alt-heavy portfolios use BTC as the proxy hedge.",
  },
  {
    label: "Position sizing",
    value: "Score x profile, capped",
    detail: "Danger Scores below 50 produce no hedge. Scores from 50 to 100 interpolate from 10% to 45% of non-stablecoin holdings, adjusted by risk profile and capped by your max-hedge setting.",
  },
  {
    label: "Coverage",
    value: "Hedge / hedgeable beta",
    detail: "Coverage is calculated against BTC and ETH beta exposure, so the user sees what share of liquid directional risk is addressed.",
  },
  {
    label: "Preview cost",
    value: "Order-book walk",
    detail: "The hedge size is filled against live SoDEX bid levels to estimate average entry price and slippage, with warnings for thin books, funding and your slippage limit.",
  },
];

const SAFETY_CONTROLS = [
  {
    icon: LockKeyhole,
    title: "No automatic execution",
    body: "No order is ever placed automatically. Confirming a plan records a paper hedge in the outcome ledger.",
  },
  {
    icon: FileSearch,
    title: "Inspectable evidence",
    body: "Every scan returns factor explanations and evidence cards so the user can see why the score moved.",
  },
  {
    icon: DatabaseZap,
    title: "Transparent data mode",
    body: "Every source reports live, stale or fallback in API responses, and the dashboard banners any source that is down.",
  },
  {
    icon: ShieldCheck,
    title: "Human confirmation gate",
    body: "The hedge preview requires three acknowledgements before a paper hedge is recorded.",
  },
];

export default function MethodologyPage() {
  return (
    <main>
      <Section className="bg-[#05070d]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-7">
              <SectionHeader
                eyebrow="Methodology"
                title="An inspectable risk engine, built for portfolio protection."
                subtitle="Convexity Desk turns portfolio composition, SoSoValue intelligence, and SoDEX market structure into a deterministic Danger Score."
                align="left"
              />
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/app/scan">
                  <BarChart3 className="h-4 w-4" />
                  Run Risk Scan
                </PrimaryButton>
                <SecondaryButton href="/docs">
                  View API Docs
                </SecondaryButton>
              </div>
              <CardShell variant="warning" padding="sm">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
                  <p className="text-sm leading-relaxed text-[#9ca3af]">
                    Convexity Desk is not financial advice. It analyses risk and proposes hedges; it does not place orders on your behalf.
                  </p>
                </div>
              </CardShell>
            </div>

            <CardShell variant="glow" className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-[#7cffb2]">
                  Danger Score Formula
                </p>
                <Badge variant="primary">0-100</Badge>
              </div>
              <p className="font-mono text-sm leading-relaxed text-white">
                score = 0.30 * institutional_flow<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 * narrative_pressure<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.25 * portfolio_concentration<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.15 * microstructure_stress<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 * event_proximity
              </p>
              <div className="grid gap-2 sm:grid-cols-4">
                {RISK_LEVELS.map(({ range, label, action, color }) => (
                  <div key={label} className="rounded-lg border border-[#1f2937] bg-[#111827] p-3">
                    <p className="font-mono text-xs font-bold" style={{ color }}>{range}</p>
                    <p className="mt-1 text-xs font-semibold text-white">{label}</p>
                    <p className="mt-1 text-[11px] leading-snug text-[#6b7280]">{action}</p>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>

          <div className="mt-16">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#6b7280]">
                  Score Inputs
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Five weighted factors
                </h2>
              </div>
              <Badge variant="demo" dot>Deterministic</Badge>
            </div>
            <div className="grid gap-4 lg:grid-cols-5">
              {FORMULA_FACTORS.map(({ key, weight, scoreKey, source, detail, accent }) => (
                <CardShell key={key} variant="elevated" className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                    <Badge variant="default">{weight}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-white">{key}</p>
                    <p className="mt-1 font-mono text-[10px] text-[#6b7280]">{scoreKey}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-[#9ca3af]">{detail}</p>
                  <p className="border-t border-[#1f2937] pt-3 text-[11px] leading-relaxed text-[#6b7280]">
                    Source: {source}
                  </p>
                </CardShell>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#080d1a]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Hedge Logic"
                title="Recommendations are sized, previewed, and gated."
                subtitle="The hedge composer is a rule-based planner. It chooses the instrument, computes the size, estimates coverage, and prepares the execution preview."
                align="left"
              />
              <div className="mt-8 grid gap-3">
                {HEDGE_RULES.map(({ label, value, detail }) => (
                  <CardShell key={label} variant="default" padding="sm">
                    <div className="flex items-start gap-3">
                      <TrendingDown className="mt-1 h-4 w-4 shrink-0 text-[#7cffb2]" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-white">{label}</p>
                          <Badge variant="primary">{value}</Badge>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">{detail}</p>
                      </div>
                    </div>
                  </CardShell>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                eyebrow="Safety Controls"
                title="Designed to slow down risky actions."
                subtitle="The product explains, previews, and asks for acknowledgement before any hedge is recorded."
                align="left"
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {SAFETY_CONTROLS.map(({ icon: Icon, title, body }) => (
                  <CardShell key={title} variant="elevated" className="space-y-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#0b1020]">
                      <Icon className="h-4 w-4 text-[#7cffb2]" />
                    </div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs leading-relaxed text-[#9ca3af]">{body}</p>
                  </CardShell>
                ))}
              </div>

              <CardShell variant="glow" className="mt-4">
                <div className="flex items-start gap-3">
                  <SlidersHorizontal className="mt-1 h-4 w-4 shrink-0 text-[#7cffb2]" />
                  <div>
                    <p className="text-sm font-semibold text-white">Risk preferences</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">
                      Settings control the risk profile (sizing multiplier), a hard max-hedge cap and a slippage warning threshold. They are saved in the browser and applied server-side to every hedge plan.
                    </p>
                  </div>
                </div>
              </CardShell>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
      <Footer />
    </main>
  );
}
