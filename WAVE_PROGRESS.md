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

### Phase 1 — Project Setup ⏳ Pending

Tasks:
- Initialize Next.js 14+ with App Router
- Configure TypeScript (strict mode)
- Install and configure Tailwind CSS
- Add shadcn/ui
- Add lucide-react, recharts, framer-motion
- Create base routes with placeholder pages
- Verify all routes load

---

### Phase 2 — Design System ⏳ Pending

Tasks:
- Font configuration (Space Grotesk / Inter / Space Mono)
- Color/theme tokens
- Layout primitives: Container, Section, SectionHeader
- UI primitives: Badge, PrimaryButton, SecondaryButton, CardShell, GradientText
- Responsive grid rules

---

### Phase 3 — Landing Page: Header + Hero ⏳ Pending

Tasks:
- Premium sticky navbar with logo and nav links
- Hero section with CTA and dashboard preview card
- Mobile responsiveness

---

### Phase 4 — Landing Page: Story Sections ⏳ Pending

Tasks:
- Problem section
- How It Works section
- Product Preview scene
- Feature grid
- Ecosystem Fit section
- Why Different comparison
- Final CTA section
- Footer (copyright 2026)

---

### Phase 5 — Dashboard Shell ⏳ Pending

Tasks:
- /app dashboard layout
- Sidebar with navigation links
- Topbar with status badges
- Placeholder route pages

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
