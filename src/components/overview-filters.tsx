import { CalendarDays, Check, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFilterOptions } from "@/services/dashboardService";
import type { DashboardFilters, FilterOptions } from "@/types/dashboard";

interface Props {
  value: DashboardFilters;
  onApply: (filters: DashboardFilters) => void;
}

const EMPTY_OPTIONS: FilterOptions = {
  periodo: { inicio: "", fim: "" },
  projeto: ["Todos"],
  subprojeto: ["Todos"],
  andar: ["Todos"],
  status: ["Todos"],
  responsavel: ["Todos"],
  subprojetoPorProjeto: {},
};

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fromIso(iso: string) {
  return new Date(`${iso}T12:00:00Z`);
}

function clampDate(iso: string, min: string, max: string) {
  if (min && iso < min) return min;
  if (max && iso > max) return max;
  return iso;
}

function quickPeriod(kind: "7" | "30" | "90" | "month" | "6months", fullPeriod: DashboardFilters["periodo"]) {
  if (!fullPeriod.inicio || !fullPeriod.fim) return fullPeriod;
  const end = fromIso(fullPeriod.fim);
  let start = new Date(end);

  if (kind === "month") {
    start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1, 12));
  } else if (kind === "6months") {
    start.setUTCMonth(start.getUTCMonth() - 6);
    start.setUTCDate(start.getUTCDate() + 1);
  } else {
    start.setUTCDate(start.getUTCDate() - (Number(kind) - 1));
  }

  return {
    inicio: clampDate(isoDate(start), fullPeriod.inicio, fullPeriod.fim),
    fim: fullPeriod.fim,
  };
}

export function OverviewFilters({ value, onApply }: Props) {
  const [options, setOptions] = useState<FilterOptions>(EMPTY_OPTIONS);
  const [draft, setDraft] = useState<DashboardFilters>(value);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getFilterOptions()
      .then((result) => {
        if (!active) return;
        setOptions(result);
        setDraft((current) => ({
          ...current,
          periodo: current.periodo.inicio && current.periodo.fim ? current.periodo : result.periodo,
        }));
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoadingOptions(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setDraft((current) => ({
      ...value,
      periodo: value.periodo.inicio && value.periodo.fim ? value.periodo : current.periodo,
    }));
  }, [value]);

  const effectiveFullPeriod = options.periodo.inicio && options.periodo.fim ? options.periodo : draft.periodo;
  const invalidPeriod = !draft.periodo.inicio || !draft.periodo.fim || draft.periodo.inicio > draft.periodo.fim;

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify({
    ...value,
    periodo: value.periodo.inicio && value.periodo.fim ? value.periodo : draft.periodo,
  }), [draft, value]);

  const subprojectOptions = draft.projeto === "Todos"
    ? options.subprojeto
    : ["Todos", ...(options.subprojetoPorProjeto?.[draft.projeto] ?? [])];

  const apply = () => {
    if (invalidPeriod) return;
    onApply(draft);
    setMoreOpen(false);
  };

  const reset = () => {
    const next: DashboardFilters = {
      periodo: effectiveFullPeriod,
      projeto: "Todos",
      subprojeto: "Todos",
      andar: "Todos",
      status: "Todos",
      responsavel: "Todos",
    };
    setDraft(next);
    onApply(next);
    setMoreOpen(false);
  };

  return (
    <section className="overview-filter-panel" aria-label="Filtros da Visão Geral">
      <div className="overview-period-block">
        <div className="overview-filter-label">
          <CalendarDays className="h-3.5 w-3.5" /> Período de análise
        </div>
        <div className="overview-date-fields">
          <OverviewDateField
            label="Data inicial"
            value={draft.periodo.inicio}
            min={effectiveFullPeriod.inicio || undefined}
            max={draft.periodo.fim || effectiveFullPeriod.fim || undefined}
            onChange={(inicio) => setDraft((current) => ({ ...current, periodo: { ...current.periodo, inicio } }))}
          />
          <span className="overview-date-separator">até</span>
          <OverviewDateField
            label="Data final"
            value={draft.periodo.fim}
            min={draft.periodo.inicio || effectiveFullPeriod.inicio || undefined}
            max={effectiveFullPeriod.fim || undefined}
            onChange={(fim) => setDraft((current) => ({ ...current, periodo: { ...current.periodo, fim } }))}
          />
        </div>
      </div>

      <div className="overview-quick-periods" aria-label="Períodos rápidos">
        <div className="overview-quick-label">Períodos rápidos</div>
        <div className="overview-quick-buttons">
          <QuickButton label="7 dias" onClick={() => setDraft((current) => ({ ...current, periodo: quickPeriod("7", effectiveFullPeriod) }))} />
          <QuickButton label="30 dias" onClick={() => setDraft((current) => ({ ...current, periodo: quickPeriod("30", effectiveFullPeriod) }))} />
          <QuickButton label="90 dias" onClick={() => setDraft((current) => ({ ...current, periodo: quickPeriod("90", effectiveFullPeriod) }))} />
          <QuickButton label="Este mês" onClick={() => setDraft((current) => ({ ...current, periodo: quickPeriod("month", effectiveFullPeriod) }))} />
          <QuickButton label="Últimos 6 meses" className="overview-quick-wide" onClick={() => setDraft((current) => ({ ...current, periodo: quickPeriod("6months", effectiveFullPeriod) }))} />
        </div>
      </div>

      <Popover open={moreOpen} onOpenChange={setMoreOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="overview-more-filters" aria-label="Abrir filtros adicionais">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Mais filtros</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[380px] border-border bg-popover p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold">Filtros adicionais</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Projeto, subprojeto, andar, status e responsável.</div>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={reset} className="h-7 px-2 text-[10px] text-muted-foreground hover:text-primary-glow">
              <RotateCcw className="mr-1 h-3 w-3" /> Limpar
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <OverviewSelect label="Projeto" value={draft.projeto} options={options.projeto} onChange={(projeto) => setDraft((current) => ({ ...current, projeto, subprojeto: "Todos" }))} />
            <OverviewSelect label="Subprojeto" value={draft.subprojeto} options={subprojectOptions} onChange={(subprojeto) => setDraft((current) => ({ ...current, subprojeto }))} />
            <OverviewSelect label="Andar" value={draft.andar} options={options.andar} onChange={(andar) => setDraft((current) => ({ ...current, andar }))} />
            <OverviewSelect label="Status" value={draft.status} options={options.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} />
            <div className="col-span-2">
              <OverviewSelect label="Responsável" value={draft.responsavel} options={options.responsavel} onChange={(responsavel) => setDraft((current) => ({ ...current, responsavel }))} />
            </div>
          </div>
          <Button type="button" onClick={apply} disabled={invalidPeriod} className="mt-3 h-9 w-full bg-primary text-[11px] text-primary-foreground hover:bg-primary-glow">
            <Check className="mr-1.5 h-3.5 w-3.5" /> Aplicar filtros
          </Button>
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        onClick={apply}
        disabled={invalidPeriod || loadingOptions}
        className="overview-apply-period"
      >
        <Check className="h-4 w-4" />
        Aplicar período
        {dirty && <span className="overview-filter-dirty-dot" aria-label="Há alterações não aplicadas" />}
      </Button>

      {invalidPeriod && <div className="overview-period-error">Verifique as datas do período.</div>}
    </section>
  );
}

function OverviewDateField({ label, value, min, max, onChange }: { label: string; value: string; min?: string; max?: string; onChange: (value: string) => void }) {
  return (
    <label className="overview-date-field">
      <span className="sr-only">{label}</span>
      <CalendarDays className="h-3.5 w-3.5" />
      <input type="date" aria-label={label} value={value} min={min} max={max} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function QuickButton({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
  return <button type="button" onClick={onClick} className={`overview-quick-button ${className}`}>{label}</button>;
}

function OverviewSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="mb-1 text-[9px] font-semibold uppercase tracking-[.08em] text-muted-foreground">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="h-9 border-border bg-background text-[10px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72 border-border bg-popover">
          {options.map((option) => <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
