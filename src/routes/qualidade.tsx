import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ChartCard } from "@/components/chart-card";
import { getOverview } from "@/services/dashboardService";
import type { DashboardOverview } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AlertTriangle, Database, ShieldCheck, Copy } from "lucide-react";
import { fmtInt, fmtPct } from "@/lib/format";

export const Route = createFileRoute("/qualidade")({
  head: () => ({
    meta: [
      { title: "Qualidade dos Dados · Klabin" },
      { name: "description", content: "Monitoramento da qualidade e integridade dos dados operacionais." },
      { property: "og:title", content: "Qualidade dos Dados · Klabin" },
      { property: "og:description", content: "Cobertura de setor, duplicidades e inconsistências." },
    ],
  }),
  component: Qualidade,
});

function Qualidade() {
  const [d, setD] = useState<DashboardOverview | null>(null);
  useEffect(() => { getOverview().then(setD); }, []);

  return (
    <div className="animate-fade-in-up">
      <DashboardHeader title="Qualidade dos Dados" subtitle="Governança, integridade e cobertura da base operacional" />
      {!d ? <LoadingSkeleton className="h-96" /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Metric icon={<Database className="h-5 w-5" />} value={fmtInt(d.qualidadeDados.semVencimento)} label="Tarefas sem vencimento" tone="primary" />
          <Metric icon={<ShieldCheck className="h-5 w-5" />} value={fmtPct(d.qualidadeDados.coberturaSetor)} label="Cobertura de setor" tone="primary" />
          <Metric icon={<AlertTriangle className="h-5 w-5" />} value={fmtInt(d.qualidadeDados.fechamentoAnterior)} label="Fechamento anterior à data inicial" tone="warning" />
          <Metric icon={<Copy className="h-5 w-5" />} value={fmtInt(d.qualidadeDados.camposDuplicados)} label="Tarefas com campos duplicados" tone="info" />
          <ChartCard title="Recomendações" className="col-span-full">
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Padronizar preenchimento obrigatório de datas de vencimento no módulo de Chamados.</li>
              <li>• Rever registros com campos duplicados — 793 tarefas afetadas.</li>
              <li>• Aumentar cobertura de setor acima de 80% em áreas críticas.</li>
              <li>• Auditar fechamentos com data anterior à criação (490 casos).</li>
            </ul>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: "primary" | "warning" | "info" }) {
  const cls = tone === "warning" ? "border-warning/30 bg-warning/5 text-warning" : tone === "info" ? "border-info/30 bg-info/5 text-[color:var(--info)]" : "border-primary/30 bg-primary/5 text-primary-glow";
  return (
    <div className={`card-premium rounded-2xl p-5 border ${cls}`}>
      <div className="flex items-center gap-2">{icon}</div>
      <div className="mt-3 text-3xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
