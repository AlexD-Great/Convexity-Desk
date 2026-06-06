import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  CircleDot,
  Compass,
  LineChart,
  Shield,
  Users,
} from "lucide-react";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { GradientText } from "@/components/shared/GradientText";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";

const USERS = [
  {
    icon: BarChart3,
    title: "Crypto spot traders",
    body: "Users with existing BTC, ETH, SOL, or high-beta holdings who want a clear downside-risk read.",
  },
  {
    icon: LineChart,
    title: "SSI and index holders",
    body: "Basket holders who need a protection layer when full-sector beta starts weakening.",
  },
  {
    icon: Shield,
    title: "Solo fund operators",
    body: "One-person desks that need professional risk framing without a full risk team.",
  },
  {
    icon: Users,
    title: "Signal group admins",
    body: "People checking whether an existing exposure is too dangerous before recommending action.",
  },
];

const PRINCIPLES = [
  "Start from the portfolio, not a watchlist.",
  "Explain risk before recommending action.",
  "Use AI-shaped explanation only where the underlying logic remains inspectable.",
  "Label live, fallback, and demo data clearly.",
  "Require human confirmation before any execution path.",
  "Track outcomes so recommendations can be judged later.",
];

const BUILD_STATUS = [
  { label: "Wave 2 Core Flow", status: "Complete", variant: "success" as const },
  { label: "SoSoValue API", status: "Access requested", variant: "fallback" as const },
  { label: "SoDEX Market Reads", status: "Public/testnet attempt", variant: "live" as const },
  { label: "Outcome Ledger", status: "In-memory", variant: "demo" as const },
  { label: "Wallet Execution", status: "Wave 3", variant: "default" as const },
  { label: "Persistence", status: "Wave 3", variant: "default" as const },
];

const ROADMAP = [
  {
    phase: "Wave 2",
    title: "Polished risk-to-hedge demo",
    body: "Portfolio map, risk scan, evidence cards, hedge plan, SoDEX preview, confirmation gate, and outcome ledger.",
    active: true,
  },
  {
    phase: "Wave 3",
    title: "Execution and persistence",
    body: "Wallet connection, SoDEX testnet execution, EIP-712 signing, Supabase or SQLite persistence, and smart-contract receipts.",
    active: false,
  },
  {
    phase: "Beyond",
    title: "A real protection desk",
    body: "Live wallet portfolios, richer scenario simulation, saved risk policies, alerts, and auditable hedge-performance analytics.",
    active: false,
  },
];

export default function AboutPage() {
  return (
    <main>
      <Section className="bg-[#05070d]">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="demo" dot>SoSoValue Buildathon Wave 2</Badge>
            <h1
              className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Portfolio protection for <GradientText>on-chain finance.</GradientText>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#9ca3af] sm:text-lg">
              Convexity Desk was built around a simple gap: crypto users can enter risk quickly, but they rarely have a structured way to detect, explain, hedge, and review that risk.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <PrimaryButton href="/app">
                Launch Desk
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton href="/methodology">
                Read Methodology
              </SecondaryButton>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 lg:grid-cols-3">
            <CardShell variant="glow" className="lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#7cffb2]/20 bg-[#7cffb2]/10">
                  <Compass className="h-5 w-5 text-[#7cffb2]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Product thesis
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#9ca3af]">
                    Most crypto tools ask what to buy next. Convexity Desk asks what you already hold, where risk is building, what evidence supports that risk, and what hedge could reduce downside before the market move becomes obvious.
                  </p>
                </div>
              </div>
            </CardShell>
            <CardShell variant="elevated">
              <p className="font-mono text-xs uppercase tracking-widest text-[#6b7280]">
                Core Flow
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white">
                {"Portfolio -> Risk Scan -> Evidence -> Hedge Plan -> Execution Preview -> Confirmation -> Outcome Tracking"}
              </p>
            </CardShell>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#080d1a]">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                eyebrow="Who It Serves"
                title="Built for people already carrying exposure."
                subtitle="The product is for users who need a protection workflow, not another stream of isolated token signals."
                align="left"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {USERS.map(({ icon: Icon, title, body }) => (
                <CardShell key={title} variant="elevated" className="space-y-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2937] bg-[#0b1020]">
                    <Icon className="h-4 w-4 text-[#7cffb2]" />
                  </div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs leading-relaxed text-[#9ca3af]">{body}</p>
                </CardShell>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#05070d]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Design Principles"
                title="A risk desk should create clarity, not momentum."
                subtitle="The workflow intentionally slows the user down at the moment where automated systems often speed them up."
                align="left"
              />
              <div className="mt-8 grid gap-3">
                {PRINCIPLES.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-[#1f2937] bg-[#0b1020] p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7cffb2]" />
                    <p className="text-sm leading-relaxed text-[#d1d5db]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                eyebrow="Build Status"
                title="Wave 2 is a complete simulated workflow."
                subtitle="The current application is deployment-ready as a hackathon demo, with explicit boundaries around live data, persistence, and execution."
                align="left"
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {BUILD_STATUS.map(({ label, status, variant }) => (
                  <CardShell key={label} variant="elevated" padding="sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-white">{label}</p>
                      <Badge variant={variant} dot>{status}</Badge>
                    </div>
                  </CardShell>
                ))}
              </div>
              <CardShell variant="warning" className="mt-4">
                <p className="font-mono text-xs uppercase tracking-widest text-[#f59e0b]">
                  Prototype Disclaimer
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#9ca3af]">
                  Convexity Desk is not financial advice. All Wave 2 hedge plans are research, simulation, or testnet preparation unless clearly stated otherwise.
                </p>
              </CardShell>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#080d1a]">
        <Container>
          <SectionHeader
            eyebrow="Roadmap"
            title="From demo desk to execution infrastructure."
            subtitle="The build moves from transparent simulation toward persistent, wallet-connected, testnet-confirmed protection workflows."
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-4 lg:grid-cols-3">
            {ROADMAP.map(({ phase, title, body, active }) => (
              <CardShell key={phase} variant={active ? "glow" : "default"} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={active ? "demo" : "default"} dot>{phase}</Badge>
                  {active ? (
                    <BookOpenCheck className="h-4 w-4 text-[#7cffb2]" />
                  ) : (
                    <CircleDot className="h-4 w-4 text-[#4b5563]" />
                  )}
                </div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs leading-relaxed text-[#9ca3af]">{body}</p>
              </CardShell>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection />
      <Footer />
    </main>
  );
}
