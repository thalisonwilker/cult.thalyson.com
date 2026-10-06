---
name: spec
description: Contrato da feature 0008 - Refatoração da Identidade Visual com Lettering Fluvial dos Abridores de Letras.
alwaysApply: true
---

# Spec — 0008: Identidade Visual Inspirada nos Abridores de Letras Fluviais da Amazônia

> **Fonte da verdade.** Status: em implementação

## Resumo
Refatorar a identidade visual do **CULT — cult.thalyson.com**, preservando sua estrutura editorial contemporânea e aproximando toda a experiência visual da tradição dos **abridores de letras** dos barcos da Amazônia paraense. A nova marca traz como elemento central a logo **“CULT .thalyson.com”** com fundo transparente e lettering fluvial estilizado com sombras duras e filetes artesanais. O Hero ganha máxima nitidez fotográfica e gradiente direcional suave, o botão de ação principal é redesenhado como uma autêntica **placa náutica ribeirinha** com sombra dura turquesa e borda creme, os divisores de seção recebem filetes ornamentais com moderação e os cards editoriais assumem microinterações inspiradas no acabamento náutico paraense.

---

## Critérios de Aceite (Given / When / Then)

### AC-1: Paleta de Cores e Tokens dos Barcos da Amazônia
- **Dado** o arquivo `src/styles/tokens.css`
- **Quando** os estilos são carregados
- **Então** os tokens devem consagrar a paleta fluvial:
  - Azul Guajará profundo: `#070D22` e `#0B1739`
  - Branco-vela / Creme artesanal: `#FFF6E5` / `#F8F3E8`
  - Amarelo solar: `#F4B63F`
  - Turquesa das marés: `#17A9B8`
  - Coral das aparelhagens: `#EC5B5B`
- **E** tokens de sombra dura artesanal (`--shadow-fluvial-hard`, `--shadow-card-fluvial`) e texturas sutis devem estar declarados.

### AC-2: Nova Logo Central “CULT .thalyson.com” com Lettering Fluvial
- **Dado** o componente de logo vetorial (SVG puro escalável e componente Astro)
- **Quando** for renderizado no Header ou no Rodapé
- **Então** deve exibir “CULT .thalyson.com” com fundo transparente, tipografia de lettering fluvial inspirada na pintura vernacular dos barcos (volume, sombras duras, filetes e ornamentos manuais).
- **E** possuir excelente legibilidade tanto em telas de alta densidade (Retina) quanto em dispositivos móveis, sem distorção.

### AC-3: Header Editorial com Nova Logo e Navegação Harmônica
- **Dado** o cabeçalho no desktop e no mobile
- **Quando** o usuário navega pelo site
- **Então** o texto anterior “CULT Belém & Amazônia” é substituído pela nova logo `CULT .thalyson.com`.
- **E** no desktop a logo fica posicionada à esquerda e a navegação à direita, mantendo o menu simples, acessível e contemporâneo.
- **E** no mobile uma versão proporcionalmente ajustada da logo deve ser exibida, mantendo o drawer acessível.

### AC-4: Hero de Alto Impacto com Imagem Nítida e Ornamentos Fluviais
- **Dado** o Editorial Hero na página inicial
- **Quando** a imagem da Estação das Docas é renderizada
- **Então** qualquer opacidade escura excessiva cobrindo uniformemente a foto deve ser eliminada; a imagem deve apresentar alto contraste, cores vivas, saturação e definição visível.
- **E** a legibilidade do texto deve ser garantida por um gradiente sutil direcional:
  `linear-gradient(90deg, rgba(7,13,34,.92) 0%, rgba(7,13,34,.65) 35%, rgba(7,13,34,.10) 70%, transparent 100%)`.
- **E** a headline “Belém entre arte, música e memória amazônica” deve receber pequenos filetes ou arabescos inspirados nos barcos, mantendo o equilíbrio editorial e a clareza da leitura.

### AC-5: Botão de Ação Principal em Estilo Placa Pintada de Barco
- **Dado** o botão “Explorar histórias” no Hero
- **Quando** renderizado na tela
- **Então** deve se assemelhar a uma placa pintada dos barcos:
  - Fundo amarelo solar (`#F4B63F`) ou coral
  - Texto azul Guajará profundo (`#070D22`)
  - Borda sólida fina em branco-vela/creme (`2px solid #FFF6E5`)
  - Sombra dura turquesa (`5px 5px 0 #17A9B8`)
  - Cantos levemente chanfrados ou corte naval artesanal
  - Tipografia encorpada e de alto contraste
- **Quando** o usuário passa o cursor (hover) ou foca o botão
- **Então** o elemento deve se deslocar 2px para baixo e direita (`translate(2px, 2px)`), reduzir a sombra para `3px 3px 0 #17A9B8`, aumentar levemente a saturação com transição entre 180ms e 220ms, sem uso de efeitos genéricos como glow difuso ou glassmorphism.

### AC-6: Divisores de Seção com Filetes dos Barcos Amazônicos
- **Dado** os divisores editoriais das seções (“Em Destaque”, “Explore a Cultura”, “Belém & Pará”, “Últimas Histórias”)
- **Quando** as seções são renderizadas
- **Então** os títulos devem conter pequenos elementos gráficos inspirados nos filetes e adornos das proas (traços duplos náuticos, ondas, estrelas estilizadas ou folhas abstratas dos abridores de letras).
- **E** devem ser aplicados com sobriedade, mantendo o perfil sofisticado de revista cultural.

### AC-7: Cards Editoriais com Detalhes Fluviais no Hover
- **Dado** os cards editoriais em `EssayCard.astro` e `FeaturedStories.astro`
- **Quando** o leitor interage via hover ou foco
- **Então** os cards devem apresentar acentos da identidade fluvial:
  - Borda inferior ou de destaque em coral ou turquesa;
  - Deslocamento sutil;
  - Sombra sólida curta (`box-shadow: 4px 4px 0 ...`);
  - Sem sombras difusas borradas.

### AC-8: Rodapé com Assinatura da Nova Logo e Filete Final
- **Dado** o componente `Footer.astro`
- **Quando** o leitor atinge o final da página
- **Então** o rodapé exibe a versão reduzida da nova logo `CULT .thalyson.com`.
- **E** preserva a descrição editorial do espaço pessoal de Thalyson.
- **E** adiciona um filete ornamental náutico como assinatura final.

### AC-9: Validação Técnica e Não-Regressão
- **Dado** a suíte de validação do projeto
- **Quando** são executados `npm run typecheck`, `npm run test:unit` e `npm run build`
- **Então** todos os comandos devem finalizar com código 0 (sem erros de tipagem, compilação ou quebra de testes).

---

## Rastreabilidade
- Solicitação do Usuário: Refatoração da identidade visual do CULT inspirada nos abridores de letras fluviais da Amazônia paraense
- Tokens: `src/styles/tokens.css`
- Componente de Marca: `src/components/CultLogo.astro`
- Componentes Atualizados: `src/components/Header.astro`, `src/components/EditorialHero.astro`, `src/components/Footer.astro`, `src/components/FeaturedStories.astro`, `src/components/ParaSection.astro`, `src/components/EssayCard.astro`, `src/components/CategoryNavigation.astro`
- Páginas: `src/pages/index.astro`, `src/pages/ensaios/[slug].astro`
