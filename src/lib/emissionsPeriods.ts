import type { EmissionsData } from "@/types/database";

// ---------------------------------------------------------------------------
// Period selection and aggregation for the dashboard.
// Every figure is summed from the saved quarterly records — nothing is estimated.
// ---------------------------------------------------------------------------

export const CATEGORY_KEYS = [
  { name: "Electricity", key: "electricity_emissions", color: "#3b82f6" },
  { name: "Fuel", key: "fuel_emissions", color: "#ef4444" },
  { name: "Flights", key: "flights_emissions", color: "#8b5cf6" },
  { name: "Gas", key: "gas_emissions", color: "#f97316" },
  { name: "Waste", key: "waste_emissions", color: "#92400e" },
  { name: "Water", key: "water_emissions", color: "#06b6d4" },
  { name: "Paper", key: "paper_emissions", color: "#64748b" },
] as const;

export type CategoryName = (typeof CATEGORY_KEYS)[number]["name"];

export const num = (val: unknown): number => {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

/** "Q1 2025" style label for a record, derived from its period dates when possible. */
export const quarterLabel = (r: EmissionsData): string => {
  if (r.period_start) {
    const d = new Date(`${r.period_start}T00:00:00`);
    if (!isNaN(d.getTime())) return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
  }
  return r.report_period || "Unknown period";
};

const sortKey = (r: EmissionsData) => r.period_start ?? r.created_at ?? "";

export type PeriodSelection =
  | { kind: "quarter"; label: string } // a single quarter, e.g. "Q2 2026"
  | { kind: "year"; year: number } // a calendar year
  | { kind: "all" };

export const selectionValue = (s: PeriodSelection): string =>
  s.kind === "quarter" ? `q:${s.label}` : s.kind === "year" ? `y:${s.year}` : "all";

export const parseSelection = (v: string): PeriodSelection =>
  v.startsWith("q:") ? { kind: "quarter", label: v.slice(2) }
    : v.startsWith("y:") ? { kind: "year", year: parseInt(v.slice(2), 10) }
    : { kind: "all" };

const yearOf = (r: EmissionsData): number | null => {
  if (!r.period_start) return null;
  const y = new Date(`${r.period_start}T00:00:00`).getFullYear();
  return isNaN(y) ? null : y;
};

export function recordsFor(records: EmissionsData[], s: PeriodSelection): EmissionsData[] {
  if (s.kind === "all") return records;
  if (s.kind === "year") return records.filter((r) => yearOf(r) === s.year);
  return records.filter((r) => quarterLabel(r) === s.label);
}

/** The comparable earlier period: previous quarter, previous year, or none for "all". */
export function previousSelection(s: PeriodSelection): PeriodSelection | null {
  if (s.kind === "year") return { kind: "year", year: s.year - 1 };
  if (s.kind === "quarter") {
    const m = s.label.match(/Q(\d) (\d{4})/);
    if (!m) return null;
    const q = parseInt(m[1], 10);
    const y = parseInt(m[2], 10);
    return { kind: "quarter", label: q === 1 ? `Q4 ${y - 1}` : `Q${q - 1} ${y}` };
  }
  return null;
}

/**
 * Records for the comparison period. For a calendar year only the same quarters of the
 * previous year are used (e.g. Q1–Q2 2026 vs Q1–Q2 2025), so a part-year is never
 * compared against a full year.
 */
export function previousRecords(records: EmissionsData[], s: PeriodSelection): EmissionsData[] {
  const prev = previousSelection(s);
  if (!prev) return [];
  const recs = recordsFor(records, prev);
  if (s.kind !== "year") return recs;
  const qNum = (r: EmissionsData) => quarterLabel(r).split(" ")[0];
  const currentQuarters = new Set(recordsFor(records, s).map(qNum));
  return recs.filter((r) => currentQuarters.has(qNum(r)));
}

export const selectionTitle = (s: PeriodSelection): string =>
  s.kind === "quarter" ? s.label : s.kind === "year" ? `Calendar year ${s.year}` : "All periods";

export const previousTitle = (s: PeriodSelection, prevQuarters: string[] = []): string => {
  if (s.kind === "quarter") return "previous quarter";
  if (s.kind === "year") {
    return prevQuarters.length > 0 && prevQuarters.length < 4
      ? `same quarters ${s.year - 1}`
      : `${s.year - 1}`;
  }
  return "";
};

type SiteEntry = { name?: string; total?: number | string; [k: string]: unknown };

/** site_breakdown is saved as [{ name, total, ... }] (current calculator) or { name: total } (older). */
const siteTotals = (raw: unknown): Record<string, number> => {
  let v = raw;
  if (typeof v === "string") {
    try { v = JSON.parse(v); } catch { return {}; }
  }
  const out: Record<string, number> = {};
  if (Array.isArray(v)) {
    (v as SiteEntry[]).forEach((s) => {
      if (s && typeof s.name === "string") out[s.name] = (out[s.name] ?? 0) + num(s.total);
    });
  } else if (v && typeof v === "object") {
    Object.entries(v as Record<string, unknown>).forEach(([name, val]) => {
      out[name] = (out[name] ?? 0) + (typeof val === "object" && val !== null ? num((val as SiteEntry).total) : num(val));
    });
  }
  return out;
};

export interface PeriodTotals {
  records: number;
  quarters: string[];
  total: number;
  scope1: number;
  scope2: number;
  scope3: number;
  categories: Record<CategoryName, number>;
  sites: Record<string, number>;
  /** Emissions not recorded against a site (fleet fuel, business travel). */
  organisationWide: number;
}

export function aggregate(records: EmissionsData[]): PeriodTotals {
  const categories = Object.fromEntries(CATEGORY_KEYS.map((c) => [c.name, 0])) as Record<CategoryName, number>;
  const sites: Record<string, number> = {};
  let total = 0, scope1 = 0, scope2 = 0, scope3 = 0;
  for (const r of records) {
    total += num(r.total_emissions);
    scope1 += num(r.scope1_total);
    scope2 += num(r.scope2_total);
    scope3 += num(r.scope3_total);
    for (const c of CATEGORY_KEYS) categories[c.name] += num((r as Record<string, unknown>)[c.key]);
    for (const [name, v] of Object.entries(siteTotals(r.site_breakdown))) sites[name] = (sites[name] ?? 0) + v;
  }
  const siteSum = Object.values(sites).reduce((a, b) => a + b, 0);
  return {
    records: records.length,
    quarters: [...records].sort((a, b) => sortKey(a).localeCompare(sortKey(b))).map(quarterLabel),
    total, scope1, scope2, scope3, categories, sites,
    organisationWide: Math.max(0, total - siteSum),
  };
}

/** % change from previous to current, or null when there is nothing meaningful to compare. */
export const pctChange = (current: number, previous: number | null | undefined): number | null =>
  previous && previous > 0 ? ((current - previous) / previous) * 100 : null;

export interface PeriodOption { value: string; label: string; group: "Quarter" | "Calendar year" | "Overall" }

export function periodOptions(records: EmissionsData[]): PeriodOption[] {
  const sorted = [...records].sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  const quarters = [...new Set(sorted.map(quarterLabel))];
  const years = [...new Set(sorted.map(yearOf).filter((y): y is number => y !== null))];
  return [
    { value: "all", label: "All periods", group: "Overall" },
    ...years.map((y) => {
      const n = sorted.filter((r) => yearOf(r) === y).length;
      return { value: `y:${y}`, label: `${y} (${n} of 4 quarters)`, group: "Calendar year" as const };
    }),
    ...quarters.map((q) => ({ value: `q:${q}`, label: q, group: "Quarter" as const })),
  ];
}

export function quarterlyTrend(records: EmissionsData[]) {
  return [...records]
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
    .map((r) => ({
      quarter: quarterLabel(r),
      scope1: num(r.scope1_total),
      scope2: num(r.scope2_total),
      scope3: num(r.scope3_total),
      total: num(r.total_emissions),
    }));
}

export function yearlyTotals(records: EmissionsData[]): Record<string, PeriodTotals> {
  const out: Record<string, PeriodTotals> = {};
  const years = [...new Set(records.map(yearOf).filter((y): y is number => y !== null))].sort();
  for (const y of years) out[String(y)] = aggregate(records.filter((r) => yearOf(r) === y));
  return out;
}
