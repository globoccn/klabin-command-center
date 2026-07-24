import { reports } from "@/data/mockData";
import type { Report } from "@/types/dashboard";

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getReports(tipo?: Report["tipo"], period?: { inicio: string; fim: string }): Promise<Report[]> {
  await delay();
  let result = [...reports];
  if (tipo) result = result.filter((report) => report.tipo === tipo);
  if (period) {
    const start = new Date(`${period.inicio}T00:00:00`);
    const end = new Date(`${period.fim}T23:59:59`);
    result = result.filter((report) => {
      const generatedAt = new Date(report.geradoEm);
      return generatedAt >= start && generatedAt <= end;
    });
  }
  return result;
}

export async function getReport(id: string): Promise<Report | undefined> {
  await delay(180);
  return reports.find((report) => report.id === id);
}

export async function generateReport(tipo: Report["tipo"], period?: { inicio: string; fim: string }): Promise<Report> {
  await delay(950);
  const periodText = period ? `${formatDate(period.inicio)} – ${formatDate(period.fim)}` : new Date().toLocaleDateString("pt-BR");
  return {
    id: `r-${Date.now()}`,
    titulo: `Relatório ${tipo} — ${periodText}`,
    tipo,
    periodo: periodText,
    geradoEm: new Date().toISOString(),
    status: "Pronto",
    resumo: "Relatório gerado com os dados mockados atuais, pronto para conexão com o workflow n8n.",
    destaques: ["Indicadores consolidados", "Comparação com o período anterior disponível"],
    riscos: ["Validar datas de SLA antes da integração produtiva"],
    recomendacoes: ["Conectar o endpoint /api/reports/generate ao workflow de relatórios"],
    indicadores: [
      { label: "Tarefas criadas", value: "343", delta: "+8,2%", tone: "positive" },
      { label: "Concluídas", value: "326", delta: "+7,9%", tone: "positive" },
      { label: "Taxa de conclusão", value: "97,1%", delta: "+1,8 p.p.", tone: "positive" },
      { label: "Backlog", value: "111", delta: "-12,7%", tone: "positive" },
    ],
    tendencia: [
      { name: "P1", value: 72 },
      { name: "P2", value: 80 },
      { name: "P3", value: 91 },
      { name: "P4", value: 100 },
    ],
  };
}

export function downloadReport(report: Report) {
  const lines = [
    report.titulo,
    `Tipo: ${report.tipo}`,
    `Período: ${report.periodo}`,
    `Gerado em: ${new Date(report.geradoEm).toLocaleString("pt-BR")}`,
    "",
    "RESUMO EXECUTIVO",
    report.resumo,
    "",
    "DESTAQUES",
    ...report.destaques.map((item) => `- ${item}`),
    "",
    "RISCOS",
    ...(report.riscos.length ? report.riscos.map((item) => `- ${item}`) : ["- Nenhum risco registrado"]),
    "",
    "RECOMENDAÇÕES",
    ...report.recomendacoes.map((item) => `- ${item}`),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${slug(report.titulo)}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
