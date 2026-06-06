import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convexity Desk — Portfolio Protection for Crypto",
  description:
    "Protect your crypto portfolio before the drawdown becomes obvious. Convexity Desk scans institutional flow pressure, narrative risk, and SoDEX market structure to build an approval-gated hedge plan.",
  keywords: ["crypto", "portfolio", "hedge", "risk", "SoSoValue", "SoDEX"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} dark`}
    >
      <body className="min-h-screen antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
