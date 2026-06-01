# PRD: Convexity Desk — Product Requirements Document

> SoSoValue Buildathon — Wave 2 + Wave 3 Build Plan

This document is the master product specification for Convexity Desk. It defines the product vision, user flow, feature set, technical architecture, build phases, and judging criteria mapping.

---

## 0. Build Philosophy

This project must be built **step by step**, not all at once.

Each phase must be completed, tested, documented, and stopped for review before moving to the next phase. The README is the single source of truth at all times.

Do not generate the entire application in one large build.

---

## 1. Product Name

**Convexity Desk**

**Tagline:** Protect your crypto portfolio before the drawdown becomes obvious.

**Short Description:** Convexity Desk is a portfolio-protection and hedge-execution desk for crypto traders, SSI/index holders, and one-person on-chain fund managers. It reads a user's holdings, analyses market stress using SoSoValue intelligence and SoDEX market structure, then generates a clear, approval-gated hedge plan that can be previewed and later executed on SoDEX testnet.

---

## 2. Product Thesis

Most crypto tools tell users what to buy next. Convexity Desk focuses on what users already hold.

The core question:

> "Given my current portfolio, what downside risk is building, what evidence supports that risk, and what is the cleanest hedge I can take before the market moves against me?"

Core product flow:

**Portfolio → Risk Scan → Evidence → Hedge Plan → Execution Preview → Confirmation → Outcome Tracking**

---

## 3. Target Users

1. **Crypto spot traders** — BTC, ETH, SOL, SOSO holders who want to know when to reduce risk
2. **SSI/index holders** — thematic basket holders who need sector protection
3. **One-person fund managers** — solo traders needing a professional risk layer
4. **Signal group admins** — checking exposure risk before recommending action

---

## 4. Core Problem

Crypto users enter positions easily but rarely have structured portfolio protection tools. The missing category is:

> A portfolio-native protection layer that detects risk, explains the evidence, proposes a hedge, previews execution, and tracks whether the hedge actually helped.

---

## 5. Core Solution

Convexity Desk runs a **Convexity Risk Scan** that analyses:

1. Portfolio concentration
2. Asset exposure
3. Institutional flow pressure
4. News/narrative risk
5. Market structure stress
6. Liquidity and orderbook conditions
7. Potential hedge coverage

It outputs:

1. A **Danger Score** from 0–100
2. Risk factor breakdown
3. Evidence cards from SoSoValue and/or fallback market data
4. A hedge recommendation
5. Suggested hedge size
6. Expected coverage
7. SoDEX market/execution preview
8. Human confirmation gate
9. Outcome ledger entry after simulated or testnet execution

---

## 6. Key Differentiation

Position: **Portfolio protection infrastructure for on-chain finance.**

- Starts from the portfolio, not from a token watchlist
- Focuses on downside risk, not only alpha discovery
- Uses AI for explanation, not blind trading
- Keeps the risk formula inspectable
- Requires user confirmation before irreversible action
- Tracks hedge outcomes after recommendation
- Makes SoSoValue + SoDEX feel like one research-to-execution stack
- Uses mock data only as fallback, not as the main Wave 2 claim

---

## 7. Wave Scope

### Wave 2: Polished MVP + Real Integration Foundation

Wave 2 must not be mock-only. Required:

1. Premium landing page
2. Dashboard shell
3. Demo portfolio
4. Risk scoring engine
5. SoSoValue adapter (live attempt + fallback)
6. SoDEX adapter (live attempt + fallback)
7. Portfolio exposure map
8. Convexity Danger Score
9. Evidence cards
10. SoDEX market/execution preview
11. Hedge recommendation
12. Confirmation gate
13. Simulated hedge confirmation
14. Outcome ledger
15. Documentation
16. Deployment-ready app

#### Live Integration Requirement

Option A — SoDEX Public Market Data:
- Fetch market/ticker, orderbook, spread/depth, price/market status
- Use in `/api/market/sodex`, `/api/hedge/preview`, microstructure stress factor

Option B — SoSoValue API:
- Fetch news/flash news, token/currency data, market sentiment, ETF/institutional flow
- Use in `/api/intelligence/sosovalue`, evidence cards, narrative + institutional flow factors

#### Required Fallback Behavior

- Return typed fallback data on failure
- Label as fallback/mock mode clearly
- Do not crash the app
- `/api/status` must expose integration mode per source

### Wave 3: Product Completion + Testnet Execution + Smart Contract Layer

1. Improved live integrations
2. SoDEX testnet execution path
3. Wallet connection (wagmi/viem)
4. EIP-712 signing
5. Testnet order submission
6. Outcome ledger persistence
7. Supabase or SQLite
8. Alert settings
9. Better scenario simulation
10. Better hedge sizing formula
11. Smart contract support
12. Final UI polish and docs

#### Wave 3 Smart Contracts

1. `HedgeReceiptLogger` — logs hedge recommendation hash, portfolio hash, danger score, timestamp, execution mode
2. `RiskPolicyRegistry` — stores user-approved risk policy configuration
3. `OutcomeLedgerAnchor` — anchors outcome ledger entries on-chain

Contracts must not custody user funds in MVP.

---

## 8. Product Pages and Routes

### Public Marketing Pages

- `/` — Landing page
- `/how-it-works` — Product workflow explanation
- `/methodology` — Danger Score, risk factors, hedge logic, safety controls
- `/docs` — API integrations, architecture, hackathon scope
- `/about` — Product vision

### App Dashboard Pages

- `/app` — Main dashboard overview
- `/app/portfolio` — Portfolio exposure map
- `/app/scan` — Run Convexity Risk Scan
- `/app/hedge` — Hedge recommendation and execution preview
- `/app/outcomes` — Outcome ledger
- `/app/settings` — API mode, demo mode, alerts, wallet status

---

## 9. Landing Page Requirements

### Top Navigation

- Logo: Convexity Desk
- Links: Product, How It Works, Methodology, Docs
- CTA buttons: View Demo, Launch Desk

### Hero Section

Headline: **Protect your crypto portfolio before the drawdown becomes obvious.**

Subheadline: **Convexity Desk reads your holdings, scans institutional flow pressure, narrative risk, and SoDEX market structure, then builds an approval-gated hedge plan before volatility turns into damage.**

Primary CTA: **Launch Desk** | Secondary CTA: **See How It Works**

Hero preview shows: Danger Score, portfolio exposure, hedge recommendation, evidence cards, demo/live status.

### Story Sections

1. Problem Section — traders enter positions easily, news arrives late, risk compounds quietly
2. How It Works — Holdings → Risk Scan → Evidence → Hedge Plan → SoDEX Preview → Outcome Ledger
3. Product Preview Scene — large visual panel showing product in action
4. Feature Grid — portfolio map, danger score, evidence cards, execution preview, hedge composer, outcome ledger, confirmation gate, live/fallback mode
5. Ecosystem Fit — SoSoValue Terminal/API, SSI/index, SoDEX, ValueChain
6. Why Different — portfolio-native vs. signal bots, downside risk vs. alpha discovery
7. Final CTA — "Your portfolio already has risk. Convexity Desk tells you where it is hiding."
8. Footer — 2026 copyright, SoSoValue Buildathon Wave 2 badge, disclaimer

---

## 10. Dashboard Layout

### Sidebar

- Overview, Portfolio, Risk Scan, Hedge Plan, Outcome Ledger, Methodology, Settings
- App logo
- User/demo wallet status
- Current mode badge

### Topbar

- Search/command placeholder
- Market status badge
- API status badge
- Connect wallet button
- Theme toggle

---

## 11. Core App Screens

### /app Overview

- Portfolio value: $42,850
- Danger Score: 78/100 (High)
- Suggested action: Hedge 35% BTC beta exposure
- Current hedge coverage: 22%
- Top risk driver: ETF outflow pressure

### /app/portfolio

- Asset table: symbol, amount, price, value, weight, risk contribution, hedgeable status
- Allocation chart
- Exposure buckets: BTC beta, ETH beta, high beta alts, stablecoins, SSI/index
- Concentration warning
- CTA: Run Convexity Scan

### /app/scan

- Danger Score gauge
- Risk factor breakdown (5 factors)
- Evidence cards
- Plain English explanation
- CTA: Generate Hedge Plan

### /app/hedge

- Recommended instrument, direction, size, coverage, confidence
- Risk if hedge is ignored
- SoDEX orderbook preview, slippage estimate
- Confirmation gate

### /app/outcomes

- Table: date, portfolio state, danger score, hedge, action, order ID, coverage before/after, result status
- Status options: Pending, Useful, Neutral, Wasteful, Avoided Loss, Missed Hedge

### /app/methodology

- What is Danger Score?
- How each factor is calculated
- Data sources: live vs. fallback
- Hedge sizing assumptions
- Safety controls
- Disclaimer

### /app/settings

- Demo mode toggle
- Live API mode placeholder
- SoSoValue API status, SoDEX API status
- Wallet status
- Risk preferences: Conservative / Balanced / Aggressive
- Max hedge size, max slippage
- Alert settings placeholder

---

## 12. Data Models

```typescript
type PortfolioAsset = {
  symbol: string;
  name: string;
  amount: number;
  priceUsd: number;
  valueUsd: number;
  weight: number;
  riskContribution: number;
  betaBucket: "BTC_BETA" | "ETH_BETA" | "HIGH_BETA_ALT" | "STABLE" | "SSI_INDEX";
  hedgeable: boolean;
};

type Portfolio = {
  id: string;
  ownerAddress?: string;
  mode: "demo" | "wallet";
  totalValueUsd: number;
  assets: PortfolioAsset[];
  updatedAt: string;
};

type RiskFactor = {
  key: "institutional_flow" | "narrative_pressure" | "portfolio_concentration" | "market_microstructure" | "event_proximity";
  label: string;
  score: number;
  weight: number;
  explanation: string;
  evidenceIds: string[];
};

type RiskScan = {
  id: string;
  portfolioId: string;
  dangerScore: number;
  riskLevel: "Normal" | "Watch" | "Elevated" | "High Risk";
  factors: RiskFactor[];
  summary: string;
  createdAt: string;
};

type EvidenceCard = {
  id: string;
  source: "SoSoValue" | "SoDEX" | "Internal" | "Mock";
  title: string;
  description: string;
  asset?: string;
  category?: string;
  sentiment?: "bullish" | "bearish" | "neutral";
  severity: "low" | "medium" | "high";
  timestamp: string;
  url?: string;
};

type HedgePlan = {
  id: string;
  scanId: string;
  instrument: string;
  direction: "short" | "long" | "reduce" | "hold";
  suggestedSizeUsd: number;
  coveragePercent: number;
  confidence: number;
  orderType: "limit" | "market" | "ioc" | "simulation";
  estimatedSlippageBps: number;
  rationale: string;
  risks: string[];
  createdAt: string;
};

type OutcomeLedgerEntry = {
  id: string;
  hedgePlanId: string;
  status: "pending" | "useful" | "neutral" | "wasteful" | "avoided_loss" | "missed_hedge";
  actionTaken: "simulated" | "testnet_executed" | "cancelled";
  orderId?: string;
  coverageBefore: number;
  coverageAfter: number;
  notes: string;
  createdAt: string;
};

type IntegrationStatus = {
  sosovalue: "live" | "fallback" | "mock" | "error";
  sodex: "live" | "fallback" | "mock" | "error";
  mode: "demo" | "mixed" | "live";
  lastCheckedAt: string;
};
```

---

## 13. API Routes

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

## 14. Danger Score Formula

```
Danger Score = 0.30 × institutional_flow_pressure
             + 0.20 × narrative_pressure
             + 0.25 × portfolio_concentration
             + 0.15 × market_microstructure_stress
             + 0.10 × event_proximity
```

Risk levels: 0–24 Normal | 25–49 Watch | 50–74 Elevated | 75–100 High Risk

---

## 15. Hedge Sizing Formula

```
hedgeSizeUsd = portfolio.totalValueUsd × dangerScoreMultiplier × riskProfileMultiplier

dangerScoreMultiplier:
  0–49:   0         (no hedge)
  50–74:  0.10–0.25
  75–100: 0.25–0.45

riskProfileMultiplier:
  Conservative: 1.2
  Balanced:     1.0
  Aggressive:   0.7

Suggested direction:
  BTC-heavy:      Short BTC-PERP
  ETH-heavy:      Short ETH-PERP
  High beta alts: Short BTC or ETH proxy hedge
  Stable-heavy:   Hold / no hedge
```

---

## 16. UI Design Direction

- Dark mode first
- Background: #05070D | Surface: #0B1020 | Elevated: #111827
- Border: #1F2937 | Primary: #7CFFB2 | Blue: #60A5FA
- Warning: #F59E0B | Danger: #EF4444 | Success: #22C55E
- Muted: #9CA3AF | Text: #F9FAFB
- Headings: Space Grotesk or Sora
- Body: Inter or Manrope
- Mono labels: Space Mono or Geist Mono

---

## 17. Demo Data

```typescript
const demoPortfolio = {
  totalValueUsd: 42850,
  assets: [
    { symbol: "BTC", valueUsd: 18500, weight: 43.2 },
    { symbol: "ETH", valueUsd: 9200,  weight: 21.5 },
    { symbol: "SOL", valueUsd: 5100,  weight: 11.9 },
    { symbol: "SOSO", valueUsd: 2300, weight: 5.4  },
    { symbol: "USDC", valueUsd: 7750, weight: 18.0 }
  ]
};

// Fallback evidence cards:
// 1. BTC ETF outflows increasing
// 2. News sentiment turning cautious
// 3. SoDEX orderbook spread widening
// 4. Portfolio concentration above safe threshold
// 5. High-impact macro event approaching

// Fallback hedge plan:
// Instrument: BTC-PERP / USDC
// Direction: Short
// Size: $12,000
// Coverage: 42%
// Confidence: 82%
// Estimated slippage: 12 bps
```

---

## 18. Security Requirements

1. No API keys on frontend
2. All external API calls server-side only
3. No automatic trade execution
4. Human confirmation gate required
5. Simulation/testnet/live mode clearly labelled
6. Financial disclaimer in footer, methodology, hedge confirmation
7. Slippage and risk warnings on execution preview
8. Zod validation on all API inputs
9. TypeScript strict mode
10. No private key storage on frontend

---

## 19. Financial Disclaimer

> Convexity Desk is a hackathon prototype. It is not financial advice. All hedge plans are for research, simulation, or testnet demonstration unless clearly stated otherwise. Users are responsible for all trading decisions.

---

## 20. Build Phases Summary

| Phase | Description |
|-------|-------------|
| 0 | Planning docs — README, WAVE_PROGRESS, ARCHITECTURE, PRD, .env.example |
| 1 | Next.js project setup |
| 2 | Design system + layout primitives |
| 3 | Landing page — header + hero |
| 4 | Landing page — story sections + footer |
| 5 | Dashboard shell + navigation |
| 6 | Portfolio module with demo data |
| 7 | SoDEX market data adapter |
| 8 | SoSoValue intelligence adapter |
| 9 | Convexity Risk Scan engine |
| 10 | Hedge composer + execution preview |
| 11 | Confirmation gate + outcome ledger |
| 12 | Methodology, docs, settings pages |
| 13 | Wave 2 polish + Vercel deployment |

---

## 21. Judging Criteria Mapping

| Criterion | How Convexity Desk Addresses It |
|-----------|--------------------------------|
| User Value & Practical Impact | Protects existing crypto exposure before major drawdowns |
| Functionality & Working Demo | Complete flow: Portfolio → Scan → Evidence → Hedge → Preview → Confirm → Outcome |
| Logic, Workflow & Product Design | Inspectable Danger Score, explainable recommendations, clear user flow |
| Data/API Integration | SoSoValue intelligence + SoDEX market data with transparent fallback |
| UX & Clarity | Premium landing page, structured dashboard, guided actions |

---

*This PRD is the master product specification. Implementation must follow the build phases in order.*
