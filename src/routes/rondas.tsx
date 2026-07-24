import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, CheckCircle2, ClipboardCheck, Moon, Sun } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DEFAULT_FILTERS, FilterBar } from "@/components/filter-bar";
import { ChartCard } from "@/components/chart-card";
import { getOverview } from "@/services/dashboardService";
import type { DashboardFilters, DashboardOverview } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";

export const Route = createFileRoute("/rondas")({
  head: () => ({
    meta: [
      { title: "Rondas e Preventivas · Klabin" },
      { name: "description", content: "Acompanhamento das atividades de ronda e manutenções preventivas." },
      { property: "og:title", content: "Rondas e Preventivas · Klabin" },
      { property: "og:description", content: "Rondas técnicas, preventivas e histórico de execução." },
    ],
  }),
  component: Rondas,
});

function Rondas() {
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
      <DashboardHeader title="Rondas e Preventivas" subtitle="Atividades preventivas planejadas, turnos e evidências de execução" />
      <FilterBar value={filters} onChange={setFilters} />

      {!data ? <LoadingSkeleton className="h-[500px]" /> : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <RoundMetric icon={<ClipboardCheck className="h-5 w-5" />} label="Rondas registradas" value={String(data.atividadesRonda.reduce((sum, item) => sum + item.value, 0))} />
            <RoundMetric icon={<CheckCircle2 className="h-5 w-5" />} label="Com evidência" value="83%" />
            <RoundMetric icon={<Sun className="h-5 w-5" />} label="Turno predominante" value="Manhã" />
            <RoundMetric icon={<Moon className="h-5 w-5" />} label="Rondas noturnas" value="96" />
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_.75fr]">
            <ChartCard title="Atividades de Ronda">
              <div className="space-y-4 py-2">
                {data.atividadesRonda.map((item) => {
                  const max = Math.max(...data.atividadesRonda.map((current) => current.value));
                  return (
                    <div key={item.name} className="grid grid-cols-[28px_minmax(130px,220px)_1fr_44px] items-center gap-3">
                      <span className="grid h-7 w-7 place-items-center rounded-lg border border-primary/24 bg-primary/10 text-primary-glow"><ClipboardCheck className="h-4 w-4" /></span>
                      <span className="truncate text-xs text-[#dce5e2]">{item.name}</span>
                      <span className="h-2 overflow-hidden rounded-full bg-primary/10"><span className="block h-full rounded-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${(item.value / max) * 100}%` }} /></span>
                      <strong className="text-right text-sm">{item.value}</strong>
                    </div>
                  );
                })}
              </div>
            </ChartCard>

            <ChartCard title="Conformidade das Evidências">
              <div className="grid h-full place-items-center py-5 text-center">
                <div className="grid h-36 w-36 place-items-center rounded-full border-[12px] border-primary/12 border-t-primary border-r-primary/60 shadow-[0_0_36px_rgba(18,183,106,.12)]">
                  <div><div className="text-3xl font-bold">83%</div><div className="mt-1 text-[10px] text-muted-foreground">com evidência</div></div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/7 px-3 py-2 text-[11px] text-[#e8ded6]"><Camera className="h-4 w-4 text-warning" /> 17 rondas sem evidência fotográfica</div>
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function RoundMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="command-card relative flex items-center gap-3 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary-glow">{icon}</span>
      <div><div className="text-[10px] text-muted-foreground">{label}</div><div className="mt-1 text-2xl font-bold">{value}</div></div>
    </div>
  );
}
