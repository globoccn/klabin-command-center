import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, MessageCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantConversation } from "@/components/assistant-conversation";
import { cn } from "@/lib/utils";

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const currentPath = useRouterState({ select: (state) => state.location.pathname });

  if (currentPath === "/assistente") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir assistente operacional"
        aria-expanded={open}
        className={cn(
          "fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-[14px] border border-primary/35 bg-[linear-gradient(145deg,#10b866,#36e85f)] text-primary-foreground shadow-[0_12px_35px_rgba(18,183,106,.32)] transition hover:scale-105 hover:shadow-[0_14px_38px_rgba(55,237,99,.4)] sm:bottom-5 sm:right-5 lg:bottom-7 lg:right-7",
          open && "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-scan-glow rounded-full border-2 border-background bg-primary-glow" />
      </button>

      {open && (
        <button
          type="button"
          aria-label="Fechar assistente"
          className="fixed inset-0 z-40 bg-black/42 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[470px] flex-col border-l border-border bg-[linear-gradient(180deg,#0b1d22,#051716)] shadow-2xl transition-transform duration-300 sm:w-[min(470px,92vw)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-primary/28 bg-primary/12 text-primary-glow shadow-[0_0_22px_rgba(18,183,106,.12)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">Assistente Operacional</div>
              <div className="text-[10px] text-muted-foreground">Perguntas guiadas e respostas governadas</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary-glow">
              <Link to="/assistente" onClick={() => setOpen(false)} aria-label="Abrir página do assistente">
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Fechar">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          {open ? <AssistantConversation compact pageContext="floating-assistant" /> : null}
        </div>
      </aside>
    </>
  );
}
