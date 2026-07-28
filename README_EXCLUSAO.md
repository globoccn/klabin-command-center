# Aplicação da frontend com exclusão de relatórios

## Pré-requisito
O workflow `29_KLABIN_DEMO_REPORT_DELETE_API` deve estar ativo no n8n.

A frontend solicita o mesmo código definido no node `Validate Delete Request` do workflow 29.

## Publicação
1. Substitua o projeto atual pelo conteúdo deste ZIP.
2. Mantenha:

```env
VITE_KLABIN_API_BASE_URL=https://automacoes-n8n.cvkbyg.easypanel.host/webhook/klabin-demo
```

3. Faça uma nova implantação no EasyPanel.

## Teste
1. Abra Relatórios.
2. Clique no ícone de lixeira de um relatório que não esteja processando.
3. Confirme a exclusão e informe o código.
4. O card deve desaparecer imediatamente.
5. Atualize a página: o relatório não deve retornar, pois foi removido do PostgreSQL.
