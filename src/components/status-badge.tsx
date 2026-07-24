import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/dashboard";

const map: Record<string, string> = {
  "Concluída": "bg-primary/15 text-primary-glow border-primary/30",
  "A Fazer": "bg-info/15 text-[color:var(--info)] border-info/30",
  "Fazendo": "bg-destructive/15 text-destructive border-destructive/30",
  "Em Espera": "bg-warning/15 text-warning border-warning/30",
  "Acompanhamento": "bg-chart-5/15 text-[color:var(--chart-5)] border-chart-5/30",
};

export function StatusBadge({ status }: { status: TaskStatus | string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium", map[status] ?? "bg-muted text-muted-foreground border-border")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
