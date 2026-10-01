---
name: STATE
description: Memória de trabalho volátil — onde paramos, próximo passo, bloqueios.
alwaysApply: true
---

# STATE — Memória viva do projeto

> Memória de trabalho entre sessões. É volátil e atualizada a cada etapa do desenvolvimento.

**Última atualização:** 2026-10-01 por Antigravity

## Em andamento / próximo passo
- **Feature ativa:** [`specs/0003-portal-cultura-paraense/`](../specs/0003-portal-cultura-paraense/spec.md) — Implementada e validada (todos os gates verdes).
- **Próximo passo:** Explorar a experiência no navegador ou avançar para as próximas features do roadmap (Feed RSS/Sitemap ou Container Docker/Deploy no Fly.io).

## Decisões recentes
- 2026-10-01: Implementação completa da spec `0003-portal-cultura-paraense` — Home page reimaginada com Hero dos pilares culturais do Pará (Carimbó, Guitarrada, Círio, Abridores de Letras), abas de território (Pará & Belém, Brasil, Mundo), novos ensaios regionais e badges de localidade.
- 2026-10-01: Implementação completa da spec `0002-fundacao-editorial-astro` (Astro SSG, Design System Vanilla CSS com paleta vibrante e fontes Google Rye/Newsreader/Inter, Content Collections tipadas e rotas dinâmicas).
- 2026-10-01: Conclusão do Kickoff (Lean Inception + 5 eixos técnicos) — [overview.md](architecture/overview.md)
- 2026-10-01: [ADR-0002](architecture/adr/0002-tech-stack-astro-typescript.md) — Adoção do Astro (SSG) e TypeScript.
- 2026-10-01: [ADR-0003](architecture/adr/0003-conteudo-local-content-collections.md) — Gestão de conteúdo local em Markdown/MDX com Content Collections.
- 2026-10-01: [ADR-0004](architecture/adr/0004-design-system-vanilla-css-editorial.md) — Design System editorial em Vanilla CSS atualizado com a paleta oficial de cores vibrantes (Fusion Red, Orange Hibiscus, Flirtatious, Reptile Green, Maximum Blue Green e variações) e tokens em `src/styles/tokens.css`.
- 2026-10-01: [ADR-0005](architecture/adr/0005-infra-docker-flyio.md) — Infraestrutura e deploy conteinerizado via Docker no Fly.io.

## Bloqueios
- *Nenhum no momento.*

## Ideias adiadas / backlog técnico
- Busca estática indexada com Pagefind (Onda 2).
- Grafo visual de referências cruzadas entre obras e ensaios (Onda 2).

## Todos soltos
- [ ] Inicializar o projeto Astro com as dependências essenciais na raiz/src.
