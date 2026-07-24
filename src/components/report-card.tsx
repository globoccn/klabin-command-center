import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDateTime } from "@/lib/format";
import type { Report } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function ReportCard({ report, onView }: { report: Report; onView: (r: Report) => void }) {
  return (
    <div className="card-premium rounded-2xl p-4 flex flex-col animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl grid place-items-center bg-primary/15 border border-primary/30 text-primary-glow">
          <FileText className="h-5 w-5" />
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{report.tipo}</span>
      </div>
      <h3 className="mt-3 font-semibold text-sm">{report.titulo}</h3>
      <div className="text-xs text-muted-foreground mt-1">{report.periodo}</div>
      <div className="text-[11px] text-muted-foreground mt-2">Gerado em {fmtDateTime(report.geradoEm)}</div>
      <div className={cn("mt-2 text-[11px] font-medium inline-flex items-center gap-1",
        report.status === "Pronto" ? "text-primary-glow" : report.status === "Processando" ? "text-warning" : "text-destructive"
      )}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {report.status}
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={() => onView(report)} className="bg-primary text-primary-foreground hover:bg-primary-glow flex-1" disabled={report.status !== "Pronto"}>
          <Eye className="h-3.5 w-3.5 mr-1" /> Visualizar
        </Button>
        <Button size="sm" variant="outline" className="border-border">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
