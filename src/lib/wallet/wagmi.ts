"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { SUPPORTED_WALLET_CHAINS } from "./chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "convexity-desk-wallet-preview";

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Convexity Desk",
  projectId: walletConnectProjectId,
  chains: SUPPORTED_WALLET_CHAINS,
  ssr: true,
});
