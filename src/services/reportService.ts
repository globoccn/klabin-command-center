import { apiDownload, apiGet, apiPost } from "@/services/apiClient";
import type { Report } from "@/types/dashboard";

const typeCode: Record<Report["tipo"], "daily" | "weekly" | "monthly"> = { Diário: "daily", Semanal: "weekly", Mensal: "monthly" };

export async function getReports(tipo?: Report["tipo"], period?: { inicio: string; fim: string }): Promise<Report[]> {
  return apiGet<Report[]>("reports", { type: tipo ? typeCode[tipo] : undefined, inicio: period?.inicio, fim: period?.fim });
}

export async function getReport(id: string): Promise<Report> {
  return apiGet<Report>(`reports/${encodeURIComponent(id)}`);
}

export async function generateReport(tipo: Report["tipo"]): Promise<Report> {
  return apiPost<Report>("reports/generate", { type: typeCode[tipo], requestedBy: "frontend", force: false });
}

export async function downloadReport(report: Report) {
  const { blob, fileName } = await apiDownload(`reports/${encodeURIComponent(report.id)}/download`);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || report.arquivoNome || "relatorio-klabin.pdf";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
