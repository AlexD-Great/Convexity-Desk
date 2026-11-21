"use client";

import { connectorsForWallets, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { SUPPORTED_WALLET_CHAINS } from "./chains";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Convexity Desk";
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

/**
 * With a WalletConnect project ID: full RainbowKit wallet list (QR, mobile, etc.).
 * Without one: browser-extension wallets only (MetaMask, Rabby, Coinbase extension…),
 * so no WalletConnect relay calls are made with an invalid ID.
 */
export const wagmiConfig = walletConnectProjectId
  ? getDefaultConfig({
      appName,
      projectId: walletConnectProjectId,
      chains: SUPPORTED_WALLET_CHAINS,
      ssr: true,
    })
  : createConfig({
      chains: SUPPORTED_WALLET_CHAINS,
      connectors: connectorsForWallets(
        [{ groupName: "Browser wallet", wallets: [injectedWallet] }],
        // projectId is only used by WalletConnect-based wallets, none of which are listed.
        { appName, projectId: "extension-only" }
      ),
      transports: Object.fromEntries(
        SUPPORTED_WALLET_CHAINS.map((c) => [c.id, http()])
      ) as Record<(typeof SUPPORTED_WALLET_CHAINS)[number]["id"], ReturnType<typeof http>>,
      ssr: true,
    });
