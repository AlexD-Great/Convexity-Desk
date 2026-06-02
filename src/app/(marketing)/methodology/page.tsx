import { ComparisonSection } from "@/components/marketing/ComparisonSection";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";

const FORMULA_FACTORS = [
  { key: "Institutional Flow Pressure", weight: "30%", source: "SoSoValue ETF/flow data or fallback" },
  { key: "Narrative / News Pressure", weight: "20%", source: "SoSoValue news intelligence or fallback" },
  { key: "Portfolio Concentration", weight: "25%", source: "Internal portfolio analysis" },
  { key: "Market Microstructure Stress", weight: "15%", source: "SoDEX orderbook data or fallback" },
  { key: "Event Proximity", weight: "10%", source: "SoSoValue macro/event data or fallback" },
];

export default function MethodologyPage() {
  return (
    <main>
      <Section className="bg-[#05070d]">
        <Container>
          <SectionHeader
            eyebrow="Methodology"
            title="How the Danger Score is calculated."
            subtitle="Every factor is weighted, inspectable, and backed by a data source. No black boxes."
            align="center"
          />

          {/* Formula */}
          <div className="mx-auto mt-14 max-w-2xl space-y-6">
            <CardShell variant="glow">
              <p className="font-mono text-xs uppercase tracking-widest text-[#7cffb2] mb-3">Danger Score Formula</p>
              <p className="font-mono text-sm text-white leading-relaxed">
                Score = 0.30 × institutional_flow<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 × narrative_pressure<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.25 × portfolio_concentration<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.15 × microstructure_stress<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 × event_proximity
              </p>
            </CardShell>

            <div className="grid gap-3">
              {FORMULA_FACTORS.map(({ key, weight, source }) => (
                <CardShell key={key} variant="elevated" padding="sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{key}</p>
                      <p className="text-xs text-[#9ca3af] mt-0.5">{source}</p>
                    </div>
                    <Badge variant="primary">{weight}</Badge>
                  </div>
                </CardShell>
              ))}
            </div>

            <CardShell variant="default">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] mb-3">Risk Levels</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { range: "0–24", label: "Normal", color: "#22c55e" },
                  { range: "25–49", label: "Watch", color: "#60a5fa" },
                  { range: "50–74", label: "Elevated", color: "#f59e0b" },
                  { range: "75–100", label: "High Risk", color: "#ef4444" },
                ].map(({ range, label, color }) => (
                  <div key={label} className="rounded-lg border border-[#1f2937] p-3">
                    <p className="font-mono text-xs font-bold" style={{ color }}>{range}</p>
                    <p className="text-xs text-[#9ca3af] mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell variant="default">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] mb-2">Disclaimer</p>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                Convexity Desk is a hackathon prototype. It is not financial advice. All hedge plans are for
                research, simulation, or testnet demonstration unless clearly stated otherwise.
                Users are responsible for all trading decisions.
              </p>
            </CardShell>
          </div>
        </Container>
      </Section>

      <ComparisonSection />
      <CTASection />
      <Footer />
    </main>
  );
}
