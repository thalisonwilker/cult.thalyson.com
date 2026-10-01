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
- **Paleta de Cores Principais (Acentos & Identidade Editorial):**
  - Vermelhos / Corais: `Fusion Red` (`#fc5c65`) e `Desire` (`#eb3b5a`)
  - Laranjas: `Orange Hibiscus` (`#fd9644`) e `Beniukon Bronze` (`#fa8231`)
  - Amarelos / Ouro: `Flirtatious` (`#fed330`) e `NYC Taxi` (`#f7b731`)
  - Verdes: `Reptile Green` (`#26de81`) e `Algal Fuel` (`#20bf6b`)
  - Teal / Turquesa: `Maximum Blue Green` (`#2bcbba`) e `Turquoise Topaz` (`#0fb9b1`)
- Tipografia rica e modular (Serif para long-form e Sans para UI).
- Cores de fundo e superfícies contrastadas para temas Claro e Escuro.
- Estilos encapsulados por componente e arquivo global de tokens (`src/styles/tokens.css`).
- Alternativas descartadas:
  - *TailwindCSS*: Cria dependência de compilação adicional e classes utilitárias que podem poluir o HTML de componentes puramente semânticos.
  - *CSS-in-JS (Styled-Components / Emotion)*: Adicionaria overhead de runtime JavaScript incompatível com a proposta SSG de alto desempenho.

## Consequências
- **+** Controle artesanal e flexibilidade estética máxima.
- **+** Zero dependências externas de compilação de CSS.
- **+** Bundle CSS leve e performático.
- **−** Exige escrita disciplinada de CSS estruturado.
