import type { EvidenceCard } from "@/types";

/**
 * Typed fallback evidence cards used when SoSoValue API is unavailable.
 * Source is "Mock" so the UI can label them correctly.
 * Reflect realistic bearish conditions matching the demo portfolio context.
 */
export const FALLBACK_EVIDENCE: EvidenceCard[] = [
  {
    id: "ev-fb-001",
    source: "Mock",
    title: "BTC spot ETF cumulative outflows hit $620M",
    description:
      "Three consecutive weeks of net outflows from spot BTC ETFs signal institutional repositioning. Cumulative outflows now exceed $620M from peak AUM levels, consistent with risk-off sentiment.",
    asset: "BTC",
    category: "ETF Flow",
    sentiment: "bearish",
    severity: "high",
    timestamp: "2026-06-02T08:00:00.000Z",
  },
  {
    id: "ev-fb-002",
    source: "Mock",
    title: "ETH ETF net flow turns negative after 2-week inflow streak",
    description:
      "Ethereum spot ETF products saw net outflows of $48M in the latest session, reversing a two-week inflow trend. Institutional appetite for ETH beta is softening.",
    asset: "ETH",
    category: "ETF Flow",
    sentiment: "bearish",
    severity: "medium",
    timestamp: "2026-06-02T07:30:00.000Z",
  },
  {
    id: "ev-fb-003",
    source: "Mock",
    title: "BTC perpetual open interest compressed 18% in 48 hours",
    description:
      "Open interest on BTC perpetual contracts fell sharply over the past 48 hours, indicating leveraged position unwinding. Reduced OI during price decline typically signals continued selling pressure.",
    asset: "BTC",
    category: "Market Structure",
    sentiment: "bearish",
    severity: "high",
    timestamp: "2026-06-02T06:00:00.000Z",
  },
  {
    id: "ev-fb-004",
    source: "Mock",
    title: "Macro event: Fed minutes release scheduled within 48 hours",
    description:
      "Federal Reserve meeting minutes are due for release. High-impact macro events historically increase crypto volatility and can trigger rapid repositioning among institutional holders.",
    asset: undefined,
    category: "Macro",
    sentiment: "neutral",
    severity: "high",
    timestamp: "2026-06-02T05:00:00.000Z",
  },
  {
    id: "ev-fb-005",
    source: "Mock",
    title: "Narrative pressure: 'sell in May' seasonal pattern active",
    description:
      "Social sentiment analysis shows elevated mentions of seasonal selling patterns. While not a fundamental signal, increased narrative pressure can amplify momentum-driven moves.",
    asset: "BTC",
    category: "Sentiment",
    sentiment: "bearish",
    severity: "medium",
    timestamp: "2026-06-02T04:00:00.000Z",
  },
  {
    id: "ev-fb-006",
    source: "Mock",
    title: "SOL ecosystem: network congestion reports increasing",
    description:
      "Reports of intermittent Solana network congestion have surfaced. High-beta alts like SOL tend to underperform during periods of technical uncertainty.",
    asset: "SOL",
    category: "Network",
    sentiment: "bearish",
    severity: "low",
    timestamp: "2026-06-02T03:30:00.000Z",
  },
];

/**
 * Compute a raw narrative pressure score from evidence cards (0–100).
 * Used by the risk engine as a factor input.
 */
export function computeNarrativePressure(cards: EvidenceCard[]): number {
  if (cards.length === 0) return 50;
  const bearish = cards.filter((c) => c.sentiment === "bearish").length;
  const high = cards.filter((c) => c.severity === "high").length;
  const bearishRatio = bearish / cards.length;
  const highRatio = high / cards.length;
  return Math.round(Math.min(100, bearishRatio * 65 + highRatio * 35));
}

/**
 * Compute a raw institutional flow pressure score (0–100).
 * Without live ETF data, uses evidence card count as a proxy.
 */
export function computeInstitutionalFlowPressure(cards: EvidenceCard[]): number {
  const etfCards = cards.filter(
    (c) => c.category === "ETF Flow" && c.sentiment === "bearish"
  );
  const baseScore = etfCards.length >= 2 ? 75 : etfCards.length === 1 ? 60 : 40;
  const highSeverityBonus = etfCards.filter((c) => c.severity === "high").length * 6;
  return Math.min(100, baseScore + highSeverityBonus);
}
