import type { Portfolio } from "@/types";

const BASE_ASSETS: Portfolio["assets"] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    amount: 0.432,
    priceUsd: 42824,
    valueUsd: 18500,
    weight: 43.2,
    riskContribution: 38.5,
    betaBucket: "BTC_BETA",
    hedgeable: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: 4.12,
    priceUsd: 2233,
    valueUsd: 9200,
    weight: 21.5,
    riskContribution: 19.8,
    betaBucket: "ETH_BETA",
    hedgeable: true,
  },
  {
    symbol: "SOL",
    name: "Solana",
    amount: 31.5,
    priceUsd: 162,
    valueUsd: 5100,
    weight: 11.9,
    riskContribution: 14.2,
    betaBucket: "HIGH_BETA_ALT",
    hedgeable: true,
  },
  {
    symbol: "SOSO",
    name: "SoSo Token",
    amount: 4600,
    priceUsd: 0.5,
    valueUsd: 2300,
    weight: 5.4,
    riskContribution: 6.1,
    betaBucket: "HIGH_BETA_ALT",
    hedgeable: false,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: 7750,
    priceUsd: 1.0,
    valueUsd: 7750,
    weight: 18.0,
    riskContribution: 0.5,
    betaBucket: "STABLE",
    hedgeable: false,
  },
];

export function getDemoPortfolio(): Portfolio {
  return {
    id: "demo-portfolio-1",
    mode: "demo",
    totalValueUsd: 42850,
    assets: BASE_ASSETS,
    updatedAt: new Date().toISOString(),
  };
}
