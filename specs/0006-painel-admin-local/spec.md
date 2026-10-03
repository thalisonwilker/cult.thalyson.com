---
name: spec
description: Contrato da feature Painel Administrativo Local e Gerenciador de Categorias em Lista.
alwaysApply: true
---

# Spec — Painel Administrativo Local & Gestão de Categorias (dev-only)

> **Fonte da verdade.** Status: aprovado
> Os critérios de aceite são (a) o contrato com o negócio, (b) o oráculo de teste,
> (c) o prompt para o agente de IA implementar.

## Resumo
Criação da interface `/admin/` dev-only (localhost) que consolida visão geral com métricas das publicações e categorias, pesquisa em tempo real de publicações com atalho para edição, e gerenciamento de categorias por lista estruturada (adicionar, editar e excluir) com persistência direta em `src/data/categories.json`. O seletor em dropdown de posts e o editor de JSON bruto são removidos da página `/editor/`.

## Critérios de aceite

### AC-1: Bloqueio em produção
- **Dado** que o projeto foi construído com `npm run build` (modo produção, `DEV === false`)
- **Quando** a rota `/admin/` é solicitada
- **Então** o servidor retorna 404 (a rota não é emitida no build estático)

### AC-2: Acesso local liberado
- **Dado** que o servidor está rodando via `npm run dev` (`DEV === true`)
- **Quando** o usuário acessa `http://localhost:4321/admin/`
- **Então** a interface do Painel Administrativo é exibida com identidade visual azul escuro consistente

### AC-3: Visão geral e métricas do acervo
- **Dado** que o painel `/admin/` está aberto
- **Quando** a página carrega
- **Então** exibe cards de métricas atualizadas: total de publicações, total de rascunhos vs publicadas e total de categorias ativas

### AC-4: Criação de nova publicação a partir do admin
- **Dado** que o autor está no painel `/admin/`
- **Quando** clica em "+ Criar Nova Publicação"
- **Então** é redirecionado para `/editor/` com formulário limpo para nova publicação

### AC-5: Pesquisa e listagem de publicações
- **Dado** que o autor está no painel `/admin/` na seção de publicações
- **Quando** digita um termo no campo de pesquisa ou filtra por categoria
- **Então** a lista de publicações é filtrada instantaneamente exibindo título, categoria (badge), território, data e status

### AC-6: Ação de editar publicação a partir da pesquisa
- **Dado** que publicações são exibidas na lista de resultados do `/admin/`
- **Quando** o autor clica em "Editar" em uma publicação específica
- **Então** é redirecionado para `/editor/?slug=<slug>` com os dados da publicação carregados para edição

### AC-7: Gestão de categorias em lista com persistência no JSON
- **Dado** que o autor está na seção de gerenciamento de categorias no `/admin/`
- **Quando** o autor:
  - Adiciona uma categoria preenchendo Nome (Label) e Identificador (Slug)
  - Edita o nome (Label) de uma categoria existente
  - Remove uma categoria com confirmação
- **Então** as alterações são gravadas imediatamente em `src/data/categories.json`, a lista visual é atualizada na hora e o total de categorias é recalculado sem necessidade de manipular JSON bruto

### AC-8: Simplificação do cabeçalho e formulário de `/editor/`
- **Dado** que o autor acessa `/editor/`
- **Quando** visualiza o cabeçalho e o formulário
- **Então**:
  - O antigo `<select>` de listagem de posts no header é substituído por botão "← Painel Admin" e indicador claro de status ("Nova Publicação" ou "Editando: [slug]")
  - O botão/modal de edição de JSON bruto de categorias é removido do formulário do editor, mantendo apenas o seletor das categorias disponíveis com link para gerenciar no Admin

## Casos de borda e erros
- Tentar adicionar categoria sem nome ou identificador → bloqueia com aviso amigável
- Tentar adicionar identificador (slug) duplicado → rejeita informando duplicidade
- Tentar excluir publicação no admin → exibe diálogo de confirmação seguro antes de invocar a remoção
- Busca sem resultados → exibe estado vazio limpo ("Nenhuma publicação encontrada para o termo pesquisado")

## Fora de escopo
- Autenticação com login/senha externa em produção (o painel é estritamente dev-only)
- Edição de campos de frontmatter fora do modelo de categoria e ensaio

## Rastreabilidade
- ADRs relacionados: [ADR-0003](../../docs/architecture/adr/0003-conteudo-local-content-collections.md), [ADR-0002](../../docs/architecture/adr/0002-tech-stack-astro-typescript.md)
