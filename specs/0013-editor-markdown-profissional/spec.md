---
name: spec
description: Contrato da feature Editor Markdown Profissional com CodeMirror 6 (0013). Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec 0013 — Editor Markdown Profissional com CodeMirror 6

> **Fonte da verdade.** Status: rascunho em validação
> Os critérios de aceite são (a) o contrato com o negócio, (b) o oráculo de teste,
> (c) o prompt para o agente de IA implementar.

## Resumo
Substituir o editor simples de texto (`<textarea>`) no painel editorial local (`/editor/`) pela biblioteca profissional **CodeMirror 6**, oferecendo realce de sintaxe (syntax highlighting) para Markdown, quebra visual de linhas (line wrapping), numeração de linhas, histórico robusto com reset por artigo, busca/substituição integrada e tema escuro harmonizado com o Design System do CULT, mantendo compatibilidade total com a toolbar existente, preview em tempo real e salvamento local.

## Critérios de aceite

### AC-1: Instalação e Empacotamento de Dependências CodeMirror 6
- **Dado** o projeto Astro com TypeScript estrito
- **Quando** as dependências oficiais do CodeMirror 6 forem adicionadas (`codemirror`, `@codemirror/state`, `@codemirror/view`, `@codemirror/lang-markdown`, `@codemirror/language`, `@codemirror/commands`, `@codemirror/search`, `@codemirror/theme-one-dark`)
- **Então** o projeto compila sem erros de tipagem em `npm run typecheck` e empacota perfeitamente no cliente através do Vite sem quebrar `npm run build`.

### AC-2: Substituição Visual e Inicialização do Editor CodeMirror 6
- **Dado** o autor acessando o painel de edição (`/editor/`)
- **Quando** a página carregar no navegador
- **Então** o CodeMirror 6 é instanciado em substituição visual ao textarea padrão, exibindo:
  - Realce de sintaxe para elementos Markdown (títulos, negrito, itálico, links, listas e blocos de código).
  - Numeração de linhas ativa na calha lateral (gutters).
  - Quebra automática de linhas longas (line wrapping) sem barra de rolagem horizontal desnecessária.
  - Placeholder contextual informativo quando o documento estiver vazio.
- **E** caso ocorra falha na inicialização do script, o textarea nativo permanece visível como fallback resiliente.

### AC-3: Sincronização Bidirecional e Integração com a Toolbar
- **Dado** o editor CodeMirror 6 instanciado
- **Quando** o autor digitar diretamente no CodeMirror 6 ou acionar qualquer botão da toolbar existente (Negrito, Itálico, H2, H3, Citação, Código, Lista, Divisor, Inserir Link, Alinhamentos)
- **Então** a formatação ou texto é inserido exatamente na seleção atual do CodeMirror 6
- **E** o valor sincroniza imediatamente com o estado da página, disparando atualização do preview ao vivo em tempo real e autosave do rascunho no `localStorage`.

### AC-4: Isolamento de Histórico por Publicação e Ações de Desfazer/Refazer
- **Dado** o autor editando um artigo com histórico de modificações
- **Quando** o autor carregar outra publicação (via `?slug=`, lista de ensaios ou `?draft=`)
- **Então** o estado do CodeMirror 6 é recarregado com o novo conteúdo e o histórico de desfazer/refazer é reiniciado a partir do zero
- **E** atalhos de teclado (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z / Ctrl/Cmd+Y) bem como botões de desfazer/refazer operam exclusivamente sobre o artigo atual.

### AC-5: Painel de Busca e Substituição Integrado
- **Dado** o autor no editor CodeMirror 6
- **Quando** pressionar Ctrl/Cmd+F ou clicar no botão "Buscar e substituir"
- **Então** o painel oficial de busca do CodeMirror 6 é exibido sobre o editor, permitindo localizar ocorrências, navegar entre resultados e realizar substituição de texto com suporte a case-sensitive e regex.

### AC-6: Design System, Acessibilidade e Responsividade
- **Dado** a interface do `/editor/`
- **Quando** visualizada em temas escuros e resoluções variadas (de telas mobile 320px até desktops)
- **Então** o CodeMirror 6 utiliza as cores e variáveis do Design System (`var(--color-cult-navy-deep)`, `var(--color-cult-turquoise)`, `var(--color-cult-surface)`), possui indicador de foco visível (`:focus-visible`), atributo `aria-label="Conteúdo Markdown"` e altura flexível e confortável para long-form writing sem quebrar o layout da página.

## Matriz de decisão

| Cenário de Inicialização | Suporte JS | Estado textarea | Estado CodeMirror 6 | AC |
|---|---|---|---|---|
| Carga normal no browser moderno | Sucesso | Oculto (`hidden`) | Visível e ativo | AC-2 |
| Erro de carregamento de módulo | Falha | Visível (Fallback) | Oculto | AC-2 |
| Clique em botão da Toolbar | Ativo | Sincronizado | Recebe inserção na seleção | AC-3 |
| Troca de publicação / slug | Ativo | Sincronizado | Novo doc com histórico zerado | AC-4 |
| Atalho Ctrl/Cmd+F | Ativo | — | Painel de busca aberto | AC-5 |

## Casos de borda e erros
- Carregamento de artigo muito longo: CodeMirror 6 deve manter renderização por viewport virtual sem engasgar o navegador.
- Seleção colapsada ao inserir links/alinhamento: cursor deve ser posicionado entre as tags ou no final da inserção.
- Rascunho com caracteres especiais ou formatação mista: sincronização não pode escapar ou corromper o texto Markdown.

## Fora de escopo
- Editor visual WYSIWYG estilo Notion ou Rich-Text (mantém-se formato Markdown puro).
- Colaboração em tempo real (CRDTs / WebSockets).
- Mudança do formato de armazenamento dos artigos em disco.

## Rastreabilidade
- Spec: `specs/0013-editor-markdown-profissional/spec.md`
- Tasks: `specs/0013-editor-markdown-profissional/tasks.md`
- Estado: `docs/STATE.md`
