# Central Operacional Klabin — frontend integrado

Frontend React/TypeScript conectado aos webhooks do n8n entregues no pacote Marco 4.

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

## Build

```bash
npm run build
```

## Integrações reais do Marco 4

- visão geral;
- filtros;
- chamados e tarefas paginadas;
- climatização;
- rondas;
- evidências;
- qualidade dos dados.

Relatórios e chatbot permanecem mockados e pertencem ao Marco 5.

## Publicação

O `vite.config.ts` mantém o host autorizado:

```text
klabin.facilities-ai.com.br
```
