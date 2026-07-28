# Central Operacional Klabin

Frontend React/TypeScript integrado aos webhooks do n8n da demonstração Klabin.

## Configuração

```bash
cp .env.example .env
```

Preencha:

```env
VITE_KLABIN_API_BASE_URL=https://SEU-N8N.DOMINIO/webhook/klabin-demo
```

## Execução

```bash
npm install
npm run dev
```

## Build e produção

```bash
npm run build
npm run start
```

## Integrações disponíveis

- visão geral e filtros operacionais;
- chamados e tarefas paginadas;
- climatização;
- rondas e preventivas;
- evidências e auditoria;
- qualidade dos dados;
- relatórios diário, semanal e mensal;
- geração, visualização, download e exclusão de relatórios;
- interface do assistente preparada para a próxima etapa de IA.

## Publicação

O `vite.config.ts` autoriza o host:

```text
klabin.facilities-ai.com.br
```
