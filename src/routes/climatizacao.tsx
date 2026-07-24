import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Snowflake, Sun, Thermometer, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DEFAULT_FILTERS, FilterBar } from "@/components/filter-bar";
import { ChartCard } from "@/components/chart-card";
import { getOverview } from "@/services/dashboardService";
import type { DashboardFilters, DashboardOverview } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { fmtInt } from "@/lib/format";

export const Route = createFileRoute("/climatizacao")({
  head: () => ({
    meta: [
      { title: "Climatização · Klabin" },
      { name: "description", content: "Análise operacional dos chamados de climatização por setor, horário e dia." },
      { property: "og:title", content: "Climatização · Klabin" },
      { property: "og:description", content: "Distribuição, tipo e picos de atendimento em climatização." },
    ],
  }),
  component: Climatizacao,
});

const tooltip = { contentStyle: { background: "#0b1d22", border: "1px solid rgba(110,195,156,.25)", borderRadius: 10, color: "#F5F7F6", fontSize: 11 } };

function Climatizacao() {
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
      <DashboardHeader title="Climatização" subtitle="Análise detalhada dos chamados de HVAC e conforto térmico" />
      <FilterBar value={filters} onChange={setFilters} />

      {!data ? <LoadingSkeleton className="h-[560px]" /> : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <ClimateMetric icon={<Thermometer className="h-5 w-5" />} label="Solicitações" value={fmtInt(data.climatizacaoTipo.reduce((sum, item) => sum + item.value, 0))} />
            <ClimateMetric icon={<Snowflake className="h-5 w-5" />} label="Ambiente frio" value={fmtInt(data.climatizacaoTipo[0]?.value ?? 0)} />
            <ClimateMetric icon={<Sun className="h-5 w-5" />} label="Ambiente quente" value={fmtInt(data.climatizacaoTipo[1]?.value ?? 0)} tone="warning" />
            <ClimateMetric icon={<TrendingUp className="h-5 w-5" />} label="Setor mais recorrente" value={data.topSetoresClimatizacao[0]?.name ?? "—"} />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ChartCard title="Tipo de Solicitação">
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie data={data.climatizacaoTipo} dataKey="value" innerRadius={68} outerRadius={108} stroke="none">
                    {data.climatizacaoTipo.map((item, index) => <Cell key={`${item.name}-${index}`} fill={item.color} />)}
                  </Pie>
                  <Tooltip {...tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Setores">
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={data.topSetoresClimatizacao} layout="vertical" margin={{ left: 8, right: 28 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={55} stroke="#AAB8B2" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" fill="#55CB46" radius={[0, 5, 5, 0]} label={{ position: "right", fill: "#F5F7F6", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Horário de Abertura">
              <ResponsiveContainer width="100%" height={245}>
                <BarChart data={data.climatizacaoHorario} margin={{ top: 20 }}>
                  <CartesianGrid stroke="rgba(110,195,156,.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" fill="#39E75F" radius={[5, 5, 0, 0]} label={{ position: "top", fill: "#F5F7F6", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Dia da Semana">
              <ResponsiveContainer width="100%" height={245}>
                <BarChart data={data.climatizacaoDiaSemana} margin={{ top: 20 }}>
                  <CartesianGrid stroke="rgba(110,195,156,.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" fill="#10B866" radius={[5, 5, 0, 0]} label={{ position: "top", fill: "#F5F7F6", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function ClimateMetric({ icon, label, value, tone = "primary" }: { icon: React.ReactNode; label: string; value: string; tone?: "primary" | "warning" }) {
  return (
    <div className={`command-card relative flex items-center gap-3 p-4 ${tone === "warning" ? "border-warning/25" : ""}`}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${tone === "warning" ? "border-warning/25 bg-warning/10 text-warning" : "border-primary/25 bg-primary/10 text-primary-glow"}`}>{icon}</span>
      <div className="min-w-0"><div className="text-[10px] text-muted-foreground">{label}</div><div className="mt-1 truncate text-2xl font-bold">{value}</div></div>
    </div>
  );
}
