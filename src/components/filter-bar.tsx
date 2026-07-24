import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const opts = {
  projeto: ["Todos", "Chamados", "Klabin Sede SP"],
  subprojeto: ["Todos", "Facility", "Manutenção"],
  andar: ["Todos", "1º andar", "5º andar", "10º andar", "15º andar"],
  status: ["Todos", "Concluída", "A Fazer", "Fazendo", "Em Espera", "Acompanhamento"],
  responsavel: ["Todos", "Carlos Silva", "Maria Souza", "João Pereira", "Ana Lima", "Ricardo Alves", "Misael Costa"],
};

export interface FilterState {
  periodo: string;
  projeto: string;
  subprojeto: string;
  andar: string;
  status: string;
  responsavel: string;
}

const initial: FilterState = {
  periodo: "04/11/2025 – 23/07/2026",
  projeto: "Todos",
  subprojeto: "Todos",
  andar: "Todos",
  status: "Todos",
  responsavel: "Todos",
};

export function FilterBar({ onChange }: { onChange?: (f: FilterState) => void }) {
  const [state, setState] = useState<FilterState>(initial);
  const upd = (k: keyof FilterState, v: string) => {
    const next = { ...state, [k]: v };
    setState(next);
    onChange?.(next);
  };
  const clear = () => { setState(initial); onChange?.(initial); };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pb-6">
      <div className="rounded-xl border border-border bg-card px-3 py-2 col-span-2 sm:col-span-1">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Período</div>
        <div className="text-xs mt-0.5 truncate">{state.periodo}</div>
      </div>
      {(["projeto", "subprojeto", "andar", "status", "responsavel"] as const).map((k) => (
        <div key={k} className="rounded-xl border border-border bg-card px-2 py-1">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground px-1 pt-1 capitalize">{k}</div>
          <Select value={state[k]} onValueChange={(v) => upd(k, v)}>
            <SelectTrigger className="h-7 border-0 bg-transparent px-1 text-xs focus:ring-0 shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {opts[k].map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={clear} className="col-span-2 sm:col-span-1 lg:col-span-6 justify-self-end text-xs text-muted-foreground hover:text-primary-glow">
        <X className="h-3 w-3 mr-1" /> Limpar filtros
      </Button>
    </div>
  );
}
