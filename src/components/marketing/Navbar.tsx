"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { SecondaryButton } from "@/components/shared/SecondaryButton";

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Methodology", href: "/methodology" },
  { label: "Docs", href: "/docs" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[#1f2937] bg-[#05070d]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#7cffb2]/25 bg-[#7cffb2]/10 transition-colors group-hover:bg-[#7cffb2]/15">
              <Shield className="h-3.5 w-3.5 text-[#7cffb2]" />
            </div>
            <span
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Convexity<span className="text-[#7cffb2]">Desk</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-4 py-2 text-sm text-[#9ca3af] transition-colors hover:bg-[#1f2937]/60 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <SecondaryButton href="/app" size="sm" variant="ghost">
              View Demo
            </SecondaryButton>
            <PrimaryButton href="/app" size="sm">
              Launch Desk
            </PrimaryButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-[#9ca3af] transition-colors hover:bg-[#1f2937] hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#1f2937] bg-[#05070d]/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-[#9ca3af] transition-colors hover:bg-[#1f2937] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t border-[#1f2937] pt-3 mt-2">
              <SecondaryButton
                href="/app"
                size="md"
                variant="outline"
                className="w-full justify-center"
              >
                View Demo
              </SecondaryButton>
              <PrimaryButton href="/app" size="md" className="w-full justify-center">
                Launch Desk
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
