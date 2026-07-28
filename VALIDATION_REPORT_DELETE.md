# Validação — Exclusão de relatórios na frontend

## Base utilizada
Projeto recebido em `klabin-frontend-relatorios-download-direto-validado(1).zip`.

## Integração
A frontend chama:

```text
POST /webhook/klabin-demo/reports/delete
```

Corpo enviado:

```json
{
  "reportId": "rep-...",
  "deleteCode": "código informado pelo usuário",
  "requestedBy": "frontend"
}
```

## Comportamento após sucesso
1. Remove imediatamente o card do estado local.
2. Fecha a visualização caso o relatório excluído esteja aberto.
3. Consulta novamente o endpoint `reports` para confirmar a lista real do PostgreSQL.
4. Mantém o card em tela quando a exclusão falha.
5. Bloqueia exclusão de relatórios com status `Processando`.

## Segurança de interface
- confirmação explícita;
- aviso de exclusão permanente;
- código digitado em campo `password`;
- o código não é gravado no navegador;
- estado de carregamento durante a exclusão.

## Resultados
- 83/83 validações estruturais aprovadas;
- 85 arquivos TypeScript/TSX analisados;
- 0 erros sintáticos;
- rota de download direto preservada;
- configuração do Vite preservada.
