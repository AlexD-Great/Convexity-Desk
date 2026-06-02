import { Settings, Wallet, Radio, Shield } from "lucide-react";
import { CardShell } from "@/components/shared/CardShell";
import { Badge } from "@/components/shared/Badge";

const SETTINGS_GROUPS = [
  {
    title: "App Mode",
    icon: Radio,
    items: [
      { label: "Current Mode", value: "Demo", badge: "demo" as const },
      { label: "SoSoValue API", value: "Not configured", badge: "fallback" as const },
      { label: "SoDEX API", value: "Not configured", badge: "fallback" as const },
    ],
  },
  {
    title: "Risk Preferences",
    icon: Shield,
    items: [
      { label: "Risk Profile", value: "Balanced", badge: "default" as const },
      { label: "Max Hedge Size", value: "45% of portfolio", badge: "default" as const },
      { label: "Max Slippage", value: "25 bps", badge: "default" as const },
    ],
  },
  {
    title: "Wallet",
    icon: Wallet,
    items: [
      { label: "Status", value: "Not connected", badge: "default" as const },
      { label: "Chain", value: "—", badge: "default" as const },
      { label: "Wallet Connect", value: "Wave 3 feature", badge: "default" as const },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <h2
          className="text-xl font-bold text-white"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Settings
        </h2>
        <Badge variant="default">Phase 12 will make these interactive</Badge>
      </div>

      <div className="space-y-4">
        {SETTINGS_GROUPS.map(({ title, icon: Icon, items }) => (
          <CardShell key={title} variant="elevated" className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#1f2937] bg-[#111827]">
                <Icon className="h-3.5 w-3.5 text-[#9ca3af]" />
              </div>
              <p
                className="text-sm font-semibold text-white"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {title}
              </p>
            </div>
            <div className="divide-y divide-[#1f2937]">
              {items.map(({ label, value, badge }) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <p className="text-sm text-[#9ca3af]">{label}</p>
                  <Badge variant={badge}>{value}</Badge>
                </div>
              ))}
            </div>
          </CardShell>
        ))}
      </div>

      <CardShell variant="default" padding="sm">
        <p className="text-xs text-[#6b7280]">
          <span className="text-[#9ca3af] font-medium">Settings are read-only in Phase 5.</span>
          {" "}Interactive toggles, API key input, risk preference sliders, and alert configuration
          will be added in Phase 12.
        </p>
      </CardShell>
    </div>
  );
}
