import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { DashboardHeader } from "@/components/dashboard-header";
import { FilterBar } from "@/components/filter-bar";
import { ChartCard } from "@/components/chart-card";
import { getOverview } from "@/services/dashboardService";
import type { DashboardOverview } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";

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

const tt = { contentStyle: { background: "#0D2A22", border: "1px solid rgba(89,209,137,0.25)", borderRadius: 12, color: "#F5F7F6", fontSize: 12 } };

function Climatizacao() {
  const [d, setD] = useState<DashboardOverview | null>(null);
  useEffect(() => { getOverview().then(setD); }, []);

  return (
    <div className="animate-fade-in-up">
      <DashboardHeader title="Climatização" subtitle="Análise detalhada dos chamados de HVAC e conforto térmico" />
      <FilterBar />
      {!d ? <LoadingSkeleton className="h-96" /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ChartCard title="Tipo de Solicitação">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={d.climatizacaoTipo} dataKey="value" innerRadius={70} outerRadius={110}>
                  {d.climatizacaoTipo.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip {...tt} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Top Setores">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={d.topSetoresClimatizacao} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#AAB8B2" fontSize={12} />
                <Tooltip {...tt} />
                <Bar dataKey="value" fill="#12B76A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Horário de Abertura">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={d.climatizacaoHorario}>
                <CartesianGrid stroke="rgba(89,209,137,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#AAB8B2" fontSize={12} />
                <YAxis stroke="#AAB8B2" fontSize={12} />
                <Tooltip {...tt} />
                <Bar dataKey="value" fill="#39E75F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Dia da Semana">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={d.climatizacaoDiaSemana}>
                <CartesianGrid stroke="rgba(89,209,137,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#AAB8B2" fontSize={12} />
                <YAxis stroke="#AAB8B2" fontSize={12} />
                <Tooltip {...tt} />
                <Bar dataKey="value" fill="#12B76A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
