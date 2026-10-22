---
name: tasks
description: Tasks da feature 0008 - Identidade visual abridores de letras.
alwaysApply: false
---

# Tasks — 0008: Identidade Visual Inspirada nos Abridores de Letras Fluviais

> **Gate executável:** `npm run typecheck && npm run test:unit && npm run build`

## Lista de Tarefas Atômicas

- [x] **Task 1: Design Tokens Fluviais & Textura Náutica**
  - Atualizar `src/styles/tokens.css` com a paleta oficial (Azul Guajará `#070D22` / `#0B1739`, Branco-vela `#FFF6E5`, Amarelo solar `#F4B63F`, Turquesa `#17A9B8`, Coral `#EC5B5B`).
  - Adicionar tokens de sombra dura artesanal (`--shadow-fluvial-hard`, `--shadow-card-fluvial`) e variáveis de chanfro e filetes.
  - Adicionar textura sutil artesanal em `src/styles/global.css` (opacidade entre 2% e 5%).

- [x] **Task 2: Componente Central da Marca `CultLogo.astro`**
  - Criar componente de logo vetorial (SVG puro, responsivo, nítido e com fundo transparente) exibindo `CULT .thalyson.com`.
  - Estilização inspirada no lettering fluvial paraense dos barcos: letras volumétricas com sombras duras angulares, filetes decorativos centrais/periféricos e acabamento sofisticado.
  - Suportar variantes de tamanho (padrão, compacto/mobile e footer) e acessibilidade com `aria-label`.

- [x] **Task 3: Refatoração do `Header.astro`**
  - Substituir “CULT Belém & Amazônia” e textos antigos pela nova logo `CultLogo.astro`.
  - Posicionar a logo à esquerda e a navegação à direita no desktop em linha única equilibrada.
  - Otimizar versão mobile preservando tamanho legível e drawer acessível.

- [x] **Task 4: Redesenho do `EditorialHero.astro` e Botão em Estilo Placa de Barco**
  - Aumentar nitidez, contraste e saturação da fotografia da Estação das Docas, eliminando sobreposições escuras uniformes que apagam a imagem.
  - Aplicar gradiente direcional suave `linear-gradient(90deg, rgba(7,13,34,.92) 0%, rgba(7,13,34,.65) 35%, rgba(7,13,34,.10) 70%, transparent 100%)`.
  - Adicionar pequenos filetes ornamentais inspirados nos abridores de letras contornando o título com elegância.
  - Redesenhar completamente o botão CTA "Explorar histórias" no formato de pequena placa pintada de barco amazônico (fundo `#F4B63F`, texto `#070D22`, borda `2px solid #FFF6E5`, box-shadow `5px 5px 0 #17A9B8`, cantos chanfrados, hover com deslocamento de 2px e redução da sombra).

- [x] **Task 5: Divisores de Seção com Filetes Ornamentais Náuticos**
  - Atualizar `src/styles/global.css` e seções (`FeaturedStories.astro`, `CategoryNavigation.astro`, `ParaSection.astro`, `index.astro`) com filetes gráficos moderados (ondas, traços duplos de embarcação e estrelas estilizadas).

- [x] **Task 6: Detalhes Fluviais nos Cards (`EssayCard.astro` & `FeaturedStories.astro`)**
  - Implementar nos cards editoriais os detalhes da identidade no hover: borda inferior coral ou turquesa, deslocamento sutil, pequenos detalhes amarelos e sombras sólidas curtas.

- [x] **Task 7: Refatoração do `Footer.astro`**
  - Integrar versão reduzida da nova logo `CultLogo.astro`.
  - Preservar manifesto pessoal autoral.
  - Incluir filete ornamental de encerramento como assinatura final.

- [x] **Task 8: Testes Automatizados e Validação Técnica**
  - Criar teste unitário em `src/components/CultLogo.test.ts` para verificar estrutura, acessibilidade e elementos do SVG.
  - Validar toda a aplicação com `npm run typecheck`, `npm run test:unit` e `npm run build`.
