---
name: adr-0004
description: Design System editorial em Vanilla CSS.
alwaysApply: false
---

# ADR-0004: Design System Editorial em Vanilla CSS

- **Status:** aceito
- **Data:** 2026-10-01
- **Decisores:** Antigravity, Thalyson

## Contexto
Uma plataforma editorial de alta qualidade visual necessita de controle tipográfico milimétrico (espaçamentos, contrastes, ritmo vertical, fontes serifadas para leitura longa e sans para interface), animações sutis e alternância dinâmica de temas (Dark / Light) sem dependência excessiva de bibliotecas pesadas de utilitários que inflem o bundle final.

## Decisão
Vamos implementar um **Design System em Vanilla CSS** com CSS Custom Properties (variáveis CSS) estruturado com tokens de design:
- Tipografia rica e modular.
- Cores HSL harmoniosas e tema adaptável com persistência via `localStorage`.
- Estilos encapsulados por componente e arquivo global de tokens (`index.css` / `variables.css`).
- Alternativas descartadas:
  - *TailwindCSS*: Cria dependência de compilação adicional e classes utilitárias que podem poluir o HTML de componentes puramente semânticos.
  - *CSS-in-JS (Styled-Components / Emotion)*: Adicionaria overhead de runtime JavaScript incompatível com a proposta SSG de alto desempenho.

## Consequências
- **+** Controle artesanal e flexibilidade estética máxima.
- **+** Zero dependências externas de compilação de CSS.
- **+** Bundle CSS leve e performático.
- **−** Exige escrita disciplinada de CSS estruturado.
