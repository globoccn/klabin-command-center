import type { DashboardFilters } from "@/types/dashboard";

type Period = DashboardFilters["periodo"];

function isoLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function defaultDashboardPeriod(available: Period, now = new Date()): Period {
  if (!available.inicio || !available.fim) return available;

  const today = isoLocal(now);
  const currentMonthStart = `${today.slice(0, 7)}-01`;
  const availableEnd = available.fim;
  const availableStart = available.inicio;

  // Usa o mês vigente quando existe qualquer interseção entre a base e o mês atual.
  const currentEnd = availableEnd < today ? availableEnd : today;
  if (currentEnd >= currentMonthStart && availableStart <= currentEnd) {
    return {
      inicio: availableStart > currentMonthStart ? availableStart : currentMonthStart,
      fim: currentEnd,
    };
  }

  // A base ainda não chegou ao mês vigente: abre o mês mais recente disponível.
  const latestMonthStart = `${availableEnd.slice(0, 7)}-01`;
  return {
    inicio: availableStart > latestMonthStart ? availableStart : latestMonthStart,
    fim: availableEnd,
  };
}
