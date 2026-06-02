import { EcosystemSection } from "@/components/marketing/EcosystemSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";

const API_ROUTES = [
  { method: "GET", route: "/api/portfolio/demo", desc: "Demo portfolio data", phase: "Phase 6" },
  { method: "POST", route: "/api/scan/run", desc: "Run Convexity Risk Scan", phase: "Phase 9" },
  { method: "GET", route: "/api/evidence", desc: "Evidence cards for a scan", phase: "Phase 9" },
  { method: "POST", route: "/api/hedge/generate", desc: "Generate hedge plan", phase: "Phase 10" },
  { method: "POST", route: "/api/hedge/preview", desc: "SoDEX execution preview", phase: "Phase 10" },
  { method: "POST", route: "/api/hedge/confirm", desc: "Confirm simulated hedge", phase: "Phase 11" },
  { method: "GET", route: "/api/outcomes", desc: "Outcome ledger entries", phase: "Phase 11" },
  { method: "GET", route: "/api/market/sodex", desc: "SoDEX market data", phase: "Phase 7" },
  { method: "GET", route: "/api/intelligence/sosovalue", desc: "SoSoValue intelligence", phase: "Phase 8" },
  { method: "GET", route: "/api/status", desc: "Integration status", phase: "Live" },
];

export default function DocsPage() {
  return (
    <main>
      <Section className="bg-[#05070d]">
        <Container>
          <SectionHeader
            eyebrow="Documentation"
            title="Architecture and API reference."
            subtitle="Built for the SoSoValue Buildathon. All integrations are transparent about live vs. fallback data."
            align="center"
          />

          <div className="mx-auto mt-14 max-w-3xl space-y-8">
            <CardShell variant="default">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] mb-4">API Routes</p>
              <div className="space-y-2">
                {API_ROUTES.map(({ method, route, desc, phase }) => (
                  <div key={route} className="flex items-center justify-between gap-4 rounded-lg bg-[#111827] px-3 py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`font-mono text-[10px] font-bold shrink-0 ${method === "GET" ? "text-[#22c55e]" : "text-[#60a5fa]"}`}>
                        {method}
                      </span>
                      <span className="font-mono text-xs text-white truncate">{route}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#6b7280] hidden sm:block">{desc}</span>
                      <Badge variant={phase === "Live" ? "success" : "default"}>{phase}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell variant="elevated">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] mb-3">Data Mode Transparency</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Live", desc: "Real API call succeeded", variant: "live" as const },
                  { label: "Fallback", desc: "API failed, typed fallback data used", variant: "fallback" as const },
                  { label: "Mock / Demo", desc: "Demo mode, no API called", variant: "mock" as const },
                ].map(({ label, desc, variant }) => (
                  <div key={label} className="rounded-lg border border-[#1f2937] p-3 space-y-1.5">
                    <Badge variant={variant} dot>{label}</Badge>
                    <p className="text-xs text-[#6b7280]">{desc}</p>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>
        </Container>
      </Section>

      <EcosystemSection />
      <CTASection />
      <Footer />
    </main>
  );
}
