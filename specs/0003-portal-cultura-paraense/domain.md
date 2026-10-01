---
name: domain
description: Modelo DDD com suporte a território e manifestações da cultura paraense.
alwaysApply: false
---

# Domain Model (DDD) — Cultura Paraense & Territorialidade

> Responde: qual a linguagem e o modelo de negócio da identidade do `cult.thalyson.com`.

## Bounded Context
- **Nome:** `Editorial & Ensaios`
- **Subdomínio:** Core (Diferencial cultural de Belém e Pará com visão ampla)

## Linguagem ubíqua
| Termo                     | Definição                                                                         | NÃO confundir com                                |
|---------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------|
| **Território**            | Âmbito geográfico/cultural do ensaio (`para`, `nacional`, `global`).              | Categoria temática                               |
| **Localidade**            | Cidade ou região específica do Pará (ex: Belém, Ilha do Marajó, Bragança).        | Endereço físico                                  |
| **Manifestação Cultural** | Gênero ou expressão viva (ex: Carimbó, Guitarrada, Tecnobrega, Círio, Ver-o-Peso).| Termo genérico de entretenimento                 |

## Agregados e Value Objects
- **Value Object `Territory`:**
  - `enum`: `'para'` | `'nacional'` | `'global'`
- **Extensão do Agregado `Essay`:**
  - `territory`: Territory (default: `'para'`)
  - `locality`: string opcional (ex: `'Belém'`)
  - `category`: `'musica'` | `'literatura'` | `'cinema'` | `'patrimonio'` | `'gastronomia'` | `'ensaios'`
