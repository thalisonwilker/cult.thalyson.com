---
name: tasks
description: Decomposição e gates da feature 0002.
alwaysApply: false
---

# Tasks — 0002: Fundação Editorial Astro & Design System

> Decomposição da implementação. Cada task mapeia para um ou mais `AC-N` e tem um gate executável.

## Plano

| #  | Task                                                                     | Cobre AC | Depende de | Gate (comando)                     | Status |
|----|--------------------------------------------------------------------------|----------|------------|------------------------------------|--------|
| 1  | Setup do `package.json`, `astro.config.mjs`, `tsconfig.json` e scripts  | AC-1     | —          | `npm run typecheck`                | done   |
| 2  | Design System: `tokens.css` com paleta oficial e fontes Google (Rye/etc.)| AC-3     | 1          | `npm run build`                    | done   |
| 3  | Módulo de Domínio: regras de tempo de leitura e utilitários              | AC-5     | 1          | `npm run test:unit`                | done   |
| 4  | Content Collections: schema Zod de `ensaios` em `src/content/config.ts`  | AC-2     | 1          | `npx astro sync && npm run typecheck` | done|
| 5  | Componentes de UI: Layout Base, Header, Footer e ThemeToggle             | AC-3, 4  | 2, 4       | `npm run build`                    | done   |
| 6  | Páginas: Home (`index.astro`) e Leitor de Ensaios (`[slug].astro`)       | AC-6     | 3, 5       | `npm run build`                    | done   |
| 7  | Ensaios de demonstração em `src/content/ensaios/` e validação final      | AC-2, 6  | 6          | `npm run build && npm run typecheck` | done |

## Plano de teste
- **Unidade:** Teste unitário para `calculateReadingTime` e formatação de datas via Vitest (`npm run test:unit`).
- **Aceite/Compilação:** `npm run typecheck` + `npm run build` garantindo zero erros estáticos e validação dos esquemas Zod.

## Divergências (SPEC_DEVIATION)
- *Nenhuma divergência.*

## Checklist de Definition of Done
- [x] Todos os AC verdes pelo gate executável (`npm run typecheck`, `npm run test:unit`, `npm run build`)
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] ADRs registrados e coerentes com a implementação (ADR-0002, ADR-0003, ADR-0004)
- [x] `docs/STATE.md` atualizado
