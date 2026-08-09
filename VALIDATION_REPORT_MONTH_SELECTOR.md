# Validação — seleção de mês nos relatórios

Data: 2026-08-09

## Alteração aplicada

A aba **Mensal** da tela de Relatórios agora permite selecionar o mês desejado dentro do intervalo coberto pelo snapshot ativo.

- Diário continua usando o último dia disponível.
- Semanal continua usando os últimos 7 dias até a última data disponível.
- Mensal passa a usar o mês selecionado.
- Meses completos usam do dia 1 ao último dia do mês.
- Meses nas extremidades do snapshot são limitados ao intervalo realmente disponível na base.
- A geração mensal envia `inicio` e `fim` para `reports/generate`.
- A listagem mensal também consulta o mesmo intervalo selecionado.

## Exemplo validado com o snapshot atual

Snapshot: 04/11/2025 a 06/08/2026.

| Seleção | Período enviado |
| --- | --- |
| Agosto de 2026 | 01/08/2026 a 06/08/2026 |
| Julho de 2026 | 01/07/2026 a 31/07/2026 |
| Novembro de 2025 | 04/11/2025 a 30/11/2025 |

## Arquivos alterados

- `src/routes/relatorios.tsx`
- `src/services/reportService.ts`
- `scripts/validate-project.mjs`

O `vite.config.ts` não foi alterado.

## Validações realizadas

- `npm run validate:source`: **109/109 OK**.
- Validação sintática TypeScript/TSX dos dois arquivos alterados: **OK**.
- Teste isolado da lógica de meses/períodos: **OK** para julho, agosto e novembro/2025.

O build completo não pôde ser executado neste ambiente porque o registry de pacotes disponível retornou 404 ao tentar instalar as dependências do projeto. Nenhum `node_modules` ou `package-lock.json` foi incluído no pacote final.
