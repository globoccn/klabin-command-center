import { useEffect, useState } from "react";
import { AlertTriangle, Camera, Clock3, FileText, ListChecks, Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getTaskDetail } from "@/services/dashboardService";
import { fmtDateTime } from "@/lib/format";
import type { Task, TaskDetailResponse } from "@/types/dashboard";

export function DetailDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const [detail, setDetail] = useState<TaskDetailResponse | null>(null);

  useEffect(() => {
    if (!task) {
      setDetail(null);
      return;
    }
    let active = true;
    setDetail(null);
    getTaskDetail(task.id).then((response) => active && setDetail(response)).catch(() => undefined);
    return () => { active = false; };
  }, [task?.id]);

  const current = detail?.task ?? task;

  return (
    <Sheet open={!!task} onOpenChange={(open: boolean) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-border bg-[linear-gradient(180deg,#0b1d22,#061715)] sm:max-w-xl">
        {current && (
          <>
            <SheetHeader className="border-b border-border pb-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-primary-glow"><FileText className="h-3.5 w-3.5" /> Detalhamento operacional</div>
              <SheetTitle className="pr-8 text-left text-lg leading-snug text-foreground">{current.titulo}</SheetTitle>
              <div className="font-mono text-[10px] text-muted-foreground">{current.id}</div>
            </SheetHeader>

            <div className="mt-5 space-y-5 text-xs">
              {current.descricao && <div className="rounded-xl border border-border bg-background/28 p-3 leading-relaxed text-[#d5dfdc]">{current.descricao}</div>}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Info label="Status"><StatusBadge status={current.status} /></Info>
                <Info label="Projeto" value={current.projeto} />
                <Info label="Subprojeto" value={current.subprojeto ?? "—"} />
                <Info label="Setor" value={current.setor} />
                <Info label="Andar" value={current.andar ?? "—"} />
                <Info label="Serviço" value={current.servico} />
                <Info label="Responsável" value={current.responsavel} />
                <Info label="Tempo de resolução" value={current.tempoResolucaoHoras != null ? `${current.tempoResolucaoHoras.toLocaleString("pt-BR")}h` : "—"} />
              </div>

              <div className="rounded-xl border border-border bg-background/24 p-3">
                <div className="mb-3 flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4 text-primary-glow" /> Linha do tempo</div>
                <Timeline label="Tarefa criada" value={fmtDateTime(current.criadoEm)} />
                <Timeline label="Tarefa encerrada" value={current.fechadoEm ? fmtDateTime(current.fechadoEm) : "Em aberto"} last />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between"><span className="font-semibold">Evidências</span><span className="text-[10px] text-muted-foreground">{current.anexos.length} arquivo(s)</span></div>
                {current.anexos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-[10px] text-muted-foreground">Nenhuma evidência anexada.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {current.anexos.map((attachment) => (
                      <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_65%_25%,rgba(55,237,99,.17),transparent_30%),linear-gradient(135deg,#0d2a22,#061715)]">
                        {attachment.url ? <img src={attachment.url} alt={attachment.label ?? "Evidência"} loading="lazy" className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100" /> : <Camera className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary-glow/38" />}
                        {attachment.label && <span className="absolute left-2 top-2 max-w-[calc(100%-16px)] truncate rounded-full border border-primary/25 bg-background/80 px-2 py-0.5 text-[9px] text-[#e7eeeb]">{attachment.label}</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {!detail ? (
                <div className="space-y-2"><LoadingSkeleton className="h-16" /><LoadingSkeleton className="h-16" /></div>
              ) : (
                <>
                  <section className="rounded-xl border border-border bg-background/24 p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-semibold"><ListChecks className="h-4 w-4 text-primary-glow" /> Campos personalizados</div>
                      <span className="text-[10px] text-muted-foreground">{detail.fields.length}</span>
                    </div>
                    {detail.fields.length === 0 ? <div className="text-[10px] text-muted-foreground">Nenhum campo personalizado.</div> : (
                      <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                        {detail.fields.map((field) => (
                          <div key={field.id} className="rounded-lg border border-border/70 bg-card/55 px-2.5 py-2">
                            <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-[.06em] text-muted-foreground"><span>{field.label}</span>{field.duplicate && <span className="rounded-full border border-warning/25 bg-warning/10 px-1.5 py-0.5 text-warning">duplicado</span>}</div>
                            <div className="mt-1 break-words text-[11px] text-[#e4ebe8]">{formatFieldValue(field.value)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-background/24 p-3">
                      <div className="mb-2 flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-[color:var(--info)]" /> Observadores</div>
                      <div className="text-[11px] text-muted-foreground">{detail.observers.length ? detail.observers.join(", ") : "Nenhum observador registrado."}</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background/24 p-3">
                      <div className="mb-2 flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4 text-warning" /> Qualidade</div>
                      <div className="space-y-1 text-[10px] text-muted-foreground">{detail.qualityIssues.length ? detail.qualityIssues.map((issue) => <div key={issue.code}>{issue.label}</div>) : "Nenhum alerta identificado."}</div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function formatFieldValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "Não preenchido";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Não preenchido";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function Info({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return <div className="min-h-[62px] rounded-xl border border-border bg-background/22 p-3"><div className="text-[9px] uppercase tracking-[.07em] text-muted-foreground">{label}</div><div className="mt-1.5 font-medium text-[#e4ebe8]">{children ?? value}</div></div>;
}

function Timeline({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="grid grid-cols-[14px_1fr] gap-2">
      <div className="flex flex-col items-center"><span className="mt-1 h-2 w-2 rounded-full bg-primary-glow" />{!last && <span className="h-8 w-px bg-primary/25" />}</div>
      <div className={last ? "" : "pb-3"}><div className="text-[10px] text-muted-foreground">{label}</div><div className="mt-0.5 text-[11px]">{value}</div></div>
    </div>
  );
}
