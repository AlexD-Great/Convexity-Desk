import { NextResponse } from "next/server";
import { getPrices } from "@/lib/prices/price-service";

export const dynamic = "force-dynamic";

const MAX_SYMBOLS = 50;

/** GET /api/prices?symbols=ETH,USDC,WETH → { prices: { ETH: PriceQuote | null, … } } */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("symbols") ?? "";
  const symbols = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[A-Za-z0-9.]{1,20}$/.test(s))
    .slice(0, MAX_SYMBOLS);

  if (symbols.length === 0) {
    return NextResponse.json({ error: "Pass ?symbols=SYM1,SYM2" }, { status: 400 });
  }
  return NextResponse.json({ prices: await getPrices(symbols) });
}
