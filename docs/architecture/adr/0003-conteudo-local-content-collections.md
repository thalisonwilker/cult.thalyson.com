---
name: adr-0003
description: Gestão de conteúdo local com Astro Content Collections.
alwaysApply: false
---

# ADR-0003: Gestão de Conteúdo Local com Content Collections

- **Status:** aceito
- **Data:** 2026-10-01
- **Decisores:** Antigravity, Thalyson

## Contexto
O acervo cultural necessita de tipagem estrita de metadados (título, autor, data, categoria, obras citadas, resumo, tags) e armazenamento versionável diretamente no repositório Git, eliminando dependências de serviços de terceiros e bancos de dados externos vulneráveis a indisponibilidades.

## Decisão
Vamos armazenar os ensaios e resenhas como arquivos Markdown/MDX dentro do diretório `src/content/` utilizando a API de **Content Collections** do Astro com esquemas validados por Zod:
- Toda publicação passa por checagem de tipos estrita no build.
- Alternativas descartadas:
  - *Headless CMS (Strapi / Sanity)*: Custo de manutenção, dependência de rede no build e complexidade de infraestrutura.
  - *Banco de dados relacional (PostgreSQL/MySQL)*: Desnecessário para publicações estáticas e aumentaria o custo e superfície de ataque.

## Consequências
- **+** Versionamento de conteúdo junto ao código fonte via Git.
- **+** Prevenção de quebra de metadados em tempo de compilação.
- **+** Zero latência de banco de dados e custo de armazenamento nulo.
- **−** Modificações de conteúdo exigem commit no repositório Git.
