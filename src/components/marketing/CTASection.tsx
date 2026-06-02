"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";
import { GradientText } from "@/components/shared/GradientText";

export function CTASection() {
  return (
    <Section className="bg-[#05070d] border-t border-[#1f2937]/40 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(124,255,178,0.06) 0%, transparent 60%)",
        }}
      />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center space-y-8"
        >
          {/* Headline */}
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[#7cffb2]">
              Your portfolio already has risk.
            </p>
            <h2
              className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Convexity Desk tells you{" "}
              <GradientText>where it is hiding.</GradientText>
            </h2>
            <p className="text-base text-[#9ca3af] leading-relaxed">
              Stop discovering risk after the damage is done. Scan your portfolio, understand the evidence, and
              confirm a hedge before the market moves against you.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <PrimaryButton href="/app" size="lg">
              Launch Desk
              <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton href="/methodology" size="lg" variant="outline">
              <BookOpen className="h-4 w-4" />
              Read Methodology
            </SecondaryButton>
          </div>

          {/* Sub-note */}
          <p className="text-xs text-[#6b7280]">
            Demo mode active — no wallet required. Live API mode available when SoSoValue and SoDEX keys are configured.
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
