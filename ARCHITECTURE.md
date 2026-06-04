# ARCHITECTURE.md — Convexity Desk

> System architecture overview. Updated after each phase that changes the system design.

**Last updated:** Phase 12 - Methodology, Docs, and Settings (2026-06-04)

---

## System Overview

Convexity Desk is a Next.js full-stack application using the App Router. The architecture separates public marketing pages from the protected app dashboard, with all external API calls handled server-side through internal API routes.

```
User Browser
    │
    ├── Public Marketing Site (/)
    │       Landing, How It Works, Methodology, Docs, About
    │
    └── App Dashboard (/app)
            Overview, Portfolio, Scan, Hedge, Outcomes, Settings
                │
                └── Internal API Routes (/api/*)
                        │
                        ├── SoSoValue Adapter  ──▶  openapi.sosovalue.com
                        ├── SoDEX Adapter      ──▶  SoDEX public/testnet API
                        ├── Risk Scoring Engine (internal)
                        ├── Hedge Composer (internal)
                        └── Outcome Ledger (in-memory → Supabase in Wave 3)
```

---

## Layer Breakdown

### Layer 1: Frontend (Next.js App Router)

**Public routes** (`src/app/(marketing)/`):
- `/` — Landing page
- `/how-it-works` — Product workflow
- `/methodology` — Danger Score and risk formula explanation
- `/docs` — API integrations and architecture
- `/about` — Product vision

**App routes** (`src/app/app/`):
- `/app` — Dashboard overview
- `/app/portfolio` — Portfolio exposure map
- `/app/scan` — Convexity Risk Scan
- `/app/hedge` — Hedge recommendation + execution preview
- `/app/outcomes` — Outcome ledger
- `/app/settings` — Interactive local controls for data mode, API status, risk preferences, alert rules, wallet/testnet readiness

### Layer 2: Internal API (Next.js Route Handlers)

All external API calls go through internal Next.js route handlers. No API keys are exposed to the client.

**Portfolio routes** (`src/app/api/portfolio/`):
- `GET /api/portfolio/demo` — Returns static demo portfolio

**Scan routes** (`src/app/api/scan/`):
- `POST /api/scan/run` — Runs Danger Score calculation

**Evidence routes** (`src/app/api/evidence/`):
- `GET /api/evidence?scanId=...` — Returns evidence cards

**Hedge routes** (`src/app/api/hedge/`):
- `POST /api/hedge/generate` — Generates hedge plan
- `POST /api/hedge/preview` — Returns SoDEX execution preview
- `POST /api/hedge/confirm` — Simulates hedge confirmation (Wave 2)

**Outcome routes** (`src/app/api/outcomes/`):
- `GET /api/outcomes` — Returns outcome ledger entries

**Market routes** (`src/app/api/market/`):
- `GET /api/market/sodex` — SoDEX public market data (live or fallback)

**Intelligence routes** (`src/app/api/intelligence/`):
- `GET /api/intelligence/sosovalue` — SoSoValue intelligence (live or fallback)

**Status routes** (`src/app/api/status/`):
- `GET /api/status` — Returns integration status for all adapters

### Layer 3: Business Logic (`src/lib/`)

**Adapters** (`src/lib/adapters/`):
- `sosovalue.ts` — SoSoValue API adapter with fallback
- `sodex.ts` — SoDEX API adapter with fallback

**Risk Engine** (`src/lib/risk/`):
- `convexity-score.ts` — Deterministic Danger Score calculation

**Hedge Composer** (`src/lib/hedge/`):
- `hedge-composer.ts` — Hedge sizing and recommendation logic

**Data** (`src/lib/data/`):
- `demo-portfolio.ts` — Static demo portfolio data
- `fallback-evidence.ts` — Typed fallback evidence cards
- `fallback-market.ts` — Typed fallback market data
- `outcomes-store.ts` — Wave 2 in-memory outcome ledger with seeded demo entries

### Layer 4: Types (`src/types/`)

Core TypeScript types:
- `PortfolioAsset`, `Portfolio`
- `RiskFactor`, `RiskScan`
- `EvidenceCard`
- `HedgePlan`
- `OutcomeLedgerEntry`
- `IntegrationStatus`

### Layer 5: Components (`src/components/`)

**Marketing components** (`src/components/marketing/`):
- Navbar, HeroSection, ProblemSection, HowItWorksSection
- ProductPreviewSection, FeatureGrid, EcosystemSection
- ComparisonSection, CTASection, Footer

**Dashboard components** (`src/components/dashboard/`):
- DashboardShell, Sidebar, Topbar
- MetricCard, DangerScoreGauge, RiskFactorCard
- PortfolioTable, AllocationChart, EvidenceCard
- HedgePlanCard, ExecutionPreview, ConfirmationGate
- OutcomeLedgerTable, ApiStatusBadge, DemoModeBanner

**Shared primitives** (`src/components/shared/`):
- Container, Section, SectionHeader
- Badge, PrimaryButton, SecondaryButton
- CardShell, GradientText

---

## Data Flow: Convexity Risk Scan

```
User clicks "Run Scan"
        │
        ▼
POST /api/scan/run { portfolioId }
        │
        ├── Fetch portfolio data (demo or wallet)
        │
        ├── Fetch SoSoValue intelligence
        │       └── Live data (if API key valid)
        │           OR Fallback data (typed static)
        │
        ├── Fetch SoDEX market data
        │       └── Live data (if endpoint accessible)
        │           OR Fallback data (typed static)
        │
        ├── calculateDangerScore(portfolio, marketContext)
        │       ├── Institutional flow pressure (30%)
        │       ├── Narrative pressure (20%)
        │       ├── Portfolio concentration (25%)
        │       ├── Market microstructure stress (15%)
        │       └── Event proximity (10%)
        │
        └── Return RiskScan { dangerScore, riskLevel, factors, evidenceIds }
```

## Data Flow: Hedge Execution (Wave 2)

```
User clicks "Generate Hedge Plan"
        │
        ▼
POST /api/hedge/generate { scanId, portfolioId }
        │
        ├── Read RiskScan result
        ├── Compose hedge: instrument, direction, size, coverage
        └── Return HedgePlan

User clicks "Preview Execution"
        │
        ▼
POST /api/hedge/preview { hedgePlanId }
        │
        ├── Fetch SoDEX orderbook (live or fallback)
        ├── Calculate estimated slippage
        └── Return ExecutionPreview

User confirms via ConfirmationGate
        │
        ▼
POST /api/hedge/confirm { hedgePlanId, confirmed: true }
        │
        ├── Simulate execution (Wave 2) / Testnet order (Wave 3)
        ├── Create OutcomeLedgerEntry { status: "pending" }
        └── Return { success, orderId?, ledgerEntryId }
```

---

## Data Flow: Settings and Status (Phase 12)

```
User opens /app/settings
        │
        ├── Client fetches GET /api/status
        │       ├── getSoSoValueIntelligence()
        │       └── getSoDEXMarketData()
        │
        ├── UI labels integration modes
        │       ├── SoSoValue: live | fallback | error
        │       ├── SoDEX: live | fallback | error
        │       └── Overall: demo | mixed | live
        │
        └── User adjusts local controls
                ├── App mode display
                ├── Risk profile
                ├── Max hedge size
                ├── Max slippage
                └── Alert toggles
```

Phase 12 settings are intentionally client-local. Wave 3 will persist preferences and enforce execution policy server-side.

---

## Integration Architecture

### SoSoValue Adapter

```typescript
// src/lib/adapters/sosovalue.ts

// Responsibilities:
// 1. Read API key from env (server-side only)
// 2. Fetch news, tokens, ETF/institutional flow data
// 3. Normalize to EvidenceCard[] and MarketIntelligence
// 4. Cache responses (reduce rate limits)
// 5. Return fallback on failure
// 6. Expose { data, mode: 'live' | 'fallback' | 'error' }

// Environment:
// SOSOVALUE_API_KEY
// SOSOVALUE_BASE_URL=https://openapi.sosovalue.com
```

### SoDEX Adapter

```typescript
// src/lib/adapters/sodex.ts

// Responsibilities:
// 1. Fetch public market/ticker/orderbook data
// 2. Calculate spread, depth, slippage estimates
// 3. Build order preview structure
// 4. Simulate order execution (Wave 2)
// 5. Prepare EIP-712 signing structure (Wave 3)
// 6. Expose { data, mode: 'live' | 'fallback' | 'testnet' | 'error' }

// Environment:
// SODEX_BASE_URL
// SODEX_TESTNET_BASE_URL
// SODEX_API_KEY
```

---

## Danger Score Formula

```
Danger Score (0–100) =
    0.30 × institutional_flow_pressure
  + 0.20 × narrative_pressure
  + 0.25 × portfolio_concentration
  + 0.15 × market_microstructure_stress
  + 0.10 × event_proximity
```

Risk levels:
- **0–24:** Normal
- **25–49:** Watch
- **50–74:** Elevated
- **75–100:** High Risk

---

## Hedge Sizing Formula

```
hedgeSizeUsd = portfolio.totalValueUsd × dangerScoreMultiplier × riskProfileMultiplier

dangerScoreMultiplier:
  0–49:   0     (no hedge)
  50–74:  0.10–0.25
  75–100: 0.25–0.45

riskProfileMultiplier:
  Conservative: 1.2
  Balanced:     1.0
  Aggressive:   0.7
```

---

## Security Architecture

| Concern | Approach |
|---------|----------|
| API key exposure | All keys server-side only, never in client bundle |
| Trade execution | Always requires human confirmation gate |
| Fake live data | Never — fallback is labelled as fallback |
| Input validation | Zod validation on all API route inputs |
| Wallet (Wave 3) | wagmi/viem, no private key storage in app |
| Smart contracts (Wave 3) | No fund custody in MVP contracts |

---

## Wave 3 Architecture Additions (Planned)

```
Wave 3 adds:

├── Persistence Layer
│       └── Supabase (scans, hedge plans, outcomes, settings)
│
├── Wallet Layer
│       └── wagmi + viem + ConnectKit/RainbowKit
│
├── Testnet Execution Layer
│       └── SoDEX testnet order placement
│           EIP-712 signing
│
└── Smart Contract Layer
        ├── HedgeReceiptLogger.sol
        ├── RiskPolicyRegistry.sol
        └── OutcomeLedgerAnchor.sol
```

---

## File Structure (Target State After Wave 2)

```
convexity-desk/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── how-it-works/page.tsx
│   │   │   ├── methodology/page.tsx
│   │   │   ├── docs/page.tsx
│   │   │   └── about/page.tsx
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── portfolio/page.tsx
│   │   │   ├── scan/page.tsx
│   │   │   ├── hedge/page.tsx
│   │   │   ├── outcomes/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── portfolio/demo/route.ts
│   │       ├── scan/run/route.ts
│   │       ├── evidence/route.ts
│   │       ├── hedge/
│   │       │   ├── generate/route.ts
│   │       │   ├── preview/route.ts
│   │       │   └── confirm/route.ts
│   │       ├── outcomes/route.ts
│   │       ├── market/sodex/route.ts
│   │       ├── intelligence/sosovalue/route.ts
│   │       └── status/route.ts
│   ├── components/
│   │   ├── marketing/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── ProductPreviewSection.tsx
│   │   │   ├── FeatureGrid.tsx
│   │   │   ├── EcosystemSection.tsx
│   │   │   ├── ComparisonSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── DangerScoreGauge.tsx
│   │   │   ├── RiskFactorCard.tsx
│   │   │   ├── PortfolioTable.tsx
│   │   │   ├── AllocationChart.tsx
│   │   │   ├── EvidenceCard.tsx
│   │   │   ├── HedgePlanCard.tsx
│   │   │   ├── ExecutionPreview.tsx
│   │   │   ├── ConfirmationGate.tsx
│   │   │   ├── OutcomeLedgerTable.tsx
│   │   │   ├── ApiStatusBadge.tsx
│   │   │   └── DemoModeBanner.tsx
│   │   └── shared/
│   │       ├── Container.tsx
│   │       ├── Section.tsx
│   │       ├── SectionHeader.tsx
│   │       ├── Badge.tsx
│   │       ├── PrimaryButton.tsx
│   │       ├── SecondaryButton.tsx
│   │       ├── CardShell.tsx
│   │       └── GradientText.tsx
│   ├── lib/
│   │   ├── adapters/
│   │   │   ├── sosovalue.ts
│   │   │   └── sodex.ts
│   │   ├── risk/
│   │   │   └── convexity-score.ts
│   │   ├── hedge/
│   │   │   └── hedge-composer.ts
│   │   └── data/
│   │       ├── demo-portfolio.ts
│   │       ├── fallback-evidence.ts
│   │       ├── fallback-market.ts
│   │       └── outcomes-store.ts
│   └── types/
│       └── index.ts
├── docs/
│   └── PRD.md
├── public/
├── README.md
├── ARCHITECTURE.md
├── WAVE_PROGRESS.md
├── .env.example
├── .env.local          (not committed)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

*Architecture document will be updated at the end of each phase that introduces structural changes.*
