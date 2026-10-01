---
name: features
description: Inventário de funcionalidades classificadas e sequenciadas em ondas (MVP). Puxe ao priorizar o roadmap ou abrir features.
alwaysApply: false
---

# Funcionalidades do Produto — cult.thalyson.com

> Brainstorm + classificação + **sequenciamento** (Lean Inception). Cada funcionalidade nasce de uma jornada (`journeys.md`). A **Onda 1 = MVP** (`mvp-canvas.md`).

## Inventário e classificação

| #  | Funcionalidade                                | Jornada | Esforço | Valor | Confiança | UX     | Onda |
|----|-----------------------------------------------|---------|---------|-------|-----------|--------|------|
| 1  | Catálogo de Ensaios com Content Collections   | J1, J3  | Baixo   | Alto  | Alta      | Alta   | 1    |
| 2  | Visualizador de Ensaio (Leitura Editorial)    | J1      | Baixo   | Alto  | Alta      | Crítica| 1    |
| 3  | Sistema de Temas (Claro / Escuro / Séphia)    | J1      | Baixo   | Médio | Alta      | Alta   | 1    |
| 4  | Taxonomia e Categorização (Cinema, Livros...) | J2      | Baixo   | Alto  | Alta      | Alta   | 1    |
| 5  | Feed RSS / Atom para leitores de feed         | J1      | Baixo   | Médio | Alta      | Média  | 1    |
| 6  | Referências Cruzadas e Obras Relacionadas     | J1, J2  | Médio   | Alto  | Alta      | Alta   | 2    |
| 7  | Busca textual local / indexada (Pagefind)     | J2      | Médio   | Médio | Média     | Alta   | 2    |
| 8  | Fichas de Obras Culturais (Cinema/Livros)     | J2      | Médio   | Médio | Média     | Média  | 2    |
| 9  | Listas Temáticas e Guias de Leitura/Sessão    | J2      | Médio   | Médio | Média     | Média  | 3    |
| 10 | Newsletter estática / Inscrição por email     | J1      | Médio   | Baixo | Baixa     | Média  | 3    |

## Sequenciador (ondas)

- **Onda 1 (MVP):**
  - Setup do projeto Astro + TypeScript + Vanilla CSS Design System editorial.
  - Content Collections tipadas para ensaios e resenhas (com validação Zod).
  - Home editorial com ensaios em destaque, listagem por data e filtros por categoria.
  - Página de leitura de ensaio com tipografia otimizada, tempo de leitura e metadados SEO/OpenGraph.
  - Alternador de tema (Dark/Light).
  - Geração de Feed RSS e Sitemap.
  - Pipeline de build Docker e deploy no Fly.io.
  - *Hipótese a validar:* Experiência de leitura de alta performance e sem distrações atrai e engaja leitores qualificados.

- **Onda 2:**
  - Referências cruzadas entre ensaios e obras (recomendações contextuais).
  - Busca estática ultra rápida com Pagefind.
  - Páginas dedicadas para obras com histórico de ensaios que as citam.

- **Onda 3:**
  - Guias temáticos e coleções curadas.
  - Assinatura de novidades / integração opcional.
