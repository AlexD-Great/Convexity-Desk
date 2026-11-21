// ============================================================================
// Convexity Desk — Core TypeScript Types
// ============================================================================

export type BetaBucket =
  | "BTC_BETA"
  | "ETH_BETA"
  | "HIGH_BETA_ALT"
  | "STABLE"
  | "SSI_INDEX";

export type PortfolioAsset = {
  symbol: string;
  name: string;
  amount: number;
  priceUsd: number;
  valueUsd: number;
  weight: number;
  riskContribution: number;
  betaBucket: BetaBucket;
  hedgeable: boolean;
  /** Where priceUsd came from; "unavailable" means value is excluded */
  priceSource?: "sodex-perp" | "sodex-spot" | "sosovalue" | "peg" | "alchemy" | "unavailable";
  /** Chains this position was found on (wallet portfolios) */
  chains?: string[];
  change24hPct?: number;
  /** Annualised 30-day realised volatility (0.55 = 55%) */
  volatility30d?: number;
  /** "realized" from SoDEX klines, or "bucket" default when history is missing */
  volatilitySource?: "realized" | "bucket";
};

export type Portfolio = {
  id: string;
  ownerAddress?: string;
  mode: "demo" | "wallet";
  totalValueUsd: number;
  assets: PortfolioAsset[];
  updatedAt: string;
  pricing?: {
    asOf: string;
    /** Symbols with no live price (valued at $0) */
    missing: string[];
  };
};

export type RiskFactorKey =
  | "institutional_flow"
  | "narrative_pressure"
  | "portfolio_concentration"
  | "market_microstructure"
  | "event_proximity";

export type RiskFactor = {
  key: RiskFactorKey;
  label: string;
  score: number;
  weight: number;
  explanation: string;
  evidenceIds: string[];
};

export type RiskLevel = "Normal" | "Watch" | "Elevated" | "High Risk";

export type RiskScan = {
  id: string;
  portfolioId: string;
  dangerScore: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  summary: string;
  createdAt: string;
};

export type EvidenceSource = "SoSoValue" | "SoDEX" | "Internal" | "Mock";
export type EvidenceSentiment = "bullish" | "bearish" | "neutral";
export type EvidenceSeverity = "low" | "medium" | "high";

export type EvidenceCard = {
  id: string;
  source: EvidenceSource;
  title: string;
  description: string;
  asset?: string;
  category?: string;
  sentiment?: EvidenceSentiment;
  severity: EvidenceSeverity;
  timestamp: string;
  url?: string;
};

export type HedgeDirection = "short" | "long" | "reduce" | "hold";
export type OrderType = "limit" | "market" | "ioc" | "simulation";

export type HedgePlan = {
  id: string;
  scanId: string;
  instrument: string;
  direction: HedgeDirection;
  suggestedSizeUsd: number;
  /** Portfolio value the plan was sized against */
  portfolioValueUsd?: number;
  coveragePercent: number;
  confidence: number;
  orderType: OrderType;
  estimatedSlippageBps: number;
  rationale: string;
  risks: string[];
  createdAt: string;
};

export type OutcomeStatus =
  | "pending"
  | "useful"
  | "neutral"
  | "wasteful"
  | "avoided_loss"
  | "missed_hedge";

export type ActionTaken = "simulated" | "testnet_executed" | "cancelled";

export type OutcomeLedgerEntry = {
  id: string;
  hedgePlanId: string;
  status: OutcomeStatus;
  actionTaken: ActionTaken;
  orderId?: string;
  coverageBefore: number;
  coverageAfter: number;
  notes: string;
  createdAt: string;
};

export type IntegrationMode = "live" | "fallback" | "mock" | "error";
/** Overall data health: every source live, some live, or none (sample data). */
export type AppMode = "live" | "mixed" | "fallback";

export type IntegrationDetail = {
  mode: IntegrationMode;
  label: string;
  reason: string;
  configured: boolean;
  endpoint?: string;
};

export type IntegrationStatus = {
  sosovalue: IntegrationMode;
  sodex: IntegrationMode;
  mode: AppMode;
  lastCheckedAt: string;
  details: {
    sosovalue: IntegrationDetail;
    sodex: IntegrationDetail;
  };
};

export type RiskProfile = "conservative" | "balanced" | "aggressive";

export type AdapterResponse<T> = {
  data: T;
  mode: IntegrationMode;
  fetchedAt: string;
  reason?: string;
  endpoint?: string;
};
