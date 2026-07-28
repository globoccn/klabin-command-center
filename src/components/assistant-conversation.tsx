import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Database,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  apiResponseToMessage,
  clearStoredConversationId,
  fallbackCatalog,
  getChatCatalog,
  getChatHistory,
  getStoredConversationId,
  historyToMessages,
  sendChatFeedback,
  sendChatMessage,
  type ChatPeriodCode,
} from "@/services/chatService";
import type { ChatCatalogItem, ChatMessage, DashboardFilters } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface AssistantConversationProps {
  compact?: boolean;
  pageContext?: string;
  filters?: Partial<DashboardFilters>;
  className?: string;
}

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  timestamp: new Date().toISOString(),
  content:
    "Olá! Sou o Assistente Operacional Klabin. Minhas respostas são calculadas a partir dos dados disponíveis e de regras governadas. Selecione uma pergunta ou escreva com suas palavras.",
  suggestions: [
    "Como está a operação no último dia?",
    "Compare esta semana com a anterior",
    "Quais são as pendências mais antigas?",
  ],
  mode: "deterministic",
  usedAI: false,
};

const categoryLabels: Record<string, string> = {
  todos: "Todas",
  operação: "Operação",
  backlog: "Backlog",
  concentração: "Concentração",
  climatização: "Climatização",
  rondas: "Rondas",
  evidências: "Evidências",
  qualidade: "Qualidade",
  comparação: "Comparações",
  decisão: "Decisão",
  geral: "Ajuda",
};

const categoryOrder = [
  "todos",
  "operação",
  "backlog",
  "concentração",
  "climatização",
  "rondas",
  "evidências",
  "qualidade",
  "comparação",
  "decisão",
];

const periodLabels: Record<ChatPeriodCode, string> = {
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
};

export function AssistantConversation({
  compact = false,
  pageContext = "assistant",
  filters,
  className,
}: AssistantConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [catalog, setCatalog] = useState<ChatCatalogItem[]>(fallbackCatalog);
  const [category, setCategory] = useState("todos");
  const [period, setPeriod] = useState<ChatPeriodCode>("daily");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    const stored = getStoredConversationId();
    setConversationId(stored);

    Promise.all([
      getChatCatalog().catch(() => fallbackCatalog),
      stored ? getChatHistory(stored, compact ? 8 : 30).catch(() => []) : Promise.resolve([]),
    ]).then(([catalogItems, history]) => {
      if (!active) return;
      setCatalog(catalogItems.filter((item) => item.intent !== "unsupported"));
      if (history.length) setMessages([welcome, ...historyToMessages(history)]);
      setLoadingHistory(false);
    });

    return () => {
      active = false;
    };
  }, [compact]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: loadingHistory ? "auto" : "smooth",
    });
  }, [messages, loading, loadingHistory]);

  const availableCategories = useMemo(() => {
    const present = new Set(catalog.map((item) => item.category));
    return categoryOrder.filter((item) => item === "todos" || present.has(item));
  }, [catalog]);

  const guidedQuestions = useMemo(() => {
    const items = category === "todos" ? catalog : catalog.filter((item) => item.category === category);
    return items
      .flatMap((item) => item.examples.map((example) => ({ text: example, intent: item.intent, label: item.label })))
      .filter((item, index, list) => list.findIndex((candidate) => candidate.text === item.text) === index)
      .slice(0, compact ? 5 : 12);
  }, [catalog, category, compact]);

  const latestSuggestions = useMemo(() => {
    const latest = [...messages].reverse().find((message) => message.role === "assistant" && message.suggestions?.length);
    return latest?.suggestions ?? [];
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || loading) return;

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: question,
        timestamp: new Date().toISOString(),
      };

      setMessages((current) => [...current, userMessage]);
      setInput("");
      setError(null);
      setLoading(true);

      try {
        const response = await sendChatMessage({
          message: question,
          conversationId,
          period,
          filters,
          pageContext: { page: pageContext, compact },
        });
        setConversationId(response.conversationId);
        setMessages((current) => [...current, apiResponseToMessage(response)]);
      } catch (requestError) {
        const message = requestError instanceof Error ? requestError.message : "Não foi possível consultar o assistente.";
        setError(message);
        setMessages((current) => [
          ...current,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            timestamp: new Date().toISOString(),
            content: "Não consegui consultar os dados agora. Verifique se os workflows 31 a 35 estão configurados e se o workflow 32 está ativo.",
            mode: "error",
            usedAI: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [compact, conversationId, filters, loading, pageContext, period],
  );

  const submitFeedback = async (message: ChatMessage, rating: 1 | -1) => {
    if (!conversationId || !message.messageId || message.feedback === rating) return;
    setMessages((current) =>
      current.map((item) => (item.id === message.id ? { ...item, feedback: rating } : item)),
    );
    try {
      await sendChatFeedback(conversationId, message.messageId, rating);
    } catch {
      setMessages((current) =>
        current.map((item) => (item.id === message.id ? { ...item, feedback: null } : item)),
      );
    }
  };

  const newConversation = () => {
    clearStoredConversationId();
    setConversationId(undefined);
    setMessages([welcome]);
    setError(null);
  };

  return (
    <section
      className={cn(
        "assistant-conversation flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-border bg-[linear-gradient(160deg,rgba(8,31,32,.98),rgba(3,16,20,.99))] shadow-[0_20px_54px_rgba(0,0,0,.28)]",
        compact ? "h-full rounded-none border-0 shadow-none" : "min-h-[680px]",
        className,
      )}
    >
      <div className={cn("border-b border-border/80", compact ? "p-3" : "p-4 lg:p-5")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-primary/28 bg-primary/10 text-primary-glow shadow-[0_0_24px_rgba(18,183,106,.12)]">
              <BrainCircuit className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="font-semibold text-foreground">Conversa operacional</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-primary-glow">
                  <ShieldCheck className="h-3 w-3" /> Respostas governadas
                </span>
                <span>Sem IA generativa nesta etapa</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-background/35 p-1">
              {(Object.keys(periodLabels) as ChatPeriodCode[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-[10px] font-medium transition",
                    period === value
                      ? "bg-primary text-primary-foreground shadow-[0_5px_14px_rgba(18,183,106,.2)]"
                      : "text-muted-foreground hover:bg-primary/8 hover:text-foreground",
                  )}
                >
                  {periodLabels[value]}
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={newConversation}
              className="h-8 w-8 text-muted-foreground hover:text-primary-glow"
              title="Iniciar nova conversa"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {!compact && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 assistant-category-scroll">
            {availableCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition",
                  category === item
                    ? "border-primary/50 bg-primary/12 text-primary-glow"
                    : "border-border bg-background/28 text-muted-foreground hover:border-primary/25 hover:text-foreground",
                )}
              >
                {categoryLabels[item] ?? item}
              </button>
            ))}
          </div>
        )}
      </div>

      {!compact && (
        <div className="border-b border-border/70 bg-background/12 p-4 lg:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-foreground">Perguntas sugeridas</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                Selecione uma pergunta para obter uma resposta segura e rastreável.
              </div>
            </div>
            <Sparkles className="h-4 w-4 text-primary-glow" />
          </div>
          <div className="assistant-question-grid grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {guidedQuestions.map((question) => (
              <button
                key={`${question.intent}-${question.text}`}
                type="button"
                onClick={() => void send(question.text)}
                disabled={loading}
                className="group flex min-h-[66px] items-center justify-between gap-3 rounded-xl border border-border bg-card/55 px-3 py-2.5 text-left transition hover:border-primary/35 hover:bg-primary/7 disabled:opacity-50"
              >
                <span className="min-w-0">
                  <span className="block text-[9px] uppercase tracking-[.08em] text-primary-glow/85">
                    {question.label}
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-[#e3ebe8]">{question.text}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary-glow" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={scrollRef} className={cn("min-h-0 flex-1 space-y-4 overflow-y-auto", compact ? "p-4" : "p-4 lg:p-5")}>
        {loadingHistory && (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary-glow" /> Carregando conversa…
          </div>
        )}

        {!loadingHistory &&
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              compact={compact}
              onSuggestion={(suggestion) => void send(suggestion)}
              onFeedback={(rating) => void submitFeedback(message, rating)}
            />
          ))}

        {loading && (
          <div className="flex items-center gap-2 pl-9 text-[10px] text-muted-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-primary/20 bg-primary/8 text-primary-glow">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <span className="flex gap-1">
              <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow" />
              <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow [animation-delay:140ms]" />
              <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-glow [animation-delay:280ms]" />
            </span>
            consultando dados e regras…
          </div>
        )}
      </div>

      <div className={cn("border-t border-border bg-background/18", compact ? "p-3" : "p-4 lg:p-5")}>
        {compact && latestSuggestions.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {latestSuggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void send(suggestion)}
                className="rounded-full border border-primary/22 bg-primary/6 px-2 py-1 text-[9px] text-[#d9e8de] transition hover:bg-primary/12 hover:text-primary-glow"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {error && <div className="mb-2 text-[10px] text-destructive">{error}</div>}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2"
        >
          <div className="min-w-0 flex-1">
            {!compact && <div className="mb-1.5 text-[9px] uppercase tracking-[.08em] text-muted-foreground">Ou pergunte com suas palavras</div>}
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(input);
                }
              }}
              rows={compact ? 1 : 2}
              maxLength={500}
              placeholder="Ex.: Como está o backlog esta semana?"
              className={cn(
                "w-full resize-none rounded-xl border border-border bg-background/72 px-3 py-2.5 text-xs leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/55 focus:ring-1 focus:ring-primary/28",
                compact ? "min-h-10 max-h-24" : "min-h-[62px] max-h-32",
              )}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className={cn("shrink-0 bg-primary text-primary-foreground hover:bg-primary-glow", compact ? "h-10 w-10" : "h-[62px] w-12")}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[9px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Database className="h-3 w-3 text-primary-glow" /> Base operacional disponível
          </span>
          {compact ? (
            <Link to="/assistente" className="inline-flex items-center gap-1 font-medium text-primary-glow hover:text-white">
              Abrir assistente completo <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <span>Respostas determinísticas · sem geração livre de SQL</span>
          )}
        </div>
      </div>
    </section>
  );
}

function ChatBubble({
  message,
  compact,
  onSuggestion,
  onFeedback,
}: {
  message: ChatMessage;
  compact: boolean;
  onSuggestion: (value: string) => void;
  onFeedback: (rating: 1 | -1) => void;
}) {
  const assistant = message.role === "assistant";
  return (
    <div className={cn("flex gap-2.5", assistant ? "justify-start" : "justify-end")}>
      {assistant && (
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/8 text-primary-glow">
          <Bot className="h-4 w-4" />
        </span>
      )}

      <div className={cn("min-w-0", compact ? "max-w-[88%]" : "max-w-[min(92%,900px)]", !assistant && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-3 text-[12px] leading-relaxed",
            assistant
              ? "rounded-bl-sm border border-border bg-card-elevated/82 text-[#e6ece9]"
              : "rounded-br-sm bg-primary text-primary-foreground shadow-[0_7px_20px_rgba(18,183,106,.18)]",
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {assistant && message.data && Object.keys(message.data).length > 0 && <ChatData data={message.data} compact={compact} />}
        </div>

        <div className={cn("mt-1.5 flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground", !assistant && "justify-end")}>
          {assistant ? <MessageSquareText className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
          <span>{formatTime(message.timestamp)}</span>
          {assistant && message.mode && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/16 bg-primary/5 px-1.5 py-0.5 text-primary-glow">
              <ShieldCheck className="h-2.5 w-2.5" /> {message.usedAI ? "Análise assistida" : "Baseado em regras e dados"}
            </span>
          )}
          {assistant && message.period?.label && (
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-2.5 w-2.5" /> {message.period.label}
            </span>
          )}
        </div>

        {assistant && message.sources?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((source, index) => (
              <span key={`${source.label}-${index}`} className="rounded-full border border-border bg-background/28 px-2 py-1 text-[9px] text-muted-foreground">
                Fonte: {source.label}{source.period ? ` · ${source.period}` : ""}
              </span>
            ))}
          </div>
        ) : null}

        {assistant && message.messageId ? (
          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-muted-foreground">
            <span>Esta resposta foi útil?</span>
            <button
              type="button"
              onClick={() => onFeedback(1)}
              aria-label="Resposta útil"
              className={cn("rounded-md border p-1 transition", message.feedback === 1 ? "border-primary/50 bg-primary/15 text-primary-glow" : "border-border hover:border-primary/30 hover:text-primary-glow")}
            >
              {message.feedback === 1 ? <Check className="h-3 w-3" /> : <ThumbsUp className="h-3 w-3" />}
            </button>
            <button
              type="button"
              onClick={() => onFeedback(-1)}
              aria-label="Resposta não útil"
              className={cn("rounded-md border p-1 transition", message.feedback === -1 ? "border-warning/50 bg-warning/12 text-warning" : "border-border hover:border-warning/30 hover:text-warning")}
            >
              <ThumbsDown className="h-3 w-3" />
            </button>
          </div>
        ) : null}

        {assistant && !compact && message.suggestions?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.suggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion(suggestion)}
                className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[9px] text-[#dce7e2] transition hover:bg-primary/12 hover:text-primary-glow"
              >
                {suggestion} <ChevronRight className="h-2.5 w-2.5" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ChatData({ data, compact }: { data: Record<string, unknown>; compact: boolean }) {
  const arrays = Object.entries(data).filter(([, value]) => Array.isArray(value) && value.length > 0);
  const primitiveEntries = Object.entries(data).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value));
  const objectEntries = Object.entries(data).filter(([, value]) => value && typeof value === "object" && !Array.isArray(value));

  if (!arrays.length && !primitiveEntries.length && !objectEntries.length) return null;

  return (
    <div className="mt-3 space-y-2 border-t border-white/8 pt-3">
      {primitiveEntries.length > 0 && (
        <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
          {primitiveEntries.slice(0, compact ? 4 : 8).map(([key, value]) => (
            <MetricMini key={key} label={humanize(key)} value={formatValue(value)} />
          ))}
        </div>
      )}

      {objectEntries.slice(0, compact ? 1 : 3).map(([group, value]) => {
        const entries = Object.entries(value as Record<string, unknown>).filter(([, item]) => ["string", "number", "boolean"].includes(typeof item));
        if (!entries.length) return null;
        return (
          <div key={group} className="rounded-xl border border-border/80 bg-background/24 p-2.5">
            <div className="mb-2 text-[9px] font-semibold uppercase tracking-[.08em] text-primary-glow/85">{humanize(group)}</div>
            <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
              {entries.slice(0, compact ? 4 : 8).map(([key, item]) => (
                <MetricMini key={key} label={humanize(key)} value={formatValue(item)} />
              ))}
            </div>
          </div>
        );
      })}

      {arrays.slice(0, compact ? 1 : 3).map(([key, value]) => (
        <DataArray key={key} label={humanize(key)} rows={value as unknown[]} compact={compact} />
      ))}
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/30 px-2.5 py-2">
      <div className="truncate text-[8px] text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function DataArray({ label, rows, compact }: { label: string; rows: unknown[]; compact: boolean }) {
  const objects = rows.filter((row) => row && typeof row === "object" && !Array.isArray(row)) as Record<string, unknown>[];
  if (!objects.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-background/24 p-2.5">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-[.08em] text-primary-glow/85">{label}</div>
        <ul className="space-y-1 text-[10px] text-[#d8e2de]">
          {rows.slice(0, compact ? 4 : 8).map((row, index) => <li key={index}>• {formatValue(row)}</li>)}
        </ul>
      </div>
    );
  }

  const keys = Array.from(new Set(objects.flatMap((item) => Object.keys(item)))).filter((key) => !["color", "details"].includes(key)).slice(0, compact ? 3 : 6);
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background/24">
      <div className="px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[.08em] text-primary-glow/85">{label}</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[340px] text-[9px]">
          <thead className="bg-background/35">
            <tr>{keys.map((key) => <th key={key} className="px-2 py-1.5 text-left font-medium text-muted-foreground">{humanize(key)}</th>)}</tr>
          </thead>
          <tbody>
            {objects.slice(0, compact ? 4 : 8).map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-border/70">
                {keys.map((key) => <td key={key} className="max-w-[220px] truncate px-2 py-1.5 text-[#e1e8e5]">{formatValue(row[key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function humanize(value: string) {
  const labels: Record<string, string> = {
    current: "Período atual",
    previous: "Período anterior",
    openStart: "Backlog inicial",
    openEnd: "Backlog final",
    change: "Variação",
    stale90: "Acima de 90 dias",
    medianAge: "Idade mediana",
    averageAge: "Idade média",
    created: "Abertas",
    closed: "Encerradas",
    createdCompletionRate: "Taxa de conclusão",
    tasksWithEvidence: "Tarefas com evidência",
    completePairs: "Pares completos",
    withoutEvidence: "Sem evidência",
    duplicateFields: "Campos duplicados",
    withoutDue: "Sem vencimento",
    decisionStatus: "Situação",
  };
  if (labels[value]) return labels[value];
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "number") return value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "string") return value;
  return "—";
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
