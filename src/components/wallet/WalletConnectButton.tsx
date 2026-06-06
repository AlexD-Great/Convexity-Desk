"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ChevronDown, LogOut } from "lucide-react";

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletConnectButton({ compact = false }: { compact?: boolean }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="flex items-center gap-2 rounded-lg border border-[#1f2937] bg-[#111827] px-3 py-1.5 text-xs text-[#d1d5db] transition-colors hover:border-[#7cffb2]/30 hover:text-white"
            >
              <Wallet className="h-3.5 w-3.5 text-[#7cffb2]" />
              <span className={compact ? "hidden sm:inline" : ""}>Connect Wallet</span>
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className="flex items-center gap-2 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-3 py-1.5 text-xs text-[#ef4444]"
            >
              Wrong network
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          );
        }

        return (
          <button
            type="button"
            onClick={openAccountModal}
            title="Open wallet menu to disconnect"
            className="flex items-center gap-2 rounded-lg border border-[#7cffb2]/25 bg-[#7cffb2]/10 px-3 py-1.5 text-xs text-[#7cffb2] transition-colors hover:bg-[#7cffb2]/15"
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>{shortAddress(account.address)}</span>
            {!compact && <LogOut className="h-3.5 w-3.5 opacity-60" />}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
