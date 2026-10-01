---
name: spec
description: Contrato da feature 0002 - Fundação Editorial Astro e Design System.
alwaysApply: true
---

# Spec — 0002: Fundação Editorial Astro & Design System

> **Fonte da verdade.** Status: aprovado

## Resumo
Inicializar o ecossistema Astro com TypeScript, estruturar o Design System Vanilla CSS com os tokens oficiais de cores e tipografia (Rye, Newsreader, Inter), configurar as Content Collections tipadas para ensaios e implementar a página inicial e a página de leitura com cálculo de tempo e suporte a temas.

## Critérios de aceite

### AC-1: Inicialização e Compilação Limpa do Astro
- **Dado** o repositório com o projeto configurado com `package.json`, `astro.config.mjs` e `tsconfig.json`
- **Quando** o comando `npm run build` ou `npm run typecheck` for executado
- **Então** a compilação estática (SSG) e a validação de tipos devem finalizar com código de saída 0 e sem erros de TypeScript.

### AC-2: Validação de Schema em Content Collections
- **Dado** a coleção `ensaios` configurada em `src/content/config.ts` com esquema Zod
- **Quando** um ensaio em formato `.md` ou `.mdx` for adicionado com metadados obrigatórios válidos (`title`, `description`, `pubDate`, `category`, `author`, `tags`)
- **Então** o Astro deve validar os dados e expor o ensaio através de `getCollection('ensaios')`.
- **E** ensaios com metadados faltantes ou categorias inválidas devem falhar na checagem de tipos.

### AC-3: Design System Editorial e Tokens de Estilo
- **Dado** o arquivo de tokens `src/styles/tokens.css` com as cores principais (Fusion Red, Orange Hibiscus, Flirtatious, etc.) e fontes (Rye, Newsreader, Inter)
- **Quando** qualquer página for renderizada
- **Então** os elementos tipográficos, variáveis CSS e cores semânticas de categorias devem ser aplicadas corretamente
- **E** o seletor `[data-theme="dark"]` deve inverter os contrastes para leitura noturna confortável.

### AC-4: Alternador de Tema Dinâmico (Theme Toggle)
- **Dado** o componente de alternância de tema no cabeçalho
- **Quando** o usuário clica no botão de alternar tema
- **Então** o atributo `data-theme` do elemento `document.documentElement` deve mudar entre `light` e `dark`
- **E** a preferência deve ser salva no `localStorage` e respeitada no próximo carregamento de página.

### AC-5: Cálculo do Tempo Estimado de Leitura
- **Dado** o texto de um ensaio no domínio
- **Quando** a função `calculateReadingTime(content)` for executada
- **Então** deve retornar o tempo aproximado em minutos considerando uma média de 200 palavras por minuto (mínimo de 1 minuto).

### AC-6: Renderização da Home e Leitura de Ensaio
- **Dado** ensaios publicados no acervo
- **Quando** o usuário acessa `/` (Home)
- **Então** deve visualizar o logotipo estilizado com fonte display (Rye), descrição editorial e a lista de ensaios com categoria, data formatada e resumo.
- **Quando** o usuário clica em um ensaio e acessa `/ensaios/[slug]`
- **Então** deve visualizar o artigo formatado com tipografia editorial (Newsreader), tempo de leitura estimado, tags e cabeçalho completo.

## Casos de borda e erros
- Ensaio marcado como `draft: true`: não deve ser listado na Home em modo produção.
- Texto muito curto (< 200 palavras): deve exibir "1 min de leitura".
- Usuário sem preferência no `localStorage`: deve respeitar a preferência de sistema (`prefers-color-scheme`).

## Fora de escopo
- Sistema de comentários interativos.
- Busca em tempo real com Pagefind (reservado para Onda 2).
- Dashboard administrativo com login (o gerenciamento é via Git/Markdown).

## Rastreabilidade
- Product: [`./product.md`](./product.md)
- Design: [`./design.md`](./design.md)
- Domínio: [`./domain.md`](./domain.md)
- Tasks: [`./tasks.md`](./tasks.md)
- ADRs relacionados: [ADR-0002](../../docs/architecture/adr/0002-tech-stack-astro-typescript.md), [ADR-0003](../../docs/architecture/adr/0003-conteudo-local-content-collections.md), [ADR-0004](../../docs/architecture/adr/0004-design-system-vanilla-css-editorial.md), [ADR-0005](../../docs/architecture/adr/0005-infra-docker-flyio.md)
