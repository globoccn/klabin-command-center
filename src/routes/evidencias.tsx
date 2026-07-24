import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard-header";
import { EvidenceGallery } from "@/components/evidence-gallery";

export const Route = createFileRoute("/evidencias")({
  head: () => ({
    meta: [
      { title: "Evidências e Auditoria · Klabin" },
      { name: "description", content: "Galeria de evidências fotográficas das atividades operacionais." },
      { property: "og:title", content: "Evidências e Auditoria · Klabin" },
      { property: "og:description", content: "Fotos antes e depois, rondas e comprovações de execução." },
    ],
  }),
  component: Evidencias,
});

function Evidencias() {
  return (
    <div className="animate-fade-in-up">
      <DashboardHeader title="Evidências e Auditoria" subtitle="Registros fotográficos e comprovações operacionais" />
      <EvidenceGallery />
    </div>
  );
}
