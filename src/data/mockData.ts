import type {
  ChartSeries,
  DashboardOverview,
  EvidenceRecord,
  MonthlyEvolutionPoint,
  Report,
  Task,
} from "@/types/dashboard";

export const overview: DashboardOverview = {
  kpis: [
    { id: "total", label: "Total de Tarefas", value: 3783, delta: 8.2, comparison: "vs. período anterior", tone: "positive", icon: "ClipboardList" },
    { id: "concluidas", label: "Concluídas", value: 3672, delta: 7.9, comparison: "vs. período anterior", tone: "positive", icon: "CheckCircle2" },
    { id: "abertas", label: "Em Aberto", value: 111, delta: -12.7, comparison: "vs. período anterior", tone: "warning", icon: "Clock" },
    { id: "taxa", label: "Taxa de Conclusão", value: 97.1, delta: 1.8, comparison: "vs. período anterior", tone: "positive", icon: "PieChart", suffix: "%", deltaUnit: "p.p." },
    { id: "anexos", label: "Tarefas com Anexos", value: 944, delta: 6.3, comparison: "vs. período anterior", tone: "positive", icon: "Paperclip" },
    { id: "fotos", label: "Fotos", value: 5358, delta: 11.2, comparison: "vs. período anterior", tone: "positive", icon: "Camera" },
  ],
  tarefasPorProjeto: [
    { name: "Chamados", value: 2161, color: "#0DA765" },
    { name: "Klabin Sede SP", value: 1622, color: "#73D54B" },
  ],
  evolucaoMensal: [
    { month: "Nov/25", concluidas: 167, emAberto: 4, total: 171 },
    { month: "Dez/25", concluidas: 453, emAberto: 11, total: 464 },
    { month: "Jan/26", concluidas: 465, emAberto: 13, total: 478 },
    { month: "Fev/26", concluidas: 289, emAberto: 8, total: 297 },
    { month: "Mar/26", concluidas: 383, emAberto: 9, total: 392 },
    { month: "Abr/26", concluidas: 597, emAberto: 17, total: 614 },
    { month: "Mai/26", concluidas: 467, emAberto: 13, total: 480 },
    { month: "Jun/26", concluidas: 525, emAberto: 19, total: 544 },
    { month: "Jul/26", concluidas: 326, emAberto: 17, total: 343 },
  ] as MonthlyEvolutionPoint[],
  statusAbertos: [
    { name: "A Fazer", value: 56, color: "#168DDE" },
    { name: "Atividades em Espera", value: 32, color: "#FF7A12" },
    { name: "Acompanhamento", value: 10, color: "#7137D4" },
    { name: "Plantão Misael", value: 9, color: "#4365D8" },
    { name: "Plantão de Sábado", value: 2, color: "#4BB92B" },
    { name: "Fazendo", value: 2, color: "#F0D400" },
  ],
  climatizacaoTipo: [
    { name: "Ambiente frio", value: 1195, color: "#168DDE" },
    { name: "Ambiente quente", value: 729, color: "#FF7A12" },
    { name: "Outros", value: 21, color: "#9EA9A6" },
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

export const filterOptions = {
  projeto: ["Todos", "Chamados", "Klabin Sede SP"],
  subprojeto: [
    "Todos",
    "Ajuste temperatura - CCN",
    "MASSTIN",
    "Masstin",
    "Limpeza - Sodexo",
    "Sugestões",
    "Reposição de insumos de café",
  ],
  andar: ["Todos", "12º andar", "14º andar", "15º andar", "16º andar"],
  status: [
    "Todos",
    "Concluída",
    "A Fazer",
    "Atividades em Espera",
    "Acompanhamento",
    "Plantão Misael",
    "Plantão de Sábado",
    "Fazendo",
  ],
  responsavel: [
    "Todos",
    "Masstin Plantão",
    "Plantão CCN",
    "Sarah Bernardi",
    "Gustavo Roberto",
    "Misael",
    "Wellington Silva",
  ],
};

const setores = ["15.09", "15.04", "12.08", "14.20", "14.26", "14.14", "15.03", "12.14", "14.03", "14.23"];
const andares = ["12º andar", "14º andar", "15º andar", "16º andar"];
const servicos = ["Ajuste de ar", "Ronda", "Manutenção preventiva", "Corretiva não programada", "Chamado", "Limpeza"];
const atividades = [
  "Temperatura muito baixa no setor",
  "Está CALOR, quero diminuir a temperatura do Ar",
  "Ronda CPDs - Ar-condicionado",
  "Ronda hidráulica",
  "Ronda TVs dos andares",
  "Ligar / desligar EcoQuest",
  "Ronda de iluminação",
  "Ronda dos extintores",
];
const responsaveis = ["Masstin Plantão", "Plantão CCN", "Sarah Bernardi", "Gustavo Roberto", "Misael", "Wellington Silva"];
const statusList: Task["status"][] = [
  "Concluída",
  "Concluída",
  "Concluída",
  "Concluída",
  "A Fazer",
  "Atividades em Espera",
  "Acompanhamento",
  "Fazendo",
];

export const tasks: Task[] = Array.from({ length: 96 }, (_, i) => {
  const isChamado = i % 5 < 3;
  const status = statusList[i % statusList.length];
  const project = isChamado ? "Chamados" : "Klabin Sede SP";
  const subproject = isChamado
    ? (i % 7 === 0 ? "Sugestões" : "Ajuste temperatura - CCN")
    : (i % 3 === 0 ? "Masstin" : "MASSTIN");
  const createdAt = new Date(2025, 10 + Math.floor((i * 9) / 96), 4 + ((i * 7) % 24), 7 + (i % 11), (i * 13) % 60);
  const closedAt = status === "Concluída" ? new Date(createdAt.getTime() + (0.25 + (i % 36)) * 3_600_000) : undefined;
  const evidenceCount = i % 4 === 0 ? 2 : i % 7 === 0 ? 1 : 0;

  return {
    id: `KL-${String(1000 + i).padStart(4, "0")}`,
    titulo: atividades[i % atividades.length],
    descricao: `Registro operacional de ${atividades[i % atividades.length].toLowerCase()} no setor ${setores[i % setores.length]}.`,
    projeto: project,
    subprojeto: subproject,
    setor: setores[i % setores.length],
    andar: andares[i % andares.length],
    servico: isChamado ? (i % 2 === 0 ? "Ajuste de ar" : "Chamado") : servicos[i % servicos.length],
    responsavel: responsaveis[i % responsaveis.length],
    status,
    criadoEm: createdAt.toISOString(),
    fechadoEm: closedAt?.toISOString(),
    tempoResolucaoHoras: closedAt ? Number(((closedAt.getTime() - createdAt.getTime()) / 3_600_000).toFixed(1)) : undefined,
    anexos: Array.from({ length: evidenceCount }, (_, index) => ({
      id: `a-${i}-${index}`,
      url: "",
      type: "foto" as const,
      label: evidenceCount === 2 ? (index === 0 ? "Antes" : "Depois") : "Ronda",
    })),
  };
});

const defaultIndicators = [
  { label: "Tarefas criadas", value: "343", delta: "+8,2%", tone: "positive" as const },
  { label: "Concluídas", value: "326", delta: "+7,9%", tone: "positive" as const },
  { label: "Taxa de conclusão", value: "97,1%", delta: "+1,8 p.p.", tone: "positive" as const },
  { label: "Backlog atual", value: "111", delta: "-12,7%", tone: "positive" as const },
];

const defaultTrend: ChartSeries[] = [
  { name: "Sem 1", value: 72 },
  { name: "Sem 2", value: 80 },
  { name: "Sem 3", value: 91 },
  { name: "Sem 4", value: 100 },
];

export const reports: Report[] = [
  {
    id: "r1",
    titulo: "Relatório Operacional Julho/2026",
    tipo: "Mensal",
    periodo: "01/07/2026 – 23/07/2026",
    geradoEm: "2026-07-24T08:30:00Z",
    status: "Pronto",
    resumo: "Excelente desempenho operacional. A taxa de conclusão ficou 1,8 p.p. acima do período anterior, com redução expressiva do backlog em aberto.",
    destaques: ["Redução de 12,7% nas tarefas em aberto", "5.358 fotos capturadas", "Maior concentração de climatização no setor 15.09"],
    riscos: ["7 tarefas com mais de 180 dias", "793 tarefas com campos duplicados", "321 tarefas sem vencimento"],
    recomendacoes: ["Priorizar o backlog antigo", "Padronizar campos do formulário", "Ampliar evidências em rondas"],
    indicadores: defaultIndicators,
    tendencia: defaultTrend,
  },
  {
    id: "r2",
    titulo: "Semanal — 3ª semana de julho",
    tipo: "Semanal",
    periodo: "14/07/2026 – 20/07/2026",
    geradoEm: "2026-07-21T09:00:00Z",
    status: "Pronto",
    resumo: "Semana estável, com pico de chamados de climatização no início da manhã e após o almoço.",
    destaques: ["Maior demanda às 10h", "Rondas hidráulicas dentro do padrão"],
    riscos: ["Backlog concentrado entre 8 e 30 dias"],
    recomendacoes: ["Reforçar análise preventiva no 15º andar"],
    indicadores: defaultIndicators.slice(0, 3),
    tendencia: defaultTrend,
  },
  {
    id: "r3",
    titulo: "Diário — 23/07/2026",
    tipo: "Diário",
    periodo: "23/07/2026",
    geradoEm: "2026-07-24T07:00:00Z",
    status: "Pronto",
    resumo: "Dia sem incidentes críticos e com boa taxa de encerramento.",
    destaques: ["Rondas prioritárias registradas", "Nenhuma ocorrência crítica aberta"],
    riscos: [],
    recomendacoes: ["Manter a cadência atual"],
    indicadores: defaultIndicators.slice(0, 3),
    tendencia: defaultTrend,
  },
  { id: "r4", titulo: "Semanal — 2ª semana de julho", tipo: "Semanal", periodo: "07/07/2026 – 13/07/2026", geradoEm: "2026-07-14T09:00:00Z", status: "Pronto", resumo: "Boa cobertura de evidências.", destaques: ["Aumento de fotos anexadas"], riscos: [], recomendacoes: ["Manter auditoria semanal"], indicadores: defaultIndicators.slice(0, 3), tendencia: defaultTrend },
  { id: "r5", titulo: "Mensal — Junho/2026", tipo: "Mensal", periodo: "01/06/2026 – 30/06/2026", geradoEm: "2026-07-01T08:00:00Z", status: "Pronto", resumo: "Mês com forte volume de atividades preventivas.", destaques: ["544 tarefas registradas"], riscos: ["Aumento sazonal de rondas"], recomendacoes: ["Revisar capacidade operacional"], indicadores: defaultIndicators, tendencia: defaultTrend },
  { id: "r6", titulo: "Diário — 22/07/2026", tipo: "Diário", periodo: "22/07/2026", geradoEm: "2026-07-23T07:00:00Z", status: "Processando", resumo: "", destaques: [], riscos: [], recomendacoes: [] },
];

export const evidencias: EvidenceRecord[] = Array.from({ length: 32 }, (_, i) => ({
  id: `ev-${i}`,
  taskId: `KL-${String(1000 + i).padStart(4, "0")}`,
  titulo: atividades[(i + 2) % atividades.length],
  atividade: atividades[(i + 2) % atividades.length],
  andar: andares[i % andares.length],
  responsavel: responsaveis[i % responsaveis.length],
  data: new Date(2026, 6, (i % 23) + 1, 8 + (i % 10)).toISOString(),
  tipo: (i % 4 === 0 ? "Antes" : i % 4 === 1 ? "Depois" : i % 4 === 2 ? "Ronda" : "CPD") as EvidenceRecord["tipo"],
  cor: ["#10B866", "#54D36A", "#2497F2", "#FF7918", "#7A3FE2"][i % 5],
}));
