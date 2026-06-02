import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";
import { GradientText } from "@/components/shared/GradientText";

export default function AboutPage() {
  return (
    <main>
      <Section className="bg-[#05070d]">
        <Container>
          <div className="mx-auto max-w-2xl space-y-12">
            <SectionHeader
              eyebrow="About"
              title="Portfolio protection for on-chain finance."
              align="center"
            />

            <CardShell variant="glow">
              <p className="text-base leading-relaxed text-[#9ca3af]">
                Convexity Desk was built for the{" "}
                <span className="text-[#7cffb2]">SoSoValue Buildathon</span> as a portfolio-native
                protection layer for crypto traders, SSI/index holders, and one-person fund managers.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#9ca3af]">
                The product answers one question: given what you already hold, where is the risk building,
                and what is the cleanest hedge before the market moves against you?
              </p>
            </CardShell>

            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af]">Build Status</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Wave 2", status: "In progress", variant: "demo" as const },
                  { label: "SoSoValue Integration", status: "Fallback mode", variant: "fallback" as const },
                  { label: "SoDEX Integration", status: "Fallback mode", variant: "fallback" as const },
                  { label: "Wave 3 Execution", status: "Planned", variant: "default" as const },
                ].map(({ label, status, variant }) => (
                  <CardShell key={label} variant="elevated" padding="sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white">{label}</p>
                      <Badge variant={variant} dot>{status}</Badge>
                    </div>
                  </CardShell>
                ))}
              </div>
            </div>

            <CardShell variant="default">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9ca3af] mb-2">Disclaimer</p>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                Convexity Desk is a hackathon prototype. It is not financial advice. All hedge plans are for
                research, simulation, or testnet demonstration unless clearly stated otherwise.
              </p>
            </CardShell>
          </div>
        </Container>
      </Section>

      <CTASection />
      <Footer />
    </main>
  );
}
