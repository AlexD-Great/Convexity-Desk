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
  { method: "GET", route: "/api/portfolio/demo", desc: "Returns the static Wave 2 demo portfolio.", source: "Internal" },
  { method: "POST", route: "/api/scan/run", desc: "Runs portfolio, intelligence, market data, and Danger Score calculation.", source: "Pipeline" },
  { method: "GET", route: "/api/evidence", desc: "Returns SoSoValue evidence cards with live/fallback mode.", source: "SoSoValue" },
  { method: "POST", route: "/api/hedge/generate", desc: "Runs scan, composes hedge plan, and builds execution preview.", source: "Pipeline" },
  { method: "POST", route: "/api/hedge/preview", desc: "Refreshes the SoDEX execution preview for a hedge plan.", source: "SoDEX" },
  { method: "POST", route: "/api/hedge/confirm", desc: "Creates a simulated hedge outcome ledger entry.", source: "Internal" },
  { method: "GET", route: "/api/outcomes", desc: "Returns seeded and session-created outcome ledger entries.", source: "Internal" },
  { method: "GET", route: "/api/market/sodex", desc: "Returns SoDEX market data adapter response.", source: "SoDEX" },
  { method: "GET", route: "/api/intelligence/sosovalue", desc: "Returns SoSoValue intelligence adapter response.", source: "SoSoValue" },
  { method: "GET", route: "/api/status", desc: "Reports SoSoValue, SoDEX, and overall app data mode.", source: "Status" },
];

const PIPELINE_STEPS = [
  "Load demo portfolio",
  "Fetch SoSoValue intelligence",
  "Fetch SoDEX market data",
  "Calculate five-factor Danger Score",
  "Compose hedge plan",
  "Build execution preview",
  "Confirm simulated outcome",
];

const ENV_GROUPS = [
  {
    title: "App",
    vars: ["NEXT_PUBLIC_APP_MODE", "NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_APP_NAME"],
  },
  {
    title: "SoSoValue",
    vars: ["SOSOVALUE_API_KEY", "SOSOVALUE_BASE_URL"],
  },
  {
    title: "SoDEX",
    vars: ["SODEX_BASE_URL", "SODEX_TESTNET_BASE_URL", "SODEX_API_KEY"],
  },
  {
    title: "Wallet Preview",
    vars: ["NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID", "NEXT_PUBLIC_CHAIN_ID"],
  },
  {
    title: "Wave 3",
    vars: ["NEXT_PUBLIC_SUPABASE_URL"],
  },
];

const DATA_MODES = [
  {
    label: "Live",
    variant: "live" as const,
    detail: "The adapter reached a configured external API and normalized usable data.",
  },
  {
    label: "Fallback",
    variant: "fallback" as const,
    detail: "The app attempted live integration or lacked credentials, then returned typed fallback data.",
  },
  {
    label: "Demo",
    variant: "demo" as const,
    detail: "The product is using the built-in portfolio and simulation-only workflow.",
  },
];

const CURRENT_INTEGRATIONS = [
  {
    label: "SoSoValue",
    status: "Fallback",
    variant: "fallback" as const,
    detail:
      "API access has been requested. Until SOSOVALUE_API_KEY is added, the app uses typed fallback evidence and clearly labels it.",
  },
  {
    label: "SoDEX",
    status: "Live attempt",
    variant: "live" as const,
    detail:
      "The adapter attempts unsigned public/testnet market reads from documented SoDEX endpoints, then falls back if the gateway is unavailable.",
  },
  {
    label: "Wallet Preview",
    status: "Basic holdings",
    variant: "success" as const,
    detail:
      "RainbowKit and wagmi connect supported wallets and read native balance plus allowlisted ERC20 balances. Full wallet indexing is not implemented yet.",
  },
  {
    label: "Execution",
    status: "Simulation only",
    variant: "demo" as const,
    detail:
      "No live trade execution is implemented. Testnet order placement waits for safe signing and confirmation plumbing.",
  },
];

const LIMITATIONS = [
  "Risk scanning still uses the static demo portfolio for the complete Wave 2 flow.",
  "Connected wallet mode reads native balance and allowlisted ERC20 balances only.",
  "Hedge confirmation records simulated orders only.",
  "Outcome ledger storage is in-memory and resets on server restart.",
  "Full wallet indexing, EIP-712 signing, and SoDEX testnet order placement are Wave 3 work.",
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
                subtitle="Convexity Desk is a Next.js full-stack app with server-side adapters, a deterministic risk engine, and an approval-gated simulated hedge flow."
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
                  { label: "Adapters", value: "SoSoValue and SoDEX live attempts with typed fallback" },
                  { label: "Wallet", value: "RainbowKit/wagmi basic holdings preview" },
                  { label: "Execution", value: "Wave 2 simulation with human confirmation gate" },
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
                <Badge variant="demo">10 routes</Badge>
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
                    Demo Pipeline
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
                    Wave 2 Limits
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
                title="The UI must never pretend fallback data is live."
                subtitle="Every adapter returns a mode, and the status route combines those modes into demo, mixed, or live app state."
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
