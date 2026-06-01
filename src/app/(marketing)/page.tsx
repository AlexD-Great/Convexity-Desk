export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-3">
        <p className="text-sm font-mono text-[#7cffb2] tracking-widest uppercase">
          Phase 1 — Project Setup
        </p>
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Convexity Desk
        </h1>
        <p className="text-[#9ca3af] text-lg max-w-md">
          Protect your crypto portfolio before the drawdown becomes obvious.
        </p>
      </div>
      <div className="flex gap-3 text-sm text-[#9ca3af]">
        <span>/ — Landing</span>
        <span>·</span>
        <span>Route active ✓</span>
      </div>
    </main>
  );
}
