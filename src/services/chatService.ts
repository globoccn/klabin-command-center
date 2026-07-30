import { apiGet, apiPost } from "@/services/apiClient";
import type {
  ChatApiResponse,
  ChatCatalogItem,
  ChatHistoryItem,
  ChatMessage,
  DashboardFilters,
} from "@/types/dashboard";

const CONVERSATION_KEY = "klabin-assistant-conversation-id";
const CONVERSATION_STARTED_AT_KEY = "klabin-assistant-conversation-started-at";
export const CHAT_HISTORY_TTL_MS = 3 * 60 * 60 * 1000;

export type ChatPeriodCode = "daily" | "weekly" | "monthly";

export interface SendChatInput {
  message: string;
  conversationId?: string;
  period?: ChatPeriodCode;
  filters?: Partial<DashboardFilters>;
  pageContext?: Record<string, unknown>;
}

export interface ChatCatalogResponse {
  ok: boolean;
  mode: string;
  usedAI: boolean;
  items: ChatCatalogItem[];
}

export interface ChatHistoryResponse {
  ok: boolean;
  items: ChatHistoryItem[];
}

export interface ChatFeedbackResponse {
  ok: boolean;
  messageId: number;
  rating: 1 | -1;
}

export const fallbackCatalog: ChatCatalogItem[] = [
  {
    intent: "operational_overview",
    category: "operação",
    label: "Resumo operacional",
    description: "Volume, encerramentos, backlog e conclusão.",
    examples: ["Como está a operação?", "Faça um resumo da semana", "Resumo mensal"],
    responseMode: "deterministic",
  },
  {
    intent: "backlog_summary",
    category: "backlog",
    label: "Resumo do backlog",
    description: "Backlog inicial, final e variação.",
    examples: ["Como está o backlog?", "Quantas pendências temos?"],
    responseMode: "deterministic",
  },
  {
    intent: "oldest_tasks",
    category: "backlog",
    label: "Pendências mais antigas",
    description: "Lista as pendências mais antigas.",
    examples: ["Quais são as tarefas mais antigas?", "Mostre as 5 pendências críticas"],
    responseMode: "deterministic",
  },
  {
    intent: "climate_summary",
    category: "climatização",
    label: "Resumo de climatização",
    description: "Frio, calor, setores e volume.",
    examples: ["Como foi a climatização?", "Quantos chamados de frio e calor?"],
    responseMode: "deterministic",
  },
  {
    intent: "rounds_without_evidence",
    category: "rondas",
    label: "Rondas sem evidência",
    description: "Rondas sem anexos ou evidências.",
    examples: ["Quantas rondas estão sem evidência?"],
    responseMode: "deterministic",
  },
  {
    intent: "quality_summary",
    category: "qualidade",
    label: "Qualidade dos dados",
    description: "Cobertura e inconsistências cadastrais.",
    examples: ["Como está a qualidade dos dados?"],
    responseMode: "deterministic",
  },
  {
    intent: "compare_periods",
    category: "comparação",
    label: "Comparação de períodos",
    description: "Compara os principais indicadores.",
    examples: ["Compare esta semana com a anterior", "Julho melhorou?"],
    responseMode: "deterministic",
  },
  {
    intent: "risks_recommendations",
    category: "decisão",
    label: "Riscos e recomendações",
    description: "Riscos calculados e ações recomendadas a partir dos dados.",
    examples: ["Quais são os principais riscos?", "O que devemos priorizar?"],
    responseMode: "deterministic",
  },
  {
    intent: "executive_analysis",
    category: "análise assistida",
    label: "Análise executiva",
    description: "Organiza fatos, riscos e prioridades já calculados.",
    examples: ["Faça uma análise executiva da operação desta semana", "Analise o desempenho da operação neste mês"],
    responseMode: "hybrid",
  },
  {
    intent: "explain_operational_risks",
    category: "análise assistida",
    label: "Leitura dos riscos",
    description: "Apresenta os riscos calculados em ordem de relevância.",
    examples: ["Explique os riscos operacionais desta semana", "Interprete os principais riscos do mês"],
    responseMode: "hybrid",
  },
  {
    intent: "recommend_action_plan",
    category: "análise assistida",
    label: "Plano de ação",
    description: "Prioriza ações já aprovadas conforme o cenário do período.",
    examples: ["Sugira um plano de ação para esta semana", "O que devemos fazer primeiro diante dos dados atuais?"],
    responseMode: "hybrid",
  },
  {
    intent: "compare_periods_executive",
    category: "análise assistida",
    label: "Comparação executiva",
    description: "Organiza a comparação com o período anterior.",
    examples: ["Compare esta semana com a anterior de forma executiva", "Faça uma leitura gerencial deste mês contra o anterior"],
    responseMode: "hybrid",
  },
  {
    intent: "summarize_for_meeting",
    category: "análise assistida",
    label: "Resumo para reunião",
    description: "Seleciona os pontos mais relevantes para apresentação.",
    examples: ["Resuma a operação desta semana para uma reunião", "Prepare um resumo gerencial do mês"],
    responseMode: "hybrid",
  },
  {
    intent: "identify_possible_patterns",
    category: "análise assistida",
    label: "Padrões e concentrações",
    description: "Destaca concentrações já identificadas nos dados.",
    examples: ["Identifique possíveis padrões nos dados desta semana", "Há alguma concentração relevante na operação deste mês?"],
    responseMode: "hybrid",
  },
];

export function getStoredConversationId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const conversationId = window.localStorage.getItem(CONVERSATION_KEY) || undefined;
  const startedAt = Number(window.localStorage.getItem(CONVERSATION_STARTED_AT_KEY) || 0);
  if (!conversationId || !startedAt || Date.now() - startedAt >= CHAT_HISTORY_TTL_MS) {
    clearStoredConversationId();
    return undefined;
  }
  return conversationId;
}

export function getStoredConversationExpiresAt(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const startedAt = Number(window.localStorage.getItem(CONVERSATION_STARTED_AT_KEY) || 0);
  return startedAt ? startedAt + CHAT_HISTORY_TTL_MS : undefined;
}

export function storeConversationId(conversationId: string) {
  if (typeof window === "undefined" || !conversationId) return;
  const currentId = window.localStorage.getItem(CONVERSATION_KEY);
  const currentStartedAt = Number(window.localStorage.getItem(CONVERSATION_STARTED_AT_KEY) || 0);
  window.localStorage.setItem(CONVERSATION_KEY, conversationId);
  if (currentId !== conversationId || !currentStartedAt) {
    window.localStorage.setItem(CONVERSATION_STARTED_AT_KEY, String(Date.now()));
  }
}

export function clearStoredConversationId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONVERSATION_KEY);
  window.localStorage.removeItem(CONVERSATION_STARTED_AT_KEY);
}

export async function sendChatMessage(input: SendChatInput): Promise<ChatApiResponse> {
  const response = await apiPost<ChatApiResponse>("chat", {
    conversationId: input.conversationId || getStoredConversationId(),
    message: input.message,
    period: input.period,
    filters: {
      projeto: input.filters?.projeto ?? "Todos",
      subprojeto: input.filters?.subprojeto ?? "Todos",
      andar: input.filters?.andar ?? "Todos",
      status: input.filters?.status ?? "Todos",
      responsavel: input.filters?.responsavel ?? "Todos",
    },
    pageContext: input.pageContext ?? { page: "assistant" },
    clientTimestamp: new Date().toISOString(),
  });

  if (response.conversationId) storeConversationId(response.conversationId);
  return response;
}

export async function getChatCatalog(): Promise<ChatCatalogItem[]> {
  const response = await apiGet<ChatCatalogResponse>("chat/catalog");
  return Array.isArray(response.items) && response.items.length ? response.items : fallbackCatalog;
}

export async function getChatHistory(conversationId: string, limit = 30): Promise<ChatHistoryItem[]> {
  if (!conversationId) return [];
  const response = await apiGet<ChatHistoryResponse>("chat/history", { conversationId, limit });
  return Array.isArray(response.items) ? response.items : [];
}

export async function sendChatFeedback(
  conversationId: string,
  messageId: number,
  rating: 1 | -1,
  comment = "",
): Promise<ChatFeedbackResponse> {
  return apiPost<ChatFeedbackResponse>("chat/feedback", {
    conversationId,
    messageId,
    rating,
    comment,
  });
}

export function apiResponseToMessage(response: ChatApiResponse): ChatMessage {
  return {
    id: `a-${response.messageId ?? Date.now()}`,
    role: "assistant",
    timestamp: new Date().toISOString(),
    messageId: response.messageId,
    content: response.answer,
    intent: response.intent,
    confidence: response.confidence,
    mode: response.mode,
    usedAI: response.usedAI,
    period: response.period,
    sources: response.sources ?? [],
    suggestions: response.suggestions ?? [],
    data: response.data ?? {},
    feedback: null,
  };
}

export function historyToMessages(items: ChatHistoryItem[]): ChatMessage[] {
  return [...items]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .flatMap((item) => [
      {
        id: `history-user-${item.messageId}`,
        role: "user" as const,
        content: item.question,
        timestamp: item.createdAt,
      },
      {
        id: `history-assistant-${item.messageId}`,
        role: "assistant" as const,
        content: item.answer,
        timestamp: item.createdAt,
        messageId: item.messageId,
        intent: item.intent,
        confidence: Number(item.confidence || 0),
        mode: item.mode,
        usedAI: Boolean(item.usedAI),
        period: { code: item.period },
        feedback: null,
      },
    ]);
}
