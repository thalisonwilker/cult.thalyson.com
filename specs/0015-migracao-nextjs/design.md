---
name: design
description: Technical Design Doc da feature 0015 - Migração arquitetural de Astro para Next.js App Router (export estático).
alwaysApply: false
---

# Technical Design Doc — 0015: Migração para Next.js

> **Tier:** arquitetural · **Status:** aprovado (2026-10-22)
> **Autor:** Thalyson, Antigravity · **Data:** 2026-10-22
> Responde: **como** no nível de sistema. Reflete as decisões tomadas na sabatina (/clarificar).

## Links e artefatos
| Artefato | Onde | Link |
|---|---|---|
| Product PRD-lite | repositório | [product.md](product.md) |
| Spec & Tasks | repositório | [spec.md](spec.md) · [tasks.md](tasks.md) |
| ADR de substituição | repositório | [ADR-0006](../../docs/architecture/adr/0006-migracao-nextjs.md) |
| Projeto de referência | filesystem local | `/Users/thalysonwilker/Projects/Thalyson/thalisonwilker` |

## Contexto da funcionalidade
Unificação da stack editorial pessoal com o projeto `thalisonwilker`, que já utiliza Next.js (App Router, static export, editor em processo isolado). Elimina a disparidade entre Astro e Next.js, resolve nativamente a configuração de `basePath` para GitHub Pages e corrige o comportamento de filtros da Home em ambiente de produção.

## Goals / Non-goals
**Goals**
- Migração 1:1 de páginas públicas: Home (`/`), Artigo por categoria (`/[category]/[slug]`) e Página 404 (`/404.html`).
- Compilação estática pura (`output: 'export'`) gerando pasta `./out` com `index.html`, `CNAME` e `.nojekyll`.
- `basePath` configurável via `NEXT_PUBLIC_BASE_PATH` (vazio para `cult.thalyson.com` e `/cult.thalyson.com` para `github.io`).
- Desacoplar Editor e Admin do bundle do Next.js: processo Node dedicado em `127.0.0.1:3001` via `scripts/dev.mjs`, reaproveitando o backend de persistência local.
- Preservar 100% dos estilos Vanilla CSS e tokens fluviais existentes em `src/styles/*.css`.
- Portar e manter os 30 testes unitários verdes com Vitest.

**Non-goals**
- Redesign visual ou refatoração para Tailwind CSS.
- Manutenção da rota legada `/ensaios/[slug]` (descontinuada conforme decisão 5 da sabatina).
- Novas dependências de banco de dados ou autenticação remota.

## Arquitetura da Solução (Os 5 Eixos)

### 1. Tech Stack
- **Framework:** Next.js 15+ (App Router).
- **Linguagem:** TypeScript strict.
- **Renderização:** React 19 (Server Components para páginas e layouts; Client Components para filtros dinâmicos e theme toggle).
- **Conteúdo/Markdown:** `gray-matter` + `zod` + `unified` (`remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-raw`, `rehype-stringify`).
- **Estilos:** Vanilla CSS modular importado em `app/layout.tsx`.

### 2. Arquitetura em Camadas
- `src/domain/`: Regras puras desacopladas de framework mantidas intactas (`reading-time.ts`, `featured.ts`, `routes.ts`).
- `src/infrastructure/`: Leitor de conteúdo local (`content-repository.ts` lendo `src/content/ensaios/*.md`) e rotinas do editor (`editor-storage.ts`).
- `src/components/`: Componentes React correspondentes aos componentes Astro anteriores:
  - `Header.tsx`, `Footer.tsx`, `CultLogo.tsx`, `EditorialHero.tsx`, `ParaHighlightHero.tsx`, `FeaturedStories.tsx`, `EssayCard.tsx`, `CategoryNavigation.tsx`, `TerritoryFilter.tsx`, `ThemeToggle.tsx`.
- `app/`:
  - `layout.tsx`: RootLayout com Server Component e exportação de `metadata`.
  - `page.tsx`: Home com filtro interativo de categoria/território via Client Component.
  - `[category]/[slug]/page.tsx`: Renderização do artigo com `generateStaticParams()`.
  - `not-found.tsx`: Página de erro 404 estática.

### 3. Infraestrutura & Deploy
- **Saída:** `./out` com `output: 'export'` no `next.config.mjs`.
- **Assets Públicos:** `public/CNAME`, `public/.nojekyll`, `public/images/`, `public/favicon.*`.
- **CI/CD:** `.github/workflows/deploy.yml` executando `npm install`, `npm run build` e deploy para o GitHub Pages.

### 4. Qualidade & Testes
- Vitest para testes de unidade do domínio e dos utilitários (`npm run test:unit`).
- Typecheck sem emissão (`npx tsc --noEmit`).
- Verificação de paridade de rotas: `/`, `/[category]/[slug]`, `/404.html`.

### 5. Observabilidade & Operação
- Build determinístico sem warnings do Turbopack.
- Editor local acessível apenas em `http://127.0.0.1:3001` via `npm run dev` com token de segurança efêmero.
