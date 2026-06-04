# Convexity Desk

> **Protect your crypto portfolio before the drawdown becomes obvious.**

Convexity Desk is a portfolio-protection and hedge-execution desk for crypto traders, SSI/index holders, and one-person on-chain fund managers. It reads a user's holdings, analyses market stress using SoSoValue intelligence and SoDEX market structure, then generates a clear, approval-gated hedge plan that can be previewed and later executed on SoDEX testnet.

---

## Current Build Phase

**Phase 12 — Methodology, Docs, and Settings Pages** *(complete)*

`/methodology` now explains the five-factor Danger Score, factor sources, risk bands, hedge sizing logic, execution-preview assumptions, safety controls, and data-mode transparency. `/docs` now documents the runtime architecture, internal API routes, demo pipeline, env groups, live/fallback/demo semantics, and Wave 2 limitations. `/about` now presents the product thesis, target users, design principles, build status, and Wave 3 roadmap. `/app/settings` is now an interactive client screen with `/api/status` integration, local app mode controls, risk profile selection, max hedge/slippage sliders, alert toggles, wallet/testnet placeholders, and Wave 3 persistence notes. Stale Phase 5/Phase 12 copy cleaned up. Production build passes.

**Phase 11 — Confirmation Gate and Outcome Ledger** *(complete)*

`ConfirmationGate` — 3 required checkboxes, hedge summary strip, danger score context, progressive unlock, disclaimer. `OutcomeLedgerTable` — sortable by date, status badge per row, coverage before→after, order ID, notes. `/api/hedge/confirm` creates `OutcomeLedgerEntry` (status: pending, simulated, SIM-xxx order ID). `/api/outcomes` returns pre-seeded demo entries (avoided_loss, useful, neutral) plus session entries. `/app/outcomes` — metric cards, status filter tabs, full ledger table, persistence notice. `/app/hedge` updated with gate → confirmed state → outcome link. 0 TS errors.

`src/lib/hedge/hedge-composer.ts` — instrument selection, danger score multiplier, hedge sizing (rounds to $1K), coverage % (hedge/hedgeable exposure), confidence score, rationale + risk builder, execution preview from SoDEX market data. `/api/hedge/generate` runs full pipeline (scan → compose → preview) in one POST. `/api/hedge/preview` refreshes preview only. `HedgePlanCard` (instrument, direction badge, size/coverage/confidence metric tiles, rationale, risks, stop condition). `ExecutionPreviewCard` (data rows, liquidity bar, categorised warnings). Full interactive `/app/hedge`: idle → generating → results (scan strip + gauge + plan + preview + confirm CTA) → error. 0 TS errors.

`src/lib/risk/convexity-score.ts` — deterministic 5-factor Danger Score (instFlow×0.30 + narrative×0.20 + concentration×0.25 + microstructure×0.15 + eventProximity×0.10). Each factor has its own calculator, explanation generator, and evidence linker. `/api/scan/run` runs all adapters in parallel and returns `{ scan, evidenceCards, dataMode }`. `DangerScoreGauge` (animated SVG arc, 270° sweep), `RiskFactorCard` (score bar + explanation + contribution pts). Full interactive `/app/scan`: idle → scanning (animated steps) → results (gauge + 5 factor cards + evidence grid + hedge CTA) → error state. 0 TS errors.

`src/lib/adapters/sosovalue.ts` — tries live fetch from SOSOVALUE_API_KEY + BASE_URL (4 news endpoint patterns, 6 s timeout, 2 min cache), keyword-based sentiment scoring, normalises into `EvidenceCard[]`. 6-card typed fallback. `computeNarrativePressure` and `computeInstitutionalFlowPressure` exported for Phase 9 risk engine. `/api/intelligence/sosovalue` and `/api/status` both updated. `EvidenceCardList` client component with severity colouring, sentiment/source badges, and pressure score bars on `/app/scan`. 0 TS errors.

Demo portfolio data in `src/lib/data/demo-portfolio.ts`. `/api/portfolio/demo` returns live data. `/app/portfolio` shows concentration warning, 4 metric cards, Recharts donut allocation chart with custom legend, exposure buckets panel (5 buckets with progress bars), and full asset table (amount, price, value, weight bar, risk contribution, beta bucket badge, hedgeable icon). 0 TS errors.

---

## Project Status

| Item | Status |
|------|--------|
| Planning docs | ✅ Complete |
| Project setup (Next.js) | ✅ Complete |
| Design system | ✅ Complete |
| Landing page (header + hero) | ✅ Complete |
| Landing page (story sections) | ✅ Complete |
| Dashboard shell | ✅ Complete |
| Portfolio module | ✅ Complete |
| SoDEX adapter | ✅ Complete |
| SoDEX adapter | ✅ Complete |
| SoSoValue adapter | ✅ Complete |
| Risk scan engine | ✅ Complete |
| Hedge composer | ✅ Complete |
| Confirmation + ledger | ✅ Complete |
| Methodology + docs | ✅ Complete |
| Wave 2 polish + deploy | ⏳ Pending — Phase 13 |

---

## Product Thesis

Most crypto tools tell users what to buy next. Convexity Desk focuses on what users **already hold**.

The core question is:

> "Given my current portfolio, what downside risk is building, what evidence supports that risk, and what is the cleanest hedge I can take before the market moves against me?"

The core product flow is:

**Portfolio → Risk Scan → Evidence → Hedge Plan → Execution Preview → Confirmation → Outcome Tracking**

---

## Target Users

1. **Crypto spot traders** — holding BTC, ETH, SOL, SOSO, or other assets who want to know when to reduce risk or hedge
2. **SSI/index holders** — holding thematic crypto baskets who need protection when a full sector weakens
3. **One-person fund managers** — solo traders managing portfolios who need a professional risk layer
4. **Signal group admins** — people checking whether an existing exposure is dangerous before recommending action

---

## Completed Features

- [x] README.md — single source of truth
- [x] WAVE_PROGRESS.md — hackathon progress tracker
- [x] ARCHITECTURE.md — system architecture overview
- [x] docs/PRD.md — full product requirements document
- [x] .env.example — all environment variables documented
- [x] Next.js 16.2.7 with App Router initialized
- [x] TypeScript strict mode configured
- [x] Tailwind CSS v4 configured
- [x] shadcn/ui initialized (Tailwind v4 compatible)
- [x] lucide-react, recharts, framer-motion, clsx, tailwind-merge, cva, zod installed
- [x] Convexity Desk dark theme set in globals.css
- [x] Space Grotesk heading font configured
- [x] All 22 routes created (5 marketing + 6 app + 10 API + 1 404)
- [x] Core TypeScript types defined in src/types/index.ts
- [x] .gitignore configured
- [x] Production build passes: 0 TypeScript errors, 0 build errors
- [x] Design system: Container, Section, SectionHeader, Badge (10 variants), PrimaryButton, SecondaryButton, CardShell (5 variants), GradientText
- [x] Barrel export via src/components/shared/index.ts
- [x] /design-system preview page for visual verification
- [x] Navbar — sticky, scroll-triggered backdrop blur, logo, nav links, mobile hamburger
- [x] HeroDashboardPreview — realistic fake dashboard (Danger Score, risk factors, portfolio exposure, evidence, hedge plan)
- [x] HeroSection — full-viewport, background glows + dot grid, framer-motion stagger, split layout
- [x] Landing page at / wired up with Navbar + HeroSection
- [x] DashboardShell (Sidebar + Topbar + DemoModeBanner + main area)
- [x] Sidebar — logo, active nav links (usePathname), demo mode badge, wallet placeholder
- [x] Topbar — page title, ApiStatusBadge (fetches /api/status), fallback badge, wallet button
- [x] MetricCard — reusable dashboard metric component
- [x] DemoModeBanner — persistent demo mode notice with settings link
- [x] ApiStatusBadge — client component fetching /api/status
- [x] /app overview with metric cards, risk snapshot, action prompt, quick links
- [x] All /app/* screens updated with structured empty states
- [x] src/lib/data/demo-portfolio.ts — demo portfolio data (BTC/ETH/SOL/SOSO/USDC)
- [x] /api/portfolio/demo — returns typed Portfolio from demo data
- [x] AllocationChart — Recharts PieChart donut with custom tooltip and legend
- [x] /app/portfolio — concentration warning, 4 metric cards, allocation chart, exposure buckets, full asset table

---

## Pending Features

- [ ] Design system primitives (Phase 2)
- [ ] Landing page (public marketing)
- [ ] Dashboard shell (/app layout)
- [ ] Portfolio module with demo data
- [ ] SoDEX market data adapter
- [ ] SoSoValue intelligence adapter
- [ ] Convexity Risk Scan engine (Danger Score)
- [ ] Hedge composer and execution preview
- [ ] Confirmation gate and outcome ledger
- [x] Methodology and docs pages
- [ ] Wave 2 polish and deployment

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.7 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + lucide-react |
| Charts | Recharts |
| Animation | Framer Motion |
| Validation | Zod |
| Wallet (Wave 3) | wagmi + viem |
| Persistence (Wave 3) | Supabase or SQLite |
| Deployment | Vercel |

---

## Architecture Overview

```
convexity-desk/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Public landing pages
│   │   │   ├── page.tsx        # / — Landing
│   │   │   ├── how-it-works/
│   │   │   ├── methodology/
│   │   │   ├── docs/
│   │   │   └── about/
│   │   ├── app/                # Protected dashboard
│   │   │   ├── layout.tsx      # Dashboard shell
│   │   │   ├── page.tsx        # /app — Overview
│   │   │   ├── portfolio/
│   │   │   ├── scan/
│   │   │   ├── hedge/
│   │   │   ├── outcomes/
│   │   │   └── settings/
│   │   └── api/                # Internal API routes
│   │       ├── portfolio/
│   │       ├── scan/
│   │       ├── hedge/
│   │       ├── evidence/
│   │       ├── outcomes/
│   │       ├── market/
│   │       ├── intelligence/
│   │       └── status/
│   ├── components/
│   │   ├── marketing/          # Landing page components
│   │   ├── dashboard/          # Dashboard components
│   │   └── shared/             # Shared UI primitives
│   ├── lib/
│   │   ├── adapters/           # External API adapters
│   │   │   ├── sosovalue.ts
│   │   │   └── sodex.ts
│   │   ├── risk/               # Risk scoring logic
│   │   │   └── convexity-score.ts
│   │   ├── hedge/              # Hedge composition logic
│   │   │   └── hedge-composer.ts
│   │   └── data/               # Demo and fallback data
│   └── types/                  # TypeScript type definitions
├── docs/                       # Project documentation
│   └── PRD.md
├── public/                     # Static assets
├── README.md
├── ARCHITECTURE.md
├── WAVE_PROGRESS.md
├── .env.example
└── .env.local                  # Not committed
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/portfolio/demo` | Returns demo portfolio |
| POST | `/api/scan/run` | Runs Convexity Risk Scan |
| GET | `/api/evidence` | Returns evidence cards for a scan |
| POST | `/api/hedge/generate` | Generates hedge plan from scan |
| POST | `/api/hedge/preview` | Returns SoDEX execution preview |
| POST | `/api/hedge/confirm` | Simulates hedge confirmation (Wave 2) |
| GET | `/api/outcomes` | Returns outcome ledger entries |
| GET | `/api/status` | Returns API integration status |
| GET | `/api/market/sodex` | SoDEX public market data |
| GET | `/api/intelligence/sosovalue` | SoSoValue intelligence data |

---

## App Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/how-it-works` | Product workflow explanation |
| `/methodology` | Danger Score and risk formula |
| `/docs` | API integrations and architecture |
| `/about` | Product vision |
| `/app` | Dashboard overview |
| `/app/portfolio` | Portfolio exposure map |
| `/app/scan` | Run Convexity Risk Scan |
| `/app/hedge` | Hedge recommendation + preview |
| `/app/outcomes` | Outcome ledger |
| `/app/settings` | API mode, alerts, wallet status |

---

## Environment Variables

See `.env.example` for full list. Key variables:

```env
# SoSoValue Integration
SOSOVALUE_API_KEY=
SOSOVALUE_BASE_URL=https://openapi.sosovalue.com

# SoDEX Integration
SODEX_BASE_URL=
SODEX_TESTNET_BASE_URL=
SODEX_API_KEY=

# App Config
NEXT_PUBLIC_APP_MODE=demo
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Data Mode Status

| Integration | Current Mode | Notes |
|-------------|--------------|-------|
| SoSoValue | `fallback` unless API key configured | Adapter live-attempts SoSoValue news endpoints |
| SoDEX Market | `fallback` unless base URL configured | Adapter live-attempts market/ticker endpoints |
| Portfolio Data | `demo` | Static Wave 2 demo portfolio |
| Overall Mode | `demo` or `mixed` | `/api/status` reports live/fallback status |

All live/fallback/mock status will be clearly labelled in the UI once implemented. The app will never claim mock data is live.

---

## Known Issues

- None — all 22 routes build cleanly

---

## Wave 2 Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Planning docs | ✅ Complete |
| 1 | Next.js project setup | ✅ Complete |
| 2 | Design system + layout primitives | ✅ Complete |
| 3 | Landing page — header + hero | ✅ Complete |
| 4 | Landing page — story sections + footer | ✅ Complete |
| 5 | Dashboard shell + navigation | ✅ Complete |
| 6 | Portfolio module with demo data | ✅ Complete |
| 7 | SoDEX market data adapter | ✅ Complete |
| 8 | SoSoValue intelligence adapter | ✅ Complete |
| 9 | Convexity Risk Scan engine | ✅ Complete |
| 10 | Hedge composer + execution preview | ✅ Complete |
| 11 | Confirmation gate + outcome ledger | ✅ Complete |
| 12 | Methodology, docs, and settings pages | ✅ Complete |
| 13 | Wave 2 polish + Vercel deployment | ⏳ Pending |

---

## Wave 3 Roadmap

| Phase | Description |
|-------|-------------|
| W3-1 | Supabase/SQLite persistence layer |
| W3-2 | Wallet connection (wagmi + viem) |
| W3-3 | SoDEX testnet execution path |
| W3-4 | Smart contract layer (HedgeReceiptLogger, RiskPolicyRegistry) |
| W3-5 | Final demo script, architecture diagram, deployment polish |

---

## How to Run Locally

*(Available after Phase 1)*

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

---

## Deployment Notes

- Target: Vercel
- Environment variables must be configured in Vercel dashboard
- Demo mode works without any API keys configured
- Live SoSoValue/SoDEX mode requires valid API keys

---

## Disclaimer

> Convexity Desk is a hackathon prototype. It is not financial advice. All hedge plans are for research, simulation, or testnet demonstration unless clearly stated otherwise. Users are responsible for all trading decisions.

---

## Changelog

| Date | Phase | Description |
|------|-------|-------------|
| 2026-06-01 | Phase 0 | Initialized planning docs — README, WAVE_PROGRESS, ARCHITECTURE, PRD, .env.example |
| 2026-06-01 | Phase 1 | Next.js 16.2.7 project setup — Tailwind v4, shadcn/ui, all packages, 22 routes, TypeScript types, dark theme |
| 2026-06-02 | Phase 2 | Design system — Container, Section, SectionHeader, Badge, PrimaryButton, SecondaryButton, CardShell, GradientText, /design-system preview |
| 2026-06-02 | Phase 3 | Landing page header + hero — Navbar (sticky/blur/mobile), HeroSection (split layout, animations), HeroDashboardPreview (realistic product UI) |
| 2026-06-02 | Phase 4 | Full landing page — ProblemSection, HowItWorksSection, ProductPreviewSection, FeatureGrid, EcosystemSection, ComparisonSection, CTASection, Footer (2026) |
| 2026-06-02 | Phase 5 | Dashboard shell — DashboardShell, Sidebar (active nav), Topbar (API status), DemoModeBanner, MetricCard, all /app/* screens updated |
| 2026-06-02 | Phase 6 | Portfolio module — demo data, /api/portfolio/demo, AllocationChart (Recharts), exposure buckets, asset table, concentration warning |
| 2026-06-02 | Phase 7 | SoDEX adapter — live fetch attempt, 4 endpoint patterns, normaliser, 60s cache, typed fallback, /api/market/sodex, /api/status updated, SoDEXMarketPreview UI |
| 2026-06-02 | Phase 8 | SoSoValue adapter — live fetch (4 patterns, 6s timeout, 2min cache), sentiment scoring, 6-card fallback, /api/intelligence/sosovalue, /api/status updated, EvidenceCardList UI |
| 2026-06-02 | Phase 9 | Risk scan engine — convexity-score.ts (5-factor formula), /api/scan/run, DangerScoreGauge (SVG), RiskFactorCard, full interactive /app/scan (idle/scanning/results/error) |

---

## Next Recommended Build Step

**Phase 13: Wave 2 Polish + Vercel Deployment**

Run final responsive polish, verify all routes, clean remaining documentation drift, and prepare deployment.
