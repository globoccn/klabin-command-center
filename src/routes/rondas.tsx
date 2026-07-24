import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { FilterBar } from "@/components/filter-bar";
import { ChartCard } from "@/components/chart-card";
import { getOverview } from "@/services/dashboardService";
import type { DashboardOverview } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { ClipboardCheck } from "lucide-react";

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
  const [d, setD] = useState<DashboardOverview | null>(null);
  useEffect(() => { getOverview().then(setD); }, []);
  return (
    <div className="animate-fade-in-up">
      <DashboardHeader title="Rondas e Preventivas" subtitle="Atividades preventivas planejadas e executadas" />
      <FilterBar />
      {!d ? <LoadingSkeleton className="h-96" /> : (
        <ChartCard title="Atividades de Ronda">
          <div className="space-y-3">
            {d.atividadesRonda.map((a) => {
              const max = Math.max(...d.atividadesRonda.map((x) => x.value));
              return (
                <div key={a.name} className="flex items-center gap-3">
                  <ClipboardCheck className="h-4 w-4 text-primary-glow shrink-0" />
                  <span className="text-sm w-60 truncate">{a.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-card-elevated overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${(a.value / max) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">{a.value}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}
    </div>
  );
}
