---
name: spec
description: Contrato da feature Organização de URLs por Categoria e Correção de Portas em Redirecionamentos (0010). Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec 0010 — URLs por Categoria e Correção de Portas em Redirecionamentos

> **Fonte da verdade.** Status: implementado
> Os critérios de aceite são (a) o contrato com o negócio, (b) o oráculo de teste,
> (c) o prompt para o agente de IA implementar.

## Resumo
Organizar as URLs de publicações pela sua categoria cultural (`/{categoria}/{slug}/` em vez de `/ensaios/{slug}/`) e eliminar a injeção indesejada de portas de acesso internas (como `:8080` ou `:3000`) em redirecionamentos em produção via configuração do Nginx (`port_in_redirect off`, `absolute_redirect off`) e padronização com trailing slash no Astro.

## Critérios de aceite

### AC-1: Roteamento Canônico por Categoria
- **Dado** uma publicação em `src/content/ensaios/[slug].md` com categoria cultural `category: [categoria]` (ex: `category: "patrimonio"`, `slug: "as-14-procissoes-do-cirio-de-nazare"`)
- **Quando** a aplicação estática for gerada (`npm run build`) ou executada
- **Então** a publicação deve estar disponível e ser servida na rota canônica `/[categoria]/[slug]/` (ex: `/patrimonio/as-14-procissoes-do-cirio-de-nazare/`), e a tag `<link rel="canonical">` deve apontar exatamente para `https://cult.thalyson.com/[categoria]/[slug]/`.

### AC-2: Redirecionamento Retroativo de `/ensaios/[slug]/`
- **Dado** uma publicação existente cuja categoria cultural seja diferente de `ensaios`
- **Quando** um usuário ou indexador acessar a URL legada `/ensaios/[slug]/`
- **Então** deve ser servida uma página de redirecionamento com meta-refresh e substituição via script de cliente (`window.location.replace`) apontando para `/[categoria]/[slug]/`, preservando links antigos sem quebrar a navegação.

### AC-3: Padronização de Links Internos com Trailing Slash
- **Dado** qualquer componente que exiba links para publicações (`EssayCard`, `FeaturedStories`, painel `/admin/`, etc.)
- **Quando** o HTML for renderizado
- **Então** os atributos `href` devem usar a URL canônica `/[categoria]/[slug]/` sempre com barra final (`/`), evitando requisições que forcem redirecionamentos de diretório pelo servidor web.

### AC-4: Prevenção de Portas em Redirecionamentos no Nginx
- **Dado** o servidor web Nginx configurado em `nginx.conf` escutando internamente na porta desprivilegiada 8080
- **Quando** qualquer requisição for recebida sem barra final para um diretório ou acionar redirecionamento HTTP
- **Então** as diretivas `port_in_redirect off;` e `absolute_redirect off;` devem garantir que o cabeçalho de resposta `Location` seja relativo e nunca contenha portas de acesso (como `:8080` ou `:3000`).

### AC-5: Configuração de Trailing Slash no Astro
- **Dado** o arquivo `astro.config.mjs`
- **Quando** o projeto for construído
- **Então** a diretiva `trailingSlash: 'always'` deve estar ativada em conjunto com `build: { format: 'directory' }`.

### AC-6: Função de Domínio Pura para Rotas de Publicação
- **Dado** o módulo `src/domain/routes.ts`
- **Quando** invocado `getEssayUrl(category, slug)`
- **Então** deve retornar a URL higienizada e formatada com trailing slash no padrão `/${category}/${slug}/`, validado por testes unitários em `src/domain/routes.test.ts`.

## Matriz de decisão

| Categoria do Ensaio | Rota Canônica Gerada | Redirecionamento em `/ensaios/[slug]/` | AC |
|---|---|---|---|
| `patrimonio` | `/patrimonio/[slug]/` | Sim (redireciona para `/patrimonio/[slug]/`) | AC-1, AC-2 |
| `musica` | `/musica/[slug]/` | Sim (redireciona para `/musica/[slug]/`) | AC-1, AC-2 |
| `artes` | `/artes/[slug]/` | Sim (redireciona para `/artes/[slug]/`) | AC-1, AC-2 |
| `cinema` | `/cinema/[slug]/` | Sim (redireciona para `/cinema/[slug]/`) | AC-1, AC-2 |
| `literatura` | `/literatura/[slug]/` | Sim (redireciona para `/literatura/[slug]/`) | AC-1, AC-2 |
| `ensaios` | `/ensaios/[slug]/` | Não necessário (a própria rota canônica é `/ensaios/[slug]/`) | AC-1 |

## Casos de borda e erros
- Categoria com espaços ou caracteres maiúsculos no frontmatter: deve ser normalizada em minúsculas e URI encoded via `getEssayUrl`.
- Requisições sem barra final em subdiretórios no Nginx: `absolute_redirect off` emite `Location: /caminho/` relativo, impedindo que a porta 8080 do Docker/Fly apareça no navegador.
- Ensaio com `draft: true`: não deve gerar rota canônica pública e não deve ser listado em `getStaticPaths`.

## Fora de escopo
- Alteração da taxonomia de categorias em `src/data/categories.json`.
- Modificação do layout visual ou design da leitura do artigo.

## Rastreabilidade
- Domínio: `src/domain/routes.ts`
- Rota Canônica: `src/pages/[category]/[slug].astro`
- Rota Legada: `src/pages/ensaios/[slug].astro`
- Servidor Web: `nginx.conf`
- Configuração Astro: `astro.config.mjs`
