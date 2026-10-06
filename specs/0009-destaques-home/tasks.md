---
name: tasks
description: Decomposição e gates da feature Destaques da Home (0009). Puxe ao implementar.
alwaysApply: false
---

# Tasks — Destaques da Home (0009)

> Gate executável global: `npm run typecheck && npm run test:unit && npm run build`.
> Marque `[P]` nas tasks que podem rodar em paralelo.

## Plano
| #  | Task | Cobre AC | Depende de | Gate (comando) | Status |
|----|------|----------|------------|----------------|--------|
| 1  | Adicionar `featured: z.boolean().default(false)` em `src/content/config.ts` | AC-1 | — | `npm run typecheck && npm run build` | done |
| 2  | Criar `src/domain/featured.ts` (puro, sem I/O): `selectFeatured(items, max=3)` (não-rascunho + `featured`, `pubDate` desc, desempate por slug) e `slugsToUnfeature(items, targetSlug, max=3)` (retorna os Destaques mais antigos a desmarcar) + testes `featured.test.ts` cobrindo cada linha da Matriz de decisão e os casos de borda | AC-4, AC-5, AC-6 | — | `npm run test:unit` | done |
| 3  | `editor-storage.ts`: ler/gravar `featured` (`parseEssayMarkdown`, `formatEssayMarkdown`, `EssaySummary`); `saveEssay` aplica `slugsToUnfeature` e retorna `unfeatured: {slug,title}[]`; nova função `setFeatured(slug, featured)` que só altera o campo; testes em `editor-storage.test.ts` | AC-1–AC-5 | 1, 2 | `npm run test:unit` | done |
| 4  | Middleware DEV: incluir `unfeatured` na resposta de `POST /api/editor/save` e criar `POST /api/editor/featured` `{slug, featured}` (404 se inexistente) | AC-3, AC-4 | 3 | `npm run typecheck` | done |
| 5  | Editor: checkbox "Destacar na Home (featured: true)", incluído no payload, no draft do localStorage, no carregamento por `?slug=` e no reset; toast de substituição | AC-2, AC-4 | 4 | `npm run typecheck` + verificação no browser (`/editor/`) | done |
| 6  | Admin `[P]`: coluna/toggle de estrela por linha chamando `/api/editor/featured`, toast com substituição, recarregar lista; card de métrica "Destaques x/3" | AC-3, AC-4 | 4 | `npm run typecheck` + verificação no browser (`/admin/`) | done |
| 7  | Home `[P]`: `index.astro` usa `selectFeatured` (remove slug hardcoded); oculta seção e redireciona CTA do Hero para `#todas-historias` quando vazio; `FeaturedStories.astro` recebe `stories[]` e renderiza grade responsiva 3/2/1 com cards de mesmo peso | AC-6, AC-7, AC-8 | 1, 2 | `npm run build` + verificação no browser (`/` em 1280/800/375px) | done |
| 8  | Docs: termo **Destaque** em `docs/glossary.md`, `docs/STATE.md` atualizado, spec → `implementado` | — | 1–7 | revisão | done |

> Uma task só vira `done` quando o **gate passa**. Um commit por task.

## Plano de teste
- **Unidade (`src/domain/featured.test.ts`):** uma asserção por linha da Matriz de decisão; empate de
  `pubDate` → desempate por slug; >3 Destaques no disco → `selectFeatured` limita a 3 e
  `slugsToUnfeature` devolve os excedentes; rascunho com `featured: true` ignorado.
- **Unidade/integração (`src/infrastructure/editor-storage.test.ts`):** round-trip de `featured` no
  frontmatter; publicação antiga sem o campo → `false`; `saveEssay` com 3 Destaques existentes
  regrava o mais antigo com `featured: false`; `setFeatured` preserva os demais campos e o corpo.
- **Aceite (browser, DEV):** AC-2/AC-3/AC-4 via editor e admin; AC-6/AC-7/AC-8 na Home em 3 larguras.

## Divergências (SPEC_DEVIATION)
- [ ] _nenhuma até o momento_

## Checklist de Definition of Done
- [x] Todos os AC verdes **pelo gate executável** (não por inspeção)
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] ADRs de decisões difíceis de reverter registrados (não previsto)
- [x] Glossário atualizado com **Destaque**
- [x] Spec reflete o que foi construído
- [x] `docs/STATE.md` atualizado (próximo passo / decisões)
