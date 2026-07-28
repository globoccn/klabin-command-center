# Assistente Operacional e revisão responsiva

## O que foi adicionado

- Página `/assistente` no menu abaixo de Relatórios.
- Botão flutuante preservado como acesso rápido.
- Integração com os workflows:
  - `32_KLABIN_DEMO_CHAT_API_DETERMINISTIC`
  - `33_KLABIN_DEMO_CHAT_FEEDBACK_API`
  - `34_KLABIN_DEMO_CHAT_HISTORY_API`
  - `35_KLABIN_DEMO_CHAT_CATALOG_API`
- Perguntas guiadas por categoria.
- Texto livre como alternativa secundária.
- Períodos Diário, Semanal e Mensal.
- Histórico da conversa armazenado pelo backend.
- Feedback útil/não útil.
- Exibição de fonte, período e modo governado.
- Respostas locais simuladas removidas.

## Pré-requisitos no n8n

Execute o workflow 31 e mantenha ativos os workflows 32, 33, 34 e 35.

## Variável de ambiente

```env
VITE_KLABIN_API_BASE_URL=https://automacoes-n8n.cvkbyg.easypanel.host/webhook/klabin-demo
```

Como a variável é lida pelo Vite, é necessário reconstruir o serviço após qualquer alteração.

## Comportamento responsivo

- 1920×1200: mantém o layout completo de referência.
- 1920×1080: mantém seis KPIs e estrutura ampla.
- 1600×900, 1536×864 e 1366×768: KPIs reorganizados e filtros em nova linha.
- 1280×800 e 1024×768: duas colunas ou uma coluna conforme o bloco.
- abaixo de 1024 px: sidebar substituída pela navegação móvel.
- abaixo de 768 px: cards e gráficos em uma coluna.
- 390×844: filtros e KPIs em uma coluna, sem compressão de texto.
- 2560×1440 e 4K: conteúdo centralizado com largura máxima controlada.

## Aplicação

1. Substitua a frontend atual pelo conteúdo deste pacote.
2. Confirme a variável `VITE_KLABIN_API_BASE_URL`.
3. Clique em **Implantar** no EasyPanel para gerar um novo build.
4. Confirme que o workflow 32 responde no endpoint `/webhook/klabin-demo/chat`.
5. Teste a página `/assistente` e o botão flutuante.
