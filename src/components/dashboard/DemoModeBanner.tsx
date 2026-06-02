import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function DemoModeBanner() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#7cffb2]/10 bg-[#7cffb2]/[0.04] px-6 py-2.5">
      <div className="flex items-center gap-2.5 min-w-0">
        <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[#7cffb2]" />
        <p className="font-mono text-xs text-[#7cffb2] truncate">
          Demo Mode Active
          <span className="text-[#9ca3af] ml-2 hidden sm:inline">
            — using demo portfolio data. SoSoValue and SoDEX returning fallback data.
          </span>
        </p>
      </div>
      <Link
        href="/app/settings"
        className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[#7cffb2]/60 hover:text-[#7cffb2] transition-colors"
      >
        Settings →
      </Link>
    </div>
  );
}
