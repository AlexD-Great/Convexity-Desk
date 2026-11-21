# Convexity Desk

> Protect your crypto portfolio before the drawdown becomes obvious.

Convexity Desk reads your wallet, scores the downside risk building against it, and
proposes a sized hedge — using live SoSoValue institutional data and live SoDEX
market structure.

**Live:** https://convexity-desk.vercel.app

## What it does

**Portfolio → Risk Scan → Evidence → Hedge Plan → Preview → Confirm → Ledger**

- **Wallet scanning** — every token on Ethereum, Base, Arbitrum and Optimism (via Alchemy),
  spam and dust filtered, wrapped assets rolled into their underlying, valued at live prices.
- **Danger Score** — five deterministic factors:
  US spot ETF flows, news pressure, portfolio concentration, SoDEX order-book stress,
  and upcoming macro releases. Every factor cites the numbers behind it.
- **Hedge plans** — BTC/ETH perp shorts sized to your risky exposure, Danger Score and
  preferences (risk profile, max hedge %, max slippage), with slippage estimated by
  walking the live SoDEX order book.
- **Honest data** — every source reports live / stale / fallback; anything down is bannered.
  Sample data is labelled and never shown as live.

Confirming a plan records a **paper hedge**. Convexity Desk does not place orders and is
not financial advice.

## Run locally

```bash
npm install
cp .env.example .env.local   # add SOSOVALUE_API_KEY and ALCHEMY_API_KEY
npm run dev                  # http://localhost:3000
```

See [.env.example](.env.example) for every variable. Only `SOSOVALUE_API_KEY` is needed for
live risk factors; `ALCHEMY_API_KEY` enables full wallet token discovery. SoDEX needs no key.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
TanStack Query · RainbowKit + wagmi 2 + viem · Recharts · Framer Motion · Vercel

## Docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — data sources, pipelines, formulas, limitations
- `/methodology` and `/docs` in the app — user-facing explanation and API reference
- [docs/archive/](docs/archive/) — the original hackathon PRD and progress log (historical)

## Roadmap

1. Durable storage for the outcome ledger and preferences
2. Entry-price tracking so each hedge is scored on what actually happened; Danger Score history
3. SoDEX testnet order placement behind the confirmation gate, with size/slippage limits
4. Alerts when the Danger Score crosses a threshold
5. Tests for the risk engine and hedge sizing
