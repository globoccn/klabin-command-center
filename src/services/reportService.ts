import { reports } from "@/data/mockData";
import type { Report } from "@/types/dashboard";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getReports(tipo?: Report["tipo"]): Promise<Report[]> {
  await delay();
  return tipo ? reports.filter((r) => r.tipo === tipo) : reports;
}

export async function getReport(id: string): Promise<Report | undefined> {
  await delay(200);
  return reports.find((r) => r.id === id);
}

export async function generateReport(tipo: Report["tipo"]): Promise<Report> {
  await delay(1200);
  return {
    id: `r-${Date.now()}`,
    titulo: `Novo Relatório ${tipo}`,
    tipo,
    periodo: new Date().toLocaleDateString("pt-BR"),
    geradoEm: new Date().toISOString(),
    status: "Pronto",
    resumo: "Relatório gerado com sucesso a partir dos dados atuais.",
    destaques: ["Indicadores dentro do esperado"],
    riscos: [],
    recomendacoes: ["Continuar acompanhamento"],
  };
}
