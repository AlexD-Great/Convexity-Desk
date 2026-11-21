"use client";

import { AlertTriangle, FlaskConical } from "lucide-react";
import { useIntegrationStatus } from "@/hooks/use-integration-status";
import { usePortfolioSource } from "@/hooks/use-portfolio-source";

/**
 * Shown only when something deserves attention:
 *  - a data source is down (its sample data is in use), or
 *  - the user is looking at demo holdings instead of their wallet.
 * When everything is live and the wallet is selected, nothing renders.
 */
export function DataStatusBanner() {
  const { data: status } = useIntegrationStatus();
  const { source, canUseWallet, setSource } = usePortfolioSource();

  const down = status
    ? [
        status.sosovalue !== "live" && "SoSoValue (ETF flows, news, macro)",
        status.sodex !== "live" && "SoDEX (prices, order books)",
      ].filter(Boolean)
    : [];

  if (down.length > 0) {
    return (
      <div className="flex items-center gap-2.5 border-b border-[#f59e0b]/15 bg-[#f59e0b]/[0.05] px-6 py-2.5">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#f59e0b]" />
        <p className="font-mono text-xs text-[#f59e0b]">
          {down.join(" and ")} unavailable
          <span className="ml-2 text-[#9ca3af]">— affected factors use labelled sample data until it recovers.</span>
        </p>
      </div>
    );
  }

  if (source === "demo") {
    return (
      <div className="flex items-center justify-between gap-4 border-b border-[#7cffb2]/10 bg-[#7cffb2]/[0.04] px-6 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[#7cffb2]" />
          <p className="truncate font-mono text-xs text-[#7cffb2]">
            Viewing demo holdings
            <span className="ml-2 hidden text-[#9ca3af] sm:inline">
              — live market data, sample portfolio.{" "}
              {canUseWallet ? "" : "Connect a wallet to analyse your own."}
            </span>
          </p>
        </div>
        {canUseWallet && (
          <button
            type="button"
            onClick={() => setSource("wallet")}
            className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[#7cffb2]/70 transition-colors hover:text-[#7cffb2]"
          >
            Use my wallet →
          </button>
        )}
      </div>
    );
  }

  return null;
}
