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

### Phase 6 — Portfolio Module ✅ Complete

**Date:** 2026-06-02

**What was done:**
- `src/lib/data/demo-portfolio.ts` — `getDemoPortfolio()` returns typed Portfolio with 5 assets: BTC ($18,500 · 43.2%), ETH ($9,200 · 21.5%), SOL ($5,100 · 11.9%), SOSO ($2,300 · 5.4%), USDC ($7,750 · 18.0%)
- `/api/portfolio/demo` — returns demo portfolio as JSON
- `AllocationChart.tsx` — Recharts PieChart donut (innerRadius 68, outerRadius 100), custom tooltip, custom legend grid
- `/app/portfolio` page:
  - Concentration warning banner (triggered at BTC > 40% threshold)
  - 4 metric cards: Total Value, Largest Position, Hedgeable Exposure, High Beta Exposure
  - Allocation chart (left) + Exposure buckets panel (right)
  - Exposure buckets: BTC Beta 43.2%, ETH Beta 21.5%, High Beta 17.3%, Stablecoins 18.0%, SSI 0%
  - Full asset table: amount, price, value, weight bar, risk contribution (color-coded), beta bucket badge, hedgeable icon
  - CTA row: "Run Convexity Scan →"

**Files created/modified:**
- `src/lib/data/demo-portfolio.ts` (new)
- `src/app/api/portfolio/demo/route.ts` (updated — real data)
- `src/components/dashboard/AllocationChart.tsx` (new)
- `src/app/app/portfolio/page.tsx` (updated — full portfolio UI)

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 7 — SoDEX Market Data Adapter ✅ Complete

**Date:** 2026-06-02

**What was done:**
- `src/lib/adapters/sodex.ts` — full adapter with:
  - Live fetch attempt if SODEX_BASE_URL is set (4 endpoint patterns tried: /api/v1/markets, /api/v1/tickers, /v1/markets, /markets)
  - 5 second abort timeout
  - 60 second in-memory cache
  - Response normaliser (handles unknown API shapes — tries common field names)
  - Computes microstructureStress per market (spreadBps × 0.6 + liquidityStress × 0.4)
  - Typed fallback data: BTC-PERP (stress 62), ETH-PERP (stress 54), SOL-PERP (stress 71)
  - Returns `AdapterResponse<SoDEXMarketData>` with mode: live | fallback | error
- `/api/market/sodex` — force-dynamic route, calls adapter
- `/api/status` — updated to check real SoDEX mode and reflect it
- `SoDEXMarketPreview` — client component, fetches /api/market/sodex, shows markets with price, spread (with × avg), microstructure stress bar, live/fallback badge
- `/app/scan` page — updated to show SoDEXMarketPreview alongside the Phase 9 coming-soon panel
- `src/lib/data/fallback-market.ts` — exports FALLBACK_MARKET_CONTEXT for use by risk engine (Phase 9)

**Integration target:** SoDEX public market data endpoints
**Actual mode:** Fallback (SODEX_BASE_URL not configured — will go live when endpoint is known)

**Files created/modified:**
- `src/lib/adapters/sodex.ts` (new)
- `src/lib/data/fallback-market.ts` (new)
- `src/app/api/market/sodex/route.ts` (updated — real adapter)
- `src/app/api/status/route.ts` (updated — reflects SoDEX mode)
- `src/components/dashboard/SoDEXMarketPreview.tsx` (new)
- `src/app/app/scan/page.tsx` (updated — shows market preview)

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 8 — SoSoValue Intelligence Adapter ✅ Complete

**Date:** 2026-06-02

**What was done:**
- `src/lib/adapters/sosovalue.ts`:
  - Tries 4 news endpoint patterns with x-api-key + Bearer auth headers
  - 6 second abort timeout, 2 minute in-memory cache
  - `sentimentFromText()` — keyword-based scoring against 14 bearish / 11 bullish terms
  - `normaliseLiveResponse()` — handles unknown API shapes (data/items/news/articles/results/list)
  - 6-card typed fallback (BTC ETF outflow, ETH ETF outflow, OI compression, Fed minutes, seasonal pattern, SOL congestion)
  - Exports `computeNarrativePressure()` and `computeInstitutionalFlowPressure()` for Phase 9 risk engine
  - Returns `AdapterResponse<SoSoValueIntelligence>` with mode: live | fallback | error
- `/api/intelligence/sosovalue` — force-dynamic route, calls adapter
- `/api/status` — now runs both adapters in parallel (Promise.all), reflects both modes
- `EvidenceCardList` — client component:
  - Fetches `/api/intelligence/sosovalue`
  - Shows narrative pressure + institutional flow score bars (colour-coded)
  - Evidence cards with severity dot, title, description, source/sentiment/asset/category badges
  - Live/fallback badge
  - Skeleton loading states
- `/app/scan` page updated to show SoDEXMarketPreview + EvidenceCardList alongside scan placeholder

**Integration target:** SoSoValue OpenAPI (https://openapi.sosovalue.com)
**Actual mode:** Fallback (SOSOVALUE_API_KEY not configured — will go live when key is available)

**Files created/modified:**
- `src/lib/adapters/sosovalue.ts` (new)
- `src/lib/data/fallback-evidence.ts` (new)
- `src/app/api/intelligence/sosovalue/route.ts` (updated — real adapter)
- `src/app/api/status/route.ts` (updated — parallel adapter check)
- `src/components/dashboard/EvidenceCardList.tsx` (new)
- `src/app/app/scan/page.tsx` (updated — shows both data sources)

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 9 — Risk Scan Engine ✅ Complete

**Date:** 2026-06-02

**What was done:**
- `src/lib/risk/convexity-score.ts`:
  - `calculateDangerScore(portfolio, intelligence, marketData)` → `RiskScan`
  - 5 factor calculators: `calcPortfolioConcentration`, `calcMicrostructureStress`, `calcEventProximity` + reuses SoSoValue `computeNarrativePressure` / `computeInstitutionalFlowPressure`
  - Per-factor explanation generator (context-aware plain English)
  - Summary builder (risk-level-appropriate portfolio summary)
  - Evidence ID linker per factor
- `/api/scan/run` — POST, force-dynamic, runs all 3 data sources in parallel, returns `{ scan, evidenceCards, dataMode }`
- `/api/evidence` — GET, returns SoSoValue evidence cards directly
- `DangerScoreGauge` — animated SVG arc gauge (270° sweep, framer-motion stroke animation, color-coded by risk level)
- `RiskFactorCard` — score bar with color coding, weight label, explanation, contribution pts
- `/app/scan` full interactive page:
  - Idle state: "Run Scan" CTA
  - Scanning state: animated step-by-step progress
  - Results: gauge + data mode badges, risk summary, factor mini-scores, 5 RiskFactorCards, evidence grid, hedge CTA
  - Error state: retry button

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

---

---

### Phase 10 — Hedge Composer + Execution Preview ✅ Complete

**Date:** 2026-06-02

**What was done:**
- `src/lib/hedge/hedge-composer.ts`:
  - `selectInstrument()` — picks BTC-PERP, ETH-PERP, or BTC proxy based on portfolio beta weights
  - `dangerMultiplier()` — interpolates 0.10–0.45 for scores 50–100 (0 below 50)
  - `hedgeSize()` — `portfolio × dangerMultiplier × riskProfileMultiplier` rounded to $1K
  - `computeCoverage()` — hedge size / (BTC + ETH beta exposure) → coverage %
  - `computeConfidence()` — `40 + dangerScore × 0.54 + coverage × 0.08` capped at 95
  - `buildRationale()` — context-aware rationale string
  - `buildRisks()` — dynamic risk bullet list based on score and size
  - `composeHedgePlan()` — assembles full `HedgePlan`
  - `buildPreview()` — builds `ExecutionPreview` from SoDEX market data (bid/ask/spread/slippage/cost/liquidity)
- `/api/hedge/generate` — POST, runs full scan→compose→preview pipeline
- `/api/hedge/preview` — POST, refreshes execution preview from new SoDEX data
- `HedgePlanCard` — instrument + direction badge, size/coverage/confidence tiles, coverage bar, rationale, risks, stop condition
- `ExecutionPreviewCard` — data rows table, liquidity bar, categorised warnings (spread/liquidity/simulation/disclaimer)
- `/app/hedge` full interactive page: idle → generating (animated steps) → results (scan strip with mini gauge, plan card, preview card, confirm CTA) → error

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

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

### Phase 11 — Confirmation Gate + Outcome Ledger ✅ Complete

**Date:** 2026-06-02

**What was done:**
- `src/lib/data/outcomes-store.ts` — module-level in-memory store, pre-seeded with 3 demo entries (avoided_loss, useful, neutral), `getOutcomes()`, `addOutcome()`, `generateSimOrderId()`
- `/api/hedge/confirm` POST — creates OutcomeLedgerEntry (status: pending, actionTaken: simulated, SIM-xxx orderId), adds to store
- `/api/outcomes` GET — returns all entries with persistence note
- `ConfirmationGate` component — 3 required checkboxes, hedge summary strip (instrument/size/coverage), danger score context, progressive enable (count remaining), disclaimer, cancel/confirm buttons
- `OutcomeLedgerTable` — sorted newest-first, 7 columns (date, plan ID, action badge, order ID, coverage before→after, status badge, notes), empty state
- `/app/outcomes` — metric cards (total/avoided_loss/useful/pending), status filter chips, OutcomeLedgerTable, persistence notice badge, empty state CTA
- `/app/hedge` updated — gate state machine (done→gate→confirming→confirmed), ConfirmationGate renders below plan cards, confirmed state shows order ID + link to outcomes

**Wave 2 limitation documented:** In-memory outcomes reset on server restart. Wave 3 adds Supabase.

**Build result:** 25 routes, 0 TypeScript errors, 0 build errors

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
| 2026-06-02 | Phase 6 | Portfolio module — demo data, /api/portfolio/demo, AllocationChart (Recharts donut), exposure buckets, asset table, concentration warning |
| 2026-06-02 | Phase 7 | SoDEX adapter — live fetch (4 patterns, 5s timeout, 60s cache), normaliser, typed fallback (3 markets), /api/market/sodex, /api/status updated, SoDEXMarketPreview |
| 2026-06-02 | Phase 8 | SoSoValue adapter — live fetch (4 patterns, 6s timeout, 2min cache), sentiment scoring, 6-card fallback, /api/intelligence/sosovalue, /api/status updated, EvidenceCardList UI |
| 2026-06-02 | Phase 9 | Risk scan engine — convexity-score.ts (5-factor formula), /api/scan/run, DangerScoreGauge (SVG), RiskFactorCard, full interactive /app/scan (idle/scanning/results/error states) |
| 2026-06-02 | Phase 10 | Hedge composer — hedge-composer.ts (instrument selection, sizing, coverage, confidence, preview), /api/hedge/generate + preview, HedgePlanCard, ExecutionPreviewCard, full interactive /app/hedge |
| 2026-06-02 | Phase 11 | Confirmation gate (3-checkbox), outcomes store (pre-seeded), /api/hedge/confirm, /api/outcomes, OutcomeLedgerTable, /app/outcomes (metric cards + filter + table), /app/hedge updated with gate→confirmed flow |
