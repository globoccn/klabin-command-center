import { useEffect, useMemo, useState } from "react";
import { Search, Paperclip, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { getTasks } from "@/services/dashboardService";
import type { Task } from "@/types/dashboard";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { DetailDrawer } from "@/components/detail-drawer";
import { fmtDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function TaskTable() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Task | null>(null);
  const perPage = 10;

  useEffect(() => { getTasks({ search }).then(setTasks); }, [search]);

  const paged = useMemo(() => {
    if (!tasks) return [];
    return tasks.slice((page - 1) * perPage, page * perPage);
  }, [tasks, page]);
  const totalPages = tasks ? Math.max(1, Math.ceil(tasks.length / perPage)) : 1;

  return (
    <div className="card-premium rounded-2xl overflow-hidden">
      <div className="p-4 flex items-center justify-between gap-2 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por ID ou título…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="text-xs text-muted-foreground">{tasks?.length ?? 0} tarefas</div>
      </div>

      <div className="overflow-x-auto">
        {!tasks && <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-10" />)}</div>}
        {tasks && tasks.length === 0 && <EmptyState />}
        {tasks && tasks.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-background/50 text-xs uppercase text-muted-foreground">
              <tr>
                {["ID", "Tarefa", "Projeto", "Setor", "Serviço", "Responsável", "Status", "Criação", "Fechamento", "Resolução", "Evid."].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => (
                <tr key={t.id} onClick={() => setSelected(t)}
                  className="border-t border-border hover:bg-card-elevated cursor-pointer transition-colors">
                  <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-3 py-2.5 max-w-[200px] truncate">{t.titulo}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{t.projeto}</td>
                  <td className="px-3 py-2.5">{t.setor}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{t.servico}</td>
                  <td className="px-3 py-2.5">{t.responsavel}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={t.status} /></td>
                  <td className="px-3 py-2.5 text-muted-foreground text-xs">{fmtDate(t.criadoEm)}</td>
                  <td className="px-3 py-2.5 text-muted-foreground text-xs">{t.fechadoEm ? fmtDate(t.fechadoEm) : "—"}</td>
                  <td className="px-3 py-2.5 text-xs">{t.tempoResolucaoHoras ? `${t.tempoResolucaoHoras}h` : "—"}</td>
                  <td className="px-3 py-2.5">
                    {t.anexos.length > 0 ? (
                      <div className="flex items-center gap-1 text-primary-glow"><Camera className="h-3 w-3" /><span className="text-xs">{t.anexos.length}</span></div>
                    ) : <Paperclip className="h-3 w-3 text-muted-foreground/40" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {tasks && tasks.length > 0 && (
        <div className="p-3 flex items-center justify-between border-t border-border">
          <div className="text-xs text-muted-foreground">Página {page} de {totalPages}</div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      <DetailDrawer task={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
