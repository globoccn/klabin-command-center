import type { ChartSeries, DashboardOverview, Kpi } from "../types/dashboard";
import { fmtDec, fmtInt } from "./format";

export type RecommendationTone = "high" | "medium" | "low" | "positive";

export type OverviewRecommendation = {
  title: string;
  detail: string;
  tone: RecommendationTone;
  href: "/chamados" | "/climatizacao" | "/rondas" | "/evidencias" | "/qualidade";
};

export function numberKpi(data: DashboardOverview, id: string) {
  const value = data.kpis.find((item) => item.id === id)?.value;
  return Number(value ?? 0);
}

export function kpiById(data: DashboardOverview, id: string): Kpi | undefined {
  return data.kpis.find((item) => item.id === id);
}

function seriesValue(series: ChartSeries[], name: string) {
  return Number(series.find((item) => item.name === name)?.value ?? 0);
}

export function operationalModel(data: DashboardOverview) {
  const total = numberKpi(data, "total");
  const completed = numberKpi(data, "concluidas");
  const open = numberKpi(data, "abertas");
  const completionRate = numberKpi(data, "taxa");
  const evidenceRate = Number(data.evidencias.percentualComEvidencia ?? 0);
  const sectorCoverage = Number(data.qualidadeDados.coberturaSetor ?? 0);
  const criticalBacklog = seriesValue(data.backlogPorIdade, "91 a 180 dias") + seriesValue(data.backlogPorIdade, "Mais de 180 dias");
  const criticalBacklogRate = open > 0 ? (criticalBacklog / open) * 100 : 0;
  const backlogHealth = Math.max(0, 100 - criticalBacklogRate * 2);
  const score = Math.max(0, Math.min(100, Math.round(
    completionRate * 0.4 + evidenceRate * 0.2 + sectorCoverage * 0.2 + backlogHealth * 0.2,
  )));

  const status = score >= 85
    ? { label: "Operação estável", headline: "Operação em boas condições", tone: "positive" as const }
    : score >= 70
      ? { label: "Acompanhamento", headline: "Operação requer acompanhamento", tone: "warning" as const }
      : { label: "Atenção prioritária", headline: "Operação com pontos críticos", tone: "critical" as const };

  return {
    total,
    completed,
    open,
    completionRate,
    evidenceRate,
    sectorCoverage,
    criticalBacklog,
    criticalBacklogRate,
    backlogHealth,
    score,
    status,
  };
}

export function recommendationsFor(data: DashboardOverview): OverviewRecommendation[] {
  const model = operationalModel(data);
  const recommendations: OverviewRecommendation[] = [];
  const duplicates = Number(data.qualidadeDados.camposDuplicados ?? 0);
  const noDueDate = Number(data.qualidadeDados.semVencimento ?? 0);
  const climateTotal = data.climatizacaoTipo.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const topClimate = data.topSetoresClimatizacao[0];

  if (model.criticalBacklog > 0) {
    recommendations.push({
      title: "Tratar backlog acima de 90 dias",
      detail: `${fmtInt(model.criticalBacklog)} chamado${model.criticalBacklog === 1 ? "" : "s"} em aberto exigem revisão de prioridade e responsável.`,
      tone: model.criticalBacklogRate >= 10 ? "high" : "medium",
      href: "/chamados",
    });
  }

  if (model.evidenceRate < 80) {
    recommendations.push({
      title: "Reforçar cobertura de evidências",
      detail: `Cobertura atual de ${fmtDec(model.evidenceRate)}%. A referência operacional desta tela é 80% ou mais.`,
      tone: model.evidenceRate < 60 ? "high" : "medium",
      href: "/evidencias",
    });
  }

  if (model.sectorCoverage < 90) {
    recommendations.push({
      title: "Melhorar preenchimento de setor",
      detail: `${fmtDec(model.sectorCoverage)}% dos chamados possuem setor preenchido no período.`,
      tone: model.sectorCoverage < 70 ? "high" : "medium",
      href: "/qualidade",
    });
  }

  if (duplicates > 0) {
    recommendations.push({
      title: "Revisar registros duplicados",
      detail: `${fmtInt(duplicates)} tarefa${duplicates === 1 ? "" : "s"} com campos duplicados foram identificadas.`,
      tone: duplicates >= 100 ? "medium" : "low",
      href: "/qualidade",
    });
  }

  if (recommendations.length < 4 && noDueDate > 0) {
    recommendations.push({
      title: "Revisar tarefas sem vencimento",
      detail: `${fmtInt(noDueDate)} tarefa${noDueDate === 1 ? "" : "s"} sem data de vencimento no período analisado.`,
      tone: "low",
      href: "/qualidade",
    });
  }

  if (recommendations.length < 4 && climateTotal > 0) {
    recommendations.push({
      title: "Acompanhar chamados de climatização",
      detail: topClimate
        ? `${fmtInt(climateTotal)} chamados no período; ${topClimate.name} concentra ${fmtInt(topClimate.value)} registros.`
        : `${fmtInt(climateTotal)} chamados de climatização classificados no período.`,
      tone: "low",
      href: "/climatizacao",
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Manter o padrão operacional do período",
      detail: "Os principais indicadores monitorados estão dentro das referências usadas nesta visão.",
      tone: "positive",
      href: "/chamados",
    });
  }

  return recommendations.slice(0, 4);
}

export function periodInsight(data: DashboardOverview) {
  const rate = kpiById(data, "taxa");
  const open = kpiById(data, "abertas");
  const evidence = kpiById(data, "anexos");

  if (rate && Math.abs(rate.delta) >= 0.1) {
    return rate.delta >= 0
      ? `A taxa de conclusão avançou ${fmtDec(rate.delta)} p.p. ${rate.comparison}.`
      : `A taxa de conclusão recuou ${fmtDec(Math.abs(rate.delta))} p.p. ${rate.comparison}; vale acompanhar a evolução dos itens em aberto.`;
  }
  if (open && Math.abs(open.delta) >= 0.1) {
    return open.delta <= 0
      ? `Os chamados em aberto caíram ${fmtDec(Math.abs(open.delta))}% ${open.comparison}.`
      : `Os chamados em aberto cresceram ${fmtDec(open.delta)}% ${open.comparison}.`;
  }
  if (evidence && Math.abs(evidence.delta) >= 0.1) {
    return `As tarefas com evidências variaram ${evidence.delta >= 0 ? "+" : ""}${fmtDec(evidence.delta)}% ${evidence.comparison}.`;
  }
  return "Os principais indicadores permaneceram estáveis em relação ao período de comparação.";
}
