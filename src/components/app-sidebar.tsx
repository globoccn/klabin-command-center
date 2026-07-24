import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Headphones, Snowflake, ClipboardCheck, ShieldCheck, Database, FileBarChart2, Leaf, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Visão Geral", url: "/", icon: Home },
  { title: "Chamados e Atendimento", url: "/chamados", icon: Headphones },
  { title: "Climatização", url: "/climatizacao", icon: Snowflake },
  { title: "Rondas e Preventivas", url: "/rondas", icon: ClipboardCheck },
  { title: "Evidências e Auditoria", url: "/evidencias", icon: ShieldCheck },
  { title: "Qualidade dos Dados", url: "/qualidade", icon: Database },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart2 },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-[250px] shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-white">Klabin</span>
          <span className="h-2 w-2 rounded-full bg-primary-glow glow-primary" />
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Operações
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {items.map((it) => {
          const active = currentPath === it.url;
          const Icon = it.icon;
          return (
            <Link
              key={it.url}
              to={it.url}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-sidebar-accent border border-primary/40 text-accent-foreground shadow-[inset_0_0_0_1px_rgba(57,231,95,0.08)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 border border-transparent"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary-glow" : "text-muted-foreground group-hover:text-primary")} />
              <span className="truncate">{it.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="relative px-4 pt-8 pb-4 mt-4 space-y-3">
        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none opacity-70"
          style={{
            background:
              "radial-gradient(60% 100% at 20% 100%, rgba(18,183,106,0.25), transparent 70%), radial-gradient(60% 100% at 80% 100%, rgba(57,231,95,0.15), transparent 70%)",
          }}
        />
        <svg viewBox="0 0 200 60" className="w-full h-14 opacity-60 relative">
          <path d="M0 60 L20 30 L28 45 L40 20 L52 45 L64 25 L76 45 L92 15 L108 45 L120 28 L134 45 L148 22 L162 45 L176 30 L200 60 Z" fill="url(#grad)" />
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#12B76A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#061310" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="relative rounded-xl border border-primary/20 bg-card/70 px-3 py-2.5 flex items-start gap-2">
          <Leaf className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight text-muted-foreground">Sustentabilidade que nos move hoje e sempre.</p>
        </div>
        <div className="relative rounded-xl border border-primary/20 bg-card/70 px-3 py-2.5 flex items-start gap-2">
          <Building2 className="h-4 w-4 text-primary-glow shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight text-muted-foreground">Facility Management com excelência.</p>
        </div>
      </div>
    </aside>
  );
}
