---
name: tasks
description: Decomposição e gates executáveis da feature 0016 (Dashboard Administrativo Local).
alwaysApply: false
---

# Tasks — 0016: Dashboard Administrativo Local

> Decomposição da implementação. Cada task mapeia para um ou mais `AC-N` e tem um gate executável.

## Plano
| # | Task | Cobre AC | Depende de | Gate (comando) | Status |
|---|---|---|---|---|---|
| 1 | Adicionar endpoints de métricas e toggle rápido de destaques no servidor local (`scripts/editor/store.mjs` e `scripts/editor/server.mjs`) | AC-1, AC-2, AC-4 | — | `npm run test:unit` | done |
| 2 | Construir a interface visual do Dashboard (`scripts/editor/admin.html`, `admin.js`, `admin.css`) com cards de métricas, tabela com ações diretas e caixa de ideias | AC-1, AC-2, AC-3, AC-5 | 1 | `npm run test:unit` | done |
| 3 | Unificar navegação no cabeçalho entre Dashboard e Editor e validar isolamento de build de produção | AC-1, AC-6, AC-7 | 2 | `npm run build && test ! -e out/admin` | done |

## Plano de Teste
- Unidade/Integração: Testes em `scripts/editor/editor.test.mjs` cobrindo cálculo de métricas e toggle de destaques com a regra dos 3 itens.
- Aceite: Execução de `npm run build` garantindo ausência de rotas administrativas no diretório `./out`.
- Auditoria: `node scripts/audit-esteira.mjs .` e `node scripts/eval-spec-fidelity.mjs .`.

## Divergências (SPEC_DEVIATION)
- Nenhuma divergência registrada.
