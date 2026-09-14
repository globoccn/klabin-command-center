# Klabin Frontend V5.1 — validação

Data: 2026-09-14

## Escopo

- Refinamento dos comparativos dos KPIs: remoção dos fundos tipo "balão"; comparação passa a usar cor semântica discreta sobre o card.
- Recomendações reestruturadas para evitar badge/faixa ocupando largura excessiva; prioridade passa a integrar a linha meta do insight.
- Período de análise compartilhado entre páginas via `klabin-analysis-period`.
- Ao abrir a Visão Geral, o período volta ao mês vigente (com fallback para o mês mais recente disponível) e passa a ser o período compartilhado para Chamados, Climatização, Rondas, Qualidade e Evidências.
- Evidências deixam de abrir automaticamente com o período completo da base e passam a respeitar o período aplicado na Visão Geral.
- Qualidade dos Dados passa a exibir `FilterBar` e chama `getQuality(filters)`.
- `dashboardService` usa o período compartilhado como fallback quando uma tela ainda não inicializou seus filtros locais.

## Validações executadas

- `node scripts/validate-project.mjs`: **124/124 OK**.
- Transpilação sintática TypeScript/TSX via TypeScript global: **93/93 arquivos, 0 erros**.
- Revisão estrutural do CSS e dos componentes alterados: OK.
- Tentativa de `npm install`: não concluiu dentro do limite do ambiente; `node_modules` não foi instalado.
- Tentativa de screenshot do harness Chromium local: o Chromium não finalizou dentro do limite do ambiente, portanto a validação visual final deve ser feita após publicação/homologação.

## Regra de período

1. Visão Geral sempre inicia no mês vigente usando `defaultDashboardPeriod()`.
2. Se a base não alcançar o mês vigente, abre o mês mais recente disponível.
3. Ao aplicar outro período na Visão Geral, ele é salvo como período compartilhado.
4. As demais páginas reutilizam esse período até que o usuário o altere.
5. Evidências faz clamp do período aos limites disponíveis da base e não abre mais no histórico completo por padrão.

## Validação final recomendada

Após publicar a V5.1, validar em browser real:
- comparativos dos KPIs em claro/escuro;
- layout das Recomendações em larguras de 1366, 1600 e 1920 px;
- período Visão Geral -> Evidências;
- período Visão Geral -> Climatização/Rondas/Qualidade/Chamados;
- persistência durante navegação e reset para mês vigente ao reabrir a Visão Geral.
