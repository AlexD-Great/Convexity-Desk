"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PortfolioAsset } from "@/types";

const ASSET_COLORS: Record<string, string> = {
  BTC: "#f59e0b",
  ETH: "#60a5fa",
  SOL: "#a78bfa",
  SOSO: "#7cffb2",
  USDC: "#22c55e",
};

function fallbackColor(index: number) {
  const palette = ["#f59e0b", "#60a5fa", "#a78bfa", "#7cffb2", "#22c55e", "#ec4899", "#14b8a6"];
  return palette[index % palette.length];
}

interface TooltipPayload {
  name: string;
  value: number;
  payload: { weight: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: item } = payload[0];
  return (
    <div className="rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2 shadow-xl">
      <p className="font-mono text-xs font-semibold text-white">{name}</p>
      <p className="font-mono text-xs text-[#9ca3af]">${value.toLocaleString()}</p>
      <p className="font-mono text-xs text-[#6b7280]">{item.weight}% of portfolio</p>
    </div>
  );
}

interface AllocationChartProps {
  assets: PortfolioAsset[];
}

export function AllocationChart({ assets }: AllocationChartProps) {
  const data = assets.map((a) => ({
    name: a.symbol,
    value: a.valueUsd,
    weight: a.weight,
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={ASSET_COLORS[entry.name] ?? fallbackColor(i)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {assets.map((a, i) => (
          <div key={a.symbol} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: ASSET_COLORS[a.symbol] ?? fallbackColor(i) }}
            />
            <span className="font-mono text-xs text-[#9ca3af]">
              {a.symbol}{" "}
              <span className="text-white">{a.weight}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
