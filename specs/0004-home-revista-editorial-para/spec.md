---
name: spec
description: Contrato da feature 0004 - Refatoração Completa da Home como Revista Cultural Digital Contemporânea.
alwaysApply: true
---

# Spec — 0004: Home Revista Cultural Digital Contemporânea

> **Fonte da verdade.** Status: aprovado

## Resumo
Refatorar completamente a página inicial do **CULT.thalyson.com**, transformando o portal em uma **revista cultural digital contemporânea de alto padrão sobre Belém, Pará, artes e cultura amazônica**, em diálogo com o Brasil e o mundo. Elimina a fragmentação do header e o aspecto de dashboard/SaaS, introduzindo uma paleta profunda inspirada na noite amazônica (75% azul-marinho escuro, 15% neutros claros, 10% acentos vibrantes: cobalto, turquesa, dourado, laranja e coral), tipografia com Fraunces e Noto Sans/Inter, hero editorial cinematográfico com headline dominante e blocos modulares bem orquestrados (Em Destaque 2fr/1fr, Explore a Cultura, Belém & Pará, e Últimas Histórias).

---

## Critérios de Aceite (Given / When / Then)

### AC-1: Design Tokens & Universo Cromático Editorial
- **Dado** o arquivo `src/styles/tokens.css`
- **Quando** a aplicação é carregada
- **Então** as variáveis devem centralizar a paleta: background principal `#070D22`, superfície `#0B1739`, superfície secundária `#122046`, azul-cobalto `#2457A6`, turquesa `#17A9B8`, dourado `#F4B63F`, laranja `#F27A32`, coral `#EC5B5B`, texto primário `#E8EDF7` e texto secundário `#9BB0D6`.
- **E** a assinatura visual sutil (gradiente coral → laranja → dourado → turquesa → cobalto) deve estar disponível como token reutilizável.
- **E** nenhum valor hexadecimal deve estar solto diretamente nos componentes.

### AC-2: Header Editorial Integrado em Linha Única
- **Dado** o cabeçalho no desktop (largura > 860px)
- **Quando** o usuário visualiza o topo da página
- **Então** o logo `CULT.thalyson.com` com o subtítulo "Cultura do Pará, Belém & Artes" deve estar à esquerda, a navegação horizontal ("Música", "Patrimônio", "Cinema", "Literatura", "Artes") com links editoriais discretos no centro/direita, e o botão de tema à direita, todos perfeitamente alinhados em uma **única linha**, sem grandes espaços vazios ou quebras.
- **E** a assinatura visual discreta deve figurar na borda inferior do header.

### AC-3: Navegação Mobile Acessível (Drawer / Overlay)
- **Dado** um dispositivo móvel (largura ≤ 860px)
- **Quando** o leitor acessa a página
- **Então** deve ver o logo à esquerda e um botão de menu hambúrguer à direita com atributos `aria-expanded` e `aria-label`.
- **Quando** aciona o botão
- **Então** deve abrir um drawer ou overlay acessível com os links de navegação, foco acessível por teclado e opção de fechamento fácil.

### AC-4: Editorial Hero Cinematográfico com Manchete Dominante
- **Dado** a dobra inicial da Home
- **Quando** a página é renderizada
- **Então** o Hero deve ter proporção consistente (16:9 / 21:9), bordas arredondadas (16px a 24px), imagem com `object-fit: cover` e overlay gradiente escuro que assegure contraste WCAG AA.
- **E** o texto sobreposto deve ser o elemento dominante: categoria pequena ("CULTURA AMAZÔNICA · BELÉM DO PARÁ"), headline expressiva ("Belém entre arte, música e memória amazônica"), descrição curta e CTA discreto ("Explorar histórias →").

### AC-5: Bloco "Em Destaque" com Layout Assimétrico (2fr / 1fr)
- **Dado** a seção "Em destaque" logo abaixo do Hero
- **Quando** visualizada no desktop
- **Então** deve apresentar uma composição assimétrica: 1 matéria principal ampla à esquerda (2fr) e 2 a 3 matérias secundárias em lista editorial à direita (1fr), ambas com fotografia, categoria, título e data.

### AC-6: Bloco "Explore a Cultura" (Vertentes Editoriais)
- **Dado** a seção "Explore a cultura"
- **Quando** o leitor navega pelas 5 categorias
- **Então** cada categoria deve aparecer como link editorial/card tipográfico refinado com ícone e accent color próprio, sem aparência de botões de dashboard ou caixas espremidas.

### AC-7: Seção Temática "Belém & Pará" (Identidade Regional)
- **Dado** a seção dedicada ao Pará e Belém
- **Quando** a seção for exibida
- **Então** deve destacar o patrimônio ribeirinho e as manifestações autênticas (Carimbó, Guitarrada, Círio de Nazaré, Abridores de Letras), enriquecendo o leitor sobre a memória e a arte paraense.

### AC-8: Bloco "Últimas Histórias"
- **Dado** a seção de publicações recentes
- **Quando** o acervo for renderizado
- **Então** os cards devem exibir imagem com proporção controlada, tag de categoria sutil, título em tipografia Fraunces/serif, tempo de leitura e data de publicação, com microinterações suaves (hover com leve scale da imagem e transição de cor).

### AC-9: Tipografia e Layout Responsivo (320px a 2560px)
- **Dado** qualquer resolução entre 320px e 2560px
- **Quando** a página é redimensionada
- **Então** o layout deve manter `max-width: 1280px` centralizado, com padding lateral de 24px no desktop e 16px no mobile, sem nenhum overflow horizontal ou quebra visual.
- **E** os títulos principais devem usar a fonte Fraunces com `clamp()` e o corpo Noto Sans/Inter com line-height ~1.6.

### AC-10: Conformidade de Acessibilidade & Dark/Light Mode
- **Dado** navegação por teclado (Tab, Shift+Tab, Enter)
- **Quando** o usuário percorre a página
- **Então** todos os links, botões e controles interativos devem possuir foco visível claro (`:focus-visible`).
- **E** a alternância entre modo escuro e claro deve continuar 100% funcional sem quebrar o contraste.

---

## Rastreabilidade
- Solicitação do Usuário: Refatoração completa da Home CULT.thalyson.com para Revista Cultural Digital
- Design Tokens: `src/styles/tokens.css`
- Componentes: `src/components/Header.astro`, `src/components/EditorialHero.astro`, `src/components/FeaturedStories.astro`, `src/components/ExploreCulture.astro`, `src/components/ParaSection.astro`, `src/components/StoryCard.astro`
- Página Principal: `src/pages/index.astro`
