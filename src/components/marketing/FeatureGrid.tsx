"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  FileSearch,
  TrendingDown,
  Shield,
  ClipboardList,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Portfolio Exposure Map",
    body: "See your holdings broken down by beta bucket, concentration weight, and hedgeable exposure — automatically.",
    accent: "#7cffb2",
  },
  {
    icon: Activity,
    title: "Convexity Danger Score",
    body: "A deterministic 0–100 score across 5 weighted risk factors. Inspectable, explainable, and evidence-backed.",
    accent: "#ef4444",
  },
  {
    icon: FileSearch,
    title: "SoSoValue Evidence Cards",
    body: "News sentiment, ETF flow data, and token intelligence from SoSoValue — or typed fallback when APIs are unavailable.",
    accent: "#60a5fa",
  },
  {
    icon: TrendingDown,
    title: "SoDEX Execution Preview",
    body: "Estimated slippage, orderbook depth, and order type preview from SoDEX market data before any position is taken.",
    accent: "#a78bfa",
  },
  {
    icon: Shield,
    title: "Hedge Composer",
    body: "Automatically sized hedge recommendations based on your Danger Score, portfolio composition, and risk profile.",
    accent: "#7cffb2",
  },
  {
    icon: ClipboardList,
    title: "Outcome Ledger",
    body: "Every hedge recommendation is tracked. See whether the hedge was useful, neutral, avoided a loss, or was missed.",
    accent: "#60a5fa",
  },
  {
    icon: CheckCircle2,
    title: "Human Confirmation Gate",
    body: "No automatic execution. Every hedge requires explicit confirmation with a required disclaimer acknowledgement.",
    accent: "#22c55e",
  },
  {
    icon: Radio,
    title: "Live / Fallback Transparency",
    body: "Every data source is labelled: live, fallback, mock, or error. The app never claims mock data is live.",
    accent: "#f59e0b",
  },
];

export function FeatureGrid() {
  return (
    <Section className="bg-[#080d1a] border-t border-[#1f2937]/40">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to protect what you hold."
            subtitle="Convexity Desk is not a signal dashboard. It is a portfolio protection layer built around your existing exposure."
            align="center"
          />
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body, accent }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.05 }}
              className="group flex flex-col gap-4 rounded-xl border border-[#1f2937] bg-[#0b1020] p-5 transition-colors hover:border-[#374151]"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  borderColor: `${accent}20`,
                  backgroundColor: `${accent}0d`,
                }}
              >
                <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  {title}
                </p>
                <p className="text-xs leading-relaxed text-[#9ca3af]">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
