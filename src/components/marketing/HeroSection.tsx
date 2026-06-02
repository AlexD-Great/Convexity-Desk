"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle2, Activity } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/shared/Badge";
import { GradientText } from "@/components/shared/GradientText";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";
import { HeroDashboardPreview } from "./HeroDashboardPreview";

const TRUST_ITEMS = [
  { icon: Shield, label: "Portfolio-native protection" },
  { icon: CheckCircle2, label: "Human confirmation gate" },
  { icon: Activity, label: "Evidence-backed risk scan" },
];

const ease = "easeOut" as const;

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(circle, #374151 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,255,178,0.055) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-40 right-0 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      <Container className="relative py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 xl:gap-20">

          {/* ── Left: Text content ── */}
          <div className="space-y-8">

            {/* Eyebrow badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-wrap gap-2"
            >
              <Badge variant="primary" dot>SoSoValue Buildathon</Badge>
              <Badge variant="demo">Wave 2</Badge>
              <Badge variant="blue">SoDEX Integration</Badge>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.08 }}
            >
              <h1
                className="text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Protect your crypto
                <br />
                portfolio{" "}
                <GradientText>
                  before
                  <br />
                  the drawdown
                </GradientText>{" "}
                becomes
                <br />
                obvious.
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease, delay: 0.16 }}
              className="max-w-lg text-base leading-relaxed text-[#9ca3af] sm:text-[1.0625rem]"
            >
              Convexity Desk reads your holdings, scans institutional flow
              pressure, narrative risk, and SoDEX market structure, then builds
              an approval-gated hedge plan before volatility turns into damage.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.22 }}
              className="flex flex-wrap items-center gap-3"
            >
              <PrimaryButton href="/app" size="lg">
                Launch Desk
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton href="/how-it-works" size="lg" variant="outline">
                See How It Works
              </SecondaryButton>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.28 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2.5"
            >
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#7cffb2]" />
                  <span className="text-sm text-[#9ca3af]">{label}</span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── Right: Dashboard preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.18 }}
            className="w-full"
          >
            <HeroDashboardPreview />
          </motion.div>

        </div>
      </Container>

      {/* Bottom gradient fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05070d] to-transparent" />
    </section>
  );
}
