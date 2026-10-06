---
name: tasks
description: Lista de tarefas executáveis da feature 0011 (alinhamento, links e fontes no editor).
alwaysApply: false
---

# Tasks 0011 — Alinhamento de Texto, Destaque de Links e Seção de Fontes no Editor

> Status: pronto para execução. Cada tarefa é atômica, executável e vinculada a um critério de aceite.

| ID | Descrição | AC | Complexidade (1-5) | Gate Executável | Status |
|---|---|---|---|---|---|
| 1  | Adicionar campo `sources` no schema Zod de `src/content/config.ts` | AC-6 | 1 | `npm run typecheck` | done |
| 2  | Atualizar `src/infrastructure/editor-storage.ts` com suporte a `sources` (leitura, escrita, geração de frontmatter) e testes unitários | AC-4, AC-6 | 2 | `npm run test:unit` | done |
| 3  | Adicionar estilo automático de links sublinhados (`.prose a`, `.article-content a`, `.editor-preview-content a`) em `src/styles/global.css` e páginas de artigo | AC-2 | 1 | `npm run build` | done |
| 4  | Adicionar botões de alinhamento de texto (Esquerda, Centro, Direita, Justificar) na toolbar do editor e suporte a tags/classes no preview em `src/pages/editor/index.astro` e `editor.css` | AC-1 | 2 | `npm run typecheck` | done |
| 5  | Adicionar seção "Fontes & Referências Consultadas" no formulário do editor com suporte a rascunho e restauração | AC-3, AC-4 | 2 | `npm run typecheck` | done |
| 6  | Implementar renderização da seção de fontes no preview do editor e no artigo publicado `src/pages/[category]/[slug].astro` com estilos dedicados | AC-5 | 2 | `npm run build` | done |
| 7  | Executar gates de qualidade completos (`typecheck`, `test:unit`, `build`), atualizar `docs/STATE.md` e commitar | AC-1 a AC-6 | 1 | `npm run typecheck && npm run test:unit && npm run build` | done |
