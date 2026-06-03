"use client";

import { useEffect, useState } from "react";
import type { AdapterResponse, EvidenceCard } from "@/types";
import type { SoSoValueIntelligence } from "@/lib/adapters/sosovalue";
import { Badge } from "@/components/shared/Badge";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS: Record<EvidenceCard["severity"], string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#9ca3af",
};

const SENTIMENT_VARIANTS: Record<
  NonNullable<EvidenceCard["sentiment"]>,
  Parameters<typeof Badge>[0]["variant"]
> = {
  bearish: "danger",
  bullish: "success",
  neutral: "default",
};

const SOURCE_VARIANTS: Record<EvidenceCard["source"], Parameters<typeof Badge>[0]["variant"]> = {
  SoSoValue: "blue",
  SoDEX: "primary",
  Internal: "default",
  Mock: "mock",
};

function EvidenceCardItem({ card }: { card: EvidenceCard }) {
  const dotColor = SEVERITY_COLORS[card.severity];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 transition-colors",
        card.severity === "high"
          ? "border-[#ef4444]/15 bg-[#ef4444]/[0.03] hover:bg-[#ef4444]/[0.06]"
          : card.severity === "medium"
          ? "border-[#f59e0b]/15 bg-[#f59e0b]/[0.03] hover:bg-[#f59e0b]/[0.06]"
          : "border-[#1f2937] bg-[#111827] hover:bg-[#1a2436]"
      )}
    >
      {/* Severity dot */}
      <div
        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: dotColor }}
      />

      <div className="min-w-0 flex-1 space-y-2">
        {/* Title + link */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug text-white">
            {card.title}
          </p>
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 shrink-0 text-[#6b7280] hover:text-[#9ca3af] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-[#9ca3af]">
          {card.description}
        </p>

        {/* Footer: badges + timestamp */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={SOURCE_VARIANTS[card.source]}>{card.source}</Badge>
          {card.sentiment && (
            <Badge variant={SENTIMENT_VARIANTS[card.sentiment]}>
              {card.sentiment}
            </Badge>
          )}
          {card.asset && (
            <Badge variant="default">{card.asset}</Badge>
          )}
          {card.category && (
            <Badge variant="default">{card.category}</Badge>
          )}
          <span className="ml-auto font-mono text-[10px] text-[#4b5563]">
            {new Date(card.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function EvidenceCardList() {
  const [data, setData] = useState<AdapterResponse<SoSoValueIntelligence> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence/sosovalue")
      .then((r) => r.json())
      .then((json: AdapterResponse<SoSoValueIntelligence>) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-[#111827]" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-xs text-[#6b7280]">Intelligence data unavailable.</p>
    );
  }

  const { evidenceCards, narrativePressureScore, institutionalFlowScore, sentimentSummary } =
    data.data;
  const modeVariant = data.mode === "live" ? "live" : data.mode === "error" ? "danger" : "fallback";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
            SoSoValue Intelligence
          </p>
          <p className="mt-0.5 text-xs text-[#9ca3af]">{sentimentSummary}</p>
        </div>
        <Badge variant={modeVariant} dot>
          {data.mode === "live" ? "Live" : data.mode === "error" ? "Error" : "Fallback"}
        </Badge>
      </div>

      {/* Pressure scores */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Narrative Pressure", score: narrativePressureScore },
          { label: "Institutional Flow", score: institutionalFlowScore },
        ].map(({ label, score }) => {
          const color = score >= 70 ? "#ef4444" : score >= 50 ? "#f59e0b" : "#22c55e";
          return (
            <div key={label} className="rounded-lg border border-[#1f2937] bg-[#111827] p-3 space-y-1.5">
              <p className="font-mono text-[10px] text-[#6b7280]">{label}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[#1f2937]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: color, opacity: 0.8 }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold" style={{ color }}>
                  {score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evidence cards */}
      <div className="space-y-2">
        {evidenceCards.map((card) => (
          <EvidenceCardItem key={card.id} card={card} />
        ))}
      </div>

      {/* Fallback notice */}
      {data.mode === "fallback" && (
        <p className="font-mono text-[10px] text-[#6b7280]">
          Fallback data — set SOSOVALUE_API_KEY in .env.local for live intelligence.
        </p>
      )}
    </div>
  );
}
