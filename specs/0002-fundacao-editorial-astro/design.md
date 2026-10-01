---
name: design
description: Technical Design Doc — Fundação Editorial Astro, Design System e Content Collections.
alwaysApply: false
---

# Technical Design Doc — Fundação Editorial Astro & Design System

> **Tier:** arquitetural · **Status:** aprovado
> **Autor:** Antigravity · **Revisores:** Thalyson · **Data:** 2026-10-01

## Links e artefatos
| Artefato                 | Onde        | Link                                                                               |
|--------------------------|-------------|------------------------------------------------------------------------------------|
| Visão do Produto         | docs        | [docs/product/vision.md](../../docs/product/vision.md)                             |
| Overview de Arquitetura  | docs        | [docs/architecture/overview.md](../../docs/architecture/overview.md)               |
| ADR-0002 / 0003 / 0004   | docs        | [docs/architecture/adr/](../../docs/architecture/adr/)                             |
| Tokens de Estilo         | src         | [src/styles/tokens.css](../../src/styles/tokens.css)                               |
| Spec · Product · Domínio | repositório | [`./spec.md`](./spec.md) · [`./product.md`](./product.md) · [`./domain.md`](./domain.md) |

## Contexto da funcionalidade
Esta feature inicializa o codebase executável do `cult.thalyson.com`, implementando a fundação técnica do Astro com TypeScript, o layout de leitura, o Design System com Vanilla CSS e a gestão de conteúdo via Content Collections.

## Goals / Non-goals
**Goals**
- Configurar Astro com TypeScript, scripts de build/dev/check e suporte a markdown/MDX.
- Integrar os design tokens (`src/styles/tokens.css`) com fontes do Google Fonts (`Rye`, `Newsreader`, `Inter`).
- Definir schemas tipados com Zod para a coleção `ensaios` em `src/content/config.ts`.
- Criar componentes de layout editorial: `BaseLayout.astro`, `Header.astro`, `Footer.astro`, `ThemeToggle.astro`.
- Criar página inicial (`src/pages/index.astro`) e rota dinâmica de leitura (`src/pages/ensaios/[slug].astro`).
- Implementar função de domínio para cálculo de tempo de leitura aproximado.

**Non-goals**
- Integração com CMSs remotos ou bancos de dados SQL/NoSQL.
- Mecanismo de busca fulltext dinâmico (reservado para Onda 2).

## Cobertura dos 5 eixos

### 1. Tech stack
- Astro (SSG), TypeScript strict mode, Node.js runtime.
- Validação com Zod (integrado no Astro Content Collections).
- Testes com Vitest.

### 2. Arquitetura base
- Segue DDD tático em camadas:
  - `src/domain/`: Regras de tempo de leitura e tipos de domínio.
  - `src/application/`: Funções de busca, ordenação e categorização de ensaios.
  - `src/infrastructure/`: Carregamento de conteúdo via Astro `getCollection`.
  - `src/interfaces/` / `src/pages/`: Layouts, componentes Astro e páginas.

### 3. Infra
- Build estático padrão com saída em `dist/`.
- Preparado para Dockerfile multi-stage e deploy no Fly.io.

### 4. Qualidade
- `npm run typecheck` (`astro check && tsc --noEmit`).
- Testes unitários para utilitários de domínio com Vitest.
- Testes de build (`npm run build`).

### 5. Observabilidade
- Logs de console estruturados durante build estático.
- Metadados semânticos HTML para Core Web Vitals.

## Solução
| #  | Bloco                            | Descrição                                                                         | Status    |
|----|----------------------------------|-----------------------------------------------------------------------------------|-----------|
| 1  | Setup de Dependências            | `package.json`, `astro.config.mjs`, `tsconfig.json`                              | definido  |
| 2  | Design Tokens & Tipografia       | `src/styles/tokens.css` e importação de fontes (Rye, Newsreader, Inter)           | definido  |
| 3  | Schemas de Content Collections   | `src/content/config.ts` com validação de metadados                               | definido  |
| 4  | Domínio de Leitura               | Cálculo de tempo de leitura (WPM) e formatação de datas em `src/domain/`          | definido  |
| 5  | Layouts & Componentes            | `BaseLayout.astro`, `Header.astro`, `ThemeToggle.astro`, `EssayCard.astro`        | definido  |
| 6  | Páginas & Rotas Dinâmicas        | `index.astro` e `ensaios/[slug].astro`                                            | definido  |
| 7  | Conteúdo de Amostra              | Ensaios de demonstração em `src/content/ensaios/` cobrindo Cinema, Livros, Música  | definido  |

## Alternativas consideradas
- *Adicionar TailwindCSS agora:* Descartado conforme ADR-0004 para manter controle refinado em Vanilla CSS e evitar overhead de compilação.
- *Usar Markdown simples sem Content Collections:* Descartado conforme ADR-0003 para garantir validação de metadados via Zod.
