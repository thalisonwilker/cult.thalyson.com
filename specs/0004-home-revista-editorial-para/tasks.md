---
name: tasks
description: Tarefas de implementação da feature 0004 - Home Revista Cultural Digital.
alwaysApply: true
---

# Tasks — 0004: Home Revista Cultural Digital Contemporânea

> **Status:** concluído (todos os quality gates aprovados)

## Tarefas de Implementação

- [x] **Task 1: Atualização dos Design Tokens e Tipografia Editorial**
  - Importação das fontes `Fraunces` e `Noto Sans` via Google Fonts em `src/styles/tokens.css`.
  - Tokens centralizados: fundo `#070D22` (75% escuro), superfícies `#0B1739` e `#122046`, neutros claros `#E8EDF7` e `#9BB0D6` (15%), acentos vibrantes do Norte (10%): cobalto `#2457A6`, turquesa `#17A9B8`, dourado `#F4B63F`, laranja `#F27A32` e coral `#EC5B5B`.
  - Assinatura visual em gradiente: `--gradient-cult-signature: linear-gradient(90deg, #EC5B5B, #F27A32, #F4B63F, #17A9B8, #2457A6)`.
  - Max-width de 1280px e escala sistemática de espaçamento (4, 8, 12, 16, 24, 32, 48, 64, 96px).

- [x] **Task 2: Refatoração do Header em Linha Única + Drawer Mobile Acessível**
  - Desktop: logo `CULT.thalyson.com` com subtítulo à esquerda, nav horizontal com links editoriais discretos no centro e seletor de tema à direita, em uma única linha harmoniosa.
  - Mobile: logo à esquerda e menu hambúrguer à direita com drawer acessível por teclado (Escape, Tab, foco).
  - Assinatura visual sutil em gradiente na base do header.

- [x] **Task 3: Criação do Editorial Hero Cinematográfico**
  - Componente `EditorialHero.astro` com suporte visual 21:9 / 16:9, imagem `carimbo-guitarrada-noite.jpg`, overlay gradiente escuro de alto contraste e headline dominante acima da dobra ("Belém entre arte, música e memória amazônica").
  - Tag de categoria pequena, descrição curta e CTA discreto "Explorar histórias →".

- [x] **Task 4: Bloco "Em Destaque" com Composição 2fr / 1fr**
  - Componente `FeaturedStories.astro` com matéria líder ampla (2fr) e coluna secundária com 3 ensaios em lista editorial (1fr).

- [x] **Task 5: Bloco "Explore a Cultura" (Categorias Editoriais)**
  - Componente `CategoryNavigation.astro` apresentando as 5 vertentes como cards tipográficos com acento individual sutil, sem estética de dashboard.

- [x] **Task 6: Bloco Especial "Belém & Pará" (Patrimônio e Tradições)**
  - Componente `ParaSection.astro` destacando a Amazônia Atlântica e os 4 pilares: Carimbó & Dona Onete, Guitarrada & Mestre Vieira, Círio & Sagrado, Abridores de Letras & Tipografia Fluvial.

- [x] **Task 7: Bloco "Últimas Histórias" & Cards Editoriais Aprimorados**
  - Componente `EssayCard.astro` refinado com proporção 16:10, tipografia Fraunces, metadados legíveis e microinterações elegantes.

- [x] **Task 8: Montagem da Home Page em `src/pages/index.astro`**
  - Orquestração dos blocos na Home com espaçamento editorial de 80–100px entre grandes seções e responsividade de 320px a 2560px.

- [x] **Task 9: Verificação e Quality Gates (Testes, Typecheck, Build)**
  - `npm run typecheck` → 0 errors, 0 warnings.
  - `npm run test:unit` → 5/5 testes passando.
  - `npm run build` → 8/8 páginas estáticas geradas com sucesso em 477ms.
