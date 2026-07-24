import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  children,
  className,
  action = false,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: boolean;
}) {
  return (
    <section className={cn("command-card relative flex min-h-0 flex-col p-3.5", className)}>
      <div className="relative z-10 mb-2 flex min-h-[18px] items-center justify-between gap-2">
        <h2 className="truncate text-[12px] font-semibold tracking-[-0.01em] text-[#f2f5f4]">{title}</h2>
        {action && (
          <button
            type="button"
            aria-label={`Abrir detalhes de ${title}`}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-primary/10 hover:text-primary-glow"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="chart-card-content relative z-10 min-h-0 flex-1">{children}</div>
    </section>
  );
}
