---
name: tasks
description: Decomposição e gates da feature Editor Markdown Profissional com CodeMirror 6 (0013).
alwaysApply: false
---

# Tasks — Editor Markdown Profissional com CodeMirror 6 (0013)

> Decomposição da implementação. Cada task mapeia para um ou mais `AC-N` e tem um gate executável.

## Plano

| # | Task | Cobre AC | Depende de | Gate (comando) | Status |
|---|------|----------|------------|----------------|--------|
| 1 | Instalação de dependências CodeMirror 6 no `package.json` e resolução de tipagens | AC-1 | — | `npm run typecheck` | done |
| 2 | Refatoração e aprimoramento de `src/scripts/markdown-editor.ts` com tema CULT, gutters, wrapping e tipagem TypeScript sem erros | AC-1, AC-2, AC-6 | 1 | `npm run typecheck` | done |
| 3 | Integração bidirecional do CodeMirror com a toolbar existente (ações de formatação, alinhamento e links) e eventos do editor | AC-2, AC-3 | 2 | `npm run typecheck` | done |
| 4 | Isolamento de histórico por publicação (reset ao trocar de artigo/draft) e ações de desfazer/refazer/busca | AC-4, AC-5 | 3 | `npm run typecheck` | done |
| 5 | Estilização avançada no CSS (`src/styles/editor.css`) com suporte responsivo (320px a desktop) e acessibilidade | AC-6 | 2, 3 | `npm run typecheck` | done |
| 6 | Verificação completa de build e testes da suíte | AC-1..6 | 1, 2, 3, 4, 5 | `npm run typecheck && npm run test && npm run build` | done |

## Plano de teste
- **Tipagem Estática:** `npm run typecheck` garantindo zero erros de compilação TS e Astro check. (Passou)
- **Testes Unitários/Integração:** `npm run test` garantindo regressão zero nos módulos existentes (30/30 testes passando).
- **Build de Produção:** `npm run build` verificando integridade do bundle SSG estático. (Passou)
- **Validação de Comportamento:** Abertura do `/editor/`, inserção de Markdown, formatação via toolbar, atalhos de teclado, busca e restauração de rascunhos.

## Divergências (SPEC_DEVIATION)
- *Nenhuma. A implementação atende 100% aos critérios definidos.*

## Checklist de Definition of Done
- [x] Todos os ACs verificados pelo gate executável
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] Tipagem limpa no `npm run typecheck`
- [x] Testes passando no `npm test`
- [x] Build estático bem-sucedido em `npm run build`
- [x] `docs/STATE.md` atualizado com o encerramento da feature
