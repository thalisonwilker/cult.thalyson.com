---
name: architecture-overview
description: Arquitetura do sistema nos 5 eixos + segurança e operacional. Puxe ao trabalhar em arquitetura, infra, qualidade, observabilidade ou segurança.
alwaysApply: false
---

# Arquitetura do Sistema — cult.thalyson.com

> Visão **consolidada** do sistema pelos 5 eixos (+ segurança e operacional).

## 1. Tech stack
- **Framework & Runtime:** [Astro](https://astro.build/) com TypeScript (strict mode) em Node.js / Bun runtime.
- **Renderização:** Static Site Generation (SSG) com pré-renderização estática e páginas ultra velozes.
- **Estilização:** Vanilla CSS modular com Custom Properties (CSS variables) para tokens de design e temas claro/escuro.
- **Decisão:** [ADR-0002](adr/0002-tech-stack-astro-typescript.md) e [ADR-0004](adr/0004-design-system-vanilla-css-editorial.md)

## 2. Arquitetura base
- **Estilo:** Arquitetura de Conteúdo Orientada a Componentes com Astro Content Collections.
- **Camadas DDD:**
  - `domain/`: Regras de cálculo de leitura, esquemas de validação Zod para ensaios, obras e taxonomias.
  - `application/`: Serviços de busca de ensaios, ordenação, paginação e resolução de referências cruzadas.
  - `infrastructure/`: Leitura de arquivos do sistema de arquivos via Astro Content API, geradores de RSS e Sitemap.
  - `interfaces/`: Páginas Astro, componentes de UI reutilizáveis e layouts editoriais.
- **Context Map:** [context-map.md](context-map.md) · **Diagramas:** [diagrams.md](diagrams.md)
- **Decisão:** [ADR-0003](adr/0003-conteudo-local-content-collections.md)

## 3. Infra
- **Hospedagem & Nuvem:** [Fly.io](https://fly.io) com runtime conteinerizado em Docker.
- **Ambientes:** Local (dev/preview) e Produção (Fly.io).
- **Modelo de Deploy:** Build estático servido por servidor web leve (ou Nginx / Caddy / Node static server) dentro de imagem Alpine Docker.
- **Decisão:** [ADR-0005](adr/0005-infra-docker-flyio.md)

## 4. Qualidade
- **Estratégia de Testes:**
  - Testes Unitários de utilitários e regras de domínio via Vitest.
  - Testes de Aceite e validação de páginas / rotas via Playwright / Vitest.
  - Validação estática de Tipos (`astro check` e `tsc --noEmit`).
  - Linting e formatação de código com Biome ou ESLint.
- **Comandos e gates:** [TESTING.md](../engineering/TESTING.md)

## 5. Observabilidade
- **Logs Estruturados:** Logs de build e deploy no console do Docker/Fly.io.
- **Métricas:** Core Web Vitals (LCP, CLS, INP) e tempo de compilação.
- **SLO Inicial:** 99.9% de uptime e LCP < 1.0s.

## 6. Segurança
- **Segurança Estática:** Ausência de banco de dados aberto ou autenticação de terceiros elimina vetores de SQL Injection e vazamento de sessão.
- **Headers de Segurança:** CSP (Content Security Policy), HSTS, X-Content-Type-Options configurados no servidor web estático.
- **Gestão de Segredos:** Tokens de deploy mantidos em secrets do Fly.io ou CI, nunca no repositório.

## 7. Operacional
- **Deploy:** Push para a branch principal dispara o build do container e release no Fly.io.
- **Rollback:** Rollback instantâneo para versões anteriores via `fly deploy --image` ou histórico de releases.
