# Architecture — Convexity Desk

Next.js 16 (App Router) full-stack app. All external calls happen server-side in
route handlers; API keys never reach the browser.

```
Browser
 ├─ Marketing site  /  /how-it-works  /methodology  /docs  /about
 │    └─ Live previews call /api/hedge/generate (sample holdings)
 └─ Dashboard  /app  /portfolio  /scan  /hedge  /outcomes  /settings
      ├─ RainbowKit + wagmi (browser-extension wallets; WalletConnect if configured)
      ├─ usePortfolioSource   — "My wallet" | "Demo holdings" (localStorage)
      ├─ useHedgePreferences  — risk profile, max hedge %, max slippage (localStorage)
      └─ /api/* ──────────────────────────────────────────────────────────────┐
                                                                             │
Server (route handlers)                                                      │
 ├─ resolvePortfolio(address?) ── wallet holdings or demo holdings ◀─────────┘
 │    ├─ holdings-server  ── Alchemy Portfolio API  (ALCHEMY_API_KEY)
 │    │                    └ or public-RPC multicall over curated tokens
 │    └─ buildPortfolio   ── price-service ── SoDEX tickers → SoSoValue snapshot
 │                         └ 30-day vol from SoDEX daily klines
 ├─ SoSoValue adapter ── ETF flows, news, hot news, macro calendar
 ├─ SoDEX adapter     ── mainnet tickers + L2 order books
 ├─ convexity-score   ── five-factor Danger Score (deterministic)
 ├─ hedge-composer    ── instrument, size, coverage, book-walk preview
 └─ outcomes-store    ── paper-hedge ledger (in memory)
```

## Data sources

| Source | Used for | Endpoints | Caching |
|---|---|---|---|
| SoSoValue OpenAPI (`x-soso-api-key`) | ETF flows, news, macro calendar; last-resort prices | `/etfs/summary-history`, `/news`, `/news/hot`, `/macro/events`, `/currencies/*` | ETF 30 min, news 5 min, macro 6 h. Quota 20 req/min, shared |
| SoDEX mainnet (public) | Prices, order books, volatility, microstructure | `/perps/markets/tickers`, `/spot/markets/tickers`, `/perps/markets/{sym}/orderbook`, `/{venue}/markets/{sym}/klines` | tickers 30 s, klines 6 h; last live snapshot served ≤10 min on failure |
| Alchemy Portfolio API | Wallet token discovery across 4 chains | `/assets/tokens/by-address` | 60 s per address |
| Public RPCs (publicnode, 1rpc, chain RPCs) | Wallet fallback without Alchemy | multicall `balanceOf` / `decimals` | 60 s per address; 12 s per-chain deadline |

Every adapter returns `{ data, mode: "live" | "fallback", reason }`. `/api/status`
combines them into `live | mixed | fallback`; the dashboard banners any source that is down.
Fallback data is labelled as sample data and never attributed to a real source.

## Wallet holdings pipeline (`src/lib/wallet/holdings-server.ts`)

1. Discover balances (Alchemy, or curated list over RPC).
2. Price via SoDEX in one cached call. SoSoValue fallback only for **trusted** tokens
   (native or curated contract) — never for arbitrary airdrops, to protect the quota.
3. Trust rule against symbol-spoofing spam: untrusted tokens need an Alchemy price,
   and our symbol price is used only if it agrees within 25%.
4. Roll wrapped/bridged/receipt forms (WETH, stETH, cbBTC, aWETH…) into the underlying.
5. Exclude unpriced tokens and positions under $1 (reported back to the UI).

## Danger Score (`src/lib/risk/convexity-score.ts`)

`0.30·flow + 0.20·narrative + 0.25·concentration + 0.15·microstructure + 0.10·events`

| Factor | Inputs | Formula |
|---|---|---|
| Institutional flow | BTC+ETH ETF 5-day net flow % of AUM, outflow streak | `50 + 50·tanh((−pct·25 + 3·streak)/50)` |
| Narrative | News + hot news (keyword sentiment) | bearish share ×65 + high-severity share ×35 |
| Concentration | Portfolio weights | `20 + 1.3·(top risky % − 25) + alt term + cushion term` |
| Microstructure | SoDEX range, ±25 bp depth, spread | `0.4·vol + 0.35·depth + 0.25·spread`, volume-weighted |
| Event proximity | Macro calendar | `15 + 85·(1 − e^(−load/60))`, impact × time decay, MoM/YoY deduped |

## Hedge sizing (`src/lib/hedge/hedge-composer.ts`)

- Instrument: dominant beta bucket → BTC-PERP or ETH-PERP (alts proxy to BTC).
- Size: `riskyUsd × dangerMultiplier(score) × profile` (0 below score 50; 10–45% from 50–100),
  capped by the user's max-hedge %, rounded by size.
- Preview: walks live SoDEX bids for average fill and slippage; warns on thin books,
  funding, staleness and the user's slippage limit.
- Confirmation records a **paper hedge** — no order is placed anywhere.

## Known limitations

- Outcome ledger is in server memory (resets; not shared across serverless instances).
- Preferences are per browser, not per account.
- News sentiment is keyword-based.
- No order placement.

## Local development notes

- `npm run dev` / `npm run build`. On Windows, run builds from a terminal whose path uses an
  uppercase `C:\` — a lowercase `c:\` working directory makes Next load its internals twice
  and fail prerendering with "Expected workStore to be initialized".
- `@coinbase/cdp-sdk` is in `serverExternalPackages` (pulled in by wagmi connectors; its
  optional `@x402/*` imports break server bundling otherwise).
