import Link from "next/link";
import { Shield } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Badge } from "@/components/shared/Badge";

const LINKS = {
  Product: [
    { label: "Portfolio", href: "/app/portfolio" },
    { label: "Risk Scan", href: "/app/scan" },
    { label: "Hedge Plan", href: "/app/hedge" },
    { label: "Outcome Ledger", href: "/app/outcomes" },
    { label: "Methodology", href: "/methodology" },
  ],
  Resources: [
    { label: "Docs", href: "/docs" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
    { label: "Design System", href: "/design-system" },
  ],
  Ecosystem: [
    { label: "SoSoValue", href: "https://sosovalue.com" },
    { label: "SoDEX", href: "#" },
    { label: "SSI Index", href: "#" },
    { label: "ValueChain", href: "#" },
  ],
  Buildathon: [
    { label: "Wave 2", href: "/docs" },
    { label: "Wave 3 Roadmap", href: "/docs" },
    { label: "GitHub", href: "https://github.com/AlexD-Great/Convexity-Desk" },
    { label: "Architecture", href: "/docs" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1f2937] bg-[#0b1020]">
      <Container>
        {/* Main footer grid */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
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
            <p className="text-xs leading-relaxed text-[#6b7280] max-w-[180px]">
              Portfolio protection infrastructure for on-chain finance.
            </p>
            <div className="flex flex-col gap-1.5">
              <Badge variant="demo" dot>Demo Mode Active</Badge>
              <Badge variant="primary">Wave 2</Badge>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#9ca3af]">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#6b7280] transition-colors hover:text-white"
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[#1f2937] py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs text-[#4b5563]">
              © 2026 Convexity Desk
            </p>
            <span className="text-[#374151]">·</span>
            <p className="font-mono text-xs text-[#4b5563]">
              Built for SoSoValue Buildathon
            </p>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed text-[#4b5563]">
            Convexity Desk is a hackathon prototype. It is not financial advice. All hedge plans are for research,
            simulation, or testnet demonstration unless clearly stated otherwise.
          </p>
        </div>
      </Container>
    </footer>
  );
}
