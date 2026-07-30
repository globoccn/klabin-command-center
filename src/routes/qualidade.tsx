import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Database, ShieldCheck } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ChartCard } from "@/components/chart-card";
import { getQuality } from "@/services/dashboardService";
import type { QualitySummary } from "@/types/dashboard";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { fmtInt, fmtPct } from "@/lib/format";

export const Route = createFileRoute("/qualidade")({
  head: () => ({ meta: [
    { title: "Qualidade dos Dados · Klabin" },
    { name: "description", content: "Monitoramento da qualidade e integridade dos dados operacionais." },
  ] }),
  component: Qualidade,
});

function Qualidade() {
  const [data, setData] = useState<QualitySummary | null>(null);
  useEffect(() => {
    let active = true;
    getQuality().then((result) => active && setData(result)).catch(() => active && setData({ metrics: { semVencimento: 0, coberturaSetor: 0, fechamentoAnterior: 0, camposDuplicados: 0 }, coverage: [], issues: [] }));
    return () => { active = false; };
  }, []);

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader title="Qualidade dos Dados" subtitle="Governança, integridade e cobertura da base operacional" />
      {!data ? <LoadingSkeleton className="h-[520px]" /> : (
        <>
          <div className="page-kpi-grid-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={<Database className="h-5 w-5" />} value={fmtInt(data.metrics.semVencimento)} label="Tarefas sem vencimento" />
            <Metric icon={<ShieldCheck className="h-5 w-5" />} value={fmtPct(data.metrics.coberturaSetor)} label="Cobertura de setor" tone="info" />
            <Metric icon={<AlertTriangle className="h-5 w-5" />} value={fmtInt(data.metrics.fechamentoAnterior)} label="Fechamento anterior à data inicial" tone="warning" />
            <Metric icon={<Copy className="h-5 w-5" />} value={fmtInt(data.metrics.camposDuplicados)} label="Tarefas com campos duplicados" tone="blue" />
          </div>

          <div className="page-grid-quality mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.25fr_.75fr]">
            <ChartCard title="Cobertura e Integridade">
              <div className="space-y-5 py-3">
                {data.coverage.map((item) => <QualityBar key={item.label} {...item} />)}
              </div>
            </ChartCard>

            <ChartCard title="Plano de Ação Recomendado">
              <div className="space-y-2.5 py-1">
                <Action number="01" text="Padronizar e tornar obrigatórios os campos críticos dos formulários." />
                <Action number="02" text="Tratar campos duplicados preservando o array original fields." />
                <Action number="03" text="Não utilizar start_date e due_date em SLA antes da validação." />
                <Action number="04" text="Mascarar WhatsApp e demais informações pessoais no frontend." />
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ icon, value, label, tone = "primary" }: { icon: React.ReactNode; value: string; label: string; tone?: "primary" | "warning" | "info" | "blue" }) {
  const style = tone === "warning" ? "border-warning/28 text-warning" : tone === "info" ? "border-[#21c5b6]/28 text-[#45d8cc]" : tone === "blue" ? "border-info/28 text-[color:var(--info)]" : "border-primary/28 text-primary-glow";
  return (
    <article className={`command-card relative flex items-center gap-3 p-4 ${style}`}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-background/30">{icon}</span>
      <div className="min-w-0"><div className="text-[25px] font-bold leading-none text-foreground">{value}</div><div className="mt-1.5 text-[10px] leading-tight text-muted-foreground">{label}</div></div>
    </article>
  );
}

function QualityBar({ label, value, target, warning = false }: { label: string; value: number; target: number; warning?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[11px]"><span className="text-[#dbe3e0]">{label}</span><span className={warning ? "font-semibold text-warning" : "font-semibold text-primary-glow"}>{value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% <span className="font-normal text-muted-foreground">/ meta {target}%</span></span></div>
      <div className="relative h-2 overflow-hidden rounded-full bg-card-elevated"><span className={`block h-full rounded-full ${warning ? "bg-gradient-to-r from-[#db3b12] to-warning" : "bg-gradient-to-r from-primary to-primary-glow"}`} style={{ width: `${Math.min(100, value)}%` }} /><span className="absolute inset-y-0 w-px bg-white/65" style={{ left: `${Math.min(100, target)}%` }} /></div>
    </div>
  );
}

function Action({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background/24 p-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-[10px] font-bold text-primary-glow">{number}</span>
      <div className="flex-1 text-[11px] leading-relaxed text-[#d5dfdc]">{text}</div>
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/55" />
    </div>
  );
}
