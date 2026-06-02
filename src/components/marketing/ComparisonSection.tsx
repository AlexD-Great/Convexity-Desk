"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

const ROWS = [
  {
    question: "What does it focus on?",
    others: "The next trade to enter",
    convexity: "What could damage what you already hold",
  },
  {
    question: "Starting point?",
    others: "Token watchlists and market feeds",
    convexity: "Your actual portfolio composition",
  },
  {
    question: "Risk direction?",
    others: "Upside alpha discovery",
    convexity: "Downside exposure protection",
  },
  {
    question: "How does it explain risk?",
    others: "Generic market commentary",
    convexity: "Evidence against your specific holdings",
  },
  {
    question: "How does it act?",
    others: "Auto-signals, auto-bots, or prompts to buy",
    convexity: "Approval-gated hedge plan, human confirms first",
  },
  {
    question: "Does it track outcomes?",
    others: "Rarely — no accountability loop",
    convexity: "Outcome ledger logs every hedge and its result",
  },
];

export function ComparisonSection() {
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
            eyebrow="Why Different"
            title="Not another signal dashboard."
            subtitle="Signal bots ask what to buy. Convexity Desk asks what could hurt what you already own."
            align="center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
          className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-[#1f2937]"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-[#1f2937] bg-[#111827]">
            <div className="p-4">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Question</p>
            </div>
            <div className="border-l border-[#1f2937] p-4">
              <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Other Tools</p>
            </div>
            <div className="border-l border-[#7cffb2]/20 p-4 bg-[#7cffb2]/[0.03]">
              <p
                className="text-xs font-semibold text-[#7cffb2] uppercase tracking-wide"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Convexity Desk
              </p>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map(({ question, others, convexity }, i) => (
            <div
              key={question}
              className={`grid grid-cols-[1fr_1fr_1fr] border-b border-[#1f2937] last:border-b-0 ${
                i % 2 === 0 ? "bg-[#0b1020]" : "bg-[#0d1525]"
              }`}
            >
              <div className="p-4">
                <p className="text-xs text-[#9ca3af] leading-relaxed">{question}</p>
              </div>
              <div className="border-l border-[#1f2937] p-4">
                <div className="flex items-start gap-2">
                  <X className="mt-0.5 h-3 w-3 shrink-0 text-[#4b5563]" />
                  <p className="text-xs text-[#6b7280] leading-relaxed">{others}</p>
                </div>
              </div>
              <div className="border-l border-[#7cffb2]/15 p-4 bg-[#7cffb2]/[0.02]">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#7cffb2]" />
                  <p className="text-xs text-white leading-relaxed">{convexity}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
