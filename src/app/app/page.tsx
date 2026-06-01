export default function AppOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Overview
        </h1>
        <p className="text-[#9ca3af] text-sm mt-1">/app — Route active ✓ — Phase 5 will build this screen</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Portfolio Value", value: "$42,850", color: "text-white" },
          { label: "Danger Score", value: "78 / 100", color: "text-[#ef4444]" },
          { label: "Hedge Coverage", value: "22%", color: "text-[#f59e0b]" },
          { label: "Top Risk Driver", value: "ETF Outflow", color: "text-[#60a5fa]" },
        ].map((card) => (
          <div key={card.label} className="rounded-lg border border-[#1f2937] bg-[#0b1020] p-4 space-y-1">
            <p className="text-xs text-[#9ca3af] uppercase tracking-wide">{card.label}</p>
            <p className={`text-lg font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#1f2937] bg-[#0b1020] p-6 text-center text-[#9ca3af] text-sm">
        Full dashboard with charts, risk factor cards, and live scan CTA coming in Phase 5.
      </div>
    </div>
  );
}
