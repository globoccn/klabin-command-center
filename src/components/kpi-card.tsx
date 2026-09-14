import type { CSSProperties } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Minus,
  Paperclip,
  PieChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Kpi } from "@/types/dashboard";
import { fmtDec, fmtInt } from "@/lib/format";

const icons: Record<string, LucideIcon> = {
  ClipboardList,
  CheckCircle2,
  Clock: Clock3,
  PieChart,
  Paperclip,
  Camera,
};

type Accent = "cyan" | "green" | "orange" | "blue" | "purple";

const accentById: Record<string, Accent> = {
  total: "cyan",
  concluidas: "green",
  abertas: "orange",
  taxa: "green",
  anexos: "blue",
};

const accentColor: Record<Accent, string> = {
  cyan: "var(--accent-cyan)",
  green: "var(--accent-green)",
  orange: "var(--accent-orange)",
  blue: "var(--accent-blue)",
  purple: "var(--accent-purple)",
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = icons[kpi.icon] ?? ClipboardList;
  const accent = accentById[kpi.id] ?? (kpi.tone === "warning" ? "orange" : "green");
  const color = accentColor[accent];
  const lowerBetter = kpi.id === "abertas";
  const good = kpi.delta === 0 || (lowerBetter ? kpi.delta < 0 : kpi.delta > 0);
  const formattedValue = typeof kpi.value === "number"
    ? kpi.suffix === "%"
      ? fmtDec(kpi.value)
      : fmtInt(kpi.value)
    : kpi.value;
  const DeltaIcon = kpi.delta === 0 ? Minus : kpi.delta > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <article
      className="kpi-card-reference panel-v5 group"
      style={{ "--card-accent": color } as CSSProperties}
    >
      <div className="kpi-card-v5-glow" aria-hidden="true" />
      <div className="kpi-card-main-v5">
        <div className="kpi-card-icon-v5">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="kpi-card-label-v5">{kpi.label}</div>
          <div className="kpi-card-value-v5">{formattedValue}{kpi.suffix}</div>
          <div className="kpi-card-comparison-v5">
            <span className={good ? "is-good" : "is-bad"}>
              <DeltaIcon className="h-3 w-3" />
              {kpi.delta > 0 ? "+" : ""}{fmtDec(kpi.delta)}{kpi.deltaUnit === "p.p." ? " p.p." : kpi.deltaUnit ?? "%"}
            </span>
            <small>{kpi.comparison}</small>
          </div>
        </div>
      </div>
    </article>
  );
}
