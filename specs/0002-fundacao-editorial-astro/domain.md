---
name: domain
description: Modelo DDD da fundação editorial, ensaios e taxonomias.
alwaysApply: false
---

# Domain Model (DDD) — Fundação Editorial & Ensaios

> Responde: qual a linguagem e o modelo de negócio da fundação do `cult.thalyson.com`.

## Bounded Context
- **Nome:** `Editorial & Ensaios` (Core Subdomain)
- **Responsabilidade:** Curadoria, estrutura do ensaio, cálculo de leitura e apresentação de textos culturais.

## Linguagem ubíqua
| Termo                     | Definição                                                                         | NÃO confundir com                                |
|---------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------|
| **Ensaio**                | Publicação autoral crítica com metadados estruturados e corpo em Markdown/MDX.    | Post rápido de rede social                       |
| **Categoria Cultural**    | Classificação maior: `cinema`, `literatura`, `musica`, `ensaios`, `artes`.        | Tag granular                                     |
| **Tempo de Leitura**      | Minutos estimados de leitura baseado no total de palavras (média de 200 WPM).     | Tempo de permanência do visitante na página      |
| **Design System**         | Conjunto de tokens CSS, tipografia e temas (Light/Dark) aplicados na interface.   | Framework CSS externo                            |

## Agregados, entidades e value objects
- **Agregado Ensaio (Raiz: `Essay`)**
  - **Identificador (ID / Slug):** string única baseada no nome do arquivo.
  - **Metadados (`EssayMetadata` - Value Object):**
    - `title`: string não vazia.
    - `description`: resumo/lead do ensaio (string).
    - `pubDate`: data de publicação válida (`Date`).
    - `category`: enum (`cinema` | `literatura` | `musica` | `ensaios` | `artes`).
    - `author`: string (default: "Thalyson").
    - `tags`: lista de strings.
    - `draft`: boolean (se true, não aparece em produção).
  - **Invariantes:**
    - Todo ensaio publicado deve conter título, data e categoria válida.
    - O tempo de leitura não pode ser menor que 1 minuto para textos não vazios.

## Relações com outros contextos
- **Taxonomia & Obras:** O ensaio faz referência a categorias pré-definidas (`Published Language`).
- **Distribuição (RSS/Sitemap):** O agregador de feed consome a lista de ensaios ordenados por `pubDate` decrescente.
