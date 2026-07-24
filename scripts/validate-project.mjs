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
  "detail-drawer.tsx",
  "empty-state.tsx",
  "loading-skeleton.tsx",
];
const requiredRoutes = ["index.tsx", "chamados.tsx", "climatizacao.tsx", "rondas.tsx", "evidencias.tsx", "qualidade.tsx", "relatorios.tsx"];

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
check("Seletor de período dos relatórios", reportSource.includes('type="date"'));
check("Preview executivo dos relatórios", ["Resumo Executivo", "Destaques", "Riscos", "Recomendações", "Evolução no período"].every((item) => reportSource.includes(item)));

const chatSource = read("src/services/chatService.ts");
for (const intent of ["compare", "setores", "backlog", "rondas", "clima"]) check(`Chatbot: intenção ${intent}`, chatSource.includes(`${intent}:`));

const styles = read("src/styles.css");
check("Sidebar de referência", styles.includes("w-[188px]") || read("src/components/app-sidebar.tsx").includes("w-[188px]"));
check("Grid com 6 KPIs", styles.includes("repeat(6"));
check("Layout sem overflow na referência", exists("validation/overview-validated.png"));

console.table(results.map(({ name, passed }) => ({ Item: name, Status: passed ? "OK" : "FALHOU" })));
const passed = results.filter((result) => result.passed).length;
console.log(`\n${passed}/${results.length} validações aprovadas.`);
if (process.exitCode) console.error("Existem validações pendentes.");
