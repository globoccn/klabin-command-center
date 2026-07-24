import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DEFAULT_FILTERS, FilterBar } from "@/components/filter-bar";
import { TaskTable } from "@/components/task-table";
import type { DashboardFilters } from "@/types/dashboard";

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
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);

  return (
    <div className="command-page animate-fade-in-up">
      <DashboardHeader title="Chamados e Atendimento" subtitle="Gestão completa de tarefas, responsáveis e tempo operacional" />
      <FilterBar value={filters} onChange={setFilters} />
      <TaskTable filters={filters} />
    </div>
  );
}
