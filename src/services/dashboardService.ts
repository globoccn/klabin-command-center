import { overview, tasks } from "@/data/mockData";
import type { DashboardOverview, DashboardFilters, Task } from "@/types/dashboard";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function getOverview(_filters?: Partial<DashboardFilters>): Promise<DashboardOverview> {
  await delay();
  return overview;
}

export async function getTasks(filters?: Partial<DashboardFilters> & { search?: string }): Promise<Task[]> {
  await delay(250);
  let result = tasks;
  if (filters?.projeto && filters.projeto !== "Todos") result = result.filter((t) => t.projeto === filters.projeto);
  if (filters?.status && filters.status !== "Todos") result = result.filter((t) => t.status === filters.status);
  if (filters?.responsavel && filters.responsavel !== "Todos") result = result.filter((t) => t.responsavel === filters.responsavel);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((t) => t.titulo.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }
  return result;
}
