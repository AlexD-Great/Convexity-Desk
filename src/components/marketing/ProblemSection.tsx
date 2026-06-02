"use client";

import { motion } from "framer-motion";
import { Clock, TrendingDown, Layers, AlertTriangle } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";

const PROBLEMS = [
  {
    icon: Clock,
    title: "News arrives late.",
    body: "By the time a bearish narrative reaches your feed, institutional players have already repositioned. You are reading yesterday's risk.",
  },
  {
    icon: TrendingDown,
    title: "Signals are noisy.",
    body: "Buy and sell signals optimise for entry. Nobody is watching what happens to your existing exposure when conditions change.",
  },
  {
    icon: Layers,
    title: "Risk compounds quietly.",
    body: "Portfolio concentration builds over time. A single outperforming asset slowly becomes a dominant risk factor — invisibly.",
  },
  {
    icon: AlertTriangle,
    title: "By the time it dumps, it is too late.",
    body: "The drawdown is already pricing in the risk before most traders react. Hedging after the move is insurance bought after the accident.",
  },
];

export function ProblemSection() {
  return (
    <Section className="bg-[#05070d] border-t border-[#1f2937]/60" id="product">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            eyebrow="The Problem"
            title="Risk builds before you notice it."
            subtitle="Most crypto tools focus on the next trade. Nobody is watching what could damage what you already hold."
            align="center"
          />
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.07 }}
              className="flex flex-col gap-4 rounded-xl border border-[#1f2937] bg-[#0b1020] p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f2937] bg-[#111827]">
                <Icon className="h-5 w-5 text-[#9ca3af]" />
              </div>
              <div className="space-y-2">
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
