import { NextResponse } from "next/server";
import { getOutcomes } from "@/lib/data/outcomes-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = getOutcomes();
  return NextResponse.json({
    entries,
    total: entries.length,
    persistenceNote:
      "Entries are kept in server memory: they reset when the server restarts and may not appear across all requests in production.",
  });
}
