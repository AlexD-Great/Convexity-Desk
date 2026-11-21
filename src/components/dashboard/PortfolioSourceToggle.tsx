"use client";

import { Wallet, FlaskConical } from "lucide-react";
import { usePortfolioSource } from "@/hooks/use-portfolio-source";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

export function PortfolioSourceToggle({ showConnect = true }: { showConnect?: boolean }) {
  const { source, setSource, canUseWallet, address } = usePortfolioSource();

  const options = [
    { value: "wallet" as const, label: "My wallet", icon: Wallet, disabled: !canUseWallet },
    { value: "demo" as const, label: "Demo holdings", icon: FlaskConical, disabled: false },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map(({ value, label, icon: Icon, disabled }) => {
        const active = source === value;
        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => setSource(value)}
            title={disabled ? "Connect a wallet first" : undefined}
            className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              borderColor: active ? "#7cffb240" : "#1f2937",
              backgroundColor: active ? "#7cffb212" : "#0b1020",
              color: active ? "#7cffb2" : "#9ca3af",
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
      {source === "wallet" && address && (
        <span className="font-mono text-[11px] text-[#6b7280]">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
      )}
      {showConnect && !canUseWallet && <WalletConnectButton />}
    </div>
  );
}
