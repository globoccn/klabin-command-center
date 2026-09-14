# Klabin Frontend — Validação V5

Data: 2026-09-14

## Escopo da V5

A V5 abandona a estratégia de apenas adicionar acabamento à estrutura visual antiga e passa a usar um design system semântico inspirado na disciplina visual do frontend ANCAR v5.9.1, mantendo identidade e dados próprios da Klabin.

### Preservado
- fotografia de floresta homologada no sidebar (`public/images/klabin/floresta-mosaico.webp`);
- fotografia de Lages no card Saúde da Operação (`public/images/klabin/lages-operacao.webp`);
- período padrão no mês vigente com fallback para o último mês disponível;
- Climatização da Visão Geral baseada somente em chamados;
- donut de Climatização;
- geração e download automático dos relatórios;
- APIs, rotas e contratos existentes.

### Design system V5
- tokens semânticos completos para tema claro e escuro;
- acentos semânticos independentes: verde, ciano, azul, laranja, amarelo, roxo e vermelho;
- cards passam a consumir `background`, `card`, `foreground`, `muted-foreground`, `border` e acentos semânticos;
- texto principal usa `foreground`: escuro no tema claro e claro no tema escuro;
- texto secundário usa `muted-foreground` com contraste próprio por tema;
- cards no tema escuro recebem acento lateral Klabin discreto e semanticamente colorido;
- cards claros recebem superfície branca, borda suave e sombra curta, seguindo a disciplina da referência ANCAR;
- ícones passam a usar tratamento circular contornado com fundo radial suave;
- KPIs compartilhados foram reestruturados no padrão visual ANCAR/Klabin;
- recomendações da Visão Geral passaram a usar categoria, acento lateral, ícone contornado e cor por prioridade;
- cards inferiores da Visão Geral usam cor semântica por domínio: Climatização/ciano, Rondas/verde, Qualidade/roxo, Evidências/azul;
- métricas de Climatização, Rondas e Qualidade das páginas internas usam acentos semânticos diferenciados;
- filtros, tabelas, relatórios, assistente e cards de gráficos usam o mesmo sistema de superfície/contraste;
- toggle de tema permanece discreto no rodapé da sidebar e é aplicado antes da hidratação para evitar flash de tema.

## Validações executadas

### Validador do projeto
`node scripts/validate-project.mjs`

Resultado: **124/124** validações aprovadas.

### Sintaxe TS/TSX
Transpilação sintática com TypeScript global em todos os arquivos `src/**/*.ts` e `src/**/*.tsx`.

Resultado: **92/92** arquivos sem erro de transpilação/sintaxe.

### CSS
Validação estrutural de comentários, aspas e balanceamento de chaves.

Resultado: **OK**.

### Período padrão
Cenários testados:
1. mês vigente com base até 11/09/2026 → `01/09/2026–11/09/2026`;
2. base terminando em julho → fallback `01/07/2026–23/07/2026`;
3. base iniciando em 08/09 → `08/09/2026–14/09/2026`.

Resultado: **3/3 OK**.

## Limitação do ambiente

A tentativa de `npm install` não concluiu dentro do limite do ambiente e nenhum `node_modules` foi criado. Portanto, nesta sessão não foi possível executar o build Vite/TanStack completo. A validação final de runtime deve ser feita no ambiente de homologação/hospedagem com as dependências instaladas.

A V5 deve ser tratada como candidata para homologação visual/runtime antes de substituir a versão publicada.
