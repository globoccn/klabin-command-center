import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard-header";
import { FilterBar } from "@/components/filter-bar";
import { TaskTable } from "@/components/task-table";

export const Route = createFileRoute("/chamados")({
  head: () => ({
    meta: [
      { title: "Chamados e Atendimento · Klabin" },
      { name: "description", content: "Gestão de chamados, atendimentos e tempo de resolução." },
      { property: "og:title", content: "Chamados e Atendimento · Klabin" },
      { property: "og:description", content: "Tabela completa de chamados com filtros, busca e detalhes." },
    ],
  }),
  component: Chamados,
});

function Chamados() {
  return (
    <div className="animate-fade-in-up">
      <DashboardHeader title="Chamados e Atendimento" subtitle="Gestão completa de tarefas, responsáveis e SLA operacional" />
      <FilterBar />
      <TaskTable />
    </div>
  );
}
