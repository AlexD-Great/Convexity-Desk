import { Badge } from "@/components/shared/Badge";

const RISK_FACTORS = [
  { label: "Institutional Flow", score: 81, color: "#ef4444" },
  { label: "Narrative Pressure", score: 74, color: "#ef4444" },
  { label: "Portfolio Conc.", score: 68, color: "#f59e0b" },
  { label: "Microstructure", score: 62, color: "#f59e0b" },
];

const EVIDENCE = [
  { severity: "high" as const, text: "BTC ETF outflows accelerating", source: "SoSoValue" },
  { severity: "medium" as const, text: "SoDEX spread widening 2.3×", source: "SoDEX" },
  { severity: "high" as const, text: "BTC concentration 43.2% above threshold", source: "Internal" },
];

const PORTFOLIO = [
  { symbol: "BTC", weight: 43.2, color: "#f59e0b" },
  { symbol: "ETH", weight: 21.5, color: "#60a5fa" },
  { symbol: "SOL", weight: 11.9, color: "#a78bfa" },
  { symbol: "USDC", weight: 18.0, color: "#22c55e" },
];

export function HeroDashboardPreview() {
  return (
    <div className="relative">
      {/* Ambient glow behind card */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,255,178,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Main card */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1f2937] bg-[#0b1020] shadow-2xl">

        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-[#1f2937] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/60" />
            </div>
            <span className="font-mono text-[11px] text-[#6b7280]">
              convexity-desk · risk-scan
            </span>
          </div>
          <Badge variant="demo" dot>
            DEMO
          </Badge>
        </div>

        <div className="p-4 space-y-4">

          {/* Danger Score row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
                Danger Score
              </p>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span
                  className="text-[42px] font-bold leading-none text-[#ef4444]"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  78
                </span>
                <span className="text-lg text-[#4b5563]">/100</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge variant="danger" dot>
                HIGH RISK
              </Badge>
              <p className="font-mono text-[10px] text-[#6b7280]">
                Hedge 35% BTC beta
              </p>
            </div>
          </div>

          {/* Overall bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
            <div
              className="h-full rounded-full"
              style={{
                width: "78%",
                background: "linear-gradient(to right, #f59e0b, #ef4444)",
              }}
            />
          </div>

          {/* Risk factors */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Risk Breakdown
            </p>
            {RISK_FACTORS.map(({ label, score, color }) => (
              <div key={label} className="flex items-center gap-3">
                <p className="w-32 shrink-0 text-[11px] text-[#9ca3af]">{label}</p>
                <div className="flex-1 h-1 overflow-hidden rounded-full bg-[#1f2937]">
                  <div
                    className="h-full rounded-full opacity-70"
                    style={{ width: `${score}%`, backgroundColor: color }}
                  />
                </div>
                <p className="w-5 text-right font-mono text-[11px] text-white">{score}</p>
              </div>
            ))}
          </div>

          {/* Portfolio exposure */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Portfolio Exposure
            </p>
            <div className="flex h-2 w-full overflow-hidden rounded-full">
              {PORTFOLIO.map(({ symbol, weight, color }) => (
                <div
                  key={symbol}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ width: `${weight}%`, backgroundColor: color }}
                  title={`${symbol} ${weight}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {PORTFOLIO.map(({ symbol, weight, color }) => (
                <div key={symbol} className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-mono text-[11px] text-[#9ca3af]">
                    {symbol}{" "}
                    <span className="text-white">{weight}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div className="space-y-1.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
              Evidence ({EVIDENCE.length})
            </p>
            {EVIDENCE.map(({ severity, text, source }) => (
              <div
                key={text}
                className="flex items-start gap-2 rounded-lg bg-[#111827] px-3 py-2"
              >
                <div
                  className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                    severity === "high" ? "bg-[#ef4444]" : "bg-[#f59e0b]"
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-white">{text}</p>
                  <p className="font-mono text-[10px] text-[#6b7280]">{source}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hedge recommendation */}
          <div className="rounded-xl border border-[#7cffb2]/20 bg-[#7cffb2]/[0.04] p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#7cffb2]">
                Hedge Plan
              </p>
              <Badge variant="primary">82% confidence</Badge>
            </div>
            <p className="text-sm font-semibold text-white">
              Short BTC-PERP / USDC
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-mono text-[11px] text-[#9ca3af]">$12,000</span>
              <span className="text-[#374151]">·</span>
              <span className="font-mono text-[11px] text-[#7cffb2]">42% coverage</span>
              <span className="text-[#374151]">·</span>
              <span className="font-mono text-[11px] text-[#9ca3af]">12 bps slippage</span>
            </div>
          </div>

          {/* Status footer */}
          <div className="flex items-center justify-between border-t border-[#1f2937] pt-3">
            <Badge variant="fallback" dot>
              Fallback Mode
            </Badge>
            <p className="font-mono text-[10px] text-[#6b7280]">
              SoSoValue · SoDEX
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
