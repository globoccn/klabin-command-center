# Relatório de validação — Central Operacional Klabin

Data da validação: 24/07/2026

## Resultado executivo

A revisão visual, estrutural e funcional do frontend foi concluída antes do empacotamento.

- Checklist automatizado de requisitos: **65/65 aprovado**.
- Arquivos TypeScript/TSX verificados sintaticamente: **84**, sem erros.
- Tipagem do núcleo de dados e serviços: **aprovada**.
- Consistência dos dados mockados: **aprovada**.
- Prévia visual em **1672 × 941 px**: sem overflow horizontal ou vertical.
- Dados pessoais: nenhum telefone/WhatsApp exposto nos mocks.

## Itens validados

### Estrutura visual

- Sidebar escura fixa e navegação em sete módulos.
- Cabeçalho no formato de central de comando.
- Paleta verde, azul-petróleo, laranja e preto alinhada à referência.
- Seis cards de KPI na primeira linha.
- Três faixas de gráficos e indicadores.
- Faixa inferior de insight do período.
- Botão flutuante do assistente operacional.
- Layout responsivo e sem overflow na resolução de referência.

A evidência visual está em `validation/overview-validated.png`.

### Filtros globais

- Período.
- Projeto.
- Subprojeto.
- Andar.
- Status.
- Responsável.
- Limpeza dos filtros e atualização dos componentes com estado local.

### Indicadores da visão geral

- Total de tarefas: 3.783.
- Concluídas: 3.672.
- Em aberto: 111.
- Taxa de conclusão: 97,1%.
- Tarefas com anexos: 944.
- Fotos: 5.358.

Também foram validados os blocos de tarefas por projeto, evolução mensal, status em aberto, climatização, rondas, evidências, qualidade dos dados e backlog por idade.

### Páginas e recursos

- Visão Geral.
- Chamados e Atendimento, com busca, filtros, paginação e detalhes.
- Climatização.
- Rondas e Preventivas.
- Evidências e Auditoria, incluindo filtros e comparação antes/depois.
- Qualidade dos Dados.
- Relatórios diário, semanal e mensal, com seletor de período, geração mockada e preview executivo.
- Chatbot com respostas mockadas para comparação, setores, backlog, rondas, climatização e evidências.

### Consistência dos mocks

- 3.783 = 3.672 concluídas + 111 em aberto.
- Projetos somam 3.783 tarefas.
- Evolução mensal soma 3.783 tarefas.
- Status em aberto somam 111 tarefas.
- Climatização soma 1.945 solicitações.
- 96 tarefas de demonstração.
- 32 registros de evidência.
- 6 relatórios, cobrindo Diário, Semanal e Mensal.
- Andares operacionais: 12º, 14º, 15º e 16º.

## Comandos de validação incluídos

```bash
npm run validate:source
```

O comando acima executa o checklist automatizado de componentes, páginas, filtros, KPIs, relatórios, evidências, chatbot e estrutura visual.

## Limitação do ambiente de validação

O `npm install` e, consequentemente, o build final com Vite não puderam ser executados neste ambiente porque o registro npm estava indisponível por falha de resolução de DNS. Para reduzir o risco, foram executadas validações independentes de sintaxe, tipagem do núcleo, integridade dos dados, checklist de requisitos e prévia visual. Em um ambiente com acesso ao npm, a validação final recomendada é:

```bash
npm install
npm run validate:source
npm run lint
npm run build
npm run dev
```
