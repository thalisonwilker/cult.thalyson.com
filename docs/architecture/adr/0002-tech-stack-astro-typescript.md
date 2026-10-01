---
name: adr-0002
description: Decisão de Tech Stack com Astro e TypeScript.
alwaysApply: false
---

# ADR-0002: Adoção do Astro e TypeScript para a plataforma editorial

- **Status:** aceito
- **Data:** 2026-10-01
- **Decisores:** Antigravity, Thalyson

## Contexto
O projeto `cult.thalyson.com` exige altíssimo desempenho de carregamento, foco absoluto em conteúdo em texto e markdown, excelente SEO e uma experiência de leitura imersiva e sem ruídos. O uso de frameworks pesados de SPA (Single Page Applications) client-side introduziria complexidade desnecessária de hidratação e overhead de JavaScript desnecessário para o leitor.

## Decisão
Vamos utilizar **Astro** com **TypeScript** como framework principal da aplicação:
- Modo SSG (Static Site Generation) com suporte a Content Collections.
- Zero JavaScript no cliente por padrão (Islands Architecture quando necessário para o toggle de temas ou interações pontuais).
- Alternativas descartadas:
  - *Next.js*: Maior complexidade operacional, overhead de runtime de servidor e dependência do ecossistema React para páginas essencialmente estáticas.
  - *Go/Python + Templates*: Menos integrados nativamente com ferramentas modernas de parsing de MDX e ecossistema de componentes visuais web.

## Consequências
- **+** Desempenho de carregamento instantâneo (HTML puro gerado no build).
- **+** Segurança de tipos de ponta a ponta com TypeScript.
- **+** Suporte nativo a Content Collections com validação via Zod.
- **−** Necessidade de compilação/build estático a cada nova publicação.
