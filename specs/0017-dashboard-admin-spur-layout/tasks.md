---
name: tasks
description: Decomposição e gates executáveis da feature 0017 (Dashboard Administrativo no Modelo Spur).
alwaysApply: false
---

# Tasks — 0017: Dashboard Administrativo no Modelo Spur

> Decomposição da implementação. Cada task mapeia para um ou mais `AC-N` e tem um gate executável.

## Plano
| # | Task | Cobre AC | Depende de | Gate (comando) | Status |
|---|---|---|---|---|---|
| 1 | Reestruturar a marcação HTML de `scripts/editor/admin.html` seguindo o layout Spur (sidebar escura, topbar clara, cards coloridos vibrantes e seção 2 colunas com gráfico de barras e alertas) | AC-1, AC-2, AC-3, AC-4, AC-5 | — | `npm run test:unit` | done |
| 2 | Criar os estilos visuais em `scripts/editor/admin.css` com paleta Spur (sidebar `#1b2432`, fundo `#f1f4f8`, cards azul, verde, vermelho e âmbar, gráfico de barras e tabela em cards brancos) | AC-1, AC-2, AC-3, AC-4, AC-5 | 1 | `npm run test:unit` | done |
| 3 | Atualizar `scripts/editor/admin.js` para renderizar o gráfico de barras proporcional por vertente, cards com o estilo Spur, alertas dinâmicos e controle da sidebar | AC-1, AC-2, AC-3, AC-4, AC-5 | 2 | `npm run test:unit` | done |
| 4 | Validar isolamento do build de produção e conformidade da esteira | AC-6 | 3 | `npm run build && test ! -e out/admin` | done |

## Plano de Teste
- Unidade/Integração: Testes em `scripts/editor/editor.test.mjs` garantindo integridade dos dados e endpoints de métricas e destaques.
- Aceite: Execução de `npm run build` garantindo ausência de rotas administrativas no diretório `./out`.
- Auditoria: `node scripts/audit-esteira.mjs .` e `node scripts/eval-spec-fidelity.mjs .`.

## Divergências (SPEC_DEVIATION)
- Nenhuma divergência registrada.
