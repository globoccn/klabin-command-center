import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CalendarDays, CheckCircle2, Database, Lightbulb, Loader2, Plus, Trash2, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { ReportCard } from "@/components/report-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { deleteReport, generateReport, getReportDownloadUrl, getReports } from "@/services/reportService";
import { getFilterOptions } from "@/services/dashboardService";
import type { Report, SnapshotMetadata } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { fmtDateTime } from "@/lib/format";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios · Klabin" },
      { name: "description", content: "Relatórios operacionais calculados a partir da última data disponível." },
      { property: "og:title", content: "Relatórios · Klabin" },
      { property: "og:description", content: "Resumos executivos diários, semanais e mensais." },
    ],
  }),
  component: Relatorios,
});

const reportTypes: Report["tipo"][] = ["Diário", "Semanal", "Mensal"];
type ReportTab = Report["tipo"] | "Todos";

function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function periodFor(type: Report["tipo"], referenceDate: string) {
  if (type === "Diário") return { inicio: referenceDate, fim: referenceDate };
  if (type === "Semanal") return { inicio: addDays(referenceDate, -6), fim: referenceDate };
  return { inicio: `${referenceDate.slice(0, 7)}-01`, fim: referenceDate };
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function periodLabel(type: ReportTab, period: { inicio: string; fim: string } | null) {
  if (type === "Todos") return "Todos os relatórios gerados";
  if (!period) return "Carregando período disponível…";
  if (type === "Diário") return fmtDate(period.fim);
  return `${fmtDate(period.inicio)} – ${fmtDate(period.fim)}`;
}

function Relatorios() {
  const [type, setType] = useState<ReportTab>("Diário");
  const [snapshot, setSnapshot] = useState<SnapshotMetadata | null>(null);
  const [items, setItems] = useState<Report[] | null>(null);
  const [preview, setPreview] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const period = useMemo(() => {
    if (!snapshot?.periodEnd || type === "Todos") return null;
    return periodFor(type, snapshot.periodEnd.slice(0, 10));
  }, [snapshot, type]);

  useEffect(() => {
    let active = true;
    getFilterOptions()
      .then((options) => { if (active) setSnapshot(options.snapshot ?? null); })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Falha ao carregar o período disponível"));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (type !== "Todos" && !period) return;
    let active = true;
    setItems(null);
    getReports(type === "Todos" ? undefined : type, period ?? undefined)
      .then((result) => { if (active) setItems(result); })
      .catch((error) => {
        if (active) {
          setItems([]);
          toast.error(error instanceof Error ? error.message : "Falha ao carregar relatórios");
        }
      });
    return () => { active = false; };
  }, [type, period]);

  const create = async () => {
    if (type === "Todos") {
      toast.info("Selecione Diário, Semanal ou Mensal para gerar um relatório.");
      return;
    }
    if (!snapshot?.periodEnd) {
      toast.error("A última data disponível ainda não foi carregada.");
      return;
    }

    setGenerating(true);
    try {
      const report = await generateReport(type);
      setItems((current) => [report, ...(current ?? []).filter((item) => item.id !== report.id)]);
      if (report.status === "Pronto") toast.success("Relatório PDF gerado com sucesso");
      else if (report.status === "Falhou") toast.error(report.erro || "A geração do PDF falhou. Abra o relatório para ver o detalhe.");
      else toast.success("A geração do relatório foi registrada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível gerar o relatório");
    } finally {
      setGenerating(false);
    }
  };

  const openDeleteDialog = (report: Report) => {
    if (report.status === "Processando") {
      toast.info("Aguarde a geração terminar antes de excluir este relatório.");
      return;
    }
    setDeleteTarget(report);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const reportId = deleteTarget.id;
    setDeletingId(reportId);
    try {
      const result = await deleteReport(reportId);

      // Remove imediatamente o card e fecha a visualização do relatório excluído.
      setItems((current) => current?.filter((item) => item.id !== reportId) ?? []);
      setPreview((current) => (current?.id === reportId ? null : current));
      setDeleteTarget(null);

      const freed = result.freedBytes
        ? ` Espaço liberado: ${(result.freedBytes / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB.`
        : "";
      toast.success(`${result.message}${freed}`);

      try {
        const refreshed = await getReports(type === "Todos" ? undefined : type, period ?? undefined);
        setItems(refreshed);
      } catch {
        // A remoção local já garante que o card não permaneça visível.
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o relatório");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader title="Relatórios" subtitle="Períodos calculados automaticamente pela última data disponível" />

      <div className="command-card mb-4 flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-[10px] border border-border bg-background/38 p-1">
            {(["Todos", ...reportTypes] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setType(item)}
                className={`rounded-[7px] px-3 py-2 text-[10px] font-medium transition ${type === item ? "bg-primary text-primary-foreground shadow-[0_0_18px_rgba(18,183,106,.16)]" : "text-muted-foreground hover:bg-primary/8 hover:text-foreground"}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex h-10 min-w-[250px] items-center gap-2 rounded-[10px] border border-border bg-background/38 px-3">
            <CalendarDays className="h-3.5 w-3.5 text-primary-glow" />
            <div>
              <div className="text-[8px] uppercase tracking-wide text-muted-foreground">Período automático</div>
              <div className="text-[10px] font-medium text-foreground">{periodLabel(type, period)}</div>
            </div>
          </div>

          {snapshot && (
            <div className="flex h-10 items-center gap-2 rounded-[10px] border border-primary/18 bg-primary/5 px-3">
              <Database className="h-3.5 w-3.5 text-primary-glow" />
              <div>
                <div className="text-[8px] uppercase tracking-wide text-muted-foreground">Último dado disponível</div>
                <div className="text-[10px] font-medium text-primary-glow">{fmtDate(snapshot.periodEnd)}</div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={create}
          disabled={generating || type === "Todos" || !snapshot}
          className="h-10 bg-primary text-xs text-primary-foreground hover:bg-primary-glow"
        >
          <Plus className="mr-1 h-4 w-4" /> {generating ? "Gerando…" : "Gerar novo relatório"}
        </Button>
      </div>

      {snapshot && type !== "Todos" && period && (
        <div className="mb-4 rounded-xl border border-primary/16 bg-primary/5 px-4 py-3 text-[10px] text-muted-foreground">
          <strong className="text-primary-glow">Período automático:</strong>{" "}
          {type === "Diário" && "último dia disponível na base."}
          {type === "Semanal" && "últimos sete dias encerrando na data mais recente."}
          {type === "Mensal" && "mês da data mais recente, do primeiro dia até a data disponível."}
          {" "}Base disponível de {fmtDate(snapshot.periodStart)} a {fmtDate(snapshot.periodEnd)}.
        </div>
      )}

      {!items ? (
        <div className="reports-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <LoadingSkeleton key={index} className="h-[220px]" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="command-card"><EmptyState title="Nenhum relatório gerado" description={type === "Todos" ? "Gere o primeiro relatório operacional." : "Gere o relatório correspondente ao período automático selecionado."} /></div>
      ) : (
        <div className="reports-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((report) => (
            <ReportCard key={report.id} report={report} onView={setPreview} onDelete={openDeleteDialog} deleting={deletingId === report.id} />
          ))}
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

              {preview.status === "Falhou" && (
                <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/8 p-3 text-xs text-destructive">
                  <div className="mb-1 font-semibold">A geração do PDF falhou</div>
                  <div className="break-words text-[10px] text-[#ffd7d7]">{preview.erro || "Não foram registrados detalhes adicionais. Tente gerar o relatório novamente ou acione o suporte técnico."}</div>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {preview.indicadores?.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-primary/20 bg-primary/6 p-3">
                    <div className="text-[9px] text-muted-foreground">{metric.label}</div>
                    <div className="mt-1 text-xl font-bold">{metric.value}</div>
                    {metric.delta && <div className="mt-1 text-[9px] font-medium text-primary-glow">{metric.delta}</div>}
                  </div>
                ))}
              </div>

              {preview.tendencia && preview.tendencia.length > 0 && (
                <div className="mt-4 rounded-xl border border-border bg-background/22 p-3">
                  <div className="mb-2 text-xs font-semibold">Evolução no período</div>
                  <ResponsiveContainer width="100%" height={170}>
                    <BarChart data={preview.tendencia}>
                      <XAxis dataKey="name" stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#AAB8B2" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "#0b1d22", border: "1px solid rgba(110,195,156,.25)", borderRadius: 8, fontSize: 10, color: "#F5F7F6" }} />
                      <Bar dataKey="value" fill="#39E75F" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="mt-4 space-y-3 text-sm">
                <ReportSection title="Resumo Executivo" icon={<TrendingUp className="h-4 w-4" />}><p className="text-xs leading-relaxed text-muted-foreground">{preview.resumo || "Resumo indisponível."}</p></ReportSection>
                <ReportSection title="Destaques" icon={<CheckCircle2 className="h-4 w-4" />}><List items={preview.destaques} color="text-primary-glow" /></ReportSection>
                <ReportSection title="Riscos" icon={<AlertTriangle className="h-4 w-4" />} tone="warning"><List items={preview.riscos} color="text-warning" empty="Nenhum risco relevante no período." /></ReportSection>
                <ReportSection title="Recomendações" icon={<Lightbulb className="h-4 w-4" />} tone="info"><List items={preview.recomendacoes} color="text-[color:var(--info)]" /></ReportSection>
              </div>

              <div className="mt-4 flex flex-wrap justify-end gap-2">
                {preview.status !== "Processando" && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-destructive/35 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => openDeleteDialog(preview)}
                    disabled={deletingId === preview.id}
                  >
                    {deletingId === preview.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1 h-4 w-4" />}
                    Excluir relatório
                  </Button>
                )}
                {preview.status === "Pronto" && preview.pdfDisponivel !== false ? (
                  <Button asChild variant="outline" className="border-primary/30 text-primary-glow">
                    <a
                      href={getReportDownloadUrl(preview)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={preview.arquivoNome || undefined}
                    >
                      Baixar PDF
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" className="border-primary/30 text-primary-glow" disabled>Baixar PDF</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !deletingId) {
            setDeleteTarget(null);
          }
        }}
      >
        <AlertDialogContent className="border-destructive/25 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Deseja realmente excluir o relatório?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-left">
              <span className="block">O relatório será removido da lista, junto com o PDF e o conteúdo armazenado. Esta ação não pode ser desfeita.</span>
              {deleteTarget && (
                <span className="block rounded-lg border border-border bg-background/35 p-3 text-foreground">
                  <strong className="block text-sm">{deleteTarget.titulo}</strong>
                  <span className="mt-1 block text-[10px] text-muted-foreground">{deleteTarget.periodo} · {deleteTarget.id}</span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>


          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void confirmDelete()}
              disabled={!!deletingId}
            >
              {deletingId ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Trash2 className="mr-1 h-4 w-4" />}
              {deletingId ? "Excluindo…" : "Sim, excluir relatório"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
