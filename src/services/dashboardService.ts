import { overview, tasks } from "@/data/mockData";
import type { ChartSeries, DashboardFilters, DashboardOverview, Task } from "@/types/dashboard";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const FULL_PERIOD = { inicio: "2025-11-04", fim: "2026-07-23" };

export async function getOverview(filters?: Partial<DashboardFilters>): Promise<DashboardOverview> {
  await delay();
  if (!filters || !hasActiveFilters(filters)) return structuredClone(overview);

  const filteredTasks = applyTaskFilters(tasks, filters);
  const ratio = filteredTasks.length / Math.max(tasks.length, 1);
  const total = Math.max(filteredTasks.length ? 1 : 0, Math.round(3783 * ratio));
  const concludedSample = filteredTasks.filter((task) => task.status === "Concluída").length;
  const completionRate = filteredTasks.length ? concludedSample / filteredTasks.length : 0;
  const completed = Math.min(total, Math.round(total * completionRate));
  const open = Math.max(0, total - completed);
  const tasksWithEvidenceSample = filteredTasks.filter((task) => task.anexos.length > 0).length;
  const evidenceRate = filteredTasks.length ? tasksWithEvidenceSample / filteredTasks.length : 0;
  const tasksWithEvidence = Math.round(total * evidenceRate);
  const photoCount = filteredTasks.reduce((sum, task) => sum + task.anexos.length, 0);
  const photos = filteredTasks.length ? Math.round(total * (photoCount / filteredTasks.length) * 1.42) : 0;

  const projectSeries = buildProjectSeries(filteredTasks, total, filters.projeto);
  const statusSeries = scaleSeries(overview.statusAbertos, open / Math.max(overview.kpis[2].value as number, 1));
  const climateScale = filters.subprojeto === "Ajuste temperatura - CCN" || filters.projeto === "Chamados" ? Math.max(.1, ratio * 1.18) : ratio;
  const filteredMonths = filterMonthlySeries(overview.evolucaoMensal, filters.periodo);

  return {
    ...structuredClone(overview),
    kpis: [
      { ...overview.kpis[0], value: total },
      { ...overview.kpis[1], value: completed },
      { ...overview.kpis[2], value: open },
      { ...overview.kpis[3], value: Number((completionRate * 100).toFixed(1)) },
      { ...overview.kpis[4], value: tasksWithEvidence },
      { ...overview.kpis[5], value: photos },
    ],
    tarefasPorProjeto: projectSeries,
    evolucaoMensal: filteredMonths.map((point) => ({
      ...point,
      concluidas: Math.round(point.concluidas * Math.max(.04, ratio)),
      emAberto: Math.round(point.emAberto * Math.max(.04, ratio)),
      total: Math.round(point.total * Math.max(.04, ratio)),
    })),
    statusAbertos: statusSeries,
    climatizacaoTipo: scaleSeries(overview.climatizacaoTipo, climateScale),
    topSetoresClimatizacao: scaleSeries(overview.topSetoresClimatizacao, climateScale),
    climatizacaoHorario: scaleSeries(overview.climatizacaoHorario, climateScale),
    climatizacaoDiaSemana: scaleSeries(overview.climatizacaoDiaSemana, climateScale),
    atividadesRonda: scaleSeries(overview.atividadesRonda, filters.projeto === "Chamados" ? ratio * .35 : Math.max(.08, ratio)),
    evidencias: {
      percentualComEvidencia: Number((evidenceRate * 100).toFixed(1)),
      totalFotos: photos,
      tarefasComFotos: tasksWithEvidence,
    },
    backlogPorIdade: scaleSeries(overview.backlogPorIdade, open / Math.max(overview.kpis[2].value as number, 1)),
  };
}

export async function getTasks(filters?: Partial<DashboardFilters> & { search?: string }): Promise<Task[]> {
  await delay(180);
  let result = applyTaskFilters(tasks, filters);

  if (filters?.search) {
    const query = normalize(filters.search);
    result = result.filter((task) =>
      normalize(`${task.id} ${task.titulo} ${task.descricao ?? ""} ${task.setor} ${task.servico}`).includes(query),
    );
  }

  return result;
}

function applyTaskFilters(source: Task[], filters?: Partial<DashboardFilters>) {
  if (!filters) return [...source];

  const start = filters.periodo?.inicio ? new Date(`${filters.periodo.inicio}T00:00:00`) : undefined;
  const end = filters.periodo?.fim ? new Date(`${filters.periodo.fim}T23:59:59`) : undefined;

  return source.filter((task) => {
    const createdAt = new Date(task.criadoEm);
    if (start && createdAt < start) return false;
    if (end && createdAt > end) return false;
    if (filters.projeto && filters.projeto !== "Todos" && task.projeto !== filters.projeto) return false;
    if (filters.subprojeto && filters.subprojeto !== "Todos" && task.subprojeto !== filters.subprojeto) return false;
    if (filters.andar && filters.andar !== "Todos" && task.andar !== filters.andar) return false;
    if (filters.status && filters.status !== "Todos" && task.status !== filters.status) return false;
    if (filters.responsavel && filters.responsavel !== "Todos" && task.responsavel !== filters.responsavel) return false;
    return true;
  });
}

function hasActiveFilters(filters: Partial<DashboardFilters>) {
  const period = filters.periodo;
  return Boolean(
    (period && (period.inicio !== FULL_PERIOD.inicio || period.fim !== FULL_PERIOD.fim)) ||
    (filters.projeto && filters.projeto !== "Todos") ||
    (filters.subprojeto && filters.subprojeto !== "Todos") ||
    (filters.andar && filters.andar !== "Todos") ||
    (filters.status && filters.status !== "Todos") ||
    (filters.responsavel && filters.responsavel !== "Todos"),
  );
}

function buildProjectSeries(filteredTasks: Task[], total: number, selectedProject?: string): ChartSeries[] {
  if (selectedProject && selectedProject !== "Todos") {
    const original = overview.tarefasPorProjeto.find((item) => item.name === selectedProject);
    return [{ name: selectedProject, value: total, color: original?.color ?? "#10B866" }];
  }

  const sampleTotal = Math.max(filteredTasks.length, 1);
  return overview.tarefasPorProjeto.map((item) => ({
    ...item,
    value: Math.round(total * (filteredTasks.filter((task) => task.projeto === item.name).length / sampleTotal)),
  }));
}

function scaleSeries(series: ChartSeries[], scale: number): ChartSeries[] {
  return series.map((item) => ({ ...item, value: Math.max(scale > 0 ? 1 : 0, Math.round(item.value * Math.max(0, scale))) }));
}

function filterMonthlySeries(series: DashboardOverview["evolucaoMensal"], period?: DashboardFilters["periodo"]) {
  if (!period) return series;
  const monthMap: Record<string, string> = {
    "Nov/25": "2025-11-01",
    "Dez/25": "2025-12-01",
    "Jan/26": "2026-01-01",
    "Fev/26": "2026-02-01",
    "Mar/26": "2026-03-01",
    "Abr/26": "2026-04-01",
    "Mai/26": "2026-05-01",
    "Jun/26": "2026-06-01",
    "Jul/26": "2026-07-01",
  };
  const start = new Date(`${period.inicio.slice(0, 7)}-01T00:00:00`);
  const end = new Date(`${period.fim.slice(0, 7)}-28T23:59:59`);
  const selected = series.filter((point) => {
    const pointDate = new Date(`${monthMap[point.month]}T00:00:00`);
    return pointDate >= start && pointDate <= end;
  });
  return selected.length ? selected : series.slice(-1);
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
