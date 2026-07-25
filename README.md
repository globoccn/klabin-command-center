# Central Operacional Klabin

Frontend demonstrativo de uma central de comando para operações, manutenção e facility management da Klabin.

## Tecnologias

- React 19
- TypeScript
- TanStack Start / Router
- Tailwind CSS 4
- shadcn/ui
- Recharts
- Lucide Icons

## Executar localmente

```bash
npm install
npm run dev
```

## Validar o projeto

```bash
npm run validate:source
npm run lint
npm run build
```

O checklist interno valida 65 requisitos de componentes, páginas, filtros, indicadores, relatórios, evidências, chatbot e estrutura visual.

## Estrutura funcional

- Visão geral executiva
- Chamados e atendimento
- Climatização
- Rondas e preventivas
- Evidências e auditoria
- Qualidade dos dados
- Relatórios diário, semanal e mensal
- Assistente operacional mockado

## Dados e integração

Os dados atuais são mockados em `src/data/mockData.ts`. A camada assíncrona de serviços está separada em `src/services`, permitindo substituir os mocks por endpoints reais sem reconstruir as páginas.

Consulte `VALIDATION_REPORT.md` para o resultado completo da validação e `validation/overview-validated.png` para a evidência visual.

## Publicação Klabin

O host de desenvolvimento autorizado está configurado em `vite.config.ts` como:

```text
klabin.facilities-ai.com.br
```

URL prevista de publicação:

```text
https://klabin.facilities-ai.com.br/
```

A tela principal possui otimização específica para **1900 × 1200 px**, preservando o comportamento responsivo nas demais resoluções.
