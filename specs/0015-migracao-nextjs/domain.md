---
name: domain
description: Modelo DDD da feature 0015 - Entidades editoriais e vocabulário ubíquo na migração Next.js.
alwaysApply: false
---

# Domain Model (DDD) — 0015: Migração para Next.js

> Responde: qual a **linguagem** e o **modelo** do negócio.
> Mantém o core editorial desacoplado de framework (`src/domain/`).

## Bounded Context
- **Contexto:** Publicação Editorial & Curadoria Cultural (`cult.thalyson.com`).
- **Subdomínio:** Core (plataforma de publicação de ensaios e patrimônio imaterial paraense).

## Linguagem ubíqua
| Termo | Definição | NÃO confundir com |
|---|---|---|
| **Ensaio (`Essay`)** | Artigo textual aprofundado com metadados editoriais (título, categoria, território, lead, fontes). | Post simples ou notícia rápida. |
| **Categoria Cultural** | Eixo temático do ensaio: `musica`, `patrimonio`, `artes`, `literatura`. | Tag avulsa ou territorialidade. |
| **Território** | Escopo geográfico-cultural do ensaio: `para`, `nacional`, `global`. | Categoria temática ou localidade municipal. |
| **Destaque (`Featured`)** | Seleção manual curada de até 3 ensaios marcados com `featured: true` para o topo da Home. | Ordenação puramente cronológica. |
| **Editor Local** | Ferramenta de dev em processo isolado (`127.0.0.1:3001`) para rascunho e gravação de arquivos Markdown. | CMS de produção ou backend remoto. |

## Agregados, entidades e value objects
- **Agregado `Essay` (Ensaio)**
  - Identificador: `slug` (kebab-case único derivado do nome do arquivo Markdown).
  - Value Objects:
    - `Category`: `musica` | `patrimonio` | `artes` | `literatura`
    - `Territory`: `para` | `nacional` | `global`
    - `ReadingTime`: Tempo estimado de leitura em minutos e contagem de palavras (`domain/reading-time.ts`).
    - `Source`: Referência bibliográfica ou link de consulta.
  - Invariantes:
    - O título e a descrição são obrigatórios e não-vazios.
    - Data de publicação (`pubDate`) deve ser válida.
    - Ensaios marcados como `draft: true` não são emitidos no build estático de produção.

## Regras de Camadas (DDD Tático)
- `src/domain/` não importa Next.js, React, Astro ou I/O de disco.
- `src/infrastructure/content-repository.ts` implementa a leitura do sistema de arquivos e parsing do frontmatter com Zod.
- Componentes React em `src/components/` apenas consomem tipos e funções puras do domínio.
