import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessage, suggestions } from "@/services/chatService";
import type { ChatMessage } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m0", role: "assistant", timestamp: new Date().toISOString(), content: "Olá! Sou o assistente operacional Klabin. Posso comparar períodos, analisar backlog, chamados e evidências." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    const res = await sendMessage(text);
    setMessages((m) => [...m, res.message]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl grid place-items-center transition-all hover:scale-105",
          "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[0_10px_40px_-10px_rgba(57,231,95,0.6)]",
          open && "opacity-0 pointer-events-none"
        )}
        aria-label="Abrir assistente"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary-glow animate-pulse" />
      </button>

      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] flex flex-col transition-transform duration-300",
        "bg-card border-l border-border shadow-2xl",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl grid place-items-center bg-primary/15 border border-primary/30">
              <Sparkles className="h-5 w-5 text-primary-glow" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm">Assistente Operacional</div>
              <div className="text-[11px] text-muted-foreground">Pergunte sobre os dados da operação</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card-elevated border border-border rounded-bl-sm"
              )}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.table && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-xs">
                      <thead className="bg-background/50">
                        <tr>{m.table.headers.map((h) => (<th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground">{h}</th>))}</tr>
                      </thead>
                      <tbody>
                        {m.table.rows.map((r, i) => (
                          <tr key={i} className="border-t border-border">
                            {r.map((c, j) => (<td key={j} className="px-2 py-1.5">{c}</td>))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-1 items-center text-muted-foreground text-xs pl-2">
              <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
              <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse [animation-delay:150ms]" />
              <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse [animation-delay:300ms]" />
              analisando dados…
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="text-[11px] px-2 py-1 rounded-full border border-primary/25 bg-primary/5 text-primary-glow hover:bg-primary/10">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo…"
              className="flex-1 rounded-xl bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary-glow" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
