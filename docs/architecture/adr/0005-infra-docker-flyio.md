---
name: adr-0005
description: Infraestrutura e Deploy com Docker e Fly.io.
alwaysApply: false
---

# ADR-0005: Infraestrutura e Deploy com Docker no Fly.io

- **Status:** aceito
- **Data:** 2026-10-01
- **Decisores:** Antigravity, Thalyson

## Contexto
A plataforma precisa de um ambiente de execução e hospedagem confiável, de baixo custo, reprodutível localmente e com suporte a contêineres Docker e roteamento global rápido.

## Decisão
Vamos empacotar a aplicação via **Dockerfile multi-stage** e realizar o deploy na plataforma **Fly.io**:
- Multi-stage build (stage 1: build dos assets estáticos; stage 2: servidor estático leve em Alpine / Nginx ou Caddy / Node runtime).
- Alternativas descartadas:
  - *Hospedagem estática pura exclusiva (Vercel/Netlify)*: Cria acoplamento a plataformas proprietárias de hosting.
  - *VPS tradicional sem contêiner*: Dificulta a reprodutibilidade de ambiente entre desenvolvedores e servidores de produção.

## Consequências
- **+** Reprodutibilidade absoluta de ambiente via Docker.
- **+** Deploy simples e resiliente no Fly.io via `fly.toml`.
- **+** Facilidade de migração para qualquer outro provedor de contêiner se necessário.
- **−** Necessidade de manutenção do Dockerfile e configuração de servidor estático.
