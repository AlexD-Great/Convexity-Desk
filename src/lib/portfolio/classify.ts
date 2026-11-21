import type { BetaBucket } from "@/types";
import { canonicalSymbol } from "@/lib/prices/price-service";

const STABLES = new Set([
  "USDC", "USDT", "DAI", "USDS", "USDE", "SUSDE", "FDUSD", "PYUSD", "FRAX", "LUSD", "GHO",
  "TUSD", "USDP", "CRVUSD", "USDBC", "USDC.E", "USD0", "RLUSD",
]);
const BTC_LIKE = new Set(["BTC", "WBTC", "CBBTC", "TBTC", "LBTC", "SOLVBTC"]);
const ETH_LIKE = new Set(["ETH", "WETH", "STETH", "WSTETH", "RETH", "CBETH", "WEETH", "EZETH", "METH"]);

/** Risk bucket for a token symbol. Unknown tokens default to high-beta alt. */
export function classifyAsset(symbol: string): BetaBucket {
  const raw = symbol.trim().toUpperCase();
  const canon = canonicalSymbol(raw);
  if (STABLES.has(raw) || STABLES.has(canon)) return "STABLE";
  if (BTC_LIKE.has(raw) || canon === "BTC") return "BTC_BETA";
  if (ETH_LIKE.has(raw) || canon === "ETH") return "ETH_BETA";
  if (/SSI$/i.test(raw)) return "SSI_INDEX";
  return "HIGH_BETA_ALT";
}
