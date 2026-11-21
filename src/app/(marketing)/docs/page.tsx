import {
  Activity,
  ArrowRight,
  Braces,
  CheckCircle2,
  Database,
  FileCode2,
  GitBranch,
  ServerCog,
  ShieldAlert,
} from "lucide-react";
import { EcosystemSection } from "@/components/marketing/EcosystemSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";

const API_ROUTES = [
  { method: "GET", route: "/api/portfolio/demo", desc: "Sample holdings valued at live prices.", source: "Internal" },
  { method: "GET", route: "/api/portfolio/wallet", desc: "A wallet's holdings across 4 chains (?address=0x…), spam filtered.", source: "Alchemy / RPC" },
  { method: "GET", route: "/api/prices", desc: "Live prices for symbols (?symbols=BTC,ETH).", source: "SoDEX" },
  { method: "POST", route: "/api/scan/run", desc: "Five-factor Danger Score for the demo holdings or { address }.", source: "Pipeline" },
  { method: "POST", route: "/api/hedge/generate", desc: "Scan + sized hedge plan + order-book execution preview.", source: "Pipeline" },
  { method: "POST", route: "/api/hedge/preview", desc: "Refreshes the SoDEX execution preview for a hedge plan.", source: "SoDEX" },
  { method: "POST", route: "/api/hedge/confirm", desc: "Records a confirmed plan as a paper hedge.", source: "Internal" },
  { method: "GET", route: "/api/outcomes", desc: "Outcome ledger entries (in memory).", source: "Internal" },
  { method: "GET", route: "/api/market/sodex", desc: "SoDEX mainnet tickers, order-book depth and stress.", source: "SoDEX" },
  { method: "GET", route: "/api/intelligence/sosovalue", desc: "ETF flows, news and macro calendar with factor scores.", source: "SoSoValue" },
  { method: "GET", route: "/api/evidence", desc: "Evidence cards only.", source: "SoSoValue" },
  { method: "GET", route: "/api/status", desc: "Health of each data source and overall status.", source: "Status" },
];

const PIPELINE_STEPS = [
  "Read wallet holdings (or load sample holdings)",
  "Price everything on SoDEX, filter spam and dust",
  "Fetch SoSoValue ETF flows, news and macro calendar",
  "Measure SoDEX order-book depth, spread and volatility",
  "Calculate five-factor Danger Score",
  "Size hedge plan within your limits",
  "Walk the order book for slippage, then confirm as a paper hedge",
];

const ENV_GROUPS = [
  {
    title: "SoSoValue",
    vars: ["SOSOVALUE_API_KEY", "SOSOVALUE_BASE_URL"],
  },
  {
    title: "Wallet scanning",
    vars: ["ALCHEMY_API_KEY", "RPC_URL_ETHEREUM", "RPC_URL_BASE", "RPC_URL_ARBITRUM", "RPC_URL_OPTIMISM"],
  },
  {
    title: "SoDEX",
    vars: ["SODEX_BASE_URL"],
  },
  {
    title: "Wallet connection",
    vars: ["NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"],
  },
  {
    title: "App",
    vars: ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_APP_NAME"],
  },
];

const DATA_MODES = [
  {
    label: "Live",
    variant: "live" as const,
    detail: "The source responded and its data is in use.",
  },
  {
    label: "Stale",
    variant: "warning" as const,
    detail: "The latest SoDEX read failed, so the last live snapshot (under 10 minutes old) is shown.",
  },
  {
    label: "Fallback",
    variant: "fallback" as const,
    detail: "The source is down. Its factors use labelled sample data and the dashboard shows a banner.",
  },
];

const CURRENT_INTEGRATIONS = [
  {
    label: "SoSoValue",
    status: "Live",
    variant: "live" as const,
    detail:
      "US BTC/ETH spot ETF flows, news and hot news, and the US macro calendar. Each source is cached separately to stay inside the API quota.",
  },
  {
    label: "SoDEX",
    status: "Live · mainnet",
    variant: "live" as const,
    detail:
      "Mainnet perp and spot tickers, L2 order books and daily klines — prices, depth, slippage and 30-day volatility. Unsigned public reads.",
  },
  {
    label: "Wallet scanning",
    status: "4 chains",
    variant: "success" as const,
    detail:
      "Alchemy Portfolio API finds every token on Ethereum, Base, Arbitrum and Optimism; without a key, a curated token list is read over public RPCs.",
  },
  {
    label: "Execution",
    status: "Not enabled",
    variant: "default" as const,
    detail:
      "Confirming a plan records a paper hedge. No orders are sent to any exchange.",
  },
];

const LIMITATIONS = [
  "Outcome ledger entries live in server memory and reset on restart.",
  "Hedge preferences are saved per browser, not per account.",
  "News sentiment is keyword-based; SoSoValue does not provide a sentiment score.",
  "Order placement is not implemented — hedges are recorded as paper hedges.",
];

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`font-mono text-[10px] font-bold ${
        method === "GET" ? "text-[#22c55e]" : "text-[#60a5fa]"
      }`}
    >
      {method}
    </span>
  );
}

export default function DocsPage() {
  return (
    <main>
      <Section className="bg-[#05070d]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-7">
              <SectionHeader
                eyebrow="Documentation"
                title="API, architecture, and integration reference."
                subtitle="Convexity Desk is a Next.js full-stack app with server-side adapters, a deterministic risk engine, and and an approval-gated hedge flow."
                align="left"
              />
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/app">
                  Launch Desk
                  <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
                <SecondaryButton href="/methodology">
                  Read Methodology
                </SecondaryButton>
              </div>
            </div>

            <CardShell variant="glow" className="space-y-5">
              <div className="flex items-center gap-3">
                <ServerCog className="h-5 w-5 text-[#7cffb2]" />
                <div>
                  <p className="text-sm font-semibold text-white">Runtime Architecture</p>
                  <p className="text-xs text-[#9ca3af]">Browser UI to internal API routes to server-only business logic.</p>
                </div>
              </div>
              <div className="grid gap-2">
                {[
                  { label: "Frontend", value: "Next.js App Router, React 19, Tailwind v4" },
                  { label: "Risk", value: "Five-factor deterministic Danger Score" },
                  { label: "Adapters", value: "SoSoValue, SoDEX mainnet and Alchemy, cached per source" },
                  { label: "Wallet", value: "RainbowKit/wagmi basic holdings preview" },
                  { label: "Execution", value: "Paper hedges behind a human confirmation gate" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">{label}</span>
                    <span className="text-right text-xs text-[#d1d5db]">{value}</span>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#080d1a]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <CardShell variant="default" padding="none">
              <div className="flex items-center justify-between border-b border-[#1f2937] px-5 py-4">
                <div className="flex items-center gap-2">
                  <Braces className="h-4 w-4 text-[#7cffb2]" />
                  <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af]">
                    API Routes
                  </p>
                </div>
                <Badge variant="demo">{API_ROUTES.length} routes</Badge>
              </div>
              <div className="divide-y divide-[#1f2937]">
                {API_ROUTES.map(({ method, route, desc, source }) => (
                  <div key={route} className="grid gap-3 px-5 py-4 md:grid-cols-[76px_1fr_112px] md:items-center">
                    <MethodBadge method={method} />
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-white">{route}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">{desc}</p>
                    </div>
                    <Badge variant={source === "SoDEX" ? "primary" : source === "SoSoValue" ? "blue" : "default"}>
                      {source}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardShell>

            <div className="space-y-4">
              <CardShell variant="elevated" className="space-y-4">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-[#7cffb2]" />
                  <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af]">
                    Scan Pipeline
                  </p>
                </div>
                <div className="space-y-3">
                  {PIPELINE_STEPS.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1f2937] bg-[#0b1020] font-mono text-[10px] text-[#7cffb2]">
                        {index + 1}
                      </span>
                      <p className="text-xs text-[#d1d5db]">{step}</p>
                    </div>
                  ))}
                </div>
              </CardShell>

              <CardShell variant="warning" className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#f59e0b]" />
                  <p className="font-mono text-xs uppercase tracking-widest text-[#f59e0b]">
                    Current Limits
                  </p>
                </div>
                <div className="space-y-2">
                  {LIMITATIONS.map((item) => (
                    <div key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f59e0b]" />
                      <p className="text-xs leading-relaxed text-[#9ca3af]">{item}</p>
                    </div>
                  ))}
                </div>
              </CardShell>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#05070d]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Configuration"
                title="Environment variables are server-first."
                subtitle="External API keys stay on the server. Public variables are limited to UI mode, app URL, wallet setup, and future client integrations."
                align="left"
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {ENV_GROUPS.map(({ title, vars }) => (
                  <CardShell key={title} variant="elevated" padding="sm">
                    <div className="mb-3 flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-[#7cffb2]" />
                      <p className="text-sm font-semibold text-white">{title}</p>
                    </div>
                    <div className="space-y-1.5">
                      {vars.map((name) => (
                        <p key={name} className="font-mono text-[10px] text-[#9ca3af]">{name}</p>
                      ))}
                    </div>
                  </CardShell>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                eyebrow="Data Modes"
                title="The UI never presents sample data as live."
                subtitle="Every adapter returns a mode; the status route combines them into live, partial or offline, and the dashboard banners any source that is down."
                align="left"
              />
              <div className="mt-8 space-y-3">
                {CURRENT_INTEGRATIONS.map(({ label, status, variant, detail }) => (
                  <CardShell key={label} variant="elevated" padding="sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">{detail}</p>
                      </div>
                      <Badge variant={variant} dot>{status}</Badge>
                    </div>
                  </CardShell>
                ))}
                {DATA_MODES.map(({ label, variant, detail }) => (
                  <CardShell key={label} variant="default" padding="sm">
                    <div className="flex items-start gap-3">
                      <Database className="mt-1 h-4 w-4 shrink-0 text-[#7cffb2]" />
                      <div>
                        <Badge variant={variant} dot>{label}</Badge>
                        <p className="mt-2 text-xs leading-relaxed text-[#9ca3af]">{detail}</p>
                      </div>
                    </div>
                  </CardShell>
                ))}
              </div>
              <CardShell variant="glow" className="mt-4">
                <div className="flex items-start gap-3">
                  <Activity className="mt-1 h-4 w-4 shrink-0 text-[#7cffb2]" />
                  <p className="text-xs leading-relaxed text-[#9ca3af]">
                    Check the live runtime state from the dashboard topbar or the Settings page. Both read `/api/status`.
                  </p>
                </div>
              </CardShell>
            </div>
          </div>
        </Container>
      </Section>

      <EcosystemSection />
      <CTASection />
      <Footer />
    </main>
  );
}
