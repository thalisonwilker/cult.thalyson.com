---
name: spec
description: Contrato da feature Alinhamento de Texto, Destaque de Links e Seção de Fontes no Editor (0011). Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec 0011 — Alinhamento de Texto, Destaque de Links e Seção de Fontes no Editor

> **Fonte da verdade.** Status: aprovado para implementação
> Os critérios de aceite são (a) o contrato com o negócio, (b) o oráculo de teste,
> (c) o prompt para o agente de IA implementar.

## Resumo
Aprimorar a experiência editorial do portal CULT fornecendo:
1. **Controles de alinhamento de texto na barra de ferramentas do Editor** (esquerda, centro, direita e justificado), renderizados tanto no preview ao vivo quanto nas páginas publicadas.
2. **Destaque automático com sublinhado para todos os links** no corpo do artigo (`prose` / `article-content`) e no preview do editor, garantindo legibilidade e acessibilidade.
3. **Seção dedicada no Editor para cadastro de Fontes e Referências**, com persistência no frontmatter (`sources`), restauração automática no formulário, preview em tempo real e bloco estruturado e elegante de referências bibliográficas no rodapé dos artigos publicados.

## Critérios de aceite

### AC-1: Botões de Alinhamento de Texto na Barra de Ferramentas
- **Dado** o autor redigindo uma publicação no editor local (`/editor/`)
- **Quando** ele selecionar um trecho de texto (ou posicionar o cursor) e clicar em um dos botões de alinhamento na toolbar:
  - **Esquerda** (`align-left`): insere/envolve o texto com `<p align="left">` ou classe `.text-left`
  - **Centralizado** (`align-center`): insere/envolve o texto com `<p align="center">` ou classe `.text-center`
  - **Direita** (`align-right`): insere/envolve o texto com `<p align="right">` ou classe `.text-right`
  - **Justificado** (`align-justify`): insere/envolve o texto com `<p align="justify">` ou classe `.text-justify`
- **Então** o texto no textarea é atualizado com a formatação e o preview ao vivo renderiza o parágrafo ou bloco imediatamente com o respectivo alinhamento CSS (`text-align`).

### AC-2: Destaque Automático de Links Sublinhados no Conteúdo
- **Dado** qualquer link inserido no corpo de um artigo (Markdown `[texto](url)` ou tag `<a>`)
- **Quando** o artigo for visualizado na página pública (`/[categoria]/[slug]/`) ou no painel de preview do editor
- **Então** o link deve receber destaque visual automático com cor turquesa (`var(--color-cult-turquoise)`), sublinhado visível (`text-decoration: underline`, `text-underline-offset: 3px`) e transição suave no hover, diferenciando-o claramente do texto comum.

### AC-3: Seção Dedicada de Fontes Utilizadas no Editor
- **Dado** o formulário do editor (`/editor/`)
- **Quando** o autor acessar a tela de criação ou edição
- **Então** deve haver uma seção explícita "Fontes & Referências Consultadas" permitindo informar as fontes utilizadas na elaboração do ensaio (nome da fonte, link opcional ou lista de referências).
- **E** as fontes devem ser salvas no rascunho local (`localStorage`) e enviadas ao salvar a publicação.

### AC-4: Persistência e Restauração de Fontes no Frontmatter
- **Dado** uma publicação salva via endpoint `/api/editor/save/`
- **Quando** o arquivo Markdown for gravado em `src/content/ensaios/[slug].md`
- **Então** as fontes devem ser gravadas no frontmatter como `sources: [...]`.
- **E** ao carregar a publicação para edição (`/editor/?slug=[slug]`), as fontes devem ser recuperadas do backend e preenchidas automaticamente no formulário.

### AC-5: Renderização Elegante das Fontes no Artigo Publicado e Preview
- **Dado** uma publicação que possua uma ou mais fontes cadastradas
- **Quando** o artigo for aberto pelo leitor em `/[categoria]/[slug]/` ou visualizado no preview do editor
- **Então** deve ser exibido um bloco específico no final do artigo (antes dos botões de navegação/rodapé) intitulado "Fontes & Referências", listando as fontes com links externos seguros (`target="_blank" rel="noopener noreferrer"`) e ícone de referência. Se a publicação não tiver fontes, o bloco não deve ser exibido.

### AC-6: Validação de Schema Zod e Tipagem de Domínio
- **Dado** o schema de conteúdo em `src/content/config.ts` e as interfaces em `src/infrastructure/editor-storage.ts`
- **Quando** o comando `npm run typecheck` e `npm run build` forem executados
- **Então** o campo `sources` deve ser tipado como opcional com valor padrão de array vazio (`z.array(z.string()).default([])` ou objetos `{ title, url }`), sem erros de compilação ou de carregamento de coleção.

## Casos de borda e erros
- Publicação sem fontes: campo vazio não gera chave inválida no frontmatter e não renderiza bloco vazio no artigo.
- Links de fontes sem protocolo `http`/`https`: devem ser tratados com segurança para não quebrar a navegação.
- Textos com alinhamento contendo quebras de linha múltiplas: tags de bloco devem manter a sintaxe HTML válida para que o parser Markdown não escape os parágrafos.
