import { Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDateTime } from "@/lib/format";
import type { Report } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function ReportCard({ report, onView, onDownload, downloading = false }: { report: Report; onView: (report: Report) => void; onDownload: (report: Report) => void | Promise<void>; downloading?: boolean }) {
  const ready = report.status === "Pronto" && report.pdfDisponivel !== false;
  const canView = ready || report.status === "Falhou";
  const size = report.tamanhoBytes ? `${(report.tamanhoBytes / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB` : "PDF";
  return (
    <article className="command-card group relative flex min-h-[220px] flex-col p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/34">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/28 bg-primary/12 text-primary-glow"><FileText className="h-5 w-5" /></div>
        <div className="flex gap-1.5"><span className="rounded-full border border-primary/22 bg-primary/8 px-2 py-0.5 text-[9px] font-medium text-primary-glow">{size}</span><span className="rounded-full border border-border bg-background/30 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">{report.tipo}</span></div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-[#eef3f1]">{report.titulo}</h3>
      <div className="mt-1 text-[10px] text-muted-foreground">{report.periodo}</div>
      <div className="mt-2 text-[9px] text-muted-foreground">Gerado em {fmtDateTime(report.geradoEm)}</div>
      <div className={cn("mt-2 inline-flex items-center gap-1 text-[10px] font-medium", report.status === "Pronto" ? "text-primary-glow" : report.status === "Processando" ? "text-warning" : "text-destructive")}><span className="h-1.5 w-1.5 rounded-full bg-current" /> {report.status}</div>
      {report.status === "Falhou" && report.erro && <div className="mt-2 line-clamp-2 text-[9px] leading-relaxed text-[#ffb7b7]">{report.erro}</div>}
      <div className="mt-auto flex gap-2 pt-4">
        <Button size="sm" onClick={() => onView(report)} className="h-8 flex-1 bg-primary text-[10px] text-primary-foreground hover:bg-primary-glow" disabled={!canView}><Eye className="mr-1 h-3.5 w-3.5" /> Visualizar</Button>
        <Button size="sm" variant="outline" className="h-8 min-w-24 border-border px-2 text-[10px] hover:border-primary/35 hover:bg-primary/8" onClick={() => onDownload(report)} disabled={!ready || downloading} aria-label="Baixar relatório PDF"><Download className="mr-1 h-3.5 w-3.5" />{downloading ? "Baixando…" : "Baixar PDF"}</Button>
      </div>
    </article>
  );
}
