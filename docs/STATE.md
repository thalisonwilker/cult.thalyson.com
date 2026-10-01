---
name: STATE
description: Memória de trabalho volátil — onde paramos, próximo passo, bloqueios.
alwaysApply: true
---

# STATE — Memória viva do projeto

> Memória de trabalho entre sessões. É volátil e atualizada a cada etapa do desenvolvimento.

**Última atualização:** 2026-10-01 por Antigravity

## Em andamento / próximo passo
- **Fase atual:** Kickoff concluído. Constituição do projeto e roadmap do MVP estabelecidos.
- **Próximo passo:** Criar a primeira spec de implementação (`/nova-feature`) para o setup da estrutura base da aplicação (Astro + TypeScript + Design System Vanilla CSS e Content Collections).

## Decisões recentes
- 2026-10-01: Conclusão do Kickoff (Lean Inception + 5 eixos técnicos) — [overview.md](architecture/overview.md)
- 2026-10-01: [ADR-0002](architecture/adr/0002-tech-stack-astro-typescript.md) — Adoção do Astro (SSG) e TypeScript.
- 2026-10-01: [ADR-0003](architecture/adr/0003-conteudo-local-content-collections.md) — Gestão de conteúdo local em Markdown/MDX com Content Collections.
- 2026-10-01: [ADR-0004](architecture/adr/0004-design-system-vanilla-css-editorial.md) — Design System editorial em Vanilla CSS com Custom Properties e temas Dark/Light.
- 2026-10-01: [ADR-0005](architecture/adr/0005-infra-docker-flyio.md) — Infraestrutura e deploy conteinerizado via Docker no Fly.io.

## Bloqueios
- *Nenhum no momento.*

## Ideias adiadas / backlog técnico
- Busca estática indexada com Pagefind (Onda 2).
- Grafo visual de referências cruzadas entre obras e ensaios (Onda 2).

## Todos soltos
- [ ] Inicializar o projeto Astro com as dependências essenciais na raiz/src.
