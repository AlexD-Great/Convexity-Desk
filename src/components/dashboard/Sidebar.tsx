"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  ScanLine,
  ShieldCheck,
  ClipboardList,
  Settings,
  BookOpen,
  Shield,
  X,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { label: "Overview", href: "/app", icon: LayoutDashboard, exact: true },
  { label: "Portfolio", href: "/app/portfolio", icon: BarChart3 },
  { label: "Risk Scan", href: "/app/scan", icon: ScanLine },
  { label: "Hedge Plan", href: "/app/hedge", icon: ShieldCheck },
  { label: "Outcome Ledger", href: "/app/outcomes", icon: ClipboardList },
];

const SECONDARY_NAV = [
  { label: "Methodology", href: "/methodology", icon: BookOpen },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

function NavItem({
  label,
  href,
  icon: Icon,
  exact,
  onClick,
}: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-[#7cffb2]/10 text-white border border-[#7cffb2]/15"
          : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-white border border-transparent"
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-[#7cffb2]" : "text-[#6b7280]")}
      />
      {label}
    </Link>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-[#1f2937] px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7cffb2]/25 bg-[#7cffb2]/10">
            <Shield className="h-3.5 w-3.5 text-[#7cffb2]" />
          </div>
          <span
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Convexity<span className="text-[#7cffb2]">Desk</span>
          </span>
        </Link>
        {/* Mobile close */}
        <button
          onClick={onClose}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Mode badge */}
      <div className="px-4 py-3 border-b border-[#1f2937]">
        <div className="flex items-center gap-2 rounded-lg border border-[#7cffb2]/15 bg-[#7cffb2]/[0.06] px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7cffb2] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#7cffb2]">
            Demo Mode
          </span>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 font-mono text-[9px] uppercase tracking-widest text-[#4b5563]">
          Navigation
        </p>
        {PRIMARY_NAV.map((item) => (
          <NavItem key={item.href} {...item} onClick={onClose} />
        ))}

        <div className="pt-4">
          <p className="px-3 pb-2 font-mono text-[9px] uppercase tracking-widest text-[#4b5563]">
            More
          </p>
          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.href} {...item} onClick={onClose} />
          ))}
        </div>
      </nav>

      {/* Bottom: wallet placeholder */}
      <div className="border-t border-[#1f2937] p-3">
        <div className="flex items-center gap-3 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-2.5">
          <Wallet className="h-4 w-4 text-[#6b7280] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-[#9ca3af]">No wallet connected</p>
            <p className="font-mono text-[10px] text-[#4b5563]">Wave 3 feature</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[#1f2937] bg-[#0b1020]">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-[#1f2937] bg-[#0b1020] lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
