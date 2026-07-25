export type TaskStatus =
  | "A Fazer"
  | "Fazendo"
  | "Concluída"
  | "Atividades em Espera"
  | "Acompanhamento"
  | "Plantão Misael"
  | "Plantão de Sábado"
  | "Não informado";

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

export interface TaskPage {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskFieldDetail {
  id: number;
  label: string;
  value: unknown;
  typeId: number;
  required: boolean;
  duplicate: boolean;
}

export interface TaskQualityIssue {
  code: string;
  severity: string;
  label: string;
  details?: Record<string, unknown>;
}

export interface TaskDetailResponse {
  task: Task;
  fields: TaskFieldDetail[];
  observers: number[];
  qualityIssues: TaskQualityIssue[];
}

export interface DashboardFilters {
  periodo: { inicio: string; fim: string };
  projeto: string;
  subprojeto: string;
  andar: string;
  status: string;
  responsavel: string;
}

export interface FilterOptions {
  periodo: { inicio: string; fim: string };
  projeto: string[];
  subprojeto: string[];
  subprojetoPorProjeto?: Record<string, string[]>;
  andar: string[];
  status: string[];
  responsavel: string[];
  snapshot?: SnapshotMetadata;
}

export interface SnapshotMetadata {
  fileName: string;
  loadedAt: string;
  periodStart: string;
  periodEnd: string;
  recordCount: number;
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
  snapshot?: SnapshotMetadata;
}

export interface ClimateSummary {
  total: number;
  cold: number;
  hot: number;
  topSector: string;
  type: ChartSeries[];
  sectors: ChartSeries[];
  hours: ChartSeries[];
  weekdays: ChartSeries[];
  snapshot?: SnapshotMetadata;
}

export interface RoundsSummary {
  metrics: {
    total: number;
    evidenceRate: number;
    predominantShift: string;
    nightCount: number;
    withoutEvidence: number;
  };
  activities: ChartSeries[];
}

export interface QualitySummary {
  metrics: {
    semVencimento: number;
    coberturaSetor: number;
    fechamentoAnterior: number;
    camposDuplicados: number;
  };
  coverage: Array<{ label: string; value: number; target: number; warning?: boolean }>;
  issues: Array<{ code: string; label: string; value: number }>;
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
  url?: string;
  label?: string;
  beforeUrl?: string;
  afterUrl?: string;
}

export interface EvidenceResponse {
  items: EvidenceRecord[];
  total: number;
  options: {
    activities: string[];
    floors: string[];
    responsibles: string[];
  };
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
