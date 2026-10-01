---
name: tasks
description: Decomposição e gates da feature 0003.
alwaysApply: false
---

# Tasks — 0003: Portal & Home da Cultura Paraense

> Decomposição da implementação. Cada task mapeia para um ou mais `AC-N` e tem um gate executável.

## Plano

| #  | Task                                                                          | Cobre AC | Depende de | Gate (comando)                     | Status |
|----|-------------------------------------------------------------------------------|----------|------------|------------------------------------|--------|
| 1  | Estender schema Zod em `src/content/config.ts` com `territory` e `locality`   | AC-1     | —          | `npx astro sync && npm run typecheck` | done|
| 2  | Criar ensaios dedicados às manifestações do Pará (Carimbó, Guitarrada, Círio) | AC-5     | 1          | `npm run build`                    | done   |
| 3  | Atualizar `src/components/EssayCard.astro` com badges de território/localidade| AC-4     | 1          | `npm run build`                    | done   |
| 4  | Criar componente de Abas/Filtro por Território (`TerritoryFilter.astro`)      | AC-3     | 1          | `npm run build`                    | done   |
| 5  | Recriar a Home `src/pages/index.astro` com Hero Paraense e destaques          | AC-2, 3  | 2, 3, 4    | `npm run build`                    | done   |
| 6  | Validação final com typecheck e build estático completo                       | AC-1..5  | 5          | `npm run typecheck && npm run build`| done|

## Checklist de Definition of Done
- [x] Todos os AC verdes pelo gate executável (`typecheck`, `test:unit`, `build`)
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] `docs/STATE.md` atualizado
