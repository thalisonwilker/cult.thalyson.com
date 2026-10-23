---
name: tasks
description: Decomposição e gates executáveis da feature 0015 (migração para Next.js).
alwaysApply: false
---

# Tasks — 0015: Migração para Next.js

> Decomposição da implementação. Cada task mapeia para um ou mais `AC-N` e tem um gate executável.

## Plano
| # | Task | Cobre AC | Depende de | Gate (comando) | Status |
|---|---|---|---|---|---|
| 1 | Setup de dependências e configuração do Next.js (`package.json`, `next.config.mjs`, `tsconfig.json`) | AC-1 | — | `npx tsc --noEmit` | done |
| 2 | Repositório de Conteúdo Markdown (`src/infrastructure/content-repository.ts` com gray-matter + Zod + unified) e teste de paridade | AC-2 | 1 | `npm run test:unit` | done |
| 3 | Portar componentes de apresentação para React e integrar Vanilla CSS no `app/layout.tsx` | AC-3 | 1, 2 | `npm run test:unit` | done |
| 4 | Implementar páginas públicas App Router (`app/page.tsx` com filtros interativos, `app/[category]/[slug]/page.tsx` com `generateStaticParams`, `app/not-found.tsx`) | AC-4, AC-5, AC-6 | 2, 3 | `npm run build` | done |
| 5 | Migrar Editor e Admin para processo de desenvolvimento isolado (`scripts/dev.mjs`, porta 3001) | AC-7 | 1 | `npm run test:unit` | done |
| 6 | Remoção de resíduos do Astro e validação final do export estático (`out/index.html`, `out/CNAME`, `out/.nojekyll`) | AC-8 | 4, 5 | `npm run build && test -f out/index.html && test -f out/CNAME && test -f out/.nojekyll` | done |

## Plano de teste
- Unidade: Invariantes do domínio (`src/domain/*.test.ts`) continuam 100% verdes com Vitest.
- Integração: Teste do repositório de conteúdo (`src/infrastructure/content-repository.test.ts`) validando parsing dos 3 ensaios existentes.
- Aceite: Execução de `npm run build` gerando estáticos em `./out` com validação de presença de rotas canônicas e arquivos do GitHub Pages.

## Divergências (SPEC_DEVIATION)
- Nenhuma divergência registrada.
