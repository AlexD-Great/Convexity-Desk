import { NextResponse } from "next/server";
import { PortfolioError, resolvePortfolio } from "@/lib/portfolio/resolve-portfolio";

export const dynamic = "force-dynamic";

/** GET /api/portfolio/wallet?address=0x… → { portfolio, wallet } */
export async function GET(request: Request) {
  const address = new URL(request.url).searchParams.get("address")?.trim();
  if (!address) return NextResponse.json({ error: "Pass ?address=0x…" }, { status: 400 });
  try {
    const { portfolio, wallet } = await resolvePortfolio({ address });
    return NextResponse.json({ portfolio, wallet });
  } catch (err) {
    const status = err instanceof PortfolioError ? err.status : 500;
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status });
  }
}
