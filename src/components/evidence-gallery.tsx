import { useMemo, useState } from "react";
import { Camera, CalendarDays, Image, RotateCcw, Search } from "lucide-react";
import { evidencias, filterOptions } from "@/data/mockData";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

const evidenceTypes = ["Todos", "Antes", "Depois", "Ronda", "CPD"] as const;

const badgeColor: Record<string, string> = {
  Antes: "border-warning/30 bg-warning/15 text-warning",
  Depois: "border-primary/30 bg-primary/15 text-primary-glow",
  Ronda: "border-info/30 bg-info/15 text-[color:var(--info)]",
  CPD: "border-chart-5/30 bg-chart-5/15 text-[color:var(--chart-5)]",
};

const initialFilters = {
  tipo: "Todos",
  atividade: "Todas",
  andar: "Todos",
  responsavel: "Todos",
  inicio: "2026-07-01",
  fim: "2026-07-23",
  busca: "",
};

export function EvidenceGallery() {
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState<(typeof evidencias)[number] | null>(null);

  const activities = useMemo(() => ["Todas", ...Array.from(new Set(evidencias.map((item) => item.atividade)))], []);

  const filtered = useMemo(() => {
    const start = new Date(`${filters.inicio}T00:00:00`);
    const end = new Date(`${filters.fim}T23:59:59`);
    const query = normalize(filters.busca);

    return evidencias.filter((item) => {
      const date = new Date(item.data);
      if (date < start || date > end) return false;
      if (filters.tipo !== "Todos" && item.tipo !== filters.tipo) return false;
      if (filters.atividade !== "Todas" && item.atividade !== filters.atividade) return false;
      if (filters.andar !== "Todos" && item.andar !== filters.andar) return false;
      if (filters.responsavel !== "Todos" && item.responsavel !== filters.responsavel) return false;
      if (query && !normalize(`${item.taskId} ${item.titulo} ${item.atividade} ${item.responsavel}`).includes(query)) return false;
      return true;
    });
  }, [filters]);

  const update = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div>
      <div className="command-card mb-4 p-3">
        <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="text-xs font-semibold">Filtros das evidências</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">Data, atividade, andar, responsável e classificação da foto</div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-[11px] text-muted-foreground hover:text-primary-glow" onClick={() => setFilters(initialFilters)}>
            <RotateCcw className="mr-1 h-3 w-3" /> Limpar filtros
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-[1.35fr_1fr_1fr_1fr_1fr_1fr]">
          <div className="relative col-span-2 md:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.busca}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => update("busca", event.target.value)}
              placeholder="Buscar tarefa ou ID…"
              className="h-[54px] w-full rounded-[11px] border border-border bg-card px-3 pl-9 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
            />
          </div>
          <EvidenceFilter label="Tipo" value={filters.tipo} onChange={(value) => update("tipo", value)} options={[...evidenceTypes]} />
          <EvidenceFilter label="Atividade" value={filters.atividade} onChange={(value) => update("atividade", value)} options={activities} />
          <EvidenceFilter label="Andar" value={filters.andar} onChange={(value) => update("andar", value)} options={filterOptions.andar} />
          <EvidenceFilter label="Responsável" value={filters.responsavel} onChange={(value) => update("responsavel", value)} options={filterOptions.responsavel} />
          <DateRange inicio={filters.inicio} fim={filters.fim} onInicio={(value) => update("inicio", value)} onFim={(value) => update("fim", value)} />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-medium">Galeria operacional</div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/7 px-2.5 py-1 text-[10px] text-primary-glow">
          <Image className="h-3 w-3" /> {filtered.length} evidências
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="command-card"><EmptyState title="Nenhuma evidência encontrada" description="Ajuste o período ou remova parte dos filtros." /></div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="command-card group text-left transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_16px_34px_rgba(0,0,0,.28)]"
            >
              <EvidenceVisual color={item.cor} type={item.tipo} />
              <div className="p-3">
                <div className="truncate text-[12px] font-medium text-[#e8eeeb]">{item.titulo}</div>
                <div className="mt-1 truncate text-[10px] text-muted-foreground">{item.andar} · {item.responsavel}</div>
                <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>{fmtDate(item.data)}</span><span className="font-mono text-primary-glow/75">{item.taskId}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open: boolean) => !open && setSelected(null)}>
        <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto border-border bg-card p-0">
          {selected && (
            <>
              <DialogHeader className="border-b border-border px-5 py-4">
                <DialogTitle className="text-lg">Comparação de evidências</DialogTitle>
                <div className="text-[10px] text-muted-foreground">{selected.taskId} · {selected.atividade}</div>
              </DialogHeader>
              <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_270px]">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ComparisonVisual label="Antes" color="#F97316" secondary={selected.cor} />
                  <ComparisonVisual label="Depois" color="#39E75F" secondary={selected.cor} />
                </div>
                <aside className="rounded-xl border border-border bg-background/28 p-4">
                  <div className="mb-4 text-xs font-semibold">Informações da tarefa</div>
                  <div className="space-y-3 text-xs">
                    <Info label="Tarefa" value={selected.titulo} />
                    <Info label="Atividade" value={selected.atividade} />
                    <Info label="Andar" value={selected.andar} />
                    <Info label="Responsável" value={selected.responsavel} />
                    <Info label="Data" value={fmtDate(selected.data)} />
                    <Info label="Classificação" value={selected.tipo} />
                  </div>
                </aside>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EvidenceVisual({ color, type }: { color: string; type: string }) {
  return (
    <div className="relative aspect-video overflow-hidden border-b border-border" style={{ background: `radial-gradient(circle at 68% 28%, ${color}3c, transparent 28%), linear-gradient(135deg, ${color}16, #071b1a 64%)` }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
      <Camera className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-primary-glow/32 transition group-hover:scale-110 group-hover:text-primary-glow/50" />
      <span className={cn("absolute left-2.5 top-2.5 rounded-full border px-2 py-0.5 text-[9px] font-medium", badgeColor[type])}>{type}</span>
    </div>
  );
}

function ComparisonVisual({ label, color, secondary }: { label: string; color: string; secondary: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-border" style={{ background: `radial-gradient(circle at 65% 28%, ${secondary}55, transparent 30%), linear-gradient(135deg, ${color}20, #071b1a 66%)` }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <Camera className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary-glow/38" />
      <span className="absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-medium" style={{ color, borderColor: `${color}66`, background: `${color}1a` }}>{label}</span>
    </div>
  );
}

function EvidenceFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="h-[54px] min-w-0 rounded-[11px] border border-border bg-card px-2 pt-1.5">
      <div className="px-1 text-[9px] font-semibold text-muted-foreground">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-7 border-0 bg-transparent px-1 text-[10px] shadow-none focus:ring-0"><SelectValue /></SelectTrigger>
        <SelectContent className="max-h-72 border-border bg-popover">{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function DateRange({ inicio, fim, onInicio, onFim }: { inicio: string; fim: string; onInicio: (value: string) => void; onFim: (value: string) => void }) {
  return (
    <div className="col-span-2 flex h-[54px] items-center gap-1.5 rounded-[11px] border border-border bg-card px-2 md:col-span-1">
      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary-glow" />
      <input aria-label="Data inicial" type="date" value={inicio} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onInicio(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[9px] outline-none" />
      <span className="text-muted-foreground">–</span>
      <input aria-label="Data final" type="date" value={fim} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFim(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[9px] outline-none" />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-border pb-2"><div className="text-[9px] uppercase tracking-[.08em] text-muted-foreground">{label}</div><div className="mt-1 leading-relaxed text-[#e3e9e6]">{value}</div></div>;
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
