import type { ReactNode } from "react";
import { Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  subtitle?: string;
  /** Mantido por compatibilidade com chamadas existentes. O card de status foi removido da UI. */
  updatedAt?: string;
  toolbar?: ReactNode;
  layout?: "command" | "page";
  /** Mantido por compatibilidade com chamadas existentes. O card de status foi removido da UI. */
  statusLabel?: string;
}

export function DashboardHeader({
  title = "Central Operacional Klabin",
  subtitle = "Inteligência em operações, manutenção e facility management",
  toolbar,
  layout = "page",
}: Props) {
  if (layout === "command") {
    return (
      <header className="dashboard-topbar dashboard-topbar-without-status">
        <HeaderIdentity title={title} subtitle={subtitle} command />
        {toolbar}
      </header>
    );
  }

  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center">
      <HeaderIdentity title={title} subtitle={subtitle} />
      {toolbar}
    </header>
  );
}

function HeaderIdentity({ title, subtitle, command = false }: { title: string; subtitle: string; command?: boolean }) {
  return (
    <div className="min-w-0">
      <h1
        className={cn(
          "font-bold tracking-[-0.038em] text-foreground",
          command ? "text-[clamp(25px,2vw,35px)] leading-[1.06] lg:whitespace-nowrap" : "text-2xl sm:text-[34px]",
        )}
      >
        {title}
      </h1>
      <div className={cn("flex min-w-0 items-center gap-2.5 text-muted-foreground", command ? "mt-2 text-[12px]" : "mt-2 text-sm")}> 
        <Square className="h-3 w-3 shrink-0 rounded-[3px] text-primary-glow" strokeWidth={2.3} />
        <span className="truncate">{subtitle}</span>
        <span className="hidden h-px w-5 shrink-0 bg-primary-glow lg:block" />
      </div>
    </div>
  );
}
