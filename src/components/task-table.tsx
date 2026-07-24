import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Paperclip, Search } from "lucide-react";
import { getTasks } from "@/services/dashboardService";
import type { DashboardFilters, Task } from "@/types/dashboard";
import { StatusBadge } from "@/components/status-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { DetailDrawer } from "@/components/detail-drawer";
import { fmtDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function TaskTable({ filters }: { filters?: DashboardFilters }) {
  const [items, setItems] = useState<Task[] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Task | null>(null);
  const perPage = 10;

  useEffect(() => {
    let active = true;
    setItems(null);
    getTasks({ ...filters, search }).then((result) => active && setItems(result));
    setPage(1);
    return () => { active = false; };
  }, [filters, search]);

  const paged = useMemo(() => {
    if (!items) return [];
    return items.slice((page - 1) * perPage, page * perPage);
  }, [items, page]);
  const totalPages = items ? Math.max(1, Math.ceil(items.length / perPage)) : 1;

  return (
    <section className="command-card">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            placeholder="Buscar por ID, tarefa, setor ou serviço…"
            className="h-10 w-full rounded-[10px] border border-border bg-background/70 pl-9 pr-3 text-xs outline-none transition placeholder:text-muted-foreground focus:border-primary/55 focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary-glow shadow-[0_0_10px_rgba(55,237,99,.45)]" />
          {items?.length ?? 0} tarefas encontradas
        </div>
      </div>

      <div className="overflow-x-auto">
        {!items ? (
          <div className="space-y-2 p-4">{Array.from({ length: 8 }, (_, index) => <LoadingSkeleton key={index} className="h-10" />)}</div>
        ) : items.length === 0 ? (
          <EmptyState title="Nenhuma tarefa encontrada" description="Revise os filtros ou o termo pesquisado." />
        ) : (
          <table className="w-full min-w-[1210px] text-[11px]">
            <thead className="bg-background/48 text-[9px] uppercase tracking-[.08em] text-muted-foreground">
              <tr>
                {["ID", "Tarefa", "Projeto", "Setor", "Serviço", "Responsável", "Status", "Criação", "Fechamento", "Resolução", "Evid."].map((heading) => (
                  <th key={heading} className="px-3 py-3 text-left font-semibold whitespace-nowrap">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelected(task)}
                  className="cursor-pointer border-t border-border/72 transition hover:bg-card-elevated/72"
                >
                  <td className="px-3 py-3 font-mono text-[10px] text-primary-glow/80">{task.id}</td>
                  <td className="max-w-[250px] px-3 py-3">
                    <div className="truncate font-medium text-[#e7ecea]">{task.titulo}</div>
                    <div className="mt-0.5 truncate text-[9px] text-muted-foreground">{task.subprojeto}</div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{task.projeto}</td>
                  <td className="px-3 py-3 font-medium">{task.setor}</td>
                  <td className="px-3 py-3 text-muted-foreground">{task.servico}</td>
                  <td className="px-3 py-3">{task.responsavel}</td>
                  <td className="px-3 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-3 py-3 text-[10px] text-muted-foreground">{fmtDate(task.criadoEm)}</td>
                  <td className="px-3 py-3 text-[10px] text-muted-foreground">{task.fechadoEm ? fmtDate(task.fechadoEm) : "—"}</td>
                  <td className="px-3 py-3 text-[10px]">{task.tempoResolucaoHoras != null ? `${task.tempoResolucaoHoras.toLocaleString("pt-BR")}h` : "—"}</td>
                  <td className="px-3 py-3">
                    {task.anexos.length > 0 ? (
                      <div className="inline-flex items-center gap-1 rounded-md border border-primary/22 bg-primary/8 px-1.5 py-1 text-primary-glow">
                        <Camera className="h-3 w-3" /><span>{task.anexos.length}</span>
                      </div>
                    ) : <Paperclip className="h-3.5 w-3.5 text-muted-foreground/35" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {items && items.length > 0 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <div className="text-[10px] text-muted-foreground">Página {page} de {totalPages}</div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <DetailDrawer task={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
