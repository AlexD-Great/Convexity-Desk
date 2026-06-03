import { NextResponse } from "next/server";
import { getOutcomes } from "@/lib/data/outcomes-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = getOutcomes();
  return NextResponse.json({
    entries,
    total: entries.length,
    mode: "demo",
    persistenceNote:
      "Wave 2: in-memory store — resets on server restart. Wave 3 will add Supabase persistence.",
  });
}
