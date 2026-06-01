# Convexity Desk

> **Protect your crypto portfolio before the drawdown becomes obvious.**

Convexity Desk is a portfolio-protection and hedge-execution desk for crypto traders, SSI/index holders, and one-person on-chain fund managers. It reads a user's holdings, analyses market stress using SoSoValue intelligence and SoDEX market structure, then generates a clear, approval-gated hedge plan that can be previewed and later executed on SoDEX testnet.

---

## Current Build Phase

**Phase 0 — Planning Docs** *(complete)*

No product code has been written yet. This phase establishes the documentation foundation and project structure before any implementation begins.

---

## Project Status

| Item | Status |
|------|--------|
| Planning docs | ✅ Complete |
| Project setup (Next.js) | ⏳ Pending — Phase 1 |
| Design system | ⏳ Pending — Phase 2 |
| Landing page | ⏳ Pending — Phase 3–4 |
| Dashboard shell | ⏳ Pending — Phase 5 |
| Portfolio module | ⏳ Pending — Phase 6 |
| SoDEX adapter | ⏳ Pending — Phase 7 |
| SoSoValue adapter | ⏳ Pending — Phase 8 |
| Risk scan engine | ⏳ Pending — Phase 9 |
| Hedge composer | ⏳ Pending — Phase 10 |
| Confirmation + ledger | ⏳ Pending — Phase 11 |
| Methodology + docs | ⏳ Pending — Phase 12 |
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

- [x] README.md (this file) — single source of truth
- [x] WAVE_PROGRESS.md — hackathon progress tracker
- [x] ARCHITECTURE.md — system architecture overview
- [x] docs/PRD.md — full product requirements document
- [x] .env.example — all required environment variables
- [x] Initial folder structure plan

---

## Pending Features

- [ ] Next.js project initialization
- [ ] TypeScript + Tailwind setup
- [ ] Design system primitives
- [ ] Landing page (public marketing)
- [ ] Dashboard shell (/app layout)
- [ ] Portfolio module with demo data
- [ ] SoDEX market data adapter
- [ ] SoSoValue intelligence adapter
- [ ] Convexity Risk Scan engine (Danger Score)
- [ ] Hedge composer and execution preview
- [ ] Confirmation gate and outcome ledger
- [ ] Methodology and docs pages
- [ ] Wave 2 polish and deployment

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router) |
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
| SoSoValue | ⏳ Not yet configured | Adapter pending Phase 8 |
| SoDEX Market | ⏳ Not yet configured | Adapter pending Phase 7 |
| Portfolio Data | ⏳ Not yet configured | Demo data pending Phase 6 |
| Overall Mode | `demo` | Phase 0 — no code yet |

All live/fallback/mock status will be clearly labelled in the UI once implemented. The app will never claim mock data is live.

---

## Known Issues

- None (Phase 0 — no code written yet)

---

## Wave 2 Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Planning docs | ✅ Complete |
| 1 | Next.js project setup | ⏳ Pending |
| 2 | Design system + layout primitives | ⏳ Pending |
| 3 | Landing page — header + hero | ⏳ Pending |
| 4 | Landing page — story sections + footer | ⏳ Pending |
| 5 | Dashboard shell + navigation | ⏳ Pending |
| 6 | Portfolio module with demo data | ⏳ Pending |
| 7 | SoDEX market data adapter | ⏳ Pending |
| 8 | SoSoValue intelligence adapter | ⏳ Pending |
| 9 | Convexity Risk Scan engine | ⏳ Pending |
| 10 | Hedge composer + execution preview | ⏳ Pending |
| 11 | Confirmation gate + outcome ledger | ⏳ Pending |
| 12 | Methodology, docs, and settings pages | ⏳ Pending |
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

---

## Next Recommended Build Step

**Phase 1: Project Setup**

Initialize the Next.js application with TypeScript, Tailwind CSS, shadcn/ui, lucide-react, recharts, and framer-motion. Create base app routes with placeholder pages. Ensure all routes load without errors.

Do not start Phase 1 until explicitly instructed.
