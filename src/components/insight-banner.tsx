import { Trophy, TrendingDown, Camera, ClipboardList, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InsightBanner() {
  return (
    <div className="mt-6 rounded-2xl border border-primary/25 p-4 sm:p-5"
      style={{ background: "linear-gradient(90deg, rgba(18,183,106,0.10), rgba(11,33,28,0.4) 40%, rgba(11,33,28,0.7))" }}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4 items-center">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl grid place-items-center bg-primary/15 border border-primary/30 shrink-0">
            <Trophy className="h-5 w-5 text-primary-glow" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-primary-glow">Insight do período</div>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Excelente desempenho operacional! A taxa de conclusão está 1,8 p.p. acima do período anterior.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center text-xs">
          <Indicator icon={<TrendingDown className="h-3 w-3" />} label="Redução de abertos" value="-12,7%" tone="warning" arrow="down" />
          <Indicator icon={<Camera className="h-3 w-3" />} label="Mais fotos capturadas" value="+11,2%" tone="primary" arrow="up" />
          <Indicator icon={<ClipboardList className="h-3 w-3" />} label="Mais tarefas criadas" value="+8,2%" tone="primary" arrow="up" />
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-glow shrink-0">
          Ver relatório completo <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function Indicator({ icon, label, value, tone, arrow }: { icon: React.ReactNode; label: string; value: string; tone: "primary" | "warning"; arrow: "up" | "down" }) {
  const color = tone === "warning" ? "text-warning" : "text-primary-glow";
  return (
    <div className="flex items-center gap-2">
      <div className={`h-7 w-7 rounded-lg grid place-items-center border ${tone === "warning" ? "border-warning/30 bg-warning/10 text-warning" : "border-primary/30 bg-primary/10 text-primary-glow"}`}>{icon}</div>
      <div>
        <div className={`text-sm font-semibold flex items-center gap-1 ${color}`}>
          {arrow === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {value}
        </div>
        <div className="text-[10px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
