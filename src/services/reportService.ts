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

  if (blob.size < 1024) {
    throw new Error(`O PDF retornado possui apenas ${blob.size} bytes.`);
  }

  const header = new Uint8Array(await blob.slice(0, 5).arrayBuffer());
  const signature = String.fromCharCode(...header);
  if (signature !== "%PDF-") {
    throw new Error(`O endpoint de download não retornou um PDF válido. Assinatura recebida: ${signature || "vazia"}.`);
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName || report.arquivoNome || "relatorio-klabin.pdf";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();

  // Alguns navegadores ainda estão iniciando o download quando o click retorna.
  // Revogar a URL imediatamente pode cancelar silenciosamente o arquivo.
  window.setTimeout(() => {
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }, 5000);
}
