"use client";

import { useEffect, useState } from "react";
import type { AdapterResponse } from "@/types";
import type { SoDEXMarketData } from "@/lib/adapters/sodex";
import { Badge } from "@/components/shared/Badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

function StressBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "#ef4444" : score >= 50 ? "#f59e0b" : "#22c55e";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#1f2937]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color, opacity: 0.8 }}
        />
      </div>
      <span className="font-mono text-xs" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export function SoDEXMarketPreview() {
  const [data, setData] = useState<AdapterResponse<SoDEXMarketData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/market/sodex")
      .then((r) => r.json())
      .then((json: AdapterResponse<SoDEXMarketData>) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-[#111827]" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-xs text-[#6b7280]">Market data unavailable.</p>
    );
  }

  const { markets, overallMicrostructureStress } = data.data;
  const modeVariant =
    data.mode === "live" ? "live" : data.mode === "error" ? "danger" : "fallback";

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
            SoDEX Market Data
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">
            Microstructure stress:{" "}
            <span
              className="font-semibold"
              style={{
                color:
                  overallMicrostructureStress >= 70
                    ? "#ef4444"
                    : overallMicrostructureStress >= 50
                    ? "#f59e0b"
                    : "#22c55e",
              }}
            >
              {overallMicrostructureStress} / 100
            </span>
          </p>
        </div>
        <Badge variant={modeVariant} dot>
          {data.mode === "live" ? "Live" : data.mode === "error" ? "Error" : "Fallback"}
        </Badge>
      </div>

      {/* Market rows */}
      <div className="space-y-2">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className="flex items-center justify-between rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2.5"
          >
            {/* Left: symbol + price */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-white">
                  {market.symbol}
                </p>
                <p className="font-mono text-[10px] text-[#6b7280]">
                  ${market.lastPrice.toLocaleString()}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-0.5 font-mono text-[10px]",
                  market.priceChangePercent >= 0
                    ? "text-[#22c55e]"
                    : "text-[#ef4444]"
                )}
              >
                {market.priceChangePercent >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {market.priceChangePercent >= 0 ? "+" : ""}
                {market.priceChangePercent}%
              </div>
            </div>

            {/* Right: spread + stress */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <p className="font-mono text-[10px] text-[#6b7280]">
                Spread{" "}
                <span
                  className={cn(
                    "font-semibold",
                    market.spreadMultiple >= 2
                      ? "text-[#ef4444]"
                      : market.spreadMultiple >= 1.5
                      ? "text-[#f59e0b]"
                      : "text-[#9ca3af]"
                  )}
                >
                  {market.spreadBps} bps
                </span>
                {market.spreadMultiple > 1.5 && (
                  <span className="text-[#ef4444]">
                    {" "}({market.spreadMultiple}× avg)
                  </span>
                )}
              </p>
              <StressBar score={market.microstructureStress} />
            </div>
          </div>
        ))}
      </div>

      {/* Fallback notice */}
      {data.mode === "fallback" && (
        <p className="text-[10px] text-[#6b7280] font-mono">
          {data.reason ?? "Fallback data - SoDEX public/testnet market read failed."}
        </p>
      )}
      {data.mode === "live" && data.endpoint && (
        <p className="break-all font-mono text-[10px] text-[#6b7280]">
          Live unsigned public read: {data.endpoint}
        </p>
      )}
    </div>
  );
}
