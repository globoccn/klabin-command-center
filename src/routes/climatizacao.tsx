import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Snowflake, Sun, Thermometer, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DEFAULT_FILTERS, FilterBar } from "@/components/filter-bar";
import { ChartCard } from "@/components/chart-card";
import { getClimate } from "@/services/dashboardService";
import type { ClimateSummary, DashboardFilters } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { fmtInt } from "@/lib/format";

export const Route = createFileRoute("/climatizacao")({
  head: () => ({ meta: [
    { title: "Climatização · Klabin" },
    { name: "description", content: "Análise operacional dos chamados de climatização por setor, horário e dia." },
  ] }),
  component: Climatizacao,
});

const tooltip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--popover-foreground)", fontSize: 11 } };

function Climatizacao() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ClimateSummary | null>(null);

  useEffect(() => {
    let active = true;
    setData(null);
    getClimate(filters).then((result) => active && setData(result)).catch(() => active && setData({ total: 0, cold: 0, hot: 0, topSector: "—", type: [], sectors: [], hours: [], weekdays: [] }));
    return () => { active = false; };
  }, [filters]);

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader title="Climatização" subtitle="Análise detalhada dos chamados classificados como climatização" />
      <FilterBar value={filters} onChange={setFilters} />

      {!data ? <LoadingSkeleton className="h-[560px]" /> : (
        <>
          <div className="page-kpi-grid-4 mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ClimateMetric icon={<Thermometer className="h-5 w-5" />} label="Solicitações" value={fmtInt(data.total)} accent="cyan" />
            <ClimateMetric icon={<Snowflake className="h-5 w-5" />} label="Ambiente frio" value={fmtInt(data.cold)} accent="blue" />
            <ClimateMetric icon={<Sun className="h-5 w-5" />} label="Ambiente quente" value={fmtInt(data.hot)} accent="orange" />
            <ClimateMetric icon={<TrendingUp className="h-5 w-5" />} label="Setor mais recorrente" value={data.topSector} accent="green" />
          </div>

          <div className="page-grid-2 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ChartCard title="Tipo de Solicitação">
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie data={data.type} dataKey="value" innerRadius={68} outerRadius={108} stroke="none">
                    {data.type.map((item, index) => <Cell key={`${item.name}-${index}`} fill={item.color} />)}
                  </Pie>
                  <Tooltip {...tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top Setores">
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={data.sectors} layout="vertical" margin={{ left: 8, right: 28 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={55} stroke="var(--chart-axis)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" fill="var(--accent-cyan)" radius={[0, 5, 5, 0]} label={{ position: "right", fill: "var(--chart-label)", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Horário de Abertura">
              <ResponsiveContainer width="100%" height={245}>
                <BarChart data={data.hours} margin={{ top: 20 }}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--chart-axis)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--chart-axis)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" fill="var(--accent-blue)" radius={[5, 5, 0, 0]} label={{ position: "top", fill: "var(--chart-label)", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Dia da Semana">
              <ResponsiveContainer width="100%" height={245}>
                <BarChart data={data.weekdays} margin={{ top: 20 }}>
                  <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--chart-axis)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--chart-axis)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltip} />
                  <Bar dataKey="value" fill="var(--accent-green)" radius={[5, 5, 0, 0]} label={{ position: "top", fill: "var(--chart-label)", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function ClimateMetric({ icon, label, value, accent = "green" }: { icon: React.ReactNode; label: string; value: string; accent?: "green" | "cyan" | "blue" | "orange" }) {
  const color = accent === "cyan" ? "var(--accent-cyan)" : accent === "blue" ? "var(--accent-blue)" : accent === "orange" ? "var(--accent-orange)" : "var(--accent-green)";
  return (
    <div className="command-card metric-summary-card" style={{ "--metric-accent": color, "--card-accent": color } as React.CSSProperties}>
      <span className="metric-summary-icon">{icon}</span>
      <div className="min-w-0"><div className="metric-summary-label">{label}</div><div className="metric-summary-value">{value}</div></div>
    </div>
  );
}
