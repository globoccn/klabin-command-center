import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMessage, suggestions } from "@/services/chatService";
import type { ChatMessage } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      timestamp: new Date().toISOString(),
      content: "Olá! Sou o Assistente Operacional Klabin. Posso comparar períodos e analisar chamados, climatização, backlog, rondas e evidências.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text.trim(), timestamp: new Date().toISOString() };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    const response = await sendMessage(text);
    setMessages((current) => [...current, response.message]);
    setLoading(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir assistente operacional"
        aria-expanded={open}
        className={cn(
          "fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-[14px] border border-primary/35 bg-[linear-gradient(145deg,#10b866,#36e85f)] text-primary-foreground shadow-[0_12px_35px_rgba(18,183,106,.32)] transition hover:scale-105 hover:shadow-[0_14px_38px_rgba(55,237,99,.4)] md:right-6 md:bottom-8 xl:right-7 xl:bottom-9 2xl:right-7 2xl:bottom-10",
          open && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary-glow animate-scan-glow" />
      </button>

      {open && <button type="button" aria-label="Fechar assistente" className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1px] sm:hidden" onClick={() => setOpen(false)} />}

      <aside className={cn("fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-[linear-gradient(180deg,#0b1d22,#051716)] shadow-2xl transition-transform duration-300 sm:w-[430px]", open ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/28 bg-primary/12 text-primary-glow shadow-[0_0_22px_rgba(18,183,106,.12)]"><Sparkles className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="text-sm font-semibold">Assistente Operacional</div><div className="text-[10px] text-muted-foreground">Pergunte sobre os dados da operação</div></div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Fechar"><X className="h-4 w-4" /></Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}>
              {message.role === "assistant" && <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/8 text-primary-glow"><Bot className="h-3.5 w-3.5" /></span>}
              <div className={cn("max-w-[86%] rounded-2xl px-3 py-2.5 text-[12px] leading-relaxed", message.role === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-card-elevated/82 text-[#e6ece9]")}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.table && (
                  <div className="mt-2 overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[300px] text-[10px]">
                      <thead className="bg-background/45"><tr>{message.table.headers.map((header) => <th key={header} className="px-2 py-1.5 text-left font-medium text-muted-foreground">{header}</th>)}</tr></thead>
                      <tbody>{message.table.rows.map((row, rowIndex) => <tr key={rowIndex} className="border-t border-border">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-2 py-1.5">{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 pl-9 text-[10px] text-muted-foreground">
              <span className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" /><i className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse [animation-delay:140ms]" /><i className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse [animation-delay:280ms]" /></span>
              analisando dados…
            </div>
          )}
        </div>

        <div className="space-y-2.5 border-t border-border bg-background/18 p-3">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => send(suggestion)} className="rounded-full border border-primary/22 bg-primary/6 px-2 py-1 text-[9px] text-[#d9e8de] transition hover:bg-primary/12 hover:text-primary-glow">{suggestion}</button>
            ))}
          </div>
          <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); send(input); }} className="flex gap-2">
            <input value={input} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInput(event.target.value)} placeholder="Pergunte algo…" className="h-10 flex-1 rounded-xl border border-border bg-background/72 px-3 text-xs outline-none focus:border-primary/55 focus:ring-1 focus:ring-primary/28" />
            <Button type="submit" size="icon" className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary-glow" disabled={loading || !input.trim()}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </aside>
    </>
  );
}
