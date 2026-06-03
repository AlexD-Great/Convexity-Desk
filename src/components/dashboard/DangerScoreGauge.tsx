"use client";

import { motion } from "framer-motion";
import type { RiskLevel } from "@/types";

const SIZE = 200;
const STROKE = 14;
const r = (SIZE - STROKE) / 2 - 2; // ≈ 91
const cx = SIZE / 2;
const cy = SIZE / 2;
const circumference = 2 * Math.PI * r;
const SWEEP_DEG = 270;
const activeArc = (SWEEP_DEG / 360) * circumference;
const gapArc = circumference - activeArc;
// Rotate so the arc starts at the bottom-left (225° from 12-o-clock = 135° from 3-o-clock)
const ROTATION = 135;

function scoreColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  if (score >= 25) return "#60a5fa";
  return "#22c55e";
}

interface DangerScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  animated?: boolean;
}

export function DangerScoreGauge({
  score,
  riskLevel,
  animated = true,
}: DangerScoreGaugeProps) {
  const color = scoreColor(score);
  const scoreArc = activeArc * (score / 100);
  const initialDash = `0 ${circumference}`;
  const finalDash = `${scoreArc} ${circumference - scoreArc}`;

  const LEVEL_COLORS: Record<RiskLevel, string> = {
    Normal: "#22c55e",
    Watch: "#60a5fa",
    Elevated: "#f59e0b",
    "High Risk": "#ef4444",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-label={`Danger Score ${score} of 100 — ${riskLevel}`}
      >
        {/* Background track */}
        <circle
          r={r}
          cx={cx}
          cy={cy}
          fill="none"
          stroke="#1f2937"
          strokeWidth={STROKE}
          strokeDasharray={`${activeArc} ${gapArc}`}
          strokeLinecap="round"
          transform={`rotate(${ROTATION} ${cx} ${cy})`}
        />

        {/* Scored arc */}
        {animated ? (
          <motion.circle
            r={r}
            cx={cx}
            cy={cy}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            transform={`rotate(${ROTATION} ${cx} ${cy})`}
            initial={{ strokeDasharray: initialDash }}
            animate={{ strokeDasharray: finalDash }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          />
        ) : (
          <circle
            r={r}
            cx={cx}
            cy={cy}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={finalDash}
            transform={`rotate(${ROTATION} ${cx} ${cy})`}
          />
        )}

        {/* Score number */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="42"
          fontWeight="700"
          fontFamily="var(--font-space-grotesk)"
        >
          {score}
        </text>

        {/* /100 label */}
        <text
          x={cx}
          y={cy + 22}
          textAnchor="middle"
          fill="#4b5563"
          fontSize="13"
          fontFamily="monospace"
        >
          / 100
        </text>
      </svg>

      {/* Risk level badge */}
      <div
        className="rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide"
        style={{
          borderColor: `${LEVEL_COLORS[riskLevel]}30`,
          backgroundColor: `${LEVEL_COLORS[riskLevel]}12`,
          color: LEVEL_COLORS[riskLevel],
        }}
      >
        {riskLevel}
      </div>
    </div>
  );
}
