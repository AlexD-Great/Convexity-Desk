"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useAccount } from "wagmi";

/**
 * Which holdings the app analyses: the connected wallet or the demo set.
 * Shared across pages (and tabs) via localStorage. Defaults to the wallet
 * whenever one is connected, unless the user explicitly picked "demo".
 */

export type PortfolioSource = "wallet" | "demo";
type Preference = PortfolioSource | "auto";

const KEY = "convexity:portfolio-source";
const EVENT = "convexity:portfolio-source-change";

function readPref(): Preference {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "wallet" || v === "demo" ? v : "auto";
  } catch {
    return "auto";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function usePortfolioSource() {
  const { address, isConnected } = useAccount();
  const pref = useSyncExternalStore(subscribe, readPref, () => "auto" as Preference);

  const source: PortfolioSource = isConnected && address && pref !== "demo" ? "wallet" : "demo";

  const setSource = useCallback((next: PortfolioSource) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked — preference just won't persist */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return {
    source,
    setSource,
    address: source === "wallet" ? address : undefined,
    canUseWallet: Boolean(isConnected && address),
    /** POST body for /api/scan/run and /api/hedge/generate */
    requestBody: source === "wallet" && address ? JSON.stringify({ address }) : "{}",
    label: source === "wallet" ? "Your wallet" : "Demo holdings",
  };
}
