export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#05070d]">
      {/* Sidebar placeholder — Phase 5 */}
      <aside className="w-64 shrink-0 border-r border-[#1f2937] bg-[#0b1020] flex flex-col p-4 gap-2">
        <div className="py-4 border-b border-[#1f2937] mb-2">
          <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Convexity Desk
          </p>
          <p className="text-xs text-[#7cffb2] font-mono mt-1">DEMO MODE</p>
        </div>
        {[
          ["Overview", "/app"],
          ["Portfolio", "/app/portfolio"],
          ["Risk Scan", "/app/scan"],
          ["Hedge Plan", "/app/hedge"],
          ["Outcome Ledger", "/app/outcomes"],
          ["Settings", "/app/settings"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="px-3 py-2 rounded-md text-sm text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
          >
            {label}
          </a>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar placeholder — Phase 5 */}
        <header className="h-14 border-b border-[#1f2937] bg-[#0b1020] flex items-center justify-between px-6">
          <p className="text-xs text-[#9ca3af]">Dashboard Shell — Phase 1 Placeholder</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-[#1f2937] text-[#7cffb2] font-mono">
              DEMO
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-[#1f2937] text-[#9ca3af] font-mono">
              FALLBACK
            </span>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
