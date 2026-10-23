---
name: product
description: PRD-lite da feature 0015 - Migração do Astro para Next.js (export estático no GitHub Pages). Puxe ao trabalhar nesta feature.
alwaysApply: false
---

# Product — 0015: Migração do Astro para Next.js

> **Tier:** arquitetural · **Status:** aprovado (2026-10-22) · **Dono:** Thalyson
> Responde: **por quê** e **para quem**. Mantenha em 1 página.

## Problema
O `cult.thalyson.com` é o único projeto pessoal do autor em Astro; o `thalisonwilker` já é Next.js
(App Router, export estático, editor local só de dev). Manter duas stacks diferentes para sites
editoriais equivalentes dobra o custo de manutenção, impede reaproveitar padrões e componentes e
torna cada sessão de trabalho (humana ou de agente) mais cara em contexto.

Sintoma que motivou a abertura: em `https://thalisonwilker.github.io/cult.thalyson.com/` o CSS e as
imagens não carregam. **Diagnóstico registrado:** a causa é o *base path* (assets em `/_astro/...`
pedidos na raiz de `github.io`), não o framework — Next.js exige o mesmo ajuste (`basePath`). A
migração resolve o sintoma **apenas porque** inclui `basePath` configurável no escopo; ela não é
pré-requisito para corrigi-lo.

## Para quem
- **Autor/mantenedor (Thalyson):** único dev; publica ensaios pelo editor local e faz deploy via push.
- **Leitores:** visitantes de `cult.thalyson.com` — não devem perceber diferença alguma.

## Resultado esperado / métrica de sucesso
- Stack unificada: `cult.thalyson.com` e `thalisonwilker` no mesmo framework (Next.js App Router,
  `output: 'export'`). Baseline: 2 stacks → Alvo: 1.
- Paridade: 100% das URLs públicas atuais geradas com o mesmo caminho (baseline: 10 páginas no build atual).
- Deploy: site carrega com CSS/imagens em `cult.thalyson.com` **e** em `thalisonwilker.github.io/cult.thalyson.com/`.
- Gates verdes: typecheck, testes unitários (≥ os 30 atuais portados) e build estático.

## Goals
- Migrar 1:1 site público, editor e painel admin locais para Next.js.
- Preservar URLs, visual, conteúdo (Markdown em `src/content/ensaios/`) e frontmatter.
- `basePath` configurável por variável de ambiente (vazio no domínio próprio; `/cult.thalyson.com` no `github.io`).
- Editor/admin como ferramenta **só de dev** (fora do export), como no `thalisonwilker`.
- Deploy no GitHub Pages via o workflow existente, publicando `./out`.

## Non-goals
- Redesign visual, mudança de estrutura editorial ou de URLs.
- Novas features de conteúdo, CMS remoto, autenticação ou backend em produção.
- Migrar o design system de Vanilla CSS para Tailwind/CSS-in-JS.
- Compartilhar código entre os dois repositórios (monorepo/pacote) — só alinhar a stack.

## Riscos / premissas
- **Premissa:** o export estático do Next.js cobre todas as páginas atuais (todas são SSG hoje).
- **Risco:** o editor/admin depende de um middleware Vite (`/api/editor`); no Next precisa virar um
  servidor de dev separado (padrão `scripts/dev.mjs` do `thalisonwilker`) — maior parte do esforço.
- **Risco:** reescrever ~6.400 linhas de `.astro` pode introduzir regressões visuais sutis.
- **Risco:** `next/font/google` + Turbopack já causou erro no `thalisonwilker`; evitar ou isolar.
- **Decisão irreversível:** substitui o ADR-0002 (Astro) → exige novo ADR.
