"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { RiskProfile } from "@/types";

/**
 * Hedge sizing preferences, saved in this browser and sent with every
 * /api/hedge/generate request (the server applies them).
 */

export type HedgePreferences = {
  riskProfile: RiskProfile;
  /** Cap on hedge notional as % of non-stablecoin exposure */
  maxHedgePct: number;
  /** Execution previews warn above this estimated slippage */
  maxSlippageBps: number;
};

export const DEFAULT_HEDGE_PREFERENCES: HedgePreferences = {
  riskProfile: "balanced",
  maxHedgePct: 50,
  maxSlippageBps: 25,
};

const KEY = "convexity:hedge-preferences";
const EVENT = "convexity:hedge-preferences-change";

let cachedRaw: string | null = null;
let cachedValue: HedgePreferences = DEFAULT_HEDGE_PREFERENCES;

function read(): HedgePreferences {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return DEFAULT_HEDGE_PREFERENCES;
  }
  if (raw === cachedRaw) return cachedValue; // stable reference for useSyncExternalStore
  cachedRaw = raw;
  try {
    cachedValue = { ...DEFAULT_HEDGE_PREFERENCES, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    cachedValue = DEFAULT_HEDGE_PREFERENCES;
  }
  return cachedValue;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useHedgePreferences() {
  const prefs = useSyncExternalStore(subscribe, read, () => DEFAULT_HEDGE_PREFERENCES);

  const update = useCallback((patch: Partial<HedgePreferences>) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }));
    } catch {
      /* storage blocked — preference won't persist */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { prefs, update };
}
