import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ReportCard } from "@/components/report-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getReports, generateReport } from "@/services/reportService";
import type { Report } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmtDateTime } from "@/lib/format";
import { Plus, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios · Klabin" },
      { name: "description", content: "Geração e visualização de relatórios operacionais diários, semanais e mensais." },
      { property: "og:title", content: "Relatórios · Klabin" },
      { property: "og:description", content: "Resumos executivos, indicadores, destaques, riscos e recomendações." },
    ],
  }),
  component: Relatorios,
});

const tipos: Report["tipo"][] = ["Diário", "Semanal", "Mensal"];

function Relatorios() {
  const [tipo, setTipo] = useState<Report["tipo"] | "Todos">("Todos");
  const [reports, setReports] = useState<Report[] | null>(null);
  const [preview, setPreview] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getReports(tipo === "Todos" ? undefined : tipo).then(setReports);
  }, [tipo]);

  const gerar = async () => {
    setGenerating(true);
    const r = await generateReport(tipo === "Todos" ? "Diário" : tipo);
    setReports((prev) => [r, ...(prev ?? [])]);
    setGenerating(false);
    toast.success("Novo relatório gerado com sucesso");
  };

  return (
    <div className="animate-fade-in-up">
      <DashboardHeader title="Relatórios" subtitle="Geração automática de relatórios diários, semanais e mensais" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {(["Todos", ...tipos] as const).map((t) => (
            <button key={t} onClick={() => setTipo(t)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${tipo === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        <Button onClick={gerar} disabled={generating} className="bg-primary text-primary-foreground hover:bg-primary-glow">
          <Plus className="h-4 w-4 mr-1" /> {generating ? "Gerando…" : "Gerar novo relatório"}
        </Button>
      </div>

      {!reports ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-52" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.map((r) => <ReportCard key={r.id} report={r} onView={setPreview} />)}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[85vh] overflow-y-auto">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{preview.titulo}</DialogTitle>
                <div className="text-xs text-muted-foreground">{preview.periodo} · Gerado em {fmtDateTime(preview.geradoEm)}</div>
              </DialogHeader>
              <div className="mt-4 space-y-5 text-sm">
                <Section title="Resumo Executivo" icon={<TrendingUp className="h-4 w-4" />}>
                  <p className="text-muted-foreground leading-relaxed">{preview.resumo}</p>
                </Section>
                <Section title="Destaques" icon={<CheckCircle2 className="h-4 w-4" />} tone="primary">
                  <ul className="space-y-1.5">{preview.destaques.map((d) => <li key={d} className="flex gap-2"><span className="text-primary-glow">•</span>{d}</li>)}</ul>
                </Section>
                <Section title="Riscos" icon={<AlertTriangle className="h-4 w-4" />} tone="warning">
                  <ul className="space-y-1.5">{preview.riscos.map((d) => <li key={d} className="flex gap-2"><span className="text-warning">•</span>{d}</li>)}</ul>
                </Section>
                <Section title="Recomendações" icon={<Lightbulb className="h-4 w-4" />} tone="info">
                  <ul className="space-y-1.5">{preview.recomendacoes.map((d) => <li key={d} className="flex gap-2"><span className="text-[color:var(--info)]">•</span>{d}</li>)}</ul>
                </Section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, icon, tone = "primary", children }: { title: string; icon: React.ReactNode; tone?: "primary" | "warning" | "info"; children: React.ReactNode }) {
  const cls = tone === "warning" ? "border-warning/25 bg-warning/5" : tone === "info" ? "border-info/25 bg-info/5" : "border-primary/25 bg-primary/5";
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="flex items-center gap-2 font-semibold mb-2">{icon}{title}</div>
      {children}
    </div>
  );
}
