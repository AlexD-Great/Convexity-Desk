export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        Settings
      </h1>
      <p className="text-[#9ca3af] text-sm">/app/settings — Route active ✓ — Phase 12 will build this screen</p>
      <div className="rounded-lg border border-[#1f2937] bg-[#0b1020] p-6 text-center text-[#9ca3af] text-sm">
        API mode toggle, SoSoValue/SoDEX status, wallet status, risk preferences coming in Phase 12.
      </div>
    </div>
  );
}
