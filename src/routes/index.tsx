import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Camera,
  Database,
  Droplets,
  Lightbulb,
  Monitor,
  ShieldCheck,
  Snowflake,
  Wind,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DEFAULT_FILTERS, FilterBar } from "@/components/filter-bar";
import { KpiCard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import { InsightBanner } from "@/components/insight-banner";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getOverview } from "@/services/dashboardService";
import type { ChartSeries, DashboardFilters, DashboardOverview } from "@/types/dashboard";
import { fmtDec, fmtInt, fmtPct } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral · Central Operacional Klabin" },
      { name: "description", content: "Painel executivo com indicadores de operação, manutenção e facility management." },
      { property: "og:title", content: "Visão Geral · Central Operacional Klabin" },
      { property: "og:description", content: "KPIs, gráficos e insights operacionais em tempo real." },
    ],
  }),
  component: Overview,
});

const tooltipStyle = {
  contentStyle: {
    background: "#0b1d22",
    border: "1px solid rgba(110,195,156,.25)",
    borderRadius: 9,
    color: "#F5F7F6",
    fontSize: 10,
    boxShadow: "0 14px 32px rgba(0,0,0,.38)",
  },
  cursor: { fill: "rgba(18,183,106,.045)" },
};

function Overview() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let active = true;
    setData(null);
    getOverview(filters).then((result) => active && setData(result));
    return () => { active = false; };
  }, [filters]);

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader
        layout="command"
        toolbar={<FilterBar variant="toolbar" value={filters} onChange={setFilters} />}
      />

      {!data ? (
        <OverviewLoading />
      ) : (
        <>
          <section className="kpi-grid-reference" aria-label="Indicadores principais">
            {data.kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
          </section>

          <section className="overview-row-primary">
            <ChartCard title="Tarefas por Projeto">
              <DonutWithLegend
                series={data.tarefasPorProjeto}
                centerLabel="Total"
                centerValue={fmtInt(Number(data.kpis[0].value))}
              />
            </ChartCard>

            <ChartCard title="Evolução de Tarefas por Mês">
              <div className="overview-line-layout">
                <Legend
                  items={[
                    { name: "Concluídas", color: "#40C35A" },
                    { name: "Em Aberto", color: "#FF7918" },
                    { name: "Total", color: "#E8EEEB", dashed: true },
                  ]}
                />
                <div className="min-h-0 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.evolucaoMensal} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(110,195,156,.075)" vertical={false} />
                      <XAxis dataKey="month" stroke="#99AAA5" fontSize={9} tickLine={false} axisLine={false} dy={5} />
                      <YAxis stroke="#99AAA5" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Line type="monotone" dataKey="concluidas" stroke="#40C35A" strokeWidth={2.2} dot={{ r: 2.5, fill: "#40C35A", strokeWidth: 0 }} activeDot={{ r: 4 }} name="Concluídas" />
                      <Line type="monotone" dataKey="emAberto" stroke="#FF7918" strokeWidth={1.8} dot={{ r: 2.3, fill: "#FF7918", strokeWidth: 0 }} name="Em Aberto" />
                      <Line type="monotone" dataKey="total" stroke="#E8EEEB" strokeWidth={1.4} strokeDasharray="3 4" dot={false} name="Total" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Status dos itens em aberto">
              <DonutWithLegend
                series={data.statusAbertos}
                centerLabel="Em aberto"
                centerValue={fmtInt(Number(data.kpis[2].value))}
                showPct
                dense
              />
            </ChartCard>
          </section>

          <section className="overview-row-secondary">
            <ChartCard title="Climatização — Tipo de Solicitação">
              <DonutWithLegend
                series={data.climatizacaoTipo}
                centerLabel="Total"
                centerValue={fmtInt(data.climatizacaoTipo.reduce((sum, item) => sum + item.value, 0))}
                showPct
                compact
              />
            </ChartCard>

            <ChartCard title="Top 5 Setores — Climatização" action>
              <div className="h-full min-h-[116px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topSetoresClimatizacao} layout="vertical" margin={{ top: 0, right: 26, bottom: 0, left: -8 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={42} stroke="#D4DEDA" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" fill="#5CCB42" radius={[0, 2, 2, 0]} barSize={10} label={{ position: "right", fill: "#EAF0ED", fontSize: 9 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Climatização — Horário de Abertura">
              <VerticalBars data={data.climatizacaoHorario} />
            </ChartCard>

            <ChartCard title="Climatização — Dia da Semana">
              <VerticalBars data={data.climatizacaoDiaSemana} />
            </ChartCard>
          </section>

          <section className="overview-row-tertiary">
            <ChartCard title="Atividades de Ronda (Principais)">
              <RoundActivities data={data.atividadesRonda} />
            </ChartCard>

            <ChartCard title="Qualidade dos Dados">
              <div className="grid h-full grid-cols-2 gap-2">
                <QualityTile icon={<Database className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.semVencimento)} label="Tarefas sem vencimento" tone="primary" />
                <QualityTile icon={<ShieldCheck className="h-4 w-4" />} value={fmtPct(data.qualidadeDados.coberturaSetor)} label="Cobertura de setor" tone="info" />
                <QualityTile icon={<AlertTriangle className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.fechamentoAnterior)} label="Fechamento anterior à data inicial" tone="warning" />
                <QualityTile icon={<Database className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.camposDuplicados)} label="Tarefas com campos duplicados" tone="blue" />
              </div>
            </ChartCard>

            <ChartCard title="Evidências Fotográficas">
              <div className="grid h-full grid-cols-[1fr_1.05fr] items-center gap-2">
                <div className="relative min-w-0">
                  <div className="h-full min-h-[112px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                      <Pie data={[{ v: data.evidencias.percentualComEvidencia }, { v: 100 - data.evidencias.percentualComEvidencia }]} dataKey="v" innerRadius={39} outerRadius={53} startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill="#44C94B" />
                        <Cell fill="rgba(110,195,156,.14)" />
                      </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-[24px] font-bold leading-none text-white">{fmtDec(data.evidencias.percentualComEvidencia)}%</div>
                    <div className="mt-1 max-w-[70px] text-center text-[8px] leading-tight text-muted-foreground">das tarefas com evidências</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <EvidenceStat value={fmtInt(data.evidencias.totalFotos)} label="Total de fotos" />
                  <EvidenceStat value={fmtInt(data.evidencias.tarefasComFotos)} label="Tarefas com fotos" />
                  <Link to="/evidencias" className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-[8px] border border-primary/45 bg-primary/8 text-[10px] font-medium text-[#e5f8e9] hover:bg-primary/15">
                    <Camera className="h-3.5 w-3.5 text-primary-glow" /> Ver galeria
                  </Link>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Backlog por Idade">
              <BacklogChart data={data.backlogPorIdade} median={data.idadeMediana} />
            </ChartCard>
          </section>

          <InsightBanner />
        </>
      )}
    </div>
  );
}

function OverviewLoading() {
  return (
    <div className="space-y-3">
      <div className="kpi-grid-reference">{Array.from({ length: 6 }, (_, index) => <LoadingSkeleton key={index} className="h-[clamp(116px,11vh,132px)]" />)}</div>
      <div className="overview-row-primary">{Array.from({ length: 3 }, (_, index) => <LoadingSkeleton key={index} className="h-[clamp(190px,20vh,240px)]" />)}</div>
      <div className="overview-row-secondary">{Array.from({ length: 4 }, (_, index) => <LoadingSkeleton key={index} className="h-[clamp(162px,18vh,216px)]" />)}</div>
      <div className="overview-row-tertiary">{Array.from({ length: 4 }, (_, index) => <LoadingSkeleton key={index} className="h-[clamp(188px,20vh,240px)]" />)}</div>
    </div>
  );
}

function DonutWithLegend({
  series,
  centerLabel,
  centerValue,
  showPct = false,
  dense = false,
  compact = false,
}: {
  series: ChartSeries[];
  centerLabel: string;
  centerValue: string;
  showPct?: boolean;
  dense?: boolean;
  compact?: boolean;
}) {
  const total = series.reduce((sum, item) => sum + item.value, 0) || 1;
  const chartHeight = compact ? 110 : 136;
  const outerRadius = compact ? 50 : 58;
  const innerRadius = compact ? 35 : 41;

  return (
    <div className={dense ? "grid h-full grid-cols-[150px_1fr] items-center gap-2" : compact ? "grid h-full grid-cols-[128px_1fr] items-center gap-2" : "grid h-full grid-cols-[145px_1fr] items-center gap-3"}>
      <div className="relative min-w-0">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie data={series} dataKey="value" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={dense ? 0 : 1.5} stroke="none">
              {series.map((item, index) => <Cell key={`${item.name}-${index}`} fill={item.color ?? ["#10B866", "#54D36A", "#2497F2", "#FF7918", "#7A3FE2"][index % 5]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className={compact ? "text-[19px] font-bold leading-none" : "text-[22px] font-bold leading-none"}>{centerValue}</div>
          <div className="mt-1 text-[9px] text-muted-foreground">{centerLabel}</div>
        </div>
      </div>

      <div className={dense ? "space-y-1 text-[9px]" : "space-y-1.5 text-[10px]"}>
        {series.map((item, index) => (
          <div key={item.name} className="grid min-w-0 grid-cols-[8px_minmax(0,1fr)_auto] items-center gap-2">
            <span className="h-2 w-2 rounded-[3px]" style={{ background: item.color }} />
            <span className="truncate text-[#d5dfdc]">{item.name}</span>
            <span className="whitespace-nowrap font-medium text-white">
              {fmtInt(item.value)}{showPct ? ` (${fmtDec((item.value / total) * 100)}%)` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ items }: { items: { name: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="mb-1 flex flex-wrap items-center gap-4 text-[9px] text-[#d7e0dd]">
      {items.map((item) => (
        <span key={item.name} className="flex items-center gap-1.5">
          <span className={item.dashed ? "h-px w-4 border-t border-dashed" : "h-2 w-2 rounded-[3px]"} style={{ background: item.dashed ? undefined : item.color, borderColor: item.color }} />
          {item.name}
        </span>
      ))}
    </div>
  );
}

function VerticalBars({ data }: { data: ChartSeries[] }) {
  return (
    <div className="h-full min-h-[116px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 18, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(110,195,156,.06)" vertical={false} />
          <XAxis dataKey="name" stroke="#D4DEDA" fontSize={9} tickLine={false} axisLine={false} dy={5} />
          <YAxis hide />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" fill="#31B851" radius={[2, 2, 0, 0]} barSize={26} label={{ position: "top", fill: "#F3F6F5", fontSize: 9 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const roundIcons = [Snowflake, Droplets, Monitor, Wind, Lightbulb];

function RoundActivities({ data }: { data: ChartSeries[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="round-activities-list space-y-[7px] pt-1">
      {data.map((item, index) => {
        const Icon = roundIcons[index % roundIcons.length];
        return (
          <div key={item.name} className="grid grid-cols-[20px_minmax(0,1fr)_82px_30px] items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-primary/12 text-primary-glow"><Icon className="h-3 w-3" /></span>
            <span className="truncate text-[9px] text-[#d5dfdc]">{item.name}</span>
            <span className="h-[2px] overflow-hidden rounded-full bg-primary/12"><span className="block h-full bg-primary-glow" style={{ width: `${(item.value / max) * 100}%` }} /></span>
            <strong className="text-right text-[10px] font-semibold text-white">{item.value}</strong>
          </div>
        );
      })}
    </div>
  );
}

function QualityTile({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: "primary" | "warning" | "info" | "blue" }) {
  const toneClass = {
    primary: "border-primary/24 bg-primary/7 text-[#71dc65]",
    warning: "border-warning/28 bg-warning/7 text-[#ff9e3d]",
    info: "border-[#22c6b7]/28 bg-[#22c6b7]/7 text-[#45d8cc]",
    blue: "border-info/26 bg-info/7 text-[#59aff0]",
  }[tone];

  return (
    <div className={`min-h-0 rounded-[10px] border p-2.5 ${toneClass}`}>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-current/10">{icon}</span>
        <strong className="text-[21px] leading-none tracking-[-.03em] text-white">{value}</strong>
      </div>
      <div className="mt-1.5 text-center text-[8px] leading-[1.25] text-[#d0dad7]">{label}</div>
    </div>
  );
}

function EvidenceStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[20px] font-bold leading-none text-[#55d649]">{value}</div>
      <div className="mt-1 text-[9px] text-[#d0dad7]">{label}</div>
    </div>
  );
}

function BacklogChart({ data, median }: { data: ChartSeries[]; median: number }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-[7px] pt-1">
        {data.map((item, index) => {
          const pct = (item.value / total) * 100;
          return (
            <div key={item.name} className="grid grid-cols-[82px_minmax(0,1fr)_64px] items-center gap-2">
              <span className="truncate text-[9px] text-[#d3dcda]">{item.name}</span>
              <span className="h-[10px] overflow-hidden bg-warning/9">
                <span className="block h-full bg-[linear-gradient(90deg,#db3b12,#ff7a18)]" style={{ width: `${(item.value / max) * 100}%` }} />
              </span>
              <span className="whitespace-nowrap text-right text-[9px] text-[#e4e9e7]">{item.value} ({fmtDec(pct)}%)</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex h-8 items-center justify-center gap-2 rounded-[8px] border border-warning/30 bg-warning/9 text-[10px] text-[#e8ded6]">
        <AlertTriangle className="h-3.5 w-3.5 text-warning" />
        Idade mediana: <strong className="text-[13px] text-warning">{fmtDec(median)} dias</strong>
      </div>
    </div>
  );
}
