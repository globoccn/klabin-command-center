import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CalendarDays, ChevronDown, Image, LoaderCircle, RotateCcw, Search } from "lucide-react";
import { getEvidence } from "@/services/dashboardService";
import type { EvidenceRecord, EvidenceResponse } from "@/types/dashboard";
import { fmtDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/empty-state";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";

const evidenceTypes = ["Todos", "Antes", "Depois", "Ronda", "CPD"] as const;
const PAGE_SIZE = 24;

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
  inicio: "2025-11-04",
  fim: "2026-07-23",
  busca: "",
};

const EMPTY_RESPONSE: EvidenceResponse = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 0,
  hasMore: false,
  options: { activities: [], floors: [], responsibles: [] },
};

export function EvidenceGallery() {
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [response, setResponse] = useState<EvidenceResponse | null>(null);
  const [selected, setSelected] = useState<EvidenceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestSequence = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(filters.busca), 350);
    return () => window.clearTimeout(timer);
  }, [filters.busca]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestSequence.current;
    setLoading(true);

    getEvidence(
      { ...filters, busca: debouncedSearch, page: 1, pageSize: PAGE_SIZE },
      controller.signal,
    )
      .then((result) => {
        if (requestId === requestSequence.current) setResponse(result);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (requestId === requestSequence.current) setResponse(EMPTY_RESPONSE);
      })
      .finally(() => {
        if (requestId === requestSequence.current) setLoading(false);
      });

    return () => controller.abort();
  }, [filters.tipo, filters.atividade, filters.andar, filters.responsavel, filters.inicio, filters.fim, debouncedSearch]);

  const activities = useMemo(() => ["Todas", ...(response?.options.activities ?? [])], [response]);
  const floors = useMemo(() => ["Todos", ...(response?.options.floors ?? [])], [response]);
  const responsibles = useMemo(() => ["Todos", ...(response?.options.responsibles ?? [])], [response]);
  const update = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  const loadMore = async () => {
    if (!response?.hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = await getEvidence({
        ...filters,
        busca: debouncedSearch,
        page: response.page + 1,
        pageSize: PAGE_SIZE,
      });
      setResponse((current) => {
        if (!current) return next;
        const existingIds = new Set(current.items.map((item) => item.id));
        return {
          ...next,
          items: [...current.items, ...next.items.filter((item) => !existingIds.has(item.id))],
          options: current.options,
        };
      });
    } finally {
      setLoadingMore(false);
    }
  };

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

        <div className="evidence-filter-grid grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.35fr_1fr_1fr_1fr_1fr_1fr]">
          <div className="relative col-span-2 md:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={filters.busca} onChange={(event: React.ChangeEvent<HTMLInputElement>) => update("busca", event.target.value)} placeholder="Buscar tarefa ou ID…" className="h-[54px] w-full rounded-[11px] border border-border bg-card px-3 pl-9 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25" />
          </div>
          <EvidenceFilter label="Tipo" value={filters.tipo} onChange={(value) => update("tipo", value)} options={[...evidenceTypes]} />
          <EvidenceFilter label="Atividade" value={filters.atividade} onChange={(value) => update("atividade", value)} options={activities} />
          <EvidenceFilter label="Andar" value={filters.andar} onChange={(value) => update("andar", value)} options={floors} />
          <EvidenceFilter label="Responsável" value={filters.responsavel} onChange={(value) => update("responsavel", value)} options={responsibles} />
          <DateRange inicio={filters.inicio} fim={filters.fim} onInicio={(value) => update("inicio", value)} onFim={(value) => update("fim", value)} />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          Galeria operacional
          {loading && response && (
            <span className="inline-flex items-center gap-1 text-[9px] font-normal text-muted-foreground">
              <LoaderCircle className="h-3 w-3 animate-spin text-primary-glow" /> atualizando
            </span>
          )}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/7 px-2.5 py-1 text-[10px] text-primary-glow">
          <Image className="h-3 w-3" /> {response ? `${response.items.length} de ${response.total}` : "…"} evidências
        </div>
      </div>

      {!response && loading ? (
        <div className="evidence-gallery-grid grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <LoadingSkeleton key={index} className="aspect-video" />)}</div>
      ) : !response || response.items.length === 0 ? (
        <div className="command-card"><EmptyState title="Nenhuma evidência encontrada" description="Ajuste o período ou remova parte dos filtros." /></div>
      ) : (
        <>
          <div className="evidence-gallery-grid grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {response.items.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelected(item)} className="command-card evidence-card group text-left transition duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_16px_34px_rgba(0,0,0,.28)] hover:text-foreground">
                <EvidenceVisual record={item} />
                <div className="p-3">
                  <div className="truncate text-[12px] font-medium text-[#e8eeeb]">{item.titulo}</div>
                  <div className="mt-1 truncate text-[10px] text-muted-foreground">{item.andar} · {item.responsavel}</div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground"><span>{fmtDate(item.data)}</span><span className="font-mono text-primary-glow/75">{item.taskId}</span></div>
                </div>
              </button>
            ))}
          </div>

          {response.hasMore && (
            <div className="mt-5 flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="min-w-[220px] border-primary/30 bg-background/45 text-xs text-[#e5f8e9] hover:border-primary/50 hover:bg-primary/12 hover:text-white"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                {loadingMore ? "Carregando…" : `Carregar mais ${Math.min(PAGE_SIZE, response.total - response.items.length)} evidências`}
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open: boolean) => !open && setSelected(null)}>
        <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto border-border bg-card p-0">
          {selected && (
            <>
              <DialogHeader className="border-b border-border px-5 py-4">
                <DialogTitle className="text-lg">Evidência operacional</DialogTitle>
                <div className="text-[10px] text-muted-foreground">{selected.taskId} · {selected.atividade}</div>
              </DialogHeader>
              <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_270px]">
                <div className={cn("grid gap-3", selected.beforeUrl || selected.afterUrl ? "sm:grid-cols-2" : "grid-cols-1")}>
                  {selected.beforeUrl || selected.afterUrl ? (
                    <>
                      <EvidenceComparisonPhoto label="Antes" url={selected.beforeUrl} color="#F97316" />
                      <EvidenceComparisonPhoto label="Depois" url={selected.afterUrl} color="#39E75F" />
                    </>
                  ) : (
                    <EvidenceComparisonPhoto label={selected.tipo} url={selected.url} color={selected.cor} />
                  )}
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

function EvidenceComparisonPhoto({ label, url, color }: { label: string; url?: string; color: string }) {
  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-border bg-background/35">
      {url ? (
        <img src={url} alt={`Evidência ${label}`} decoding="async" className="h-full max-h-[560px] w-full object-contain" />
      ) : (
        <ComparisonVisual label={label} color={color} />
      )}
      <span className="absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm" style={{ color, borderColor: `${color}66`, background: `${color}24` }}>{label}</span>
    </div>
  );
}

function EvidenceVisual({ record }: { record: EvidenceRecord }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(record.url) && !failed;

  return (
    <div className="relative aspect-video overflow-hidden border-b border-border" style={{ background: `radial-gradient(circle at 68% 28%, ${record.cor}3c, transparent 28%), linear-gradient(135deg, ${record.cor}16, #071b1a 64%)` }}>
      {showImage && (
        <img
          src={record.url}
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-95",
            loaded ? "opacity-75" : "opacity-0",
          )}
        />
      )}
      {!loaded && showImage && <div className="absolute inset-0 animate-pulse bg-primary/5" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      {(!showImage || failed) && <Camera className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-primary-glow/32" />}
      <span className={cn("absolute left-2.5 top-2.5 rounded-full border px-2 py-0.5 text-[9px] font-medium backdrop-blur-sm", badgeColor[record.tipo])}>{record.tipo}</span>
    </div>
  );
}

function ComparisonVisual({ label, color }: { label: string; color: string }) {
  return <div className="relative aspect-square" style={{ background: `radial-gradient(circle at 65% 28%, ${color}55, transparent 30%), linear-gradient(135deg, ${color}20, #071b1a 66%)` }}><Camera className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary-glow/38" /><span className="absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-medium" style={{ color, borderColor: `${color}66`, background: `${color}1a` }}>{label}</span></div>;
}

function EvidenceFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="h-[54px] min-w-0 rounded-[11px] border border-border bg-card px-2 pt-1.5"><div className="px-1 text-[9px] font-semibold text-muted-foreground">{label}</div><Select value={value} onValueChange={onChange}><SelectTrigger className="h-7 border-0 bg-transparent px-1 text-[10px] shadow-none focus:ring-0"><SelectValue /></SelectTrigger><SelectContent className="max-h-72 border-border bg-popover">{options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}</SelectContent></Select></div>;
}

function DateRange({ inicio, fim, onInicio, onFim }: { inicio: string; fim: string; onInicio: (value: string) => void; onFim: (value: string) => void }) {
  return <div className="flex h-[54px] sm:col-span-2 items-center gap-1.5 rounded-[11px] border border-border bg-card px-2 md:col-span-1"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary-glow" /><input aria-label="Data inicial" type="date" value={inicio} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onInicio(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[9px] outline-none" /><span className="text-muted-foreground">–</span><input aria-label="Data final" type="date" value={fim} onChange={(event: React.ChangeEvent<HTMLInputElement>) => onFim(event.target.value)} className="min-w-0 flex-1 bg-transparent text-[9px] outline-none" /></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-border pb-2"><div className="text-[9px] uppercase tracking-[.08em] text-muted-foreground">{label}</div><div className="mt-1 leading-relaxed text-[#e3e9e6]">{value}</div></div>;
}
