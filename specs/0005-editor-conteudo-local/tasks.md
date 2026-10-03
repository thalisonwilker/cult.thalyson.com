---
name: tasks
description: Tarefas atômicas da feature Editor de Conteúdo Local.
alwaysApply: false
---

# Tasks — Editor de Conteúdo Local (0005)

> Gate executável: `npm run typecheck && npm run build` deve passar sem erros.
> A rota `/editor/` NÃO deve aparecer no dist/ gerado.

| # | Tarefa | Cobre AC | Status |
|---|--------|----------|--------|
| T-01 | Criar `src/pages/editor/index.astro` com guard `DEV` → retorna 404 em build | AC-1, AC-2 | ✅ |
| T-02 | Criar `src/styles/editor.css` com design system do editor | — | ✅ |
| T-03 | Criar `src/components/editor/EditorForm.astro` com campos de formulário | AC-3, AC-4, AC-5 | ✅ |
| T-04 | Implementar script client-side: preview Markdown em tempo real | AC-7 | ✅ |
| T-05 | Implementar script client-side: persistência de rascunho no localStorage | AC-8 | ✅ |
| T-06 | Implementar script client-side: geração e download do arquivo .md | AC-6 | ✅ |
| T-07 | Implementar script client-side: dialog de inserção de links | AC-5 | ✅ |
| T-08 | Implementar script client-side: preview de imagem + validação de tamanho | AC-4 | ✅ |
| T-09 | Atualizar `docs/STATE.md` | — | ✅ |
| T-10 | Criar `src/data/categories.json` e atualizar `src/content/config.ts` | AC-9 | ✅ |
| T-11 | Criar endpoints DEV para categorias, listagem, leitura e escrita de ensaios em disco | AC-9, AC-11, AC-12 | ✅ |
| T-12 | Atualizar `src/pages/editor/index.astro` com modal JSON de categorias e remoção de edição de data | AC-9, AC-10 | ✅ |
| T-13 | Implementar seletor de ensaios locais no editor + botão "Salvar" direto em disco | AC-11, AC-12 | ✅ |
| T-14 | Adicionar atalho "Editar ensaio" nas páginas `/ensaios/[slug]` em modo DEV | AC-12 | ✅ |
| T-15 | Implementar `deleteEssay` em `src/infrastructure/editor-storage.ts` e endpoints dev correspondentes | AC-13 | ✅ |
| T-16 | Atualizar `src/pages/editor/index.astro`, `src/styles/editor.css` e páginas com botão de excluir, diálogo modal de confirmação e terminologia de Publicação | AC-12, AC-13 | ✅ |
| T-17 | Adicionar testes unitários para exclusão em `src/infrastructure/editor-storage.test.ts` e validar quality gates | AC-13 | ✅ |
