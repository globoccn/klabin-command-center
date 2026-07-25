import { CalendarDays, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFilterOptions } from "@/services/dashboardService";
import type { DashboardFilters, FilterOptions } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export const DEFAULT_FILTERS: DashboardFilters = {
  periodo: { inicio: "2025-11-04", fim: "2026-07-23" },
  projeto: "Todos",
  subprojeto: "Todos",
  andar: "Todos",
  status: "Todos",
  responsavel: "Todos",
};

const INITIAL_OPTIONS: FilterOptions = {
  periodo: DEFAULT_FILTERS.periodo,
  projeto: ["Todos"],
  subprojeto: ["Todos"],
  andar: ["Todos"],
  status: ["Todos"],
  responsavel: ["Todos"],
  subprojetoPorProjeto: {},
};

interface FilterBarProps {
  value?: DashboardFilters;
  onChange?: (filters: DashboardFilters) => void;
  variant?: "toolbar" | "section";
  className?: string;
}

export function FilterBar({ value = DEFAULT_FILTERS, onChange, variant = "section", className }: FilterBarProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(INITIAL_OPTIONS);

  useEffect(() => {
    let active = true;
    getFilterOptions().then((result) => {
      if (!active) return;
      setFilterOptions(result);
      if (value.periodo.inicio === DEFAULT_FILTERS.periodo.inicio && value.periodo.fim === DEFAULT_FILTERS.periodo.fim) {
        onChange?.({ ...value, periodo: result.periodo });
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  const update = <K extends keyof DashboardFilters>(key: K, nextValue: DashboardFilters[K]) => {
    onChange?.({ ...value, [key]: nextValue });
  };

  const subprojectOptions = value.projeto === "Todos"
    ? filterOptions.subprojeto
    : ["Todos", ...(filterOptions.subprojetoPorProjeto?.[value.projeto] ?? [])];

  const content = (
    <>
      <PeriodFilter
        value={value.periodo}
        fullPeriod={filterOptions.periodo}
        onChange={(periodo) => update("periodo", periodo)}
        toolbar={variant === "toolbar"}
      />
      <SelectFilter label="Projeto" value={value.projeto} options={filterOptions.projeto} onChange={(next) => onChange?.({ ...value, projeto: next, subprojeto: "Todos" })} />
      <SelectFilter label="Subprojeto" value={value.subprojeto} options={subprojectOptions} onChange={(next) => update("subprojeto", next)} />
      <SelectFilter label="Andar" value={value.andar} options={filterOptions.andar} onChange={(next) => update("andar", next)} />
      <SelectFilter label="Status" value={value.status} options={filterOptions.status} onChange={(next) => update("status", next)} />
      <SelectFilter label="Responsável" value={value.responsavel} options={filterOptions.responsavel} onChange={(next) => update("responsavel", next)} />
    </>
  );

  if (variant === "toolbar") {
    return (
      <div className={cn("dashboard-filter-area min-w-0", className)}>
        <div className="dashboard-filter-grid">{content}</div>
      </div>
    );
  }

  return (
    <div className={cn("mb-5 rounded-[14px] border border-border bg-card/55 p-2.5 shadow-[0_10px_30px_rgba(0,0,0,.14)]", className)}>
      <div className="flex items-center justify-between gap-3 px-1 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#dce5e2]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary-glow" />
          Filtros da análise
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange?.({ ...DEFAULT_FILTERS, periodo: filterOptions.periodo })}
          className="h-7 px-2 text-[11px] text-muted-foreground hover:bg-primary/8 hover:text-primary-glow"
        >
          <RotateCcw className="mr-1 h-3 w-3" />
          Limpar filtros
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{content}</div>
    </div>
  );
}

function PeriodFilter({
  value,
  onChange,
  toolbar,
  fullPeriod,
}: {
  value: DashboardFilters["periodo"];
  fullPeriod: DashboardFilters["periodo"];
  onChange: (value: DashboardFilters["periodo"]) => void;
  toolbar: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cn("filter-shell group flex w-full items-center justify-between gap-2 px-3 text-left", !toolbar && "h-[58px]")}> 
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-[#dce5e2]">Período</div>
            <div className="mt-1 truncate text-[10px] text-[#f1f5f3]">{formatPeriod(value)}</div>
          </div>
          <CalendarDays className="h-4 w-4 shrink-0 text-[#d5dfdc] transition-colors group-hover:text-primary-glow" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 border-border bg-popover p-3 shadow-2xl">
        <div className="mb-3 text-xs font-semibold">Selecionar período</div>
        <div className="grid grid-cols-2 gap-2">
          <DateField
            label="Início"
            value={value.inicio}
            onChange={(inicio) => onChange({ ...value, inicio })}
          />
          <DateField
            label="Fim"
            value={value.fim}
            onChange={(fim) => onChange({ ...value, fim })}
          />
        </div>
        <button
          type="button"
          onClick={() => onChange(fullPeriod)}
          className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary-glow"
        >
          <RotateCcw className="h-3 w-3" /> Restaurar período completo
        </button>
      </PopoverContent>
    </Popover>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1">
      <span className="text-[10px] uppercase tracking-[.08em] text-muted-foreground">{label}</span>
      <input
        type="date"
        value={value}
        max={label === "Início" ? undefined : DEFAULT_FILTERS.periodo.fim}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="h-9 w-full rounded-lg border border-border bg-background px-2 text-[11px] text-foreground outline-none transition focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
      />
    </label>
  );
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="filter-shell min-w-0 px-2.5 pt-2">
      <div className="px-1 text-[10px] font-semibold text-[#dce5e2]">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-label={label} className="h-8 min-w-0 border-0 bg-transparent px-1 text-[10px] text-[#f1f5f3] shadow-none focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-72 border-border bg-popover">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-xs">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function formatPeriod(period: DashboardFilters["periodo"]) {
  const format = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  return `${format(period.inicio)} – ${format(period.fim)}`;
}
