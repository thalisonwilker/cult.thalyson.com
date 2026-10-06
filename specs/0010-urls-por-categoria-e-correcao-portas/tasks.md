---
name: tasks
description: Decomposição e gates da feature URLs por Categoria e Correção de Portas (0010). Puxe ao implementar.
alwaysApply: false
---

# Tasks — URLs por Categoria e Correção de Portas (0010)

> Gate executável global: `npm run typecheck && npm run test:unit && npm run build`.

## Plano
| #  | Task | Cobre AC | Depende de | Gate (comando) | Status |
|----|------|----------|------------|----------------|--------|
| 1  | Criar `src/domain/routes.ts` com `getEssayUrl(category, slug)` e testes unitários em `src/domain/routes.test.ts` | AC-6 | — | `npm run test:unit` | done |
| 2  | Atualizar `nginx.conf` adicionando `port_in_redirect off;` e `absolute_redirect off;` | AC-4 | — | `nginx -t -c $(pwd)/nginx.conf 2>&1 || true` | done |
| 3  | Atualizar `astro.config.mjs` com `trailingSlash: 'always'` | AC-5 | — | `npm run typecheck` | done |
| 4  | Criar página canônica `src/pages/[category]/[slug].astro` com rotas dinâmicas baseadas na categoria | AC-1 | 1, 3 | `npm run build && npm run typecheck` | done |
| 5  | Atualizar `src/pages/ensaios/[slug].astro` para redirecionamento retroativo de URLs legadas | AC-2 | 1, 4 | `npm run build` | done |
| 6  | Atualizar componentes com links para publicações (`EssayCard.astro`, `FeaturedStories.astro`, `admin/index.astro`, `ParaHighlightHero.astro`, `ParaSection.astro`) | AC-3 | 1 | `npm run build` | done |
| 7  | Atualizar `scripts/test-docker.sh` para testar nova URL por categoria e verificar que redirecionamentos não possuem `:8080` | AC-4 | 2, 4 | `npm run build && bash scripts/test-docker.sh` | done |
| 8  | Atualizar documentação do projeto (`docs/STATE.md`, spec status) | — | 1–7 | `npm run test:unit && npm run build` | done |

## Plano de teste
- **Unidade (`src/domain/routes.test.ts`):** Testa formatação, normalização em minúsculas, trailing slash, caracteres especiais e espaços.
- **Build estático (`npm run build`):** Valida geração de `dist/patrimonio/as-14-procissoes-do-cirio-de-nazare/index.html` e links canônicos.
- **Redirecionamento legada:** Valida que `/ensaios/as-14-procissoes-do-cirio-de-nazare/index.html` contém o meta-refresh e script para `/patrimonio/.../`.
