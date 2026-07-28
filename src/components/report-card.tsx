import { Download, Eye, FileText, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtDateTime } from "@/lib/format";
import type { Report } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { getReportDownloadUrl } from "@/services/reportService";

interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onDelete: (report: Report) => void;
  deleting?: boolean;
}

export function ReportCard({ report, onView, onDelete, deleting = false }: ReportCardProps) {
  const ready = report.status === "Pronto" && report.pdfDisponivel !== false;
  const canView = ready || report.status === "Falhou";
  const canDelete = report.status !== "Processando" && !deleting;
  const size = report.tamanhoBytes
    ? `${(report.tamanhoBytes / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB`
    : "PDF";

  return (
    <article className="command-card group relative flex min-h-[220px] flex-col p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/34">
      <div className="flex items-start justify-between gap-2">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/28 bg-primary/12 text-primary-glow">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span className="rounded-full border border-primary/22 bg-primary/8 px-2 py-0.5 text-[9px] font-medium text-primary-glow">{size}</span>
          <span className="rounded-full border border-border bg-background/30 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">{report.tipo}</span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:bg-destructive/12 hover:text-destructive"
            disabled={!canDelete}
            onClick={() => onDelete(report)}
            aria-label={`Excluir ${report.titulo}`}
            title={report.status === "Processando" ? "Aguarde a geração terminar para excluir" : "Excluir relatório"}
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-[#eef3f1]">{report.titulo}</h3>
      <div className="mt-1 text-[10px] text-muted-foreground">{report.periodo}</div>
      <div className="mt-2 text-[9px] text-muted-foreground">Gerado em {fmtDateTime(report.geradoEm)}</div>
      <div
        className={cn(
          "mt-2 inline-flex items-center gap-1 text-[10px] font-medium",
          report.status === "Pronto" ? "text-primary-glow" : report.status === "Processando" ? "text-warning" : "text-destructive",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {report.status}
      </div>
      {report.status === "Falhou" && report.erro && (
        <div className="mt-2 line-clamp-2 text-[9px] leading-relaxed text-[#ffb7b7]">{report.erro}</div>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        <Button
          size="sm"
          onClick={() => onView(report)}
          className="h-8 flex-1 bg-primary text-[10px] text-primary-foreground hover:bg-primary-glow"
          disabled={!canView || deleting}
        >
          <Eye className="mr-1 h-3.5 w-3.5" /> Visualizar
        </Button>
        {ready ? (
          <Button asChild size="sm" variant="outline" className="h-8 min-w-24 border-border px-2 text-[10px] hover:border-primary/35 hover:bg-primary/8">
            <a
              href={getReportDownloadUrl(report)}
              target="_blank"
              rel="noopener noreferrer"
              download={report.arquivoNome || undefined}
              aria-label="Baixar relatório PDF"
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              Baixar PDF
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="h-8 min-w-24 border-border px-2 text-[10px]" disabled aria-label="PDF indisponível">
            <Download className="mr-1 h-3.5 w-3.5" />
            Baixar PDF
          </Button>
        )}
      </div>
    </article>
  );
}
