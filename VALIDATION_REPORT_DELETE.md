# Validação — exclusão simples de relatórios

- Confirmação visual obrigatória antes da exclusão.
- Nenhum código solicitado ou armazenado no navegador.
- Chamada ao endpoint `reports/delete` com `reportId` e `requestedBy`.
- Card removido imediatamente após sucesso.
- Prévia fechada quando o relatório aberto é excluído.
- Listagem sincronizada novamente com o PostgreSQL.
- Relatórios em processamento permanecem protegidos.
- Validação estrutural da frontend: 83/83 aprovada.
- Sintaxe TS/TSX dos arquivos modificados aprovada por `typescript.transpileModule`.
