# WAVE_PROGRESS.md — Convexity Desk

> SoSoValue Buildathon — Wave 2 + Wave 3 Progress Tracker

---

## Wave 2 Overview

**Objective:** Build a polished, hackathon-grade portfolio protection desk with real integration effort into the SoSoValue and SoDEX ecosystems. The product must show a complete user flow from portfolio ingestion through risk scan, hedge recommendation, execution preview, confirmation, and outcome tracking.

Wave 2 must not be mock-only. At minimum one genuine live read integration must be attempted with transparent fallback labelling.

---

## Wave 2 Progress

### Phase 0 — Planning Docs ✅ Complete

**Date:** 2026-06-01

**What was done:**
- Created README.md (single source of truth)
- Created WAVE_PROGRESS.md (this file)
- Created ARCHITECTURE.md (system design overview)
- Saved PRD as docs/PRD.md
- Created .env.example with all required environment variables
- Established folder structure plan

**Files created:**
- `README.md`
- `WAVE_PROGRESS.md`
- `ARCHITECTURE.md`
- `docs/PRD.md`
- `.env.example`

**No product code written yet.**

---

### Phase 1 — Project Setup ✅ Complete

**Date:** 2026-06-01

**What was done:**
- Initialized Next.js 16.2.7 with App Router and TypeScript strict mode
- Configured Tailwind CSS v4 (CSS-based configuration)
- Initialized shadcn/ui (Tailwind v4 compatible)
- Installed: lucide-react, recharts, framer-motion, clsx, tailwind-merge, class-variance-authority, zod
- Set Convexity Desk dark theme in globals.css (brand colors: #7CFFB2 primary, #05070D background)
- Configured Space Grotesk heading font
- Created all 22 routes (5 marketing + 6 app + 10 API + 1 404) — all with placeholder pages
- Created src/types/index.ts with all core TypeScript types (Portfolio, RiskScan, HedgePlan, etc.)
- Created .gitignore
- Production build passes: 0 TypeScript errors, 0 build errors

**Files created:**
- `src/app/layout.tsx` (root layout with fonts + dark class)
- `src/app/globals.css` (Convexity Desk theme)
- `src/app/(marketing)/layout.tsx`
- `src/app/(marketing)/page.tsx` (/ route)
- `src/app/(marketing)/how-it-works/page.tsx`
- `src/app/(marketing)/methodology/page.tsx`
- `src/app/(marketing)/docs/page.tsx`
- `src/app/(marketing)/about/page.tsx`
- `src/app/app/layout.tsx` (dashboard shell placeholder)
- `src/app/app/page.tsx` (/app route)
- `src/app/app/portfolio/page.tsx`
- `src/app/app/scan/page.tsx`
- `src/app/app/hedge/page.tsx`
- `src/app/app/outcomes/page.tsx`
- `src/app/app/settings/page.tsx`
- `src/app/api/status/route.ts`
- `src/app/api/portfolio/demo/route.ts`
- `src/app/api/scan/run/route.ts`
- `src/app/api/evidence/route.ts`
- `src/app/api/hedge/generate/route.ts`
- `src/app/api/hedge/preview/route.ts`
- `src/app/api/hedge/confirm/route.ts`
- `src/app/api/outcomes/route.ts`
- `src/app/api/market/sodex/route.ts`
- `src/app/api/intelligence/sosovalue/route.ts`
- `src/types/index.ts`
- `.gitignore`

---

---

### Phase 2 — Design System ✅ Complete

**Date:** 2026-06-02

**What was done:**
- Created all 8 shared UI primitives using design system from PRD
- Container — max-w-7xl, responsive horizontal padding
- Section — consistent vertical padding (py-20 sm:py-28)
- SectionHeader — eyebrow label, heading (Space Grotesk), subtitle, left/center alignment
- Badge — 10 variants: default, primary, blue, success, warning, danger, live, fallback, mock, demo — uses CVA
- PrimaryButton — #7CFFB2 bg, dark text, framer-motion hover/tap, sm/md/lg sizes, href or onClick
- SecondaryButton — outline and ghost variants, framer-motion, matches primary sizing
- CardShell — 5 variants: default, elevated, glow, warning, danger — padding control
- GradientText — green-to-blue gradient, customizable from/to colors
- Barrel export via src/components/shared/index.ts
- /design-system preview page with all components rendered visually

**Files created:**
- `src/components/shared/Container.tsx`
- `src/components/shared/Section.tsx`
- `src/components/shared/SectionHeader.tsx`
- `src/components/shared/Badge.tsx`
- `src/components/shared/PrimaryButton.tsx`
- `src/components/shared/SecondaryButton.tsx`
- `src/components/shared/CardShell.tsx`
- `src/components/shared/GradientText.tsx`
- `src/components/shared/index.ts`
- `src/app/(marketing)/design-system/page.tsx`

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 3 — Landing Page: Header + Hero ✅ Complete

**Date:** 2026-06-02

**What was done:**
- Navbar: sticky top-0 with scroll-triggered backdrop-blur, logo (Shield icon + "ConvexityDesk" wordmark), 4 nav links, View Demo + Launch Desk CTAs, mobile hamburger menu with slide-down panel
- HeroDashboardPreview: realistic product UI card showing Danger Score (78/100 HIGH RISK), 4 risk factor bars, portfolio exposure stacked bar (BTC/ETH/SOL/USDC), 3 evidence cards, hedge plan (Short BTC-PERP $12K 42% coverage), Fallback Mode badge
- HeroSection: full-viewport, radial glow background, dot grid pattern, framer-motion staggered animations (5 sections), GradientText headline, CTA button row, 3 trust indicators, split layout (text left, preview right)
- Marketing layout updated to include Navbar on all public pages
- Landing page at / wired up to HeroSection

**Files created/modified:**
- `src/components/marketing/Navbar.tsx` (new)
- `src/components/marketing/HeroDashboardPreview.tsx` (new)
- `src/components/marketing/HeroSection.tsx` (new)
- `src/app/(marketing)/layout.tsx` (updated — added Navbar)
- `src/app/(marketing)/page.tsx` (updated — uses HeroSection)

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 4 — Landing Page: Story Sections ✅ Complete

**Date:** 2026-06-02

**What was done:**
- ProblemSection — 4 pain point cards (late news, noisy signals, compounding risk, reactive timing)
- HowItWorksSection — 6 numbered steps with icons + flow label arrow chain
- ProductPreviewSection — full-width mock panel: Danger Score 78/100, 5 factor breakdown, 4 evidence cards (severity-colored), plain English summary
- FeatureGrid — 8 feature cards in 4-column grid with per-feature accent colors
- EcosystemSection — SoSoValue, SoDEX, SSI Index, ValueChain cards with role, description, badge, and bullet points
- ComparisonSection — 6-row table: Other Tools vs Convexity Desk with X/Check icons
- CTASection — full-width CTA with gradient headline, Launch Desk + Read Methodology buttons
- Footer — 4 link columns (Product/Resources/Ecosystem/Buildathon) + © 2026 copyright + disclaimer
- All sections have scroll-triggered framer-motion animations (whileInView, once:true)
- Alternating bg colors (#05070d / #080d1a) for visual rhythm between sections

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

### Phase 5 — Dashboard Shell ✅ Complete

**Date:** 2026-06-02

**What was done:**
- DashboardShell: manages mobile sidebar state, renders Sidebar + Topbar + DemoModeBanner + main content
- Sidebar: logo with Shield icon, "Demo Mode" pulse badge, primary nav (Overview/Portfolio/Risk Scan/Hedge Plan/Outcome Ledger) with active state via usePathname, secondary nav (Methodology/Settings), wallet placeholder (Wave 3), mobile overlay with close button
- Topbar: mobile hamburger, page title derived from pathname, ApiStatusBadge (fetches /api/status), fallback badge, disabled Connect Wallet button (Wave 3)
- MetricCard: reusable metric with label, value, sublabel, accent color, icon
- DemoModeBanner: persistent thin banner with demo mode notice and settings link
- ApiStatusBadge: client component, fetches /api/status, shows live/demo/mixed with color dot
- /app overview: 4 metric cards (portfolio value, danger score, hedge coverage, top risk driver), risk snapshot panel with factor bars, hedge suggestion card, quick links
- All /app/* screens: proper page headers, structured empty states showing what's coming and when
- app/layout.tsx updated to use DashboardShell (replaces old placeholder)

**Files created/modified:**
- `src/components/dashboard/DashboardShell.tsx` (new)
- `src/components/dashboard/Sidebar.tsx` (new)
- `src/components/dashboard/Topbar.tsx` (new)
- `src/components/dashboard/MetricCard.tsx` (new)
- `src/components/dashboard/DemoModeBanner.tsx` (new)
- `src/components/dashboard/ApiStatusBadge.tsx` (new)
- `src/components/dashboard/index.ts` (new)
- `src/app/app/layout.tsx` (updated)
- `src/app/app/page.tsx` (updated — real overview)
- `src/app/app/portfolio/page.tsx` (updated)
- `src/app/app/scan/page.tsx` (updated)
- `src/app/app/hedge/page.tsx` (updated)
- `src/app/app/outcomes/page.tsx` (updated)
- `src/app/app/settings/page.tsx` (updated)

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 6 — Portfolio Module ⏳ Pending

Tasks:
- Portfolio TypeScript types
- Demo portfolio data ($42,850 across BTC, ETH, SOL, SOSO, USDC)
- /api/portfolio/demo route
- Portfolio table, allocation chart, exposure buckets
- Concentration warning

---

### Phase 7 — SoDEX Market Data Adapter ⏳ Pending

Tasks:
- SoDEX adapter (src/lib/adapters/sodex.ts)
- /api/market/sodex route
- Attempt live public market/ticker/orderbook fetch
- Typed fallback if unavailable
- Clear live/fallback/mock labelling
- Microstructure stress context for Danger Score

**Integration target:** SoDEX public market data endpoints
**Expected mode:** Fallback (to be updated once adapter is built and tested)

---

### Phase 8 — SoSoValue Intelligence Adapter ⏳ Pending

Tasks:
- SoSoValue adapter (src/lib/adapters/sosovalue.ts)
- /api/intelligence/sosovalue route
- Attempt live news/token/institutional flow fetch
- Typed fallback if unavailable
- Evidence cards from live or fallback data
- Clear live/fallback/mock labelling

**Integration target:** SoSoValue OpenAPI (https://openapi.sosovalue.com)
**Expected mode:** Fallback until API key is confirmed working

---

### Phase 9 — Risk Scan Engine ⏳ Pending

Tasks:
- Risk TypeScript types
- src/lib/risk/convexity-score.ts
- Deterministic Danger Score formula (0–100)
- Factor breakdown: institutional flow, narrative, concentration, microstructure, event proximity
- /api/scan/run route
- /app/scan page with gauge and evidence cards

**Danger Score Formula:**
```
Danger Score = 0.30 × institutional_flow + 0.20 × narrative_pressure + 0.25 × portfolio_concentration + 0.15 × microstructure_stress + 0.10 × event_proximity
```

---

### Phase 10 — Hedge Composer + Execution Preview ⏳ Pending

Tasks:
- Hedge TypeScript types
- src/lib/hedge/hedge-composer.ts
- Hedge sizing logic (portfolio × dangerMultiplier × riskProfileMultiplier)
- /api/hedge/generate and /api/hedge/preview routes
- /app/hedge page with instrument, direction, size, slippage preview
- SoDEX orderbook preview (live or fallback)

---

### Phase 11 — Confirmation Gate + Outcome Ledger ⏳ Pending

Tasks:
- Confirmation gate with required checkboxes and disclaimers
- /api/hedge/confirm route (simulated Wave 2)
- Outcome TypeScript types
- /api/outcomes route
- /app/outcomes page with status table

---

### Phase 12 — Methodology, Docs, Settings ⏳ Pending

Tasks:
- /methodology public page
- /docs public page
- /about public page
- /app/settings dashboard page
- ARCHITECTURE.md final update

---

### Phase 13 — Wave 2 Polish + Deployment ⏳ Pending

Tasks:
- Full responsive check
- Loading/empty/error states
- Subtle animations
- All routes verified
- Vercel deployment
- Final README + WAVE_PROGRESS update

---

## Wave 2 Live Integration Status

| Integration | Target | Current Status | Notes |
|-------------|--------|----------------|-------|
| SoSoValue News | openapi.sosovalue.com | ⏳ Not configured | Phase 8 |
| SoSoValue Tokens | openapi.sosovalue.com | ⏳ Not configured | Phase 8 |
| SoSoValue ETF Flow | openapi.sosovalue.com | ⏳ Not configured | Phase 8 |
| SoDEX Market Data | SoDEX public API | ⏳ Not configured | Phase 7 |
| SoDEX Orderbook | SoDEX public API | ⏳ Not configured | Phase 7 |

All integrations will use typed fallback data when live APIs are unavailable. The UI will clearly label the data source mode in all views.

---

## Wave 2 Demo Flow

When complete, the Wave 2 demo will follow this path:

1. User visits landing page — sees product overview and ecosystem context
2. User clicks "Launch Desk" — enters /app dashboard
3. Dashboard shows demo portfolio ($42,850 with BTC, ETH, SOL, SOSO, USDC)
4. User views /app/portfolio — sees allocation chart, weights, risk buckets
5. User clicks "Run Convexity Scan" — navigates to /app/scan
6. Scan runs — Danger Score calculates (expected ~78/100 for demo)
7. Evidence cards appear — labelled as live or fallback per data source
8. User clicks "Generate Hedge Plan" — navigates to /app/hedge
9. Hedge plan shows: Short BTC-PERP, ~$12K, 42% coverage, 82% confidence
10. Execution preview shows: orderbook, estimated slippage, order type
11. User reads confirmation gate — checks required boxes
12. User clicks "Confirm Hedge Preview" — simulated entry added to ledger
13. User views /app/outcomes — sees the ledger entry with status "Pending"

---

## Wave 2 Known Limitations

- No real trade execution (simulation only for Wave 2)
- No wallet connection (planned for Wave 3)
- SoSoValue and SoDEX integrations may use fallback data if API keys are unavailable
- Portfolio data is demo/static (no live wallet import yet)
- Outcome ledger is in-memory only (no persistence until Wave 3)

These limitations are intentional for Wave 2 and will be addressed in Wave 3.

---

## Wave 3 Planned Improvements

| Feature | Priority |
|---------|----------|
| Supabase/SQLite persistence | High |
| Wallet connection (wagmi + viem) | High |
| SoDEX testnet execution path | High |
| EIP-712 signing module | Medium |
| HedgeReceiptLogger smart contract | Medium |
| RiskPolicyRegistry smart contract | Medium |
| OutcomeLedgerAnchor smart contract | Low |
| Alert settings | Medium |
| Improved hedge sizing formula | Medium |
| Scenario simulation improvements | Medium |
| Architecture diagrams | Low |
| Final demo script | High |

---

## Changelog

| Date | Phase | Entry |
|------|-------|-------|
| 2026-06-01 | Phase 0 | Project initialized — planning docs created |
| 2026-06-01 | Phase 1 | Next.js 16 + Tailwind v4 + shadcn/ui + all packages — 22 routes, types, dark theme — 0 TS errors |
| 2026-06-02 | Phase 2 | Design system — 8 shared primitives (Container, Section, SectionHeader, Badge×10, PrimaryButton, SecondaryButton, CardShell×5, GradientText) — 0 errors |
| 2026-06-02 | Phase 3 | Landing page header + hero — Navbar (sticky/blur/mobile), HeroSection (split layout, animations), HeroDashboardPreview (realistic product UI) |
| 2026-06-02 | Phase 4 | Full landing page — ProblemSection, HowItWorksSection, ProductPreviewSection, FeatureGrid, EcosystemSection, ComparisonSection, CTASection, Footer (2026) |
| 2026-06-02 | Phase 5 | Dashboard shell — DashboardShell, Sidebar (active nav/mobile), Topbar (API status), MetricCard, DemoModeBanner, all /app/* updated |
