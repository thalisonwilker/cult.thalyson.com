---
name: spec
description: Contrato da feature 0016 - Dashboard Administrativo Local (127.0.0.1:3001) para métricas e gestão de acervo.
alwaysApply: true
---

# Spec — 0016: Dashboard Administrativo Local

> **Fonte da verdade.** Status: aprovado (2026-10-22)
> Critérios de aceite em formato Given/When/Then executáveis.

## Resumo
A plataforma editorial `cult.thalyson.com` ganha um Dashboard Administrativo moderno e de alta fidelidade visual, executado exclusivamente no processo local de desenvolvimento (`http://127.0.0.1:3001/admin`). O painel provê visão consolidada do acervo (métricas, categorias, destaques e rascunhos), toggle rápido de estrelas da Home com limite de 3 itens, gestão de ideias e transição fluida para o editor de texto, sem poluir a compilação estática do Next.js no GitHub Pages.

---

## Critérios de Aceite

### AC-1: Acesso Exclusivo a Localhost
- **Dado** o servidor de desenvolvimento rodando via `npm run dev` ou `npm run dev:editor`
- **Quando** o desenvolvedor navega para `http://127.0.0.1:3001/admin`
- **Então** o Dashboard Administrativo deve ser carregado com sucesso com cabeçalho de navegação unificado ("Dashboard" e "Editor"), rejeitando conexões externas que não sejam `127.0.0.1` ou `localhost`.

### AC-2: Cards de Métricas Editoriais em Tempo Real
- **Dado** os arquivos de ensaios existentes em `src/content/ensaios/*.md`
- **Quando** a API `/api/admin/metrics` for consultada pelo Dashboard
- **Então** devem ser exibidos cards com:
  1. Total de ensaios publicados
  2. Rascunhos pendentes (`draft: true`)
  3. Destaques da Home (X / 3 ativos)
  4. Distribuição por vertente cultural (Música, Patrimônio, Artes, Literatura)
  5. Tempo médio de leitura do acervo.

### AC-3: Tabela de Publicações com Ações Diretas
- **Dado** a lista de ensaios cadastrados no acervo
- **Quando** a tabela do Dashboard for renderizada
- **Então** deve exibir título, categoria, território, data de publicação, tempo de leitura, badge de rascunho/publicado, botão de toggle de destaque na Home, botão "Editar" (que direciona para o Editor local com `?slug=...`) e botão "Ver no Site" (que abre a rota local do Next.js em `http://127.0.0.1:3000/[category]/[slug]/`).

### AC-4: Toggle Rápido de Destaques da Home com Regra de 3
- **Dado** que a Home suporta no máximo 3 destaques ativos simultâneos
- **Quando** o usuário clica na estrela para destacar uma publicação e já houver 3 destaques
- **Então** a publicação mais antiga em destaque deve ser desmarcada automaticamente, o novo item é marcado com `featured: true`, o arquivo Markdown no disco é salvo e a tabela atualiza a interface com feedback visual.

### AC-5: Gestão de Ideias e Rascunhos Rápidos no Navegador
- **Dado** a seção "Ideias & Pautas" do Dashboard
- **Quando** o usuário registra uma nota rápida (com título e anotação)
- **Então** ela é salva no armazenamento local do navegador e oferece um botão "Transformar em Ensaio", que redireciona para o Editor com o título e lead pré-preenchidos.

### AC-6: Isolamento Estrito de Produção
- **Dado** a execução do comando `npm run build`
- **Quando** o processo de exportação estática finalizar
- **Então** o diretório `./out` não deve conter nenhum artefato, script ou rota do Dashboard Admin (`/admin`), preservando a exportação estática pura para o GitHub Pages.

---

## Fora de Escopo
- Autenticação por login/senha em nuvem ou banco de dados externo (o ambiente é 100% local, protegido por binding em `127.0.0.1` e token CSRF).
- Exposição do painel em produção no GitHub Pages.
- Edição visual de blocos complexos dentro do Dashboard (a edição ocorre no Editor já disponível na rota `/` do mesmo servidor).
