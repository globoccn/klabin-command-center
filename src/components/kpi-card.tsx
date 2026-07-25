import {
  ArrowDown,
  ArrowUp,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Paperclip,
  PieChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Kpi } from "@/types/dashboard";
import { fmtDec, fmtInt } from "@/lib/format";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  ClipboardList,
  CheckCircle2,
  Clock: Clock3,
  PieChart,
  Paperclip,
  Camera,
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = icons[kpi.icon] ?? ClipboardList;
  const warning = kpi.tone === "warning";
  const positiveTrend = kpi.delta >= 0;
  const formattedValue = typeof kpi.value === "number"
    ? kpi.suffix === "%"
      ? fmtDec(kpi.value)
      : fmtInt(kpi.value)
    : kpi.value;

  return (
    <article
      className={cn(
        "kpi-card-reference group relative h-[clamp(116px,11vh,132px)] overflow-hidden rounded-[13px] border p-3.5 shadow-[0_10px_28px_rgba(0,0,0,.22)] transition duration-200 hover:-translate-y-0.5",
        warning
          ? "border-warning/32 bg-[linear-gradient(145deg,rgba(62,42,12,.34),rgba(9,27,24,.98))] hover:shadow-[0_12px_30px_rgba(249,115,22,.12)]"
          : "border-border bg-[linear-gradient(145deg,rgba(9,42,34,.96),rgba(5,25,24,.98))] hover:border-primary/34 hover:shadow-[0_12px_30px_rgba(18,183,106,.12)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.022),transparent_38%)]" />
      <div className="relative flex h-full flex-col">
        <div className="flex min-h-0 flex-1 items-start gap-3">
          <div
            className={cn(
              "grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[12px] border shadow-[inset_0_1px_0_rgba(255,255,255,.04)]",
              warning
                ? "border-warning/22 bg-warning/12 text-[#ffad4c] shadow-[0_0_22px_rgba(249,115,22,.12)]"
                : "border-primary/24 bg-[linear-gradient(145deg,rgba(16,184,102,.22),rgba(9,77,50,.28))] text-[#85f495] shadow-[0_0_22px_rgba(18,183,106,.12)]",
            )}
          >
            <Icon className="h-[25px] w-[25px]" strokeWidth={1.7} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-medium text-[#dce5e2]">{kpi.label}</div>
            <div
              className={cn(
                "mt-1 flex min-h-[44px] gap-1.5",
                kpi.id === "taxa" ? "items-center justify-between" : "items-end",
              )}
            >
              <strong
                className={cn(
                  "font-bold leading-none tracking-[-0.035em] text-white",
                  kpi.id === "taxa" ? "text-[23px]" : "text-[26px]",
                )}
              >
                {formattedValue}{kpi.suffix}
              </strong>
              {kpi.id === "taxa" && <ProgressRing value={Number(kpi.value)} />}
            </div>
          </div>
        </div>

        <div className="relative mt-2 flex items-center gap-2 border-t border-primary/16 pt-2">
          <span
            className={cn(
              "inline-flex h-[22px] items-center gap-1 rounded-[7px] border px-2 text-[10px] font-semibold",
              warning
                ? "border-warning/20 bg-warning/10 text-warning"
                : "border-primary/20 bg-primary/10 text-primary-glow",
            )}
          >
            {positiveTrend ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {kpi.delta > 0 ? "+" : ""}{fmtDec(kpi.delta)} {kpi.deltaUnit ?? "%"}
          </span>
          <span className="min-w-0 truncate text-[9px] text-muted-foreground">{kpi.comparison}</span>
        </div>
      </div>
    </article>
  );
}

function ProgressRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 15.5;
  const progress = Math.max(0, Math.min(100, value));

  return (
    <svg viewBox="0 0 36 36" className="h-10 w-10 shrink-0 -rotate-90" aria-label={`${value}% concluído`}>
      <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(89,209,137,.14)" strokeWidth="3.4" />
      <circle
        cx="18"
        cy="18"
        r="15.5"
        fill="none"
        stroke="#39E75F"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress / 100)}
      />
    </svg>
  );
}
