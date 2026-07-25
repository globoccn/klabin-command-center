import { ArrowDown, ArrowRight, ArrowUp, Camera, ClipboardList, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function InsightBanner() {
  return (
    <section className="insight-banner-reference mt-3 min-h-[clamp(64px,6.5vh,78px)] overflow-hidden rounded-[13px] border border-primary/38 bg-[linear-gradient(100deg,rgba(5,57,38,.72),rgba(4,28,25,.9)_48%,rgba(4,42,31,.76))] px-4 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,.2),inset_0_1px_0_rgba(255,255,255,.025)]">
      <div className="grid min-h-[clamp(42px,4.6vh,56px)] grid-cols-[minmax(300px,1.65fr)_repeat(3,minmax(110px,.55fr))_190px] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3 border-r border-primary/22 pr-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-primary/25 bg-primary/10 text-primary-glow shadow-[0_0_18px_rgba(55,237,99,.1)]">
            <Trophy className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-primary-glow">Insight do período</div>
            <p className="mt-0.5 truncate text-[10px] text-[#d2ddda]">
              Excelente desempenho operacional! A taxa de conclusão está 1,8 p.p. acima do período anterior.
            </p>
          </div>
        </div>

        <InsightMetric icon={<ArrowDown className="h-3 w-3" />} value="-12,7%" label="Redução de abertos" />
        <InsightMetric icon={<Camera className="h-3 w-3" />} value="+11,2%" label="Mais fotos capturadas" />
        <InsightMetric icon={<ClipboardList className="h-3 w-3" />} value="+8,2%" label="Mais tarefas criadas" />

        <Link
          to="/relatorios"
          className="inline-flex h-9 items-center justify-center gap-4 rounded-[9px] border border-primary/48 bg-primary/8 px-4 text-[11px] font-medium text-[#dff7e5] transition hover:bg-primary/16 hover:text-white"
        >
          Ver relatório completo
          <ArrowRight className="h-4 w-4 text-primary-glow" />
        </Link>
      </div>
    </section>
  );
}

function InsightMetric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-2 border-r border-primary/18 px-2">
      <div className="text-primary-glow">{icon}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-primary-glow">
          <ArrowUp className="h-3 w-3" />{value}
        </div>
        <div className="truncate text-[9px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
