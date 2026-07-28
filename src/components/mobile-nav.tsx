import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Headphones, Snowflake, ClipboardCheck, ShieldCheck, Database, FileBarChart2, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Visão Geral", url: "/", icon: Home },
  { title: "Chamados", url: "/chamados", icon: Headphones },
  { title: "Climatização", url: "/climatizacao", icon: Snowflake },
  { title: "Rondas e Preventivas", url: "/rondas", icon: ClipboardCheck },
  { title: "Evidências", url: "/evidencias", icon: ShieldCheck },
  { title: "Qualidade dos Dados", url: "/qualidade", icon: Database },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart2 },
  { title: "Assistente Operacional", url: "/assistente", icon: BrainCircuit },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold">Klabin</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
        </div>
        <button onClick={() => setOpen((o) => !o)} className="h-9 w-9 rounded-lg grid place-items-center bg-card border border-border">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <nav className="px-3 pb-3 space-y-1">
          {items.map((it) => {
            const active = currentPath === it.url;
            const Icon = it.icon;
            return (
              <Link key={it.url} to={it.url} onClick={() => setOpen(false)}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                  active ? "bg-sidebar-accent text-accent-foreground border border-primary/30" : "text-muted-foreground border border-transparent")}>
                <Icon className={cn("h-4 w-4", active && "text-primary-glow")} />
                {it.title}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
