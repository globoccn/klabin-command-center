import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BrainCircuit, Database, GitCompareArrows, ShieldCheck, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { AssistantConversation } from "@/components/assistant-conversation";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente Operacional · Klabin" },
      {
        name: "description",
        content: "Consultas governadas sobre operação, backlog, climatização, rondas, evidências e qualidade dos dados.",
      },
      { property: "og:title", content: "Assistente Operacional · Klabin" },
      { property: "og:description", content: "Respostas baseadas nos dados operacionais disponíveis." },
    ],
  }),
  component: AssistenteOperacional,
});

function AssistenteOperacional() {
  return (
    <div className="command-page assistant-page animate-fade-in-up">
      <DashboardHeader
        title="Assistente Operacional"
        subtitle="Perguntas guiadas, respostas objetivas e análises assistidas"
        statusLabel="Consultas governadas"
      />

      <div className="assistant-page-layout grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <AssistantConversation pageContext="assistant-page" />

        <aside className="assistant-governance-column space-y-3">
          <GovernanceCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Governança da resposta"
            text="Consultas objetivas usam indicadores calculados. Nas análises assistidas, o sistema apenas seleciona, prioriza e organiza fatos, riscos e ações previamente validados."
          />
          <GovernanceCard
            icon={<Database className="h-4 w-4" />}
            title="Origem dos dados"
            text="As respostas utilizam a base operacional disponível e indicadores consolidados para o período selecionado."
          />
          <GovernanceCard
            icon={<GitCompareArrows className="h-4 w-4" />}
            title="Períodos automáticos"
            text="Diário usa o último dia disponível; semanal usa os últimos 7 dias; mensal acompanha o mês até a última data existente."
          />

          <section className="command-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary-glow" /> Assuntos disponíveis
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-1">
              {[
                "Resumo operacional",
                "Backlog e pendências",
                "Climatização",
                "Rondas e evidências",
                "Qualidade dos dados",
                "Comparações e riscos",
                "Análise assistida",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-background/25 px-2.5 py-2 text-[10px] text-[#dce5e2]">
                  <BrainCircuit className="h-3.5 w-3.5 shrink-0 text-primary-glow" /> {item}
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-xl border border-info/25 bg-info/5 p-3 text-[10px] leading-relaxed text-muted-foreground">
            <strong className="block text-[11px] text-foreground">Limites da análise</strong>
            Não são utilizados SLA, custos, metas contratuais, consumo energético, ocupação ou dados externos porque essas informações não existem na fonte atual.
          </div>
        </aside>
      </div>
    </div>
  );
}

function GovernanceCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <section className="command-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/20 bg-primary/8 text-primary-glow">{icon}</span>
        {title}
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">{text}</p>
    </section>
  );
}
