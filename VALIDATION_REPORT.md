# Relatório de validação — Central Operacional Klabin

Data da validação: 24/07/2026

## Resultado executivo

A interface foi ajustada e validada para a resolução-alvo de **1900 × 1200 px** antes do novo empacotamento.

- Layout de comando ajustado para utilizar melhor a altura de 1200 px.
- Sidebar ampliada de forma controlada na resolução-alvo.
- Cabeçalho, filtros, KPIs, três linhas analíticas e faixa de insight redimensionados proporcionalmente.
- Gráficos de linha e barras convertidos para altura responsiva dentro dos cards.
- Cards de rondas e evidências passaram a distribuir melhor o conteúdo verticalmente.
- Domínio `klabin.facilities-ai.com.br` registrado em `vite.config.ts` por meio de `server.allowedHosts`.
- Checklist automatizado de requisitos: **67/67 aprovado**.
- Arquivos TypeScript/TSX verificados sintaticamente: **84**, sem erros.
- Evidência visual em **1900 × 1200 px**, sem overflow horizontal ou vertical.
- ZIP validado estruturalmente antes da entrega.

## Configuração de domínio no Vite

O Vite recebe apenas o hostname em `allowedHosts`, sem o protocolo `https://`:

```ts
vite: {
  server: {
    allowedHosts: ["klabin.facilities-ai.com.br"],
  },
},
```

O HTTPS deve continuar sendo terminado pelo proxy reverso ou serviço de publicação que atende `https://klabin.facilities-ai.com.br/`.

## Ajustes para 1900 × 1200

Foi criado um breakpoint específico para telas com largura mínima de 1700 px e altura mínima de 1100 px. Na resolução de 1900 × 1200, ele aplica:

- sidebar de 198 px;
- espaçamento externo de 24 px;
- cabeçalho de 88 px;
- filtros de 70 px;
- KPIs de até 132 px;
- cards primários com conteúdo interno de 192 px;
- cards secundários com conteúdo interno de 168 px;
- cards terciários com conteúdo interno de 186 px;
- faixa de insight de até 78 px.

Abaixo desse breakpoint, o layout mantém as regras responsivas anteriores.

## Itens funcionais preservados

- Visão Geral.
- Chamados e Atendimento.
- Climatização.
- Rondas e Preventivas.
- Evidências e Auditoria.
- Qualidade dos Dados.
- Relatórios diário, semanal e mensal.
- Chatbot com respostas mockadas.
- Filtros de período, projeto, subprojeto, andar, status e responsável.
- Comparação antes/depois nas evidências.
- Dados pessoais não expostos nos mocks.

## Evidência visual

A captura validada está em:

```text
validation/overview-1900x1200.png
```

Medição do documento durante a captura:

```text
scrollWidth: 1900
clientWidth: 1900
scrollHeight: 1200
clientHeight: 1200
```

Isso confirma ausência de overflow na resolução-alvo.

## Comandos de validação

```bash
npm run validate:source
npm run lint
npm run build
```

O checklist de origem e a validação sintática foram executados neste ambiente. A validação visual foi feita em Chromium headless com viewport exato de 1900 × 1200 px.

## Observação sobre build

A instalação das dependências pelo registro npm não pôde ser concluída neste ambiente devido à indisponibilidade de rede. Por isso, o build Vite deve ser repetido no ambiente de publicação que tenha acesso às dependências:

```bash
npm install
npm run validate:source
npm run lint
npm run build
```


## Ajuste adicional solicitado em 25/07/2026

- removido o botão **Ver relatório completo** do banner inferior;
- botão flutuante da IA reposicionado para cima em desktop;
- cards e blocos da visão geral redimensionados para melhor preenchimento vertical em 1900 × 1200;
- `command-card` com `overflow: visible` e `z-index` elevado em hover/focus para evitar corte e sobreposição incorreta de tooltips;
- tooltips e hover cards revisados para fundo escuro com texto claro;
- revisão aplicada em padrão global para todas as telas do frontend.


## Inclusão da logo Facilities AI

- imagem fornecida convertida de fundo quadriculado escuro para PNG com transparência;
- logo inserida na área intermediária inferior da sidebar, acima dos cards institucionais;
- posicionamento específico validado para o layout de 1900 × 1200;
- marca configurada como elemento visual não interativo, sem bloquear navegação.


## Correção de download de PDF

- valida tamanho mínimo do arquivo retornado;
- valida assinatura `%PDF-`;
- mantém a Object URL ativa por cinco segundos após o clique;
- evita cancelamento silencioso do download em navegadores que processam o clique de forma assíncrona.


## Correção definitiva do download

- removido o fluxo `fetch → Blob → URL.createObjectURL`;
- download passa a ser uma navegação HTTP direta para o endpoint do n8n;
- o navegador usa o cabeçalho `Content-Disposition: attachment` retornado pelo workflow;
- rota estabilizada em `/reports/download?reportId=...`;
- eliminação da dependência de CORS, permissões de `blob:` e gesto assíncrono do navegador.
