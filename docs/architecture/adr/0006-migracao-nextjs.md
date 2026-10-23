---
name: adr-0006
description: Decisão arquitetural de migração da stack de Astro para Next.js (App Router, static export).
alwaysApply: false
---

# ADR-0006: Migração da plataforma editorial de Astro para Next.js

- **Status:** aceito
- **Data:** 2026-10-22
- **Decisores:** Thalyson, Antigravity
- **Substitui:** [ADR-0002](0002-tech-stack-astro-typescript.md)

## Contexto
O projeto `cult.thalyson.com` foi inicialmente concebido em Astro (ADR-0002). No entanto, o ecossistema pessoal do autor mantém o projeto central `thalisonwilker` padronizado em **Next.js (App Router, static export)**. A coexistência de duas stacks heterogêneas para plataformas editoriais idênticas dobrava o custo cognitivo e de manutenção, impedia o compartilhamento de padrões operacionais e aumentava o consumo de contexto em sessões de desenvolvimento com agentes.

Adicionalmente, identificou-se a necessidade de suportar deploy estático tanto no domínio canônico (`cult.thalyson.com`) quanto sob subcaminho do GitHub Pages (`thalisonwilker.github.io/cult.thalyson.com/`), exigindo controle explícito de `basePath`.

## Decisão
Vamos migrar a plataforma editorial para **Next.js (App Router)** com compilação estática pura (`output: 'export'`):
1. **Site Público:** Next.js App Router com React 19 / TypeScript, gerando HTML/CSS estático via `generateStaticParams()`.
2. **Editor e Admin Locais:** Desacoplados do build estático de produção. Rodarão em processo de desenvolvimento dedicado (`scripts/dev.mjs`, porta `127.0.0.1:3001` com token de sessão), espelhando o padrão arquitetural do projeto `thalisonwilker`.
3. **Pipeline de Conteúdo:** `gray-matter` + `zod` (preservando o schema de ensaios) + `remark-gfm` + `remark-rehype` (`rehype-raw`) para paridade total com o conteúdo Markdown/HTML existente.
4. **Design System:** Manter 100% dos estilos originais em **Vanilla CSS** (`src/styles/*.css`), sem adoção de Tailwind.
5. **URLs e Rotas:** Manter rota canônica `/[category]/[slug]` e descontinuar a rota legada `/ensaios/[slug]`.

## Consequências
- **+** Unificação completa de stack com o ecossistema `thalisonwilker` (Next.js).
- **+** Suporte nativo a `basePath` configurável via variável de ambiente para deploy no GitHub Pages.
- **+** Correção do comportamento dos filtros da Home em ambiente de produção (Client Component com `useSearchParams`).
- **+** Isolamento absoluto do editor/admin de conteúdo, eliminando o risco de exposição ou tentativa de compilação em produção.
- **−** Custo único de reescrita dos componentes de apresentação de Astro para React.
