import type { ChatMessage, ChatResponse } from "@/types/dashboard";

const delay = (ms = 680) => new Promise((resolve) => setTimeout(resolve, ms));

const canned: Record<string, ChatMessage> = {
  compare: {
    id: "", role: "assistant", timestamp: "",
    content: "Julho/2026 apresenta melhora operacional em relação a junho/2026: a taxa de conclusão subiu 1,8 p.p. e o backlog caiu 12,7%.",
    table: {
      headers: ["Indicador", "Junho", "Julho", "Variação"],
      rows: [
        ["Tarefas criadas", "317", "343", "+8,2%"],
        ["Concluídas", "302", "326", "+7,9%"],
        ["Taxa de conclusão", "95,3%", "97,1%", "+1,8 p.p."],
        ["Backlog", "127", "111", "-12,7%"],
      ],
    },
  },
  setores: {
    id: "", role: "assistant", timestamp: "",
    content: "O setor 15.09 lidera as solicitações de climatização, seguido por 15.04 e 12.08.\n\nPeríodo: 04/11/2025 a 23/07/2026 · Filtro: serviço Ajuste de ar.",
    table: {
      headers: ["Setor", "Chamados"],
      rows: [["15.09", 181], ["15.04", 106], ["12.08", 86], ["14.20", 67], ["14.26", 66]],
    },
  },
  backlog: {
    id: "", role: "assistant", timestamp: "",
    content: "Há 49 atividades abertas há mais de 30 dias. A maior concentração está na faixa de 31 a 90 dias.\n\nPeríodo: backlog atual em 24/07/2026.",
    table: {
      headers: ["Faixa", "Tarefas"],
      rows: [["31 a 90 dias", 30], ["91 a 180 dias", 12], ["Mais de 180 dias", 7]],
    },
  },
  rondas: {
    id: "", role: "assistant", timestamp: "",
    content: "Foram identificadas 17 rondas sem evidência fotográfica no período atual. Recomenda-se priorizar EcoQuest e iluminação.",
    table: { headers: ["Atividade", "Sem evidência"], rows: [["EcoQuest", 7], ["Iluminação", 5], ["Outras rondas", 5]] },
  },
  clima: {
    id: "", role: "assistant", timestamp: "",
    content: "As solicitações por ambiente frio representam 61,4% dos chamados de climatização. O pico ocorre às 10h.",
    table: { headers: ["Tipo", "Quantidade", "Participação"], rows: [["Ambiente frio", 1195, "61,4%"], ["Ambiente quente", 729, "37,5%"], ["Outros", 21, "1,1%"]] },
  },
};

export async function sendMessage(text: string): Promise<ChatResponse> {
  await delay();
  const normalized = normalize(text);
  let base: ChatMessage;

  if (normalized.includes("compar") || normalized.includes("mes anterior")) base = canned.compare;
  else if (normalized.includes("setor")) base = canned.setores;
  else if (normalized.includes("backlog") || normalized.includes("30 dias")) base = canned.backlog;
  else if (normalized.includes("ronda") || normalized.includes("evidencia")) base = canned.rondas;
  else if (normalized.includes("climat") || normalized.includes("frio") || normalized.includes("calor")) base = canned.clima;
  else base = {
    id: "", role: "assistant", timestamp: "",
    content: "Posso analisar comparações, climatização, setores, backlog, rondas e evidências. Para uma resposta objetiva, informe o indicador e o período desejado.",
  };

  return { message: { ...base, id: `m-${Date.now()}`, timestamp: new Date().toISOString() } };
}

export const suggestions = [
  "Compare este mês com o anterior",
  "Quais setores têm mais chamados?",
  "Mostre o backlog acima de 30 dias",
  "Quantas rondas estão sem evidência?",
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
