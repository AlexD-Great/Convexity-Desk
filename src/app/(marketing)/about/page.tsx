export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        About
      </h1>
      <p className="text-[#9ca3af]">/about — Route active ✓</p>
      <p className="text-[#9ca3af] text-sm">
        Phase 12 will build this page: product vision, SoSoValue Buildathon context.
      </p>
    </main>
  );
}
