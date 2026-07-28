import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, CheckCircle2, ClipboardCheck, Moon, Sun } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DEFAULT_FILTERS, FilterBar } from "@/components/filter-bar";
import { ChartCard } from "@/components/chart-card";
import { getRounds } from "@/services/dashboardService";
import type { DashboardFilters, RoundsSummary } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { fmtDec, fmtInt } from "@/lib/format";

export const Route = createFileRoute("/rondas")({
  head: () => ({ meta: [
    { title: "Rondas e Preventivas · Klabin" },
    { name: "description", content: "Acompanhamento das atividades de ronda e manutenções preventivas." },
  ] }),
  component: Rondas,
});

function Rondas() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<RoundsSummary | null>(null);

  useEffect(() => {
    let active = true;
    setData(null);
    getRounds(filters).then((result) => active && setData(result)).catch(() => active && setData({ metrics: { total: 0, evidenceRate: 0, predominantShift: "Não informado", nightCount: 0, withoutEvidence: 0 }, activities: [] }));
    return () => { active = false; };
  }, [filters]);

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader title="Rondas e Preventivas" subtitle="Atividades preventivas planejadas, turnos e evidências de execução" />
      <FilterBar value={filters} onChange={setFilters} />

      {!data ? <LoadingSkeleton className="h-[500px]" /> : (
        <>
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <RoundMetric icon={<ClipboardCheck className="h-5 w-5" />} label="Rondas registradas" value={fmtInt(data.metrics.total)} />
            <RoundMetric icon={<CheckCircle2 className="h-5 w-5" />} label="Com evidência" value={`${fmtDec(data.metrics.evidenceRate)}%`} />
            <RoundMetric icon={<Sun className="h-5 w-5" />} label="Turno predominante" value={data.metrics.predominantShift} />
            <RoundMetric icon={<Moon className="h-5 w-5" />} label="Rondas noturnas" value={fmtInt(data.metrics.nightCount)} />
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.45fr_.75fr]">
            <ChartCard title="Atividades de Ronda">
              <div className="space-y-4 py-2">
                {data.activities.map((item) => {
                  const max = Math.max(...data.activities.map((current) => current.value), 1);
                  return (
                    <div key={item.name} className="grid grid-cols-[24px_minmax(0,1.25fr)_minmax(70px,1fr)_36px] items-center gap-3">
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
                  <div><div className="text-3xl font-bold">{fmtDec(data.metrics.evidenceRate)}%</div><div className="mt-1 text-[10px] text-muted-foreground">com evidência</div></div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning/25 bg-warning/7 px-3 py-2 text-[11px] text-[#e8ded6]"><Camera className="h-4 w-4 text-warning" /> {fmtInt(data.metrics.withoutEvidence)} rondas sem evidência fotográfica</div>
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
      <div className="min-w-0"><div className="text-[10px] text-muted-foreground">{label}</div><div className="mt-1 truncate text-2xl font-bold">{value}</div></div>
    </div>
  );
}
