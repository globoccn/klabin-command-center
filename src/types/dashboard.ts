export type TaskStatus =
  | "A Fazer"
  | "Fazendo"
  | "Concluída"
  | "Atividades em Espera"
  | "Acompanhamento"
  | "Plantão Misael"
  | "Plantão de Sábado";

export interface Attachment {
  id: string;
  url: string;
  type: "foto" | "documento";
  label?: string;
}

export interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  projeto: string;
  subprojeto?: string;
  setor: string;
  andar?: string;
  servico: string;
  responsavel: string;
  status: TaskStatus;
  criadoEm: string;
  fechadoEm?: string;
  tempoResolucaoHoras?: number;
  anexos: Attachment[];
}

export interface DashboardFilters {
  periodo: { inicio: string; fim: string };
  projeto: string;
  subprojeto: string;
  andar: string;
  status: string;
  responsavel: string;
}

export interface Kpi {
  id: string;
  label: string;
  value: number | string;
  delta: number;
  comparison: string;
  tone: "positive" | "negative" | "neutral" | "warning";
  icon: string;
  suffix?: string;
  deltaUnit?: "%" | "p.p.";
}

export interface ChartSeries {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyEvolutionPoint {
  month: string;
  concluidas: number;
  emAberto: number;
  total: number;
}

export interface DashboardOverview {
  kpis: Kpi[];
  tarefasPorProjeto: ChartSeries[];
  evolucaoMensal: MonthlyEvolutionPoint[];
  statusAbertos: ChartSeries[];
  climatizacaoTipo: ChartSeries[];
  topSetoresClimatizacao: ChartSeries[];
  climatizacaoHorario: ChartSeries[];
  climatizacaoDiaSemana: ChartSeries[];
  atividadesRonda: ChartSeries[];
  qualidadeDados: {
    semVencimento: number;
    coberturaSetor: number;
    fechamentoAnterior: number;
    camposDuplicados: number;
  };
  evidencias: {
    percentualComEvidencia: number;
    totalFotos: number;
    tarefasComFotos: number;
  };
  backlogPorIdade: ChartSeries[];
  idadeMediana: number;
}

export interface ReportMetric {
  label: string;
  value: string;
  delta?: string;
  tone?: "positive" | "warning" | "neutral";
}

export interface Report {
  id: string;
  titulo: string;
  tipo: "Diário" | "Semanal" | "Mensal";
  periodo: string;
  geradoEm: string;
  status: "Pronto" | "Processando" | "Falhou";
  resumo: string;
  destaques: string[];
  riscos: string[];
  recomendacoes: string[];
  indicadores?: ReportMetric[];
  tendencia?: ChartSeries[];
}

export interface EvidenceRecord {
  id: string;
  taskId: string;
  titulo: string;
  atividade: string;
  andar: string;
  responsavel: string;
  data: string;
  tipo: "Antes" | "Depois" | "Ronda" | "CPD";
  cor: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  table?: { headers: string[]; rows: (string | number)[][] };
}

export interface ChatResponse {
  message: ChatMessage;
}
