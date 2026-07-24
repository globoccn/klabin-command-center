import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from "recharts";
import { DashboardHeader } from "@/components/dashboard-header";
import { FilterBar } from "@/components/filter-bar";
import { KpiCard } from "@/components/kpi-card";
import { ChartCard } from "@/components/chart-card";
import { InsightBanner } from "@/components/insight-banner";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getOverview } from "@/services/dashboardService";
import type { DashboardOverview } from "@/types/dashboard";
import { fmtInt, fmtDec, fmtPct } from "@/lib/format";
import { Camera, ShieldCheck, Database, ClipboardCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  contentStyle: { background: "#0D2A22", border: "1px solid rgba(89,209,137,0.25)", borderRadius: 12, color: "#F5F7F6", fontSize: 12 },
  cursor: { fill: "rgba(18,183,106,0.06)" },
};

function Overview() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  useEffect(() => { getOverview().then(setData); }, []);

  return (
    <div className="animate-fade-in-up">
      <DashboardHeader />
      <FilterBar />

      {!data ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {data.kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3">
            <ChartCard title="Tarefas por Projeto">
              <DonutWithLegend series={data.tarefasPorProjeto} centerLabel="Total" centerValue={fmtInt(data.kpis[0].value as number)} />
            </ChartCard>

            <ChartCard title="Evolução de Tarefas por Mês">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.evolucaoMensal}>
                  <CartesianGrid stroke="rgba(89,209,137,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#AAB8B2" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#AAB8B2" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="concluidas" stroke="#12B76A" strokeWidth={2.5} dot={{ r: 3, fill: "#12B76A" }} name="Concluídas" />
                  <Line type="monotone" dataKey="emAberto" stroke="#F97316" strokeWidth={2} dot={{ r: 3, fill: "#F97316" }} name="Em Aberto" />
                  <Line type="monotone" dataKey="total" stroke="#F5F7F6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Total" />
                </LineChart>
              </ResponsiveContainer>
              <Legend items={[{ name: "Concluídas", color: "#12B76A" }, { name: "Em Aberto", color: "#F97316" }, { name: "Total", color: "#F5F7F6" }]} />
            </ChartCard>

            <ChartCard title="Status dos itens em aberto">
              <DonutWithLegend series={data.statusAbertos} centerLabel="Em aberto" centerValue="111" showPct />
            </ChartCard>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3">
            <ChartCard title="Climatização — Tipo de Solicitação">
              <DonutWithLegend series={data.climatizacaoTipo} centerLabel="Total" centerValue="1.943" showPct />
            </ChartCard>

            <ChartCard title="Top 5 Setores — Climatização" action>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.topSetoresClimatizacao} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#AAB8B2" fontSize={11} tickLine={false} axisLine={false} width={45} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="value" fill="#12B76A" radius={[0, 6, 6, 0]} label={{ position: "right", fill: "#F5F7F6", fontSize: 11 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Climatização — Horário de Abertura">
              <VerticalBars data={data.climatizacaoHorario} />
            </ChartCard>

            <ChartCard title="Climatização — Dia da Semana">
              <VerticalBars data={data.climatizacaoDiaSemana} />
            </ChartCard>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3">
            <ChartCard title="Atividades de Ronda (Principais)">
              <div className="space-y-2.5 mt-1">
                {data.atividadesRonda.map((a) => {
                  const max = Math.max(...data.atividadesRonda.map((x) => x.value));
                  return (
                    <div key={a.name} className="flex items-center gap-2">
                      <ClipboardCheck className="h-3.5 w-3.5 text-primary-glow shrink-0" />
                      <span className="text-xs text-muted-foreground w-40 truncate">{a.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-card-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${(a.value / max) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium w-10 text-right">{a.value}</span>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard title="Qualidade dos Dados">
              <div className="grid grid-cols-2 gap-2 mt-1">
                <QualityTile icon={<Database className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.semVencimento)} label="Tarefas sem vencimento" tone="primary" />
                <QualityTile icon={<ShieldCheck className="h-4 w-4" />} value={fmtPct(data.qualidadeDados.coberturaSetor)} label="Cobertura de setor" tone="primary" />
                <QualityTile icon={<AlertTriangle className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.fechamentoAnterior)} label="Fechamento anterior à data inicial" tone="warning" />
                <QualityTile icon={<Database className="h-4 w-4" />} value={fmtInt(data.qualidadeDados.camposDuplicados)} label="Tarefas com campos duplicados" tone="info" />
              </div>
            </ChartCard>

            <ChartCard title="Evidências Fotográficas">
              <div className="grid grid-cols-2 gap-3 items-center h-full">
                <div className="relative">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={[{ v: 25 }, { v: 75 }]} dataKey="v" innerRadius={40} outerRadius={55} startAngle={90} endAngle={-270}>
                        <Cell fill="#12B76A" />
                        <Cell fill="rgba(89,209,137,0.12)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xl font-bold text-primary-glow">25%</div>
                    <div className="text-[10px] text-muted-foreground">com evidências</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-2xl font-bold">{fmtInt(data.evidencias.totalFotos)}</div>
                    <div className="text-[11px] text-muted-foreground">Total de fotos</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{fmtInt(data.evidencias.tarefasComFotos)}</div>
                    <div className="text-[11px] text-muted-foreground">Tarefas com fotos</div>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary-glow hover:bg-primary/10 w-full">
                    <Camera className="h-3.5 w-3.5 mr-1" /> Ver galeria
                  </Button>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Backlog por Idade">
              <div className="space-y-2 mt-1">
                {data.backlogPorIdade.map((b) => {
                  const total = data.backlogPorIdade.reduce((s, x) => s + x.value, 0);
                  const pct = (b.value / total) * 100;
                  return (
                    <div key={b.name} className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground w-24 shrink-0">{b.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-card-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-warning" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium w-16 text-right">{b.value} ({fmtDec(pct)}%)</span>
                    </div>
                  );
                })}
                <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-xs">Idade mediana: <span className="font-bold text-warning">{fmtDec(data.idadeMediana)} dias</span></span>
                </div>
              </div>
            </ChartCard>
          </section>

          <InsightBanner />
        </>
      )}
    </div>
  );
}

function DonutWithLegend({ series, centerLabel, centerValue, showPct }: { series: { name: string; value: number; color?: string }[]; centerLabel: string; centerValue: string; showPct?: boolean }) {
  const total = series.reduce((s, x) => s + x.value, 0);
  const colors = ["#12B76A", "#39E75F", "#2E90FA", "#F97316", "#A78BFA", "#F04438"];
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 items-center h-full">
      <div className="relative">
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie data={series} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={2}>
              {series.map((s, i) => <Cell key={i} fill={s.color ?? colors[i % colors.length]} />)}
            </Pie>
            <Tooltip {...tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-lg font-bold">{centerValue}</div>
          <div className="text-[10px] text-muted-foreground">{centerLabel}</div>
        </div>
      </div>
      <div className="space-y-1.5 text-xs min-w-0">
        {series.map((s, i) => (
          <div key={s.name} className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.color ?? colors[i % colors.length] }} />
            <span className="truncate text-muted-foreground">{s.name}</span>
            <span className="ml-auto font-medium text-foreground shrink-0">
              {fmtInt(s.value)}{showPct && ` (${fmtDec((s.value / total) * 100)}%)`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalBars({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 20 }}>
        <CartesianGrid stroke="rgba(89,209,137,0.06)" vertical={false} />
        <XAxis dataKey="name" stroke="#AAB8B2" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis hide />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="value" fill="#12B76A" radius={[6, 6, 0, 0]} label={{ position: "top", fill: "#F5F7F6", fontSize: 11 }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-muted-foreground">
      {items.map((i) => (<span key={i.name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: i.color }} />{i.name}</span>))}
    </div>
  );
}

function QualityTile({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: "primary" | "warning" | "info" }) {
  const cls = tone === "warning" ? "border-warning/30 bg-warning/5 text-warning" : tone === "info" ? "border-info/30 bg-info/5 text-[color:var(--info)]" : "border-primary/30 bg-primary/5 text-primary-glow";
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="flex items-center gap-2">{icon}<div className="text-xl font-bold text-foreground">{value}</div></div>
      <div className="text-[11px] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
