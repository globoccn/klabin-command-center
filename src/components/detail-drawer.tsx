import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "@/components/status-badge";
import { fmtDateTime } from "@/lib/format";
import type { Task } from "@/types/dashboard";

export function DetailDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  return (
    <Sheet open={!!task} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md overflow-y-auto">
        {task && (
          <>
            <SheetHeader>
              <SheetTitle className="text-foreground">{task.titulo}</SheetTitle>
              <div className="text-xs text-muted-foreground font-mono">{task.id}</div>
            </SheetHeader>
            <div className="mt-6 space-y-4 text-sm">
              <Row label="Status"><StatusBadge status={task.status} /></Row>
              <Row label="Projeto">{task.projeto}</Row>
              <Row label="Subprojeto">{task.subprojeto ?? "—"}</Row>
              <Row label="Setor">{task.setor}</Row>
              <Row label="Andar">{task.andar}</Row>
              <Row label="Serviço">{task.servico}</Row>
              <Row label="Responsável">{task.responsavel}</Row>
              <Row label="Criado em">{fmtDateTime(task.criadoEm)}</Row>
              <Row label="Fechado em">{task.fechadoEm ? fmtDateTime(task.fechadoEm) : "—"}</Row>
              <Row label="Resolução">{task.tempoResolucaoHoras ? `${task.tempoResolucaoHoras}h` : "—"}</Row>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Evidências</div>
                {task.anexos.length === 0 && <div className="text-xs">Nenhum anexo.</div>}
                <div className="grid grid-cols-2 gap-2">
                  {task.anexos.map((a) => (
                    <div key={a.id} className="aspect-square rounded-lg border border-border relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #0D2A22, #081B17)" }}>
                      <div className="absolute inset-0 flex items-center justify-center text-primary-glow text-xs">Foto</div>
                      {a.label && <span className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 rounded bg-background/70 border border-border">{a.label}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
