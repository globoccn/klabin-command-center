import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/dashboard";

const statusStyles: Record<string, string> = {
  "Concluída": "border-primary/28 bg-primary/12 text-primary-glow",
  "A Fazer": "border-info/28 bg-info/12 text-[color:var(--info)]",
  "Fazendo": "border-[#ebd315]/28 bg-[#ebd315]/10 text-[#ebd315]",
  "Atividades em Espera": "border-warning/28 bg-warning/12 text-warning",
  "Em Espera": "border-warning/28 bg-warning/12 text-warning",
  "Acompanhamento": "border-chart-5/28 bg-chart-5/12 text-[color:var(--chart-5)]",
  "Plantão Misael": "border-[#4265dc]/28 bg-[#4265dc]/12 text-[#7190ff]",
  "Plantão de Sábado": "border-[#53b936]/28 bg-[#53b936]/12 text-[#75d65b]",
};

export function StatusBadge({ status }: { status: TaskStatus | string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium", statusStyles[status] ?? "border-border bg-muted text-muted-foreground")}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
