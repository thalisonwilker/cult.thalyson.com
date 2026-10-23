---
name: spec
description: Contrato da feature 0015 - Migração do Astro para Next.js (App Router, static export no GitHub Pages).
alwaysApply: true
---

# Spec — 0015: Migração para Next.js

> **Fonte da verdade.** Status: aprovado (2026-10-22)
> Critérios de aceite em formato Given/When/Then executáveis.

## Resumo
A plataforma editorial `cult.thalyson.com` é refatorada de Astro para Next.js (App Router) com exportação estática pura (`output: 'export'`), preservando o design system Vanilla CSS, corrigindo os filtros da Home no cliente e isolando o editor/admin local em processo de desenvolvimento dedicado.

## Critérios de aceite

### AC-1: Configuração do Next.js e Suporte a BasePath
- **Dado** o arquivo `next.config.mjs` configurado no projeto
- **Quando** o comando `npm run build` for executado
- **Então** o Next.js deve operar em modo `output: 'export'`, com `images: { unoptimized: true }` e `basePath: process.env.NEXT_PUBLIC_BASE_PATH || ''`.

### AC-2: Infraestrutura de Leitura e Parsing de Markdown
- **Dado** os arquivos de ensaio em `src/content/ensaios/*.md`
- **Quando** o repositório de conteúdo `src/infrastructure/content-repository.ts` for consultado
- **Então** o frontmatter deve ser validado via Zod com o schema oficial de ensaios e o corpo Markdown convertido em HTML seguro com suporte a tags HTML brutas existentes (`p[align="justify"]`, `figure`, links com target).

### AC-3: Preservação 1:1 do Design System Vanilla CSS
- **Dado** o arquivo `app/layout.tsx` (Server Component)
- **Quando** a aplicação for renderizada
- **Então** todos os estilos de `src/styles/*.css` (tokens fluviais, tipografia Fraunces/Noto Sans/Rye/JetBrains Mono via Google Fonts e componentes) devem ser carregados sem auxílio de Tailwind CSS.

### AC-4: Home Page e Filtros Interativos Client-Side
- **Dado** que a Home (`/`) é acessada no site estático publicado
- **Quando** o usuário clica em uma categoria cultural (`/?categoria=musica`) ou território (`/?territorio=para`)
- **Então** a lista de ensaios exibida deve ser filtrada reativamente no cliente via `useSearchParams` (envolvido em `Suspense`), exibindo a contagem e mensagem de estado vazio caso não haja correspondência.

### AC-5: Página de Artigo Canônica e Geração Estática
- **Dado** que existem ensaios publicados com `draft: false`
- **Quando** o build estático for executado
- **Então** `app/[category]/[slug]/page.tsx` deve implementar `generateStaticParams()` gerando um arquivo estático HTML para cada ensaio na rota `/[category]/[slug]/index.html`.

### AC-6: Página 404 Estática
- **Dado** uma requisição a uma URL inexistente
- **Quando** o build for exportado
- **Então** `app/not-found.tsx` deve gerar o arquivo `out/404.html` estilizado de acordo com a identidade visual da revista.

### AC-7: Editor e Admin em Servidor Local Dedicado
- **Dado** o ambiente local de desenvolvimento
- **Quando** o desenvolvedor executa `npm run dev`
- **Então** o Next.js deve iniciar na porta `3000` e o servidor do editor/admin deve iniciar em `http://127.0.0.1:3001` com token de sessão, não gerando nenhuma rota no build de produção.

### AC-8: Build e Artefatos do GitHub Pages
- **Dado** a execução de `npm run build`
- **Quando** a compilação finalizar com sucesso
- **Então** o diretório `./out` deve conter `out/index.html`, `out/CNAME` (`cult.thalyson.com`) e `out/.nojekyll`, sem erros de tipo (`tsc --noEmit`).

## Fora de escopo
- Rota legada `/ensaios/[slug]` (descontinuada).
- Conversão de Vanilla CSS para Tailwind.
- Recursos dinâmicos de backend em produção (banco de dados, comentários, autenticação).
