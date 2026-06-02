"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/shared/Badge";

const ECOSYSTEM = [
  {
    name: "SoSoValue",
    role: "Intelligence Layer",
    description:
      "News flash, ETF flow data, token sentiment, and institutional market intelligence. Powers narrative and institutional flow factors in the Danger Score.",
    badge: "Live / Fallback" as const,
    badgeVariant: "fallback" as const,
    color: "#60a5fa",
    points: ["ETF inflow / outflow tracking", "News sentiment signals", "Token market intelligence"],
  },
  {
    name: "SoDEX",
    role: "Execution Layer",
    description:
      "Public market data, orderbook depth, and spread analysis. Powers the microstructure stress factor and the execution preview for every hedge recommendation.",
    badge: "Live / Fallback" as const,
    badgeVariant: "fallback" as const,
    color: "#7cffb2",
    points: ["Orderbook depth & spread", "Execution preview", "Testnet order placement (Wave 3)"],
  },
  {
    name: "SSI Index",
    role: "Index Exposure",
    description:
      "Structured thematic crypto baskets. Convexity Desk treats SSI/index holdings as a distinct beta bucket, enabling targeted protection for index-heavy portfolios.",
    badge: "Supported" as const,
    badgeVariant: "blue" as const,
    color: "#a78bfa",
    points: ["Thematic basket recognition", "Index beta bucketing", "Sector-level hedge targeting"],
  },
  {
    name: "ValueChain",
    role: "Infrastructure",
    description:
      "Trading infrastructure and settlement backbone. Provides the execution pathway for Wave 3 testnet order placement and smart contract anchoring.",
    badge: "Wave 3" as const,
    badgeVariant: "primary" as const,
    color: "#f59e0b",
    points: ["Trade execution backbone", "Smart contract layer", "Outcome anchoring (Wave 3)"],
  },
];

export function EcosystemSection() {
  return (
    <Section className="bg-[#05070d] border-t border-[#1f2937]/40">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader
            eyebrow="Ecosystem"
            title="SoSoValue intelligence meets SoDEX execution."
            subtitle="Convexity Desk is built as a research-to-execution stack on top of the SoSoValue ecosystem. Every integration is explicit and transparent."
            align="center"
          />
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM.map(({ name, role, description, badge, badgeVariant, color, points }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.07 }}
              className="flex flex-col gap-5 rounded-xl border border-[#1f2937] bg-[#0b1020] p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div
                    className="mb-1 inline-block font-mono text-xs font-bold tracking-wide"
                    style={{ color }}
                  >
                    {name}
                  </div>
                  <p className="text-[11px] text-[#6b7280]">{role}</p>
                </div>
                <Badge variant={badgeVariant}>{badge}</Badge>
              </div>

              {/* Top border accent */}
              <div className="h-px w-full rounded-full" style={{ backgroundColor: `${color}20` }} />

              <p className="text-xs leading-relaxed text-[#9ca3af]">{description}</p>

              {/* Points */}
              <ul className="space-y-1.5 mt-auto">
                {points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-xs text-[#6b7280]">
                    <span className="h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
