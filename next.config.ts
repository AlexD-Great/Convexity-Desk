import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // RainbowKit → @wagmi/connectors → @base-org/account → @coinbase/cdp-sdk.
  // cdp-sdk lazily imports optional @x402/* payment packages we never use;
  // bundling it on the server makes Turbopack fail on those unresolved imports.
  // Loading it as a plain Node module instead defers them to (never-called) runtime.
  serverExternalPackages: ["@coinbase/cdp-sdk"],
};

export default nextConfig;
