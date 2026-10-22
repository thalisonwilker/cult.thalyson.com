---
name: spec
description: Contrato da feature Editor de Conteúdo Local. Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec — Editor de Conteúdo Local (dev-only)

> **Fonte da verdade.** Status: aprovado
> Os critérios de aceite são (a) o contrato com o negócio, (b) o oráculo de teste,
> (c) o prompt para o agente de IA implementar.

## Resumo
O sistema passa a ter uma interface de edição de conteúdo acessível **apenas em ambiente de desenvolvimento local** (`import.meta.env.DEV === true`), que permite ao autor criar, editar e excluir publicações em Markdown com título, lead, imagem em destaque e links — sem depender de CMS externo.

## Critérios de aceite

### AC-1: Bloqueio em produção
- **Dado** que o projeto foi construído com `npm run build` (modo produção, `DEV === false`)
- **Quando** qualquer rota sob `/editor/` é solicitada
- **Então** o servidor retorna 404 (a rota não é emitida no build estático)

### AC-2: Acesso local liberado
- **Dado** que o servidor está rodando via `npm run dev` (`DEV === true`)
- **Quando** o usuário acessa `http://localhost:4321/editor/`
- **Então** a interface do editor é exibida (formulário completo, sem redirecionamento)

### AC-3: Campos obrigatórios do formulário
- **Dado** que o editor está aberto
- **Quando** o autor preenche: título, lead/descrição, categoria, território e corpo do ensaio
- **Então** os dados são válidos para gerar o frontmatter Markdown completo

### AC-4: Imagem em destaque
- **Dado** que o editor está aberto
- **Quando** o autor seleciona uma imagem via `<input type="file">` (JPG, PNG, WebP, AVIF)
- **Então** a imagem é exibida como preview antes do envio e o campo `coverImage` é preenchido com o caminho relativo correto (`/images/<nome-do-arquivo>`)

### AC-5: Links no corpo do texto
- **Dado** que o editor está aberto e o autor está escrevendo no campo de corpo (textarea)
- **Quando** o autor clica em "Inserir Link" e preenche texto + URL
- **Então** o trecho `[texto](<url>)` é inserido no cursor do textarea

### AC-6: Geração e download de arquivo Markdown
- **Dado** que todos os campos obrigatórios (AC-3) estão preenchidos
- **Quando** o autor clica em "Baixar Markdown"
- **Então** um arquivo `.md` com frontmatter YAML válido e corpo do ensaio é baixado no navegador

### AC-7: Preview em tempo real
- **Dado** que o autor está digitando no campo de corpo
- **Quando** qualquer tecla é pressionada
- **Então** o painel de preview ao lado exibe o HTML renderizado do Markdown em tempo real (sem delay perceptível > 300ms)

### AC-8: Persistência de rascunho no localStorage
- **Dado** que o autor está editando
- **Quando** o autor fecha ou recarrega a aba acidentalmente
- **Então** ao reabrir `/editor/`, o formulário restaura os últimos valores salvos automaticamente

### AC-9: Categorias dinâmicas via JSON
- **Dado** que o editor está aberto no ambiente local
- **Quando** o autor clica em "Gerenciar / Adicionar via JSON"
- **Então** um modal permite visualizar e editar/inserir categorias no formato JSON (com `value` e `label`), persistindo as mudanças em `src/data/categories.json` e atualizando o seletor imediatamente

### AC-10: Data de publicação automática
- **Dado** que um novo ensaio está sendo redigido ou editado
- **Quando** o formulário é visualizado ou salvo
- **Então** a data de publicação (`pubDate`) é gerada automaticamente pelo sistema com a data atual (ou mantida a data original se for edição), exibida de forma informativa/somente leitura, sem campo de edição manual

### AC-11: Botão Salvar com geração direta no filesystem local
- **Dado** que os campos obrigatórios estão preenchidos
- **Quando** o autor clica no botão "Salvar"
- **Então** o arquivo Markdown com frontmatter YAML é gerado e gravado diretamente em `src/content/ensaios/${slug}.md` no projeto local, emitindo feedback de sucesso (toast)

### AC-12: Edição de publicações existentes no ambiente local
- **Dado** que existem publicações salvas em `src/content/ensaios/`
- **Quando** o autor seleciona uma publicação no seletor do topo do editor ou acessa via `?slug=<slug>` (ou clica no botão de atalho presente na página da publicação em modo DEV)
- **Então** todos os campos do formulário (metadados, imagem, tags, corpo) são preenchidos com o conteúdo do arquivo existente e o salvamento atualiza o próprio arquivo

### AC-13: Exclusão de publicação local
- **Dado** que uma publicação existente está selecionada e carregada no editor
- **Quando** o autor clica em "Excluir Publicação" e confirma a ação no diálogo modal de confirmação
- **Então** o arquivo correspondente em `src/content/ensaios/${slug}.md` é removido do disco local, o seletor de publicações é atualizado, o formulário é redefinido para "Nova Publicação" e um feedback de sucesso é exibido

## Casos de borda e erros
- Arquivo de imagem > 5 MB → exibe mensagem de erro "Imagem muito grande (máx. 5 MB)" e não processa o upload
- Título em branco ao tentar salvar Markdown → exibe mensagem de erro inline "Título obrigatório"
- JSON de categorias inválido no modal → exibe mensagem de erro de sintaxe e não grava o arquivo
- URL inválida no dialog de link → exibe mensagem de aviso (não bloqueia, pois o autor pode querer links relativos)
- Tentativa de excluir publicação inexistente ou sem slug carregado → botão de exclusão permanece oculto ou exibe mensagem de erro sem corromper o estado do editor

## Fora de escopo
> Vinculante. Não implemente nada aqui.
- Autenticação ou proteção por senha da rota `/editor/`
- Editor WYSIWYG rico (TipTap, Quill etc.) — somente textarea Markdown com helpers de atalho
- Publicação automática (Git commit/push remoto)

## Rastreabilidade
- Product: `./product.md`
- ADRs relacionados: [ADR-0003](../../docs/architecture/adr/0003-conteudo-local-content-collections.md), [ADR-0002](../../docs/architecture/adr/0002-tech-stack-astro-typescript.md)
