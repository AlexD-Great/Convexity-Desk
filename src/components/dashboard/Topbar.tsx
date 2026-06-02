"use client";

import { usePathname } from "next/navigation";
import { Menu, Wallet } from "lucide-react";
import { ApiStatusBadge } from "./ApiStatusBadge";

const PAGE_TITLES: Record<string, string> = {
  "/app": "Overview",
  "/app/portfolio": "Portfolio",
  "/app/scan": "Risk Scan",
  "/app/hedge": "Hedge Plan",
  "/app/outcomes": "Outcome Ledger",
  "/app/settings": "Settings",
};

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#1f2937] bg-[#0b1020] px-4 sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-md text-[#9ca3af] hover:bg-[#1f2937] hover:text-white transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <h1
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* API status */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-[#1f2937] bg-[#111827] px-2.5 py-1.5">
          <ApiStatusBadge />
        </div>

        {/* Market status placeholder */}
        <div className="hidden md:flex items-center gap-1.5 rounded-md border border-[#1f2937] bg-[#111827] px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
          <span className="font-mono text-[10px] uppercase tracking-wide text-[#f59e0b]">
            Fallback
          </span>
        </div>

        {/* Connect wallet placeholder (Wave 3) */}
        <button
          disabled
          title="Wallet connection available in Wave 3"
          className="flex items-center gap-2 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-1.5 text-xs text-[#6b7280] cursor-not-allowed opacity-60"
        >
          <Wallet className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </button>
      </div>
    </header>
  );
}
