import { Clock, CheckCircle2 } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
  updatedAt?: string;
}

export function DashboardHeader({
  title = "Central Operacional Klabin",
  subtitle = "Inteligência em operações, manutenção e facility management",
  updatedAt = "24/07/2026 08:30",
}: Props) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start sm:items-center pb-6">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground truncate">{title}</h1>
        <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
          <span className="truncate">{subtitle}</span>
        </div>
      </div>
      <div className="shrink-0 rounded-xl border border-border bg-card/70 px-3 py-2 text-right">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Última atualização</span>
        </div>
        <div className="text-sm font-medium">{updatedAt}</div>
        <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-primary-glow">
          <CheckCircle2 className="h-3 w-3" />
          Dados atualizados
        </div>
      </div>
    </header>
  );
}
