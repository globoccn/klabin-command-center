import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const results = [];

function check(name, condition, detail = "") {
  results.push({ name, passed: Boolean(condition), detail });
  if (!condition) process.exitCode = 1;
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const requiredComponents = [
  "app-sidebar.tsx",
  "dashboard-header.tsx",
  "filter-bar.tsx",
  "kpi-card.tsx",
  "chart-card.tsx",
  "insight-banner.tsx",
  "report-card.tsx",
  "evidence-gallery.tsx",
  "task-table.tsx",
  "chat-assistant.tsx",
  "assistant-conversation.tsx",
  "detail-drawer.tsx",
  "empty-state.tsx",
  "loading-skeleton.tsx",
];
const requiredRoutes = ["index.tsx", "chamados.tsx", "climatizacao.tsx", "rondas.tsx", "evidencias.tsx", "qualidade.tsx", "relatorios.tsx", "assistente.tsx"];

for (const component of requiredComponents) check(`Componente ${component}`, exists(`src/components/${component}`));
for (const route of requiredRoutes) check(`Rota ${route}`, exists(`src/routes/${route}`));

const filterSource = read("src/components/filter-bar.tsx");
for (const label of ["Período", "Projeto", "Subprojeto", "Andar", "Status", "Responsável"]) {
  check(`Filtro ${label}`, filterSource.includes(`label=\"${label}\"`) || filterSource.includes(`label="${label}"`) || filterSource.includes(`>${label}<`) || filterSource.includes(`\"${label}\"`));
}

const overviewSource = read("src/routes/index.tsx");
for (const title of [
  "Tarefas por Projeto",
  "Evolução de Tarefas por Mês",
  "Status dos itens em aberto",
  "Climatização — Tipo de Solicitação",
  "Top 5 Setores — Climatização",
  "Climatização — Horário de Abertura",
  "Climatização — Dia da Semana",
  "Atividades de Ronda (Principais)",
  "Qualidade dos Dados",
  "Evidências Fotográficas",
  "Backlog por Idade",
]) check(`Bloco ${title}`, overviewSource.includes(title));

const mockSource = read("src/data/mockData.ts");
for (const metric of ["3783", "3672", "111", "97.1", "944", "5358"]) check(`KPI ${metric}`, mockSource.includes(metric));
for (const type of ["Diário", "Semanal", "Mensal"]) check(`Relatório ${type}`, mockSource.includes(`tipo: \"${type}\"`));
check("Sem telefone exposto no mock", !/\b55\d{10,11}\b/.test(mockSource));
check("Andares operacionais corretos", ["12º andar", "14º andar", "15º andar", "16º andar"].every((floor) => mockSource.includes(floor)));

const evidenceSource = read("src/components/evidence-gallery.tsx");
for (const field of ["Tipo", "Atividade", "Andar", "Responsável", "Data inicial", "Data final"]) check(`Evidências: ${field}`, evidenceSource.includes(field));
check("Comparação antes/depois", evidenceSource.includes('label="Antes"') && evidenceSource.includes('label="Depois"'));

const reportSource = read("src/routes/relatorios.tsx");
check("Período automático dos relatórios", reportSource.includes("Período automático") && reportSource.includes("Último dado disponível"));
check("Relatório diário ancorado no último dia", reportSource.includes("último dia existente no JSON"));
check("Relatório semanal com sete dias", reportSource.includes("últimos sete dias"));
check("Relatório mensal até a última data", reportSource.includes("mês da última data do JSON"));
check("Preview executivo dos relatórios", ["Resumo Executivo", "Destaques", "Riscos", "Recomendações", "Evolução no período"].every((item) => reportSource.includes(item)));

const chatSource = read("src/services/chatService.ts");
const assistantSource = read("src/components/assistant-conversation.tsx");
const assistantRoute = read("src/routes/assistente.tsx");
const floatingAssistant = read("src/components/chat-assistant.tsx");
const sidebarSource = read("src/components/app-sidebar.tsx");
const mobileNavSource = read("src/components/mobile-nav.tsx");
check("Chat conectado ao workflow 32", chatSource.includes('apiPost<ChatApiResponse>("chat"'));
check("Catálogo conectado ao workflow 35", chatSource.includes('apiGet<ChatCatalogResponse>("chat/catalog"'));
check("Histórico conectado ao workflow 34", chatSource.includes('apiGet<ChatHistoryResponse>("chat/history"'));
check("Feedback conectado ao workflow 33", chatSource.includes('apiPost<ChatFeedbackResponse>("chat/feedback"'));
check("Chat sem respostas locais simuladas", !chatSource.includes("const canned") && !chatSource.includes("await delay"));
check("Página Assistente Operacional", assistantRoute.includes('createFileRoute("/assistente")') && assistantRoute.includes("AssistantConversation"));
check("Perguntas guiadas", assistantSource.includes("Perguntas sugeridas") && assistantSource.includes("guidedQuestions"));
check("Texto livre secundário", assistantSource.includes("Ou pergunte com suas palavras"));
check("Períodos diário semanal mensal", ["daily", "weekly", "monthly"].every((item) => assistantSource.includes(item)));
check("Fontes e governança nas respostas", assistantSource.includes("Baseado em regras e dados") && assistantSource.includes("Fonte:"));
check("Feedback útil ou não útil", assistantSource.includes("ThumbsUp") && assistantSource.includes("ThumbsDown"));
check("Botão flutuante abre página completa", floatingAssistant.includes('to="/assistente"') && floatingAssistant.includes("AssistantConversation compact"));
check("Assistente flutuante carregado sob demanda", floatingAssistant.includes("open ? <AssistantConversation"));
check("Assistente presente nos menus", sidebarSource.includes('url: "/assistente"') && mobileNavSource.includes('url: "/assistente"'));

const styles = read("src/styles.css");
check("Sidebar de referência", read("src/components/app-sidebar.tsx").includes("w-[188px]") && styles.includes(".app-sidebar-command"));
check("Grid com 6 KPIs", styles.includes("repeat(6"));
check("Layout otimizado para 1900 × 1200", styles.includes("min-width: 1700px") && styles.includes("min-height: 1100px"));
const viteConfig = read("vite.config.ts");
check("Host Klabin autorizado no Vite", viteConfig.includes('allowedHosts: ["klabin.facilities-ai.com.br"]'));
check("Evidência visual 1900 × 1200", exists("validation/overview-1900x1200.png"));

check("Home com preenchimento ampliado", styles.includes(".overview-command-page") && styles.includes(".kpi-card-reference { height: 150px; }") && styles.includes(".overview-row-primary .chart-card-content { min-height: 232px; }"));
check("Botão da IA responsivo", floatingAssistant.includes("sm:bottom-5") && floatingAssistant.includes("lg:bottom-7"));
check("KPI Taxa de Conclusão com alinhamento dedicado", read("src/components/kpi-card.tsx").includes('kpi.id === "taxa" ? "items-center justify-between"'));
check("Logo Facilities AI adicionada à sidebar", read("src/components/app-sidebar.tsx").includes('src="/facilities-ai-logo.png"') && styles.includes(".sidebar-facilities-brand"));
check("Arquivo transparente da Facilities AI disponível", exists("public/facilities-ai-logo.png"));

check("Responsivo 1600 e abaixo", styles.includes("@media (max-width: 1599px)") && styles.includes("repeat(3, minmax(0, 1fr))"));
check("Responsivo tablets", styles.includes("@media (max-width: 1023px)") && sidebarSource.includes("hidden lg:flex") && mobileNavSource.includes("lg:hidden"));
check("Responsivo celulares", styles.includes("@media (max-width: 767px)") && styles.includes(".overview-donut-layout"));
check("Responsivo telas pequenas", styles.includes("@media (max-width: 479px)"));
check("Responsivo telas 2K e 4K", styles.includes("@media (min-width: 2200px)") && styles.includes("max-width: 2100px"));
check("Layout de baixa altura", styles.includes("@media (max-height: 850px)"));
check("Descrição demonstrativa sem tempo real", overviewSource.includes("apresentação demonstrativa") && !overviewSource.includes("em tempo real"));
check("Route tree contém assistente", read("src/routeTree.gen.ts").includes("AssistenteRoute"));


const reportService = read("src/services/reportService.ts");
const reportCard = read("src/components/report-card.tsx");
check("Relatórios conectados à API n8n", reportService.includes('apiPost<Report>("reports/generate"') && reportService.includes('url.searchParams.set("reportId", report.id)'));
check("Download direto em PDF", reportService.includes('`${baseUrl}/reports/download`') && reportCard.includes('href={getReportDownloadUrl(report)}') && !reportService.includes('URL.createObjectURL'));
check("Tela de relatórios possui botão Baixar PDF", read("src/components/report-card.tsx").includes("Baixar PDF"));


const deleteSource = read("src/routes/relatorios.tsx");
check("Frontend possui exclusão individual de relatórios", deleteSource.includes("confirmDelete") && deleteSource.includes("Sim, excluir relatório") && deleteSource.includes("setItems((current) => current?.filter"));
check("Frontend fecha preview após exclusão", deleteSource.includes("setPreview((current) => (current?.id === reportId ? null : current))"));
check("Frontend sincroniza lista após exclusão", deleteSource.includes("const refreshed = await getReports"));
check("Serviço chama workflow 29", reportService.includes('apiPost<DeleteReportResult>("reports/delete"') && !reportService.includes("deleteCode"));
check("Card possui ação de excluir", reportCard.includes("onDelete") && reportCard.includes("Trash2"));

console.table(results.map(({ name, passed }) => ({ Item: name, Status: passed ? "OK" : "FALHOU" })));
const passed = results.filter((result) => result.passed).length;
console.log(`\n${passed}/${results.length} validações aprovadas.`);
if (process.exitCode) console.error("Existem validações pendentes.");
