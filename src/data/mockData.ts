import type {
  DashboardOverview,
  Task,
  Report,
  ChartSeries,
  MonthlyEvolutionPoint,
} from "@/types/dashboard";

export const overview: DashboardOverview = {
  kpis: [
    { id: "total", label: "Total de Tarefas", value: 3783, delta: 8.2, comparison: "vs. período anterior", tone: "positive", icon: "ClipboardList" },
    { id: "concluidas", label: "Concluídas", value: 3672, delta: 7.9, comparison: "vs. período anterior", tone: "positive", icon: "CheckCircle2" },
    { id: "abertas", label: "Em Aberto", value: 111, delta: -12.7, comparison: "vs. período anterior", tone: "warning", icon: "Clock" },
    { id: "taxa", label: "Taxa de Conclusão", value: 97.1, delta: 1.8, comparison: "vs. período anterior", tone: "positive", icon: "PieChart", suffix: "%" },
    { id: "anexos", label: "Tarefas com Anexos", value: 944, delta: 6.3, comparison: "vs. período anterior", tone: "positive", icon: "Paperclip" },
    { id: "fotos", label: "Fotos", value: 5358, delta: 11.2, comparison: "vs. período anterior", tone: "positive", icon: "Camera" },
  ],
  tarefasPorProjeto: [
    { name: "Chamados", value: 2161, color: "#12B76A" },
    { name: "Klabin Sede SP", value: 1622, color: "#39E75F" },
  ],
  evolucaoMensal: [
    { month: "Nov/25", concluidas: 380, emAberto: 40, total: 420 },
    { month: "Dez/25", concluidas: 420, emAberto: 35, total: 455 },
    { month: "Jan/26", concluidas: 510, emAberto: 45, total: 555 },
    { month: "Fev/26", concluidas: 470, emAberto: 30, total: 500 },
    { month: "Mar/26", concluidas: 620, emAberto: 55, total: 675 },
    { month: "Abr/26", concluidas: 680, emAberto: 42, total: 722 },
    { month: "Mai/26", concluidas: 560, emAberto: 38, total: 598 },
    { month: "Jun/26", concluidas: 640, emAberto: 50, total: 690 },
    { month: "Jul/26", concluidas: 592, emAberto: 48, total: 640 },
  ] as MonthlyEvolutionPoint[],
  statusAbertos: [
    { name: "A Fazer", value: 56, color: "#2E90FA" },
    { name: "Atividades em Espera", value: 32, color: "#F97316" },
    { name: "Acompanhamento", value: 10, color: "#A78BFA" },
    { name: "Plantão Misael", value: 9, color: "#12B76A" },
    { name: "Plantão de Sábado", value: 2, color: "#39E75F" },
    { name: "Fazendo", value: 2, color: "#F04438" },
  ],
  climatizacaoTipo: [
    { name: "Ambiente Frio", value: 1195, color: "#2E90FA" },
    { name: "Ambiente Quente", value: 729, color: "#F97316" },
    { name: "Outros", value: 21, color: "#AAB8B2" },
  ],
  topSetoresClimatizacao: [
    { name: "15.09", value: 181 },
    { name: "15.04", value: 106 },
    { name: "12.08", value: 86 },
    { name: "14.20", value: 67 },
    { name: "14.26", value: 66 },
  ],
  climatizacaoHorario: [
    { name: "10h", value: 321 },
    { name: "9h", value: 271 },
    { name: "14h", value: 228 },
    { name: "8h", value: 218 },
    { name: "13h", value: 180 },
  ],
  climatizacaoDiaSemana: [
    { name: "Seg", value: 509 },
    { name: "Qua", value: 431 },
    { name: "Ter", value: 356 },
    { name: "Qui", value: 355 },
    { name: "Sex", value: 294 },
  ],
  atividadesRonda: [
    { name: "Ar-condicionado dos CPDs", value: 282 },
    { name: "Ronda hidráulica", value: 194 },
    { name: "TVs dos andares", value: 123 },
    { name: "EcoQuest", value: 110 },
    { name: "Iluminação", value: 90 },
  ],
  qualidadeDados: {
    semVencimento: 321,
    coberturaSetor: 67.6,
    fechamentoAnterior: 490,
    camposDuplicados: 793,
  },
  evidencias: {
    percentualComEvidencia: 25,
    totalFotos: 5358,
    tarefasComFotos: 944,
  },
  backlogPorIdade: [
    { name: "Até 7 dias", value: 29 },
    { name: "8 a 30 dias", value: 33 },
    { name: "31 a 90 dias", value: 30 },
    { name: "91 a 180 dias", value: 12 },
    { name: "Mais de 180 dias", value: 7 },
  ] as ChartSeries[],
  idadeMediana: 17.3,
};

const setores = ["15.09", "15.04", "12.08", "14.20", "14.26", "10.02", "11.05", "13.07"];
const projetos = ["Chamados", "Klabin Sede SP"];
const servicos = ["Climatização", "Elétrica", "Hidráulica", "Iluminação", "TI", "Ronda"];
const responsaveis = ["Carlos Silva", "Maria Souza", "João Pereira", "Ana Lima", "Ricardo Alves", "Misael Costa"];
const statusList: Task["status"][] = ["Concluída", "A Fazer", "Fazendo", "Em Espera", "Acompanhamento"];

export const tasks: Task[] = Array.from({ length: 48 }).map((_, i) => {
  const status = statusList[i % statusList.length];
  const criado = new Date(2026, 6, (i % 28) + 1, 8 + (i % 10));
  const fechado = status === "Concluída" ? new Date(criado.getTime() + (i % 48 + 2) * 3600 * 1000) : undefined;
  return {
    id: `KL-${1000 + i}`,
    titulo: `${servicos[i % servicos.length]} — Setor ${setores[i % setores.length]}`,
    projeto: projetos[i % projetos.length],
    subprojeto: i % 2 === 0 ? "Facility" : "Manutenção",
    setor: setores[i % setores.length],
    andar: `${(i % 15) + 1}º andar`,
    servico: servicos[i % servicos.length],
    responsavel: responsaveis[i % responsaveis.length],
    status,
    criadoEm: criado.toISOString(),
    fechadoEm: fechado?.toISOString(),
    tempoResolucaoHoras: fechado ? Math.round((fechado.getTime() - criado.getTime()) / 3600000) : undefined,
    anexos: i % 3 === 0
      ? [{ id: `a${i}`, url: "", type: "foto", label: "Antes" }, { id: `a${i}b`, url: "", type: "foto", label: "Depois" }]
      : [],
  };
});

export const reports: Report[] = [
  {
    id: "r1", titulo: "Relatório Operacional Julho/2026", tipo: "Mensal",
    periodo: "01/07/2026 – 23/07/2026",
    geradoEm: "2026-07-24T08:30:00Z", status: "Pronto",
    resumo: "Excelente desempenho operacional. Taxa de conclusão 1,8 p.p. acima do período anterior, com redução expressiva do backlog em aberto.",
    destaques: ["Redução de 12,7% em tarefas em aberto", "5.358 fotos capturadas (+11,2%)", "Cobertura de setor em 67,6%"],
    riscos: ["7 tarefas com mais de 180 dias em aberto", "793 tarefas com campos duplicados", "321 tarefas sem vencimento definido"],
    recomendacoes: ["Priorizar backlog antigo dos setores 15.09 e 15.04", "Padronizar preenchimento no módulo de Chamados", "Ampliar cobertura de evidências fotográficas"],
  },
  { id: "r2", titulo: "Semanal 3ª semana de Julho", tipo: "Semanal", periodo: "14/07 – 20/07", geradoEm: "2026-07-21T09:00:00Z", status: "Pronto", resumo: "Semana estável com pico de chamados de climatização.", destaques: ["228 chamados às 14h"], riscos: ["Backlog crescente"], recomendacoes: ["Reforço na equipe da tarde"] },
  { id: "r3", titulo: "Diário 23/07/2026", tipo: "Diário", periodo: "23/07/2026", geradoEm: "2026-07-24T07:00:00Z", status: "Pronto", resumo: "Dia sem incidentes críticos.", destaques: ["100% das rondas realizadas"], riscos: [], recomendacoes: ["Manter cadência atual"] },
  { id: "r4", titulo: "Semanal 2ª semana de Julho", tipo: "Semanal", periodo: "07/07 – 13/07", geradoEm: "2026-07-14T09:00:00Z", status: "Pronto", resumo: "Boa cobertura de evidências.", destaques: [], riscos: [], recomendacoes: [] },
  { id: "r5", titulo: "Mensal Junho/2026", tipo: "Mensal", periodo: "Junho/2026", geradoEm: "2026-07-01T08:00:00Z", status: "Pronto", resumo: "Mês com forte volume de preventivas.", destaques: [], riscos: [], recomendacoes: [] },
  { id: "r6", titulo: "Diário 22/07/2026", tipo: "Diário", periodo: "22/07/2026", geradoEm: "2026-07-23T07:00:00Z", status: "Processando", resumo: "", destaques: [], riscos: [], recomendacoes: [] },
];

export const evidencias = Array.from({ length: 24 }).map((_, i) => ({
  id: `ev-${i}`,
  taskId: `KL-${1000 + i}`,
  titulo: `${servicos[i % servicos.length]} — Setor ${setores[i % setores.length]}`,
  andar: `${(i % 15) + 1}º andar`,
  responsavel: responsaveis[i % responsaveis.length],
  data: new Date(2026, 6, (i % 23) + 1).toISOString(),
  tipo: (i % 4 === 0 ? "Antes" : i % 4 === 1 ? "Depois" : i % 4 === 2 ? "Ronda" : "CPD") as "Antes" | "Depois" | "Ronda" | "CPD",
  cor: ["#12B76A", "#39E75F", "#2E90FA", "#F97316", "#A78BFA"][i % 5],
}));
