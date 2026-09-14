import type { DashboardFilters } from "@/types/dashboard";
import { defaultDashboardPeriod } from "@/lib/date-range";

export type AnalysisPeriod = DashboardFilters["periodo"];

const STORAGE_KEY = "klabin-analysis-period";

function isValid(period?: Partial<AnalysisPeriod> | null): period is AnalysisPeriod {
  return !!period?.inicio && !!period?.fim && period.inicio <= period.fim;
}

export function readAnalysisPeriod(): AnalysisPeriod | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as Partial<AnalysisPeriod> | null;
    return isValid(parsed) ? { inicio: parsed.inicio, fim: parsed.fim } : null;
  } catch {
    return null;
  }
}

export function saveAnalysisPeriod(period: AnalysisPeriod) {
  if (typeof window === "undefined" || !isValid(period)) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(period));
  window.dispatchEvent(new CustomEvent("klabin-analysis-period-change", { detail: period }));
}

export function resolveAnalysisPeriod(available: AnalysisPeriod, preferred = readAnalysisPeriod()): AnalysisPeriod {
  if (!isValid(available)) return available;
  if (!preferred || !isValid(preferred)) return defaultDashboardPeriod(available);

  // Reutiliza o período da Visão Geral apenas quando ele intersecta a base atual.
  const inicio = preferred.inicio < available.inicio ? available.inicio : preferred.inicio;
  const fim = preferred.fim > available.fim ? available.fim : preferred.fim;
  if (inicio <= fim) return { inicio, fim };

  return defaultDashboardPeriod(available);
}
