"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ScanLine,
  FileSearch,
  ShieldCheck,
  Eye,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

const STEPS = [
  {
    number: "01",
    icon: Wallet,
    title: "Load Portfolio",
    body: "Connect your wallet or load a demo portfolio. Convexity Desk maps your holdings into risk buckets.",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Run Risk Scan",
    body: "The Convexity engine scores 5 risk factors: institutional flow, narrative, concentration, microstructure, and macro proximity.",
  },
  {
    number: "03",
    icon: FileSearch,
    title: "Review Evidence",
    body: "Evidence cards surface from SoSoValue intelligence and SoDEX market data — or fallback data when APIs are unavailable.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Generate Hedge Plan",
    body: "The hedge composer sizes a position based on your Danger Score and risk profile. Direction, instrument, and coverage are explicit.",
  },
  {
    number: "05",
    icon: Eye,
    title: "Preview Execution",
    body: "See a SoDEX-style execution preview: estimated slippage, order type, and coverage before any action is taken.",
  },
  {
    number: "06",
    icon: BookOpen,
    title: "Track Outcome",
    body: "Every confirmed hedge is logged in the outcome ledger. Review whether the hedge was useful, neutral, or avoided a loss.",
  },
];

export function HowItWorksSection() {
  return (
    <Section className="bg-[#080d1a]" id="how-it-works">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            eyebrow="How It Works"
            title="From holdings to hedge in six steps."
            subtitle="Every step is visible, explainable, and gated by your confirmation. No automatic execution, ever."
            align="center"
          />
        </motion.div>

        {/* Flow label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-10 hidden lg:flex items-center justify-center gap-2 font-mono text-[11px] text-[#9ca3af] tracking-widest uppercase"
        >
          {["Portfolio", "Risk Scan", "Evidence", "Hedge Plan", "SoDEX Preview", "Outcome"].map(
            (label, i, arr) => (
              <span key={label} className="flex items-center gap-2">
                <span className="text-[#7cffb2]">{label}</span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-[#374151]" />
                )}
              </span>
            )
          )}
        </motion.div>

        {/* Step cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ number, icon: Icon, title, body }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
              className="relative flex flex-col gap-4 rounded-xl border border-[#1f2937] bg-[#0b1020] p-6"
            >
              {/* Step number */}
              <span className="absolute right-4 top-4 font-mono text-xs text-[#374151]">
                {number}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#7cffb2]/15 bg-[#7cffb2]/8">
                <Icon className="h-5 w-5 text-[#7cffb2]" />
              </div>
              <div className="space-y-1.5">
                <p className="font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {title}
                </p>
                <p className="text-sm leading-relaxed text-[#9ca3af]">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
