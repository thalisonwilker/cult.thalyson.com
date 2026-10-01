---
name: project-home
description: Mapa do projeto — índice navegável com link para cada artefato (onde estamos, produto, arquitetura, engenharia, specs, glossário). Porta de entrada de docs/. Gerado/atualizado no /kickoff. Puxe quando precisar achar onde algo mora.
alwaysApply: false
---

# cult.thalyson.com — Mapa do Projeto

> **Porta de entrada da documentação.** Um índice de "onde está cada coisa". Gerado/atualizado no `/kickoff`.

**One-liner do produto:** Plataforma editorial e acervo de curadoria cultural de alta densidade em Astro/TypeScript. · **Status:** Greenfield / MVP

## 🧭 Onde estamos agora
- **Memória de trabalho** (onde paramos, próximo passo, bloqueios) → [STATE.md](STATE.md)
- **Aprendizados & gotchas** (staging volátil que se auto-poda) → [lessons.md](lessons.md)
- **Roadmap** (Now / Next / Later) → [product/roadmap.md](product/roadmap.md)

## 🎯 Produto — por quê e para quem
- **Visão & escopo** → [product/vision.md](product/vision.md)
- **Stakeholders** → [product/stakeholders.md](product/stakeholders.md)
- **Jornadas** → [product/journeys.md](product/journeys.md)
- **Funcionalidades** (classificadas + sequenciadas) → [product/features.md](product/features.md)
- **MVP canvas** → [product/mvp-canvas.md](product/mvp-canvas.md)

## 🏛️ Arquitetura — como, no nível de sistema
- **Overview** (os 5 eixos + segurança + operacional) → [architecture/overview.md](architecture/overview.md)
- **Context map** (bounded contexts e relações) → [architecture/context-map.md](architecture/context-map.md)
- **Diagramas** (Mermaid) → [architecture/diagrams.md](architecture/diagrams.md)
- **ADRs** (decisões duráveis e imutáveis) → [architecture/adr/](architecture/adr/)
  - [ADR-0001: Record Architecture Decisions](architecture/adr/0001-record-architecture-decisions.md)
  - [ADR-0002: Tech Stack Astro e TypeScript](architecture/adr/0002-tech-stack-astro-typescript.md)
  - [ADR-0003: Conteúdo Local com Content Collections](architecture/adr/0003-conteudo-local-content-collections.md)
  - [ADR-0004: Design System Editorial em Vanilla CSS](architecture/adr/0004-design-system-vanilla-css-editorial.md)
  - [ADR-0005: Infraestrutura e Deploy com Docker no Fly.io](architecture/adr/0005-infra-docker-flyio.md)

## 🛠️ Engenharia — como construímos
- **Testes e quality gates** → [engineering/TESTING.md](engineering/TESTING.md)
- **Camada agêntica** (rules, subagents, skills, workflows) → [engineering/agentic-layer.md](engineering/agentic-layer.md)
- **Integrações / MCPs** → [engineering/integrations.md](engineering/integrations.md)
- **Métricas de entrega** → [engineering/metrics.md](engineering/metrics.md)

## 📐 Specs — o contrato de cada feature
> A pasta [`specs/`](../specs/) é a fonte viva das features do sistema.
- [`specs/0001-exemplo-cota-de-uso/`](../specs/0001-exemplo-cota-de-uso/spec.md) — spec de referência/exemplo
- [`specs/0002-fundacao-editorial-astro/`](../specs/0002-fundacao-editorial-astro/spec.md) — Fundação Editorial Astro, Design System & Content Collections (ativa)

## 📖 Linguagem & convenções
- **Glossário** (linguagem ubíqua) → [glossary.md](glossary.md)
- **Constituição p/ agentes de IA** → [../GEMINI.md](../GEMINI.md)
- **Manual da esteira SDD** (fluxo, tiers, DoR/DoD) → [../README.md](../README.md)
