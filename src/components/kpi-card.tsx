import { ArrowDown, ArrowUp, ClipboardList, CheckCircle2, Clock, PieChart, Paperclip, Camera } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Kpi } from "@/types/dashboard";
import { fmtInt, fmtDec } from "@/lib/format";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = { ClipboardList, CheckCircle2, Clock, PieChart, Paperclip, Camera };

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = icons[kpi.icon] ?? ClipboardList;
  const positive = kpi.delta >= 0;
  const highlight = kpi.tone === "warning";

  const toneRing = highlight
    ? "border-warning/40 bg-[linear-gradient(160deg,rgba(249,115,22,0.08),rgba(11,33,28,0.9))]"
    : "border-border card-premium";

  const deltaColor = kpi.tone === "warning" ? "text-warning" : positive ? "text-primary-glow" : "text-destructive";
  const value = typeof kpi.value === "number"
    ? (kpi.suffix === "%" ? fmtDec(kpi.value) : fmtInt(kpi.value))
    : kpi.value;

  return (
    <div className={cn("relative rounded-2xl p-4 transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(18,183,106,0.35)]", toneRing)}>
      <div className="flex items-start justify-between">
        <div className={cn("h-9 w-9 rounded-xl grid place-items-center border",
          highlight ? "border-warning/30 bg-warning/10 text-warning" : "border-primary/25 bg-primary/10 text-primary-glow"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        {kpi.id === "taxa" && (
          <div className="relative h-10 w-10">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(89,209,137,0.15)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#39E75F" strokeWidth="3"
                strokeDasharray={`${(Number(kpi.value) / 100) * 97.4} 97.4`} strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{kpi.label}</div>
      <div className="mt-1 text-3xl font-bold tracking-tight">
        {value}{kpi.suffix ?? ""}
      </div>
      <div className={cn("mt-2 flex items-center gap-1 text-xs", deltaColor)}>
        {positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        <span className="font-medium">{fmtDec(Math.abs(kpi.delta))}%</span>
        <span className="text-muted-foreground">{kpi.comparison}</span>
      </div>
    </div>
  );
}
