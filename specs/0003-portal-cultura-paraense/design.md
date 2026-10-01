---
name: design
description: Technical Design Doc — Nova Home e Arquitetura Cultural Paraense.
alwaysApply: false
---

# Technical Design Doc — Nova Home e Arquitetura Cultural Paraense

> **Tier:** arquitetural · **Status:** aprovado
> **Autor:** Antigravity · **Revisores:** Thalyson · **Data:** 2026-10-01

## Contexto da funcionalidade
A Home page precisa refletir o posicionamento de **Polo de Curadoria da Cultura do Pará e de Belém**, combinando:
- Hero expressivo com tipografia display (Rye) e homenagem à estética fluvial e azulejista de Belém.
- Seletor de Território / Escopo: `Todo o Acervo`, `Pará & Belém`, `Nacional`, `Global`.
- Carrossel / Grade de Destaques Culturais do Pará (Carimbó, Guitarrada, Tecnobrega, Círio, Ver-o-Peso).
- Seção de Ensaios Globais & Nacionais para manter a perspectiva universal sem perder a raiz regional.

## Cobertura dos 5 eixos

### 1. Tech stack
- Astro (SSG), TypeScript strict, Vanilla CSS com CSS Custom Properties.
- Zod schema estendido para metadados territoriais (`territory`: `'para'` | `'nacional'` | `'global'`).

### 2. Arquitetura base
- **Domínio:**
  - `territory`: `'para'` | `'nacional'` | `'global'`
  - `category`: `'musica'`, `'literatura'`, `'cinema'`, `'patrimonio'`, `'gastronomia'`, `'ensaios'`
  - `locality`: string opcional (ex: `'Belém'`, `'Barcarena'`, `'Marajó'`, `'Bragança'`).
- **Interfaces:**
  - `src/components/ParaHighlightHero.astro`: Destaque imersivo com cores solares e ribeirinhas.
  - `src/components/TerritoryFilter.astro`: Filtros rápidos de território e tema.
  - `src/components/EssayCard.astro`: Atualizado com badge de território e localidade.
  - `src/pages/index.astro`: Nova composição modular.

### 3. Infra
- Zero impacto adicional de infraestrutura; tudo pré-renderizado estaticamente em SSG.

### 4. Qualidade
- Validação de tipagem estrita com `npm run typecheck`.
- Testes unitários atualizados em Vitest.

### 5. Observabilidade
- Metatags OpenGraph atualizadas para `CULT — Cultura do Pará, Belém & Artes`.

## Solução
| #  | Bloco                             | Descrição                                                                      | Status    |
|----|-----------------------------------|--------------------------------------------------------------------------------|-----------|
| 1  | Extensão do Schema de Conteúdo    | Adicionar `territory` e `locality` no Zod schema de `src/content/config.ts`     | definido  |
| 2  | Componente Hero Paraense          | Criar hero editorial temático sobre a cultura do Pará e Belém                  | definido  |
| 3  | Componente de Filtragem por Escopo| Navegação em abas: `Todos`, `Pará & Belém`, `Arte Nacional`, `Mundo`           | definido  |
| 4  | EssayCard Aprimorado              | Adicionar badges de localidade e categoria                                     | definido  |
| 5  | Ensaios Paraenses Inaugurais      | Escrever ensaios sobre Carimbó/Dona Onete, Guitarrada e o Círio de Nazaré      | definido  |
| 6  | Recomposição da Home              | Integrar seções na `src/pages/index.astro`                                     | definido  |
