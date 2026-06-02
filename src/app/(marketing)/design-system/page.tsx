import {
  Container,
  Section,
  SectionHeader,
  Badge,
  CardShell,
  GradientText,
} from "@/components/shared";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";
import { ArrowRight, Shield, TrendingDown, Zap } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[#05070d]">
      <Container className="py-16 space-y-20">

        {/* Header */}
        <div className="border-b border-[#1f2937] pb-8">
          <p className="font-mono text-xs text-[#7cffb2] uppercase tracking-widest mb-2">
            Phase 2 — Design System Preview
          </p>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Convexity Desk
            <span className="text-[#9ca3af] font-normal"> / Design System</span>
          </h1>
          <p className="text-[#9ca3af] mt-2">Visual verification of all shared UI primitives.</p>
        </div>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">Typography</h2>
          <div className="space-y-4">
            <p className="text-6xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Display Heading
            </p>
            <p className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Section Heading
            </p>
            <p className="text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Card Heading
            </p>
            <p className="text-base text-[#9ca3af] leading-relaxed max-w-xl">
              Body text — Convexity Desk reads your holdings, scans institutional flow pressure, narrative risk, and SoDEX market structure, then builds an approval-gated hedge plan.
            </p>
            <p className="font-mono text-sm text-[#9ca3af]">Mono label — DANGER SCORE 78/100</p>
          </div>

          {/* GradientText */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">GradientText</p>
            <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              <GradientText>Protect your portfolio</GradientText>
            </p>
            <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              <GradientText from="#60a5fa" to="#7cffb2">Before the drawdown</GradientText>
            </p>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary" dot>Primary</Badge>
            <Badge variant="blue" dot>Blue</Badge>
            <Badge variant="success" dot>Success</Badge>
            <Badge variant="warning" dot>Warning</Badge>
            <Badge variant="danger" dot>Danger</Badge>
            <Badge variant="live" dot>Live</Badge>
            <Badge variant="fallback" dot>Fallback</Badge>
            <Badge variant="mock" dot>Mock</Badge>
            <Badge variant="demo" dot>Demo Mode</Badge>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">Buttons</h2>

          <div className="space-y-3">
            <p className="text-xs text-[#9ca3af]">PrimaryButton — sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryButton size="sm">Small</PrimaryButton>
              <PrimaryButton size="md">Launch Desk</PrimaryButton>
              <PrimaryButton size="lg">
                Launch Desk <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#9ca3af]">SecondaryButton — variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <SecondaryButton size="sm" variant="outline">Outline SM</SecondaryButton>
              <SecondaryButton size="md" variant="outline">See How It Works</SecondaryButton>
              <SecondaryButton size="lg" variant="ghost">Ghost LG</SecondaryButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#9ca3af]">Button pairs (hero CTA pattern)</p>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/app" size="lg">
                Launch Desk <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton href="/how-it-works" size="lg" variant="outline">
                See How It Works
              </SecondaryButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#9ca3af]">Disabled state</p>
            <div className="flex flex-wrap gap-3">
              <PrimaryButton disabled>Disabled Primary</PrimaryButton>
              <SecondaryButton disabled>Disabled Secondary</SecondaryButton>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">CardShell</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <CardShell variant="default">
              <p className="text-xs font-mono text-[#9ca3af] uppercase mb-1">Default</p>
              <p className="text-white font-semibold">Portfolio Value</p>
              <p className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>$42,850</p>
            </CardShell>

            <CardShell variant="elevated">
              <p className="text-xs font-mono text-[#9ca3af] uppercase mb-1">Elevated</p>
              <p className="text-white font-semibold">Danger Score</p>
              <p className="text-2xl font-bold text-[#ef4444] mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>78 / 100</p>
            </CardShell>

            <CardShell variant="glow">
              <p className="text-xs font-mono text-[#7cffb2] uppercase mb-1">Glow</p>
              <p className="text-white font-semibold">Hedge Coverage</p>
              <p className="text-2xl font-bold text-[#7cffb2] mt-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>42%</p>
            </CardShell>

            <CardShell variant="warning">
              <p className="text-xs font-mono text-[#f59e0b] uppercase mb-1">Warning</p>
              <p className="text-white font-semibold">Elevated Risk Detected</p>
              <p className="text-sm text-[#9ca3af] mt-1">BTC concentration above safe threshold.</p>
            </CardShell>

            <CardShell variant="danger">
              <p className="text-xs font-mono text-[#ef4444] uppercase mb-1">Danger</p>
              <p className="text-white font-semibold">High Risk — Action Required</p>
              <p className="text-sm text-[#9ca3af] mt-1">ETF outflows increasing. Consider hedging.</p>
            </CardShell>

            <CardShell variant="default" padding="sm">
              <p className="text-xs font-mono text-[#9ca3af] uppercase mb-1">Small Padding</p>
              <p className="text-white text-sm">Compact card for dense layouts</p>
            </CardShell>
          </div>
        </section>

        {/* SectionHeader */}
        <section className="space-y-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">SectionHeader</h2>

          <SectionHeader
            eyebrow="Risk Intelligence"
            title="Your portfolio already has risk."
            subtitle="Convexity Desk tells you where it is hiding — before the market moves against you."
            align="center"
          />

          <SectionHeader
            eyebrow="Left aligned"
            title="Portfolio Exposure Map"
            subtitle="See your holdings broken down by risk bucket, concentration weight, and hedgeable exposure."
            align="left"
          />
        </section>

        {/* Section + Container composition */}
        <Section className="border border-[#1f2937] rounded-2xl">
          <Container>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
              {[
                { icon: Shield, label: "Portfolio Protected", value: "42%" },
                { icon: TrendingDown, label: "Danger Score", value: "78 / 100" },
                { icon: Zap, label: "Evidence Cards", value: "5 Active" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="space-y-2">
                  <Icon className="h-6 w-6 text-[#7cffb2] mx-auto" />
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>{value}</p>
                  <p className="text-sm text-[#9ca3af]">{label}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Color palette */}
        <section className="space-y-6">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9ca3af]">Color Palette</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "Background", hex: "#05070d" },
              { name: "Surface", hex: "#0b1020" },
              { name: "Elevated", hex: "#111827" },
              { name: "Border", hex: "#1f2937" },
              { name: "Primary", hex: "#7cffb2" },
              { name: "Blue", hex: "#60a5fa" },
              { name: "Warning", hex: "#f59e0b" },
              { name: "Danger", hex: "#ef4444" },
              { name: "Success", hex: "#22c55e" },
              { name: "Muted", hex: "#9ca3af" },
              { name: "Text", hex: "#f9fafb" },
              { name: "White", hex: "#ffffff" },
            ].map(({ name, hex }) => (
              <div key={name} className="space-y-2">
                <div
                  className="h-12 rounded-lg border border-[#1f2937]"
                  style={{ backgroundColor: hex }}
                />
                <p className="text-xs text-[#9ca3af]">{name}</p>
                <p className="font-mono text-xs text-[#6b7280]">{hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="border-t border-[#1f2937] pt-8 text-center">
          <p className="text-xs font-mono text-[#9ca3af]">
            Design system verified — Phase 2 complete. Phase 3 begins the landing page.
          </p>
        </div>

      </Container>
    </div>
  );
}
