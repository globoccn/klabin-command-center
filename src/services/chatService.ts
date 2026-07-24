import type { ChatMessage, ChatResponse } from "@/types/dashboard";

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

const canned: Record<string, ChatMessage> = {
  compare: {
    id: "", role: "assistant", timestamp: "",
    content: "Comparando julho/2026 com junho/2026: aumento de 8,2% em tarefas criadas, taxa de conclusão subiu 1,8 p.p. e o backlog em aberto caiu 12,7%.",
    table: {
      headers: ["Indicador", "Junho", "Julho", "Δ"],
      rows: [
        ["Total tarefas", "3.495", "3.783", "+8,2%"],
        ["Concluídas", "3.402", "3.672", "+7,9%"],
        ["Taxa conclusão", "95,3%", "97,1%", "+1,8 p.p."],
      ],
    },
  },
  setores: {
    id: "", role: "assistant", timestamp: "",
    content: "Top setores em chamados de climatização:",
    table: {
      headers: ["Setor", "Chamados"],
      rows: [["15.09", 181], ["15.04", 106], ["12.08", 86], ["14.20", 67], ["14.26", 66]],
    },
  },
  backlog: {
    id: "", role: "assistant", timestamp: "",
    content: "Backlog acima de 30 dias:",
    table: {
      headers: ["Faixa", "Tarefas"],
      rows: [["31 a 90 dias", 30], ["91 a 180 dias", 12], ["Mais de 180 dias", 7]],
    },
  },
  rondas: {
    id: "", role: "assistant", timestamp: "",
    content: "Atualmente 17 rondas não possuem evidência fotográfica anexada. Recomenda-se reforçar o processo nas atividades de EcoQuest e iluminação.",
  },
};

export async function sendMessage(text: string): Promise<ChatResponse> {
  await delay();
  const t = text.toLowerCase();
  let base: ChatMessage;
  if (t.includes("compar")) base = canned.compare;
  else if (t.includes("setor")) base = canned.setores;
  else if (t.includes("backlog")) base = canned.backlog;
  else if (t.includes("ronda") || t.includes("evidênc") || t.includes("evidenc")) base = canned.rondas;
  else base = {
    id: "", role: "assistant", timestamp: "",
    content: "Analisei os dados operacionais. No momento, os indicadores estão dentro dos limites esperados. Posso detalhar chamados, backlog, evidências ou climatização — é só perguntar.",
  };
  return {
    message: { ...base, id: `m-${Date.now()}`, timestamp: new Date().toISOString() },
  };
}

export const suggestions = [
  "Compare este mês com o anterior",
  "Quais setores têm mais chamados?",
  "Mostre o backlog acima de 30 dias",
  "Quantas rondas estão sem evidência?",
];
