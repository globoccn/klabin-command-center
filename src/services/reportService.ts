import { apiGet, apiPost, getApiBaseUrl } from "@/services/apiClient";
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


export interface DeleteReportResult {
  ok: boolean;
  deleted: boolean;
  reportId: string;
  title?: string;
  freedBytes?: number;
  message: string;
}

export async function deleteReport(id: string, deleteCode: string): Promise<DeleteReportResult> {
  const result = await apiPost<DeleteReportResult>("reports/delete", {
    reportId: id,
    deleteCode,
    requestedBy: "frontend",
  });

  if (!result.ok || !result.deleted) {
    throw new Error(result.message || "Não foi possível excluir o relatório.");
  }

  return result;
}

export function getReportDownloadUrl(report: Pick<Report, "id">): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("VITE_KLABIN_API_BASE_URL não está configurada.");

  const url = new URL(`${baseUrl}/reports/download`);
  url.searchParams.set("reportId", report.id);
  return url.toString();
}
