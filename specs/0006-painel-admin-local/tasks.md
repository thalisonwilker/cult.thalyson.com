---
name: tasks
description: Decomposição e gates da feature Painel Administrativo Local.
alwaysApply: false
---

# Tasks — Painel Administrativo Local & Gestão de Categorias

> Decomposição da implementação. Cada task mapeia para ACs e tem um gate executável.

## Plano
| #  | Task                                                               | Cobre AC     | Depende de | Gate (comando)                               | Status |
|----|--------------------------------------------------------------------|--------------|------------|----------------------------------------------|--------|
| 1  | Adicionar métodos/testes para manipulação de categorias na storage | AC-7         | —          | `npm run test:unit`                          | done   |
| 2  | Criar a página `/admin/` (Astro dev-only) com métricas e layout    | AC-1, AC-2,3 | 1          | `npm run typecheck`                          | done   |
| 3  | Implementar busca e listagem de publicações com link para edição   | AC-4, AC-5,6 | 2          | `npm run typecheck`                          | done   |
| 4  | Implementar gerenciador de categorias em lista com persistência    | AC-7         | 2          | `npm run test:unit && npm run typecheck`     | done   |
| 5  | Refatorar `/editor/` removendo select de posts e modal JSON bruto  | AC-8         | 3          | `npm run typecheck`                          | done   |
| 6  | Validar build estático (SSG) e suite completa                      | AC-1..8      | 1..5       | `npm run test:unit && npm run build`         | done   |

## Checklist de Definition of Done
- [x] Todos os AC verdes pelo gate executável
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] `docs/STATE.md` atualizado
