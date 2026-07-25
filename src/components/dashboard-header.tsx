import type { ReactNode } from "react";
import { CheckCircle2, RefreshCw, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  subtitle?: string;
  updatedAt?: string;
  toolbar?: ReactNode;
  layout?: "command" | "page";
}

export function DashboardHeader({
  title = "Central Operacional Klabin",
  subtitle = "Inteligência em operações, manutenção e facility management",
  updatedAt = "24/07/2026 08:30",
  toolbar,
  layout = "page",
}: Props) {
  if (layout === "command") {
    return (
      <header className="dashboard-topbar">
        <HeaderIdentity title={title} subtitle={subtitle} command />
        {toolbar}
        <UpdateStatus updatedAt={updatedAt} />
      </header>
    );
  }

  return (
    <header className="mb-5 flex flex-col justify-between gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center">
      <HeaderIdentity title={title} subtitle={subtitle} />
      <UpdateStatus updatedAt={updatedAt} />
    </header>
  );
}

function HeaderIdentity({ title, subtitle, command = false }: { title: string; subtitle: string; command?: boolean }) {
  return (
    <div className="min-w-0">
      <h1
        className={cn(
          "font-bold tracking-[-0.038em] text-foreground",
          command ? "whitespace-nowrap text-[clamp(27px,2vw,35px)] leading-[1.06]" : "text-2xl sm:text-[34px]",
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

function UpdateStatus({ updatedAt }: { updatedAt: string }) {
  return (
    <div className="h-[clamp(76px,7.3vh,88px)] min-w-[142px] rounded-[13px] border border-border bg-[linear-gradient(150deg,rgba(8,31,29,.92),rgba(3,20,20,.96))] px-3 py-2.5 shadow-[0_9px_24px_rgba(0,0,0,.2)]">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/8">
          <RefreshCw className="h-3.5 w-3.5 text-primary-glow" />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-muted-foreground">Última atualização</div>
          <div className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-[#e5ece9]">{updatedAt}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 border-t border-primary/10 pt-1.5 text-[10px] font-medium text-primary-glow">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Dados atualizados
      </div>
    </div>
  );
}
