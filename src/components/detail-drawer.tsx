import { Camera, Clock3, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/status-badge";
import { fmtDateTime } from "@/lib/format";
import type { Task } from "@/types/dashboard";

export function DetailDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  return (
    <Sheet open={!!task} onOpenChange={(open: boolean) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-border bg-[linear-gradient(180deg,#0b1d22,#061715)] sm:max-w-lg">
        {task && (
          <>
            <SheetHeader className="border-b border-border pb-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-primary-glow"><FileText className="h-3.5 w-3.5" /> Detalhamento operacional</div>
              <SheetTitle className="pr-8 text-left text-lg leading-snug text-foreground">{task.titulo}</SheetTitle>
              <div className="font-mono text-[10px] text-muted-foreground">{task.id}</div>
            </SheetHeader>

            <div className="mt-5 space-y-5 text-xs">
              {task.descricao && <div className="rounded-xl border border-border bg-background/28 p-3 leading-relaxed text-[#d5dfdc]">{task.descricao}</div>}

              <div className="grid grid-cols-2 gap-2">
                <Info label="Status"><StatusBadge status={task.status} /></Info>
                <Info label="Projeto" value={task.projeto} />
                <Info label="Subprojeto" value={task.subprojeto ?? "—"} />
                <Info label="Setor" value={task.setor} />
                <Info label="Andar" value={task.andar ?? "—"} />
                <Info label="Serviço" value={task.servico} />
                <Info label="Responsável" value={task.responsavel} />
                <Info label="Tempo de resolução" value={task.tempoResolucaoHoras != null ? `${task.tempoResolucaoHoras.toLocaleString("pt-BR")}h` : "—"} />
              </div>

              <div className="rounded-xl border border-border bg-background/24 p-3">
                <div className="mb-3 flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4 text-primary-glow" /> Linha do tempo</div>
                <Timeline label="Tarefa criada" value={fmtDateTime(task.criadoEm)} />
                <Timeline label="Tarefa encerrada" value={task.fechadoEm ? fmtDateTime(task.fechadoEm) : "Em aberto"} last />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between"><span className="font-semibold">Evidências</span><span className="text-[10px] text-muted-foreground">{task.anexos.length} arquivo(s)</span></div>
                {task.anexos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-[10px] text-muted-foreground">Nenhuma evidência anexada.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {task.anexos.map((attachment) => (
                      <div key={attachment.id} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_65%_25%,rgba(55,237,99,.17),transparent_30%),linear-gradient(135deg,#0d2a22,#061715)]">
                        <Camera className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary-glow/38" />
                        {attachment.label && <span className="absolute left-2 top-2 rounded-full border border-primary/25 bg-background/70 px-2 py-0.5 text-[9px] text-[#e7eeeb]">{attachment.label}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
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
