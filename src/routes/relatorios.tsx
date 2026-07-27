import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarDays, CheckCircle2, Lightbulb, Plus, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ReportCard } from "@/components/report-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { downloadReport, generateReport, getReports } from "@/services/reportService";
import type { Report } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmtDateTime } from "@/lib/format";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";

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

const reportTypes: Report["tipo"][] = ["Diário", "Semanal", "Mensal"];
const initialPeriod = { inicio: "2026-06-01", fim: "2026-07-23" };

function Relatorios() {
  const [type, setType] = useState<Report["tipo"] | "Todos">("Todos");
  const [period, setPeriod] = useState(initialPeriod);
  const [items, setItems] = useState<Report[] | null>(null);
  const [preview, setPreview] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setItems(null);
    getReports(type === "Todos" ? undefined : type, period).then((result) => active && setItems(result)).catch((error) => { if (active) { setItems([]); toast.error(error instanceof Error ? error.message : "Falha ao carregar relatórios"); } });
    return () => { active = false; };
  }, [type, period]);

  const create = async () => {
    setGenerating(true);
    try {
      const report = await generateReport(type === "Todos" ? "Diário" : type, period);
      setItems((current) => [report, ...(current ?? []).filter((item) => item.id !== report.id)]);
      toast.success(report.status === "Pronto" ? "Relatório PDF gerado com sucesso" : "A geração do relatório foi registrada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível gerar o relatório");
    } finally { setGenerating(false); }
  };

  const download = async (report: Report) => {
    setDownloadingId(report.id);
    try { await downloadReport(report); toast.success("Download do PDF iniciado"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Falha ao baixar o PDF"); }
    finally { setDownloadingId(null); }
  };

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader title="Relatórios" subtitle="Relatórios diários, semanais e mensais com resumo executivo" />

      <div className="command-card mb-4 flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-[10px] border border-border bg-background/38 p-1">
            {(["Todos", ...reportTypes] as const).map((item) => (
              <button key={item} type="button" onClick={() => setType(item)} className={`rounded-[7px] px-3 py-2 text-[10px] font-medium transition ${type === item ? "bg-primary text-primary-foreground shadow-[0_0_18px_rgba(18,183,106,.16)]" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex h-10 items-center gap-2 rounded-[10px] border border-border bg-background/38 px-3">
            <CalendarDays className="h-3.5 w-3.5 text-primary-glow" />
            <input aria-label="Início do período" type="date" value={period.inicio} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPeriod((current) => ({ ...current, inicio: event.target.value }))} className="bg-transparent text-[10px] outline-none" />
            <span className="text-muted-foreground">–</span>
            <input aria-label="Fim do período" type="date" value={period.fim} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPeriod((current) => ({ ...current, fim: event.target.value }))} className="bg-transparent text-[10px] outline-none" />
          </div>
        </div>

        <Button onClick={create} disabled={generating} className="h-10 bg-primary text-xs text-primary-foreground hover:bg-primary-glow">
          <Plus className="mr-1 h-4 w-4" /> {generating ? "Gerando…" : "Gerar novo relatório"}
        </Button>
      </div>

      {!items ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <LoadingSkeleton key={index} className="h-[220px]" />)}</div>
      ) : items.length === 0 ? (
        <div className="command-card"><EmptyState title="Nenhum relatório no período" description="Altere o período ou gere um novo relatório." /></div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((report) => <ReportCard key={report.id} report={report} onView={setPreview} onDownload={download} downloading={downloadingId === report.id} />)}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(open: boolean) => !open && setPreview(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-border bg-card">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{preview.titulo}</DialogTitle>
                <div className="text-[10px] text-muted-foreground">{preview.periodo} · Gerado em {fmtDateTime(preview.geradoEm)}</div>
              </DialogHeader>

              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {preview.indicadores?.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-primary/20 bg-primary/6 p-3">
                    <div className="text-[9px] text-muted-foreground">{metric.label}</div>
                    <div className="mt-1 text-xl font-bold">{metric.value}</div>
                    {metric.delta && <div className="mt-1 text-[9px] font-medium text-primary-glow">{metric.delta}</div>}
                  </div>
                ))}
              </div>

              {preview.tendencia && (
                <div className="mt-4 rounded-xl border border-border bg-background/22 p-3">
                  <div className="mb-2 text-xs font-semibold">Evolução no período</div>
                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={preview.tendencia}>
                      <XAxis dataKey="name" stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "#0b1d22", border: "1px solid rgba(110,195,156,.25)", borderRadius: 8, fontSize: 10 }} />
                      <Bar dataKey="value" fill="#39E75F" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-4 space-y-3 text-sm">
                <ReportSection title="Resumo Executivo" icon={<TrendingUp className="h-4 w-4" />}><p className="text-xs leading-relaxed text-muted-foreground">{preview.resumo}</p></ReportSection>
                <ReportSection title="Destaques" icon={<CheckCircle2 className="h-4 w-4" />}><List items={preview.destaques} color="text-primary-glow" /></ReportSection>
                <ReportSection title="Riscos" icon={<AlertTriangle className="h-4 w-4" />} tone="warning"><List items={preview.riscos} color="text-warning" empty="Nenhum risco relevante no período." /></ReportSection>
                <ReportSection title="Recomendações" icon={<Lightbulb className="h-4 w-4" />} tone="info"><List items={preview.recomendacoes} color="text-[color:var(--info)]" /></ReportSection>
              </div>

              <div className="mt-4 flex justify-end"><Button variant="outline" className="border-primary/30 text-primary-glow" onClick={() => download(preview)} disabled={downloadingId === preview.id}>Baixar PDF</Button></div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportSection({ title, icon, tone = "primary", children }: { title: string; icon: React.ReactNode; tone?: "primary" | "warning" | "info"; children: React.ReactNode }) {
  const style = tone === "warning" ? "border-warning/24 bg-warning/5" : tone === "info" ? "border-info/24 bg-info/5" : "border-primary/24 bg-primary/5";
  return <section className={`rounded-xl border p-3 ${style}`}><div className="mb-2 flex items-center gap-2 text-xs font-semibold">{icon}{title}</div>{children}</section>;
}

function List({ items, color, empty = "Nenhum item registrado." }: { items: string[]; color: string; empty?: string }) {
  if (!items.length) return <div className="text-xs text-muted-foreground">{empty}</div>;
  return <ul className="space-y-1.5 text-xs">{items.map((item) => <li key={item} className="flex gap-2"><span className={color}>•</span>{item}</li>)}</ul>;
}
