/**
 * SoSoValue OpenAPI — low-level HTTP client. Server-side only.
 *
 * Docs:      https://sosovalue-1.gitbook.io/sosovalue-api-doc
 * Base URL:  https://openapi.sosovalue.com/openapi/v1
 * Auth:      `x-soso-api-key: <key>` header on every request
 * Envelope:  { code: 0, message: "success", data: ..., details: null }
 * Limits:    20 req/min, 100,000 req/month per key — callers must cache.
 *
 * Response shapes below were verified against the live API (2026-11-21),
 * which differs from the docs in a few places (e.g. `release_time` is a
 * numeric string, `matched_currencies` uses `currency_id`/`symbol`).
 */

const DEFAULT_BASE_URL = "https://openapi.sosovalue.com/openapi/v1";
const DEFAULT_TIMEOUT_MS = 8_000;

// ─────────────────────────────────────────────
// Errors
// ─────────────────────────────────────────────

const ERROR_HINTS: Record<number, string> = {
  400001: "invalid parameter format",
  400002: "missing required parameter",
  400003: "invalid parameter value",
  400101: "invalid API key",
  400102: "API key expired",
  400301: "insufficient permissions for this endpoint",
  400401: "resource not found",
  400402: "endpoint not found",
  42901: "rate limit exceeded",
  402901: "rate limit exceeded",
  500001: "SoSoValue internal error",
  500301: "SoSoValue service unavailable",
};

export class SoSoValueError extends Error {
  constructor(
    message: string,
    readonly path: string,
    readonly httpStatus?: number,
    readonly code?: number
  ) {
    super(message);
    this.name = "SoSoValueError";
  }

  get isAuthError() {
    return this.code === 400101 || this.code === 400102 || this.httpStatus === 401;
  }

  get isRateLimited() {
    return this.httpStatus === 429 || this.code === 42901 || this.code === 402901;
  }
}

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

export function getSoSoValueConfig() {
  const apiKey = process.env.SOSOVALUE_API_KEY?.trim() ?? "";
  let baseUrl = (process.env.SOSOVALUE_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");
  // Older .env files point at the bare host; the API lives under /openapi/v1.
  if (!/\/openapi\/v\d+$/.test(baseUrl)) baseUrl = `${baseUrl}/openapi/v1`;
  return { apiKey, baseUrl, configured: apiKey.length > 0 };
}

// ─────────────────────────────────────────────
// Core request
// ─────────────────────────────────────────────

type Envelope<T> = { code: number; message?: string; data: T; details?: unknown };
type QueryValue = string | number | undefined;

export async function ssvGet<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const { apiKey, baseUrl } = getSoSoValueConfig();
  if (!apiKey) throw new SoSoValueError("SOSOVALUE_API_KEY is not set", path);

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  const url = `${baseUrl}${path}${qs.size ? `?${qs}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "x-soso-api-key": apiKey, Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (err) {
    const reason = err instanceof Error && err.name === "TimeoutError" ? `timed out after ${timeoutMs}ms` : String(err);
    throw new SoSoValueError(`${path}: network error — ${reason}`, path);
  }

  const text = await res.text();
  let body: Envelope<T> | null = null;
  try {
    body = JSON.parse(text) as Envelope<T>;
  } catch {
    // Non-JSON (e.g. Cloudflare HTML block page)
  }

  if (!body || typeof body !== "object" || !("code" in body)) {
    throw new SoSoValueError(`${path}: HTTP ${res.status}, non-JSON response`, path, res.status);
  }
  if (body.code !== 0 || !res.ok) {
    const hint = ERROR_HINTS[body.code] ?? body.message ?? "unknown error";
    throw new SoSoValueError(`${path}: ${hint} (code ${body.code}, HTTP ${res.status})`, path, res.status, body.code);
  }
  return body.data;
}

// ─────────────────────────────────────────────
// Response types (as returned by the live API)
// ─────────────────────────────────────────────

export type EtfSymbol = "BTC" | "ETH" | "SOL" | "LTC" | "HBAR" | "XRP" | "DOGE" | "LINK" | "AVAX" | "DOT";

export type EtfSummaryDay = {
  date: string; // yyyy-MM-dd
  total_net_inflow: number; // USD, negative = outflow
  total_value_traded: number;
  total_net_assets: number;
  cum_net_inflow: number;
};

export type NewsMatchedCurrency = { currency_id: string; symbol: string; name: string };

export type NewsItem = {
  id: string;
  source_link: string;
  original_link?: string | null;
  release_time: string | number; // ms epoch (string in practice)
  title: string | null;
  content: string | null; // may contain HTML
  author?: string | null;
  category?: number;
  matched_currencies?: NewsMatchedCurrency[] | null;
  tags?: string[] | null;
};

export type HotNewsItem = {
  id: string | number;
  source_link: string;
  release_time: string | number;
  title: string | null;
  content: string | null;
};

export type Paged<T> = { page: number; page_size: number; total: number; list: T[] };

export type MacroCalendarDay = { date: string; events: string[] };

export type MacroRate = {
  code: string;
  name: string;
  unit: "percent" | "usd";
  latest_date: string;
  latest_value: string;
};

/** News categories: 1 news, 2 research, 3 institution, 4 insights/KOL, 7 announcement, 13 crypto stock news */
export type NewsCategory = 1 | 2 | 3 | 4 | 7 | 13;

// ─────────────────────────────────────────────
// Endpoint wrappers
// ─────────────────────────────────────────────

/** Daily aggregate spot-ETF flows, newest first. Non-trading days excluded. */
export function getEtfSummaryHistory(symbol: EtfSymbol, countryCode: "US" | "HK" = "US", limit = 30) {
  return ssvGet<EtfSummaryDay[]>("/etfs/summary-history", {
    symbol,
    country_code: countryCode,
    limit,
  });
}

export function getNews(opts: { category?: NewsCategory; pageSize?: number; page?: number; language?: string } = {}) {
  return ssvGet<Paged<NewsItem>>("/news", {
    category: opts.category,
    page: opts.page ?? 1,
    page_size: opts.pageSize ?? 20,
    language: opts.language ?? "en",
  });
}

export function getHotNews(opts: { pageSize?: number; language?: string } = {}) {
  return ssvGet<Paged<HotNewsItem>>("/news/hot", {
    page: 1,
    page_size: opts.pageSize ?? 20,
    language: opts.language ?? "en",
  });
}

/** Upcoming macro calendar (no params). Event names may carry trailing spaces. */
export function getMacroCalendar() {
  return ssvGet<MacroCalendarDay[]>("/macro/events");
}

export type CurrencyListItem = { currency_id: string; symbol: string; name: string };

export type CurrencySnapshot = {
  price: number;
  /** Fraction, e.g. -0.0587 = −5.87% */
  change_pct_24h: number;
  high_24h: number;
  low_24h: number;
  marketcap: number;
  marketcap_rank?: number;
};

/** Note: returns only the ~20 largest assets; pagination params are ignored. */
export function getCurrencies() {
  return ssvGet<CurrencyListItem[]>("/currencies");
}

export function getCurrencySnapshot(currencyId: string) {
  return ssvGet<CurrencySnapshot>(`/currencies/${encodeURIComponent(currencyId)}/market-snapshot`);
}

export function getMacroRates() {
  return ssvGet<MacroRate[]>("/macro/rates");
}
