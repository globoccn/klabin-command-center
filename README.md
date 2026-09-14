# Central Operacional Klabin — frontend integrado

Frontend React/TypeScript da Central Operacional Klabin, integrado aos webhooks n8n do projeto.

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

## Integrações atuais

- Visão Geral executiva e filtros dinâmicos;
- chamados e tarefas paginadas;
- climatização baseada em chamados;
- rondas e preventivas;
- evidências e auditoria;
- qualidade dos dados;
- relatórios PDF reais, com geração e download automático;
- Assistente Operacional conectado ao chat governado do n8n/Groq;
- histórico e feedback do assistente.

## Experiência visual

- temas claro e escuro globais, persistidos no navegador;
- sidebar institucional Klabin mantida escura nos dois temas;
- período padrão no mês vigente, limitado à última data disponível na base;
- fallback automático para o mês mais recente disponível quando a base não alcança o mês vigente;
- cards executivos com linguagem visual consistente entre todas as páginas.

## Publicação

O `vite.config.ts` mantém o host autorizado:

```text
klabin.facilities-ai.com.br
```
