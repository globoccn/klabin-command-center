import { apiGet } from "@/services/apiClient";
import type {
  ClimateSummary,
  DashboardFilters,
  DashboardOverview,
  EvidenceResponse,
  FilterOptions,
  QualitySummary,
  RoundsSummary,
  TaskDetailResponse,
  TaskPage,
} from "@/types/dashboard";

export async function getOverview(filters?: Partial<DashboardFilters>): Promise<DashboardOverview> {
  return apiGet<DashboardOverview>("dashboard/overview", filterParams(filters));
}

export async function getFilterOptions(): Promise<FilterOptions> {
  return apiGet<FilterOptions>("dashboard/filters");
}

export async function getClimate(filters?: Partial<DashboardFilters>): Promise<ClimateSummary> {
  return apiGet<ClimateSummary>("dashboard/climate", filterParams(filters));
}

export async function getRounds(filters?: Partial<DashboardFilters>): Promise<RoundsSummary> {
  return apiGet<RoundsSummary>("dashboard/rounds", filterParams(filters));
}

export async function getQuality(filters?: Partial<DashboardFilters>): Promise<QualitySummary> {
  return apiGet<QualitySummary>("dashboard/quality", filterParams(filters));
}

export async function getTasks(
  filters?: Partial<DashboardFilters>,
  options?: { search?: string; page?: number; pageSize?: number },
): Promise<TaskPage> {
  return apiGet<TaskPage>("tasks", {
    ...filterParams(filters),
    search: options?.search,
    page: options?.page ?? 1,
    pageSize: options?.pageSize ?? 10,
  });
}

const SNAPSHOT_START = "2025-11-04";
const SNAPSHOT_END = "2026-07-23";

export async function getTaskDetail(taskId: string): Promise<TaskDetailResponse> {
  return apiGet<TaskDetailResponse>(`tasks/${encodeURIComponent(taskId)}`);
}

export async function getEvidence(filters: {
  inicio: string;
  fim: string;
  tipo: string;
  atividade: string;
  andar: string;
  responsavel: string;
  busca: string;
  page?: number;
  pageSize?: number;
}, signal?: AbortSignal): Promise<EvidenceResponse> {
  const isFullPeriod = filters.inicio === SNAPSHOT_START && filters.fim === SNAPSHOT_END;
  return apiGet<EvidenceResponse>("dashboard/evidence", {
    inicio: isFullPeriod ? undefined : filters.inicio,
    fim: isFullPeriod ? undefined : filters.fim,
    tipo: filters.tipo === "Todos" ? undefined : filters.tipo,
    atividade: filters.atividade === "Todas" ? undefined : filters.atividade,
    andar: filters.andar === "Todos" ? undefined : filters.andar,
    responsavel: filters.responsavel === "Todos" ? undefined : filters.responsavel,
    busca: filters.busca || undefined,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 24,
  }, { signal });
}

function filterParams(filters?: Partial<DashboardFilters>) {
  const inicio = filters?.periodo?.inicio;
  const fim = filters?.periodo?.fim;
  const isFullPeriod = inicio === SNAPSHOT_START && fim === SNAPSHOT_END;

  return {
    inicio: isFullPeriod ? undefined : inicio,
    fim: isFullPeriod ? undefined : fim,
    projeto: filters?.projeto && filters.projeto !== "Todos" ? filters.projeto : undefined,
    subprojeto: filters?.subprojeto && filters.subprojeto !== "Todos" ? filters.subprojeto : undefined,
    andar: filters?.andar && filters.andar !== "Todos" ? filters.andar : undefined,
    status: filters?.status && filters.status !== "Todos" ? filters.status : undefined,
    responsavel: filters?.responsavel && filters.responsavel !== "Todos" ? filters.responsavel : undefined,
  };
}
