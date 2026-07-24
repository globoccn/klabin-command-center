import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Headphones,
  Snowflake,
  ClipboardCheck,
  ShieldCheck,
  Database,
  FileBarChart2,
  Leaf,
  Building2,
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
    <aside className="relative hidden md:flex sticky top-0 h-screen w-[188px] shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar">
      <div className="relative z-10 px-7 pt-6 pb-4">
        <div className="flex items-end gap-1.5">
          <span className="text-[29px] font-extrabold tracking-[-0.05em] text-white">Klabin</span>
          <span className="mb-1.5 h-1.5 w-1.5 rounded-full bg-primary-glow shadow-[0_0_14px_rgba(55,237,99,.7)]" />
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-[11px] font-medium text-primary-glow/90">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow shadow-[0_0_10px_rgba(55,237,99,.55)]" />
          <span>Operações</span>
          <span className="h-px flex-1 bg-gradient-to-r from-primary/45 to-transparent" />
        </div>
      </div>

      <nav className="relative z-10 flex-1 space-y-2 px-3 pt-2 overflow-y-auto">
        {items.map((item) => {
          const active = currentPath === item.url;
          const Icon = item.icon;

          return (
            <Link
              key={item.url}
              to={item.url}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex min-h-[54px] items-center gap-3 overflow-hidden rounded-[14px] border px-3.5 py-2 text-[12px] font-medium leading-[1.25] transition-all duration-200",
                active
                  ? "border-primary/35 bg-[linear-gradient(90deg,rgba(9,69,47,.94),rgba(5,45,35,.8))] text-white shadow-[0_0_22px_rgba(18,183,106,.14),inset_0_1px_0_rgba(255,255,255,.03)]"
                  : "border-transparent text-[#d1d9d6] hover:border-primary/15 hover:bg-sidebar-accent/45 hover:text-white",
              )}
            >
              {active && (
                <span className="absolute inset-y-2 left-0 w-[2px] rounded-r-full bg-primary-glow shadow-[0_0_12px_rgba(55,237,99,.9)]" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  active ? "text-primary-glow drop-shadow-[0_0_7px_rgba(55,237,99,.5)]" : "text-[#d7dfdc] group-hover:text-primary-glow",
                )}
                strokeWidth={1.9}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="forest-silhouette" aria-hidden="true" />

      <div className="relative z-10 space-y-2.5 px-3 pb-4 pt-5">
        <SidebarNote icon={Leaf} text="Sustentabilidade que nos move hoje e sempre." />
        <SidebarNote icon={Building2} text="Facility Management escrito com excelência." />
      </div>
    </aside>
  );
}

function SidebarNote({ icon: Icon, text }: { icon: typeof Leaf; text: string }) {
  return (
    <div className="rounded-[12px] border border-primary/24 bg-[linear-gradient(140deg,rgba(5,46,35,.86),rgba(3,25,23,.92))] px-3 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,.22)] backdrop-blur-sm">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" strokeWidth={1.8} />
        <p className="text-[10px] leading-[1.35] text-[#d5dfdc]">{text}</p>
      </div>
    </div>
  );
}
