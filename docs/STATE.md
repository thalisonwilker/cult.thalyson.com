---
name: STATE
description: Memória de trabalho volátil — onde paramos, próximo passo, bloqueios.
alwaysApply: true
---

# STATE — Memória viva do projeto

> Memória de trabalho entre sessões. É volátil e atualizada a cada etapa do desenvolvimento.

**Última atualização:** 2026-10-06 por Antigravity

## Em andamento / próximo passo
- **Feature concluída:** [`specs/0010-urls-por-categoria-e-correcao-portas/`](../specs/0010-urls-por-categoria-e-correcao-portas/spec.md) — **URLs por Categoria e Correção de Portas em Redirecionamentos**:
  1. URLs canônicas organizadas pela categoria cultural (`/{category}/{slug}/`, ex: `/patrimonio/as-14-procissoes-do-cirio-de-nazare/`), implementadas em rota dinâmica `src/pages/[category]/[slug].astro` e função de domínio pura `src/domain/routes.ts` com trailing slash.
  2. Redirecionamento retroativo de URLs legadas (`/ensaios/[slug]/`) com meta-refresh e substituição via script de cliente (`window.location.replace`) preservando links antigos.
  3. Prevenção de anexação de portas de acesso internas (`:8080`, `:3000`) em produção através das diretivas `port_in_redirect off;` e `absolute_redirect off;` no `nginx.conf` e `trailingSlash: 'always'` no `astro.config.mjs`.
  4. Todos os links internos e componentes (`EssayCard`, `FeaturedStories`, `/admin/`, `ParaHighlightHero`, `ParaSection`) atualizados com trailing slash e rotas válidas.
- **Próximo passo:** Próxima feature do roadmap ou deploy da imagem atualizada no Fly.io.

## Decisões recentes
- 2026-10-06: Implementação de URLs por Categoria e Correção de Portas (spec `0010`):
  1. **Roteamento Canônico por Categoria:** Criação de `src/pages/[category]/[slug].astro` e módulo de domínio `src/domain/routes.ts` com testes unitários em `src/domain/routes.test.ts`.
  2. **Prevenção de Portas no Nginx:** Adicionado `port_in_redirect off;` e `absolute_redirect off;` no bloco `server` de `nginx.conf`, garantindo que diretórios sem barra recebam redirecionamentos relativos sem incluir a porta de escuta interna `:8080`.
  3. **Trailing Slash no Astro:** Adicionado `trailingSlash: 'always'` em `astro.config.mjs`.
  4. **Compatibilidade Retroativa:** `src/pages/ensaios/[slug].astro` emite página de redirecionamento imediato para `/{category}/{slug}/`.
  5. **Validação Docker E2E:** Script `scripts/test-docker.sh` atualizado e validado testando 200 OK na subpágina e ausência de `:8080` no cabeçalho `Location` do redirecionamento.
- 2026-10-05: Implementação dos Destaques da Home (spec `0009`):
  1. **Schema e Domínio (`src/content/config.ts` e `src/domain/featured.ts`):** Adicionado `featured: z.boolean().default(false)` ao schema do Astro. Módulo de domínio puro implementando `selectFeatured` (filtra não-rascunhos com `featured: true`, ordena por `pubDate` desc com desempate por slug e limita a 3) e `slugsToUnfeature` (substituição dos mais antigos ao ultrapassar 3).
  2. **Persistência e Middleware (`src/infrastructure/editor-storage.ts` e `editor-dev-middleware.ts`):** Leitura, escrita e atualização de `featured` no frontmatter; endpoint `POST /api/editor/featured` para toggle rápido por slug; `saveEssay` e `setFeatured` desmarcam automaticamente o destaque excedente mais antigo e retornam a lista de desmarcados.
  3. **Interface do Editor (`src/pages/editor/index.astro`):** Checkbox "Destacar na Home (featured: true · máx. 3 no site)" sincronizado com localStorage draft, restauração via URL `?slug=`, reset de publicação e toast detalhado quando um destaque antigo for substituído.
  4. **Painel Admin (`src/pages/admin/index.astro` e `src/styles/admin.css`):** Card de métrica "Destaques X / 3", coluna com botão de estrela por publicação permitindo favoritar/desfavoritar com um clique e feedback instantâneo.
  5. **Novo Layout Compacto da Home (`src/components/FeaturedStories.astro` e `src/pages/index.astro`):** Substituição da antiga composição 2fr/1fr com destaque hardcoded por grade responsiva uniforme de 3 colunas (`grid-template-columns: repeat(3, minmax(0, 1fr))`), onde cada card ocupa exatamente 1/3 da largura no desktop, mantendo altura compacta (capa 16:9 máx. 190px), títulos e descrições balanceados e seção oculta quando não houver itens destacados.
- 2026-10-03: Implementação da Identidade Visual dos Abridores de Letras Fluviais (spec `0008`):
  1. **Favicon Fluvial Vernacular com a Letra "C":** Conversão da arte original da letra "C" pintada dos barcos amazônicos (fundo transparente, tipografia tridimensional, ornamentos florais, sombras duras e estrela guia) em suíte completa de favicons de alta nitidez: `public/favicon.svg` (com imagem vetorial de alta definição), `public/favicon.png` (512x512), `public/apple-touch-icon.png` (180x180), `public/favicon-32x32.png` (32x32), `public/favicon-16x16.png` (16x16) e `public/favicon.ico`. Atualização das tags `<link rel="icon">` e `<link rel="apple-touch-icon">` em `BaseLayout.astro`.
  2. **Nova Logo Central Oficial (`public/images/cult-logo-fluvial.png` e `src/components/CultLogo.astro`):** Incorporada a obra de arte oficial de lettering fluvial fornecida pelo usuário, com fundo 100% transparente, tipografia tridimensional com pintura artesanal, sombras duras náuticas azul e vermelha, detalhes solares em amarelo e sufixo `.thalyson.com` perfeitamente alinhado. Recorte preciso do bounding box (1015x567), proporções refinadas e renderização otimizada para Retina.
  3. **Header Editorial com Efeito Scroll-Shrink:** Substituição do texto antigo pela nova marca `CultLogo`, alinhamento no desktop com logo à esquerda e navegação à direita, padding vertical reduzido e animação suave de encolhimento da navbar e da logo durante o scroll/navegação (`is-scrolled`).
  4. **Editorial Hero sem Ofuscação e com Foto Completa:** Remoção total do sombreado/gradiente escuro da base da fotografia da Estação das Docas tanto no desktop quanto nas resoluções responsivas (base 100% transparente para exibir toda a obra de arte e arquitetura das docas sem ofuscar), centralização do enquadramento focal da imagem (`object-position: center center`) e scrim leve localizado apenas no terço de leitura dos textos, garantindo legibilidade através de sombras tipográficas de alto contraste.
  5. **CTA em Estilo Placa de Barco:** Redesenho do botão "Explorar histórias" inspirado nas placas de proa (fundo `#F4B63F`, texto `#070D22`, borda `2px solid #FFF6E5`, box-shadow `5px 5px 0 #17A9B8`, cantos chanfrados, deslocamento físico de 2px e redução da sombra no hover entre 180-220ms).
  6. **Filetes Fluviais e Cards Náuticos:** Divisores editoriais com filetes duplos coloridos das marés, cards editoriais com detalhe inferior coral/turquesa e sombras sólidas curtas sem borrão difuso excessivo.
  7. **Textura e Rodapé com Logo em Máxima Evidência:** Textura artesanal de madeira/tinta naval sutil (3.5% de opacidade) e rodapé redesenhado com a nova logo ampliada em grande destaque central (`clamp(74px, 8vw, 108px)`), halo luminoso expandido (280x120px) para máxima evidência visual, manifesto alinhado ao centro, colunas de navegação balanceadas e filete ornamental como assinatura final.
- 2026-10-03: Implementação da Conteinerização Docker em Imagem Única (spec `0007`):
  1. **Multi-Stage Build Otimizado (`Dockerfile`):** Stage 1 de compilação em `node:22-alpine` (`npm ci` + `npm run build` gerando `dist/`) e Stage 2 de runtime em `nginxinc/nginx-unprivileged:alpine`. Tamanho final de apenas 31MB.
  2. **Isolamento de Contexto (`.dockerignore`):** Filtro estrito de caches, dependências locais, documentação, specs e artefatos de IA para builds rápidos e sem vazamento de arquivos sensíveis.
  3. **Servidor Web Nginx de Alta Performance (`nginx.conf`):** Configurado na porta 8080 (non-root / UID 101 `nginx`), compressão gzip (nível 6), resolução limpa de rotas do Astro (`try_files $uri $uri/ $uri/index.html =404`), cache imutável de 1 ano para `/_astro/*`, revalidação de HTML e página 404 personalizada (`src/pages/404.astro`).
  4. **Segurança e Observabilidade:** Headers `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` e probe de integridade em `/healthz` respondendo 200 OK.
  5. **Scripts e Automação no `package.json`:** Adicionados `docker:build`, `docker:run` e `docker:test` (`scripts/test-docker.sh`), validando todos os critérios de aceite (AC-1 ao AC-6) de forma automatizada.
- 2026-10-02: Redesign Full-Width do Editorial Hero na Home:
  1. **Imagem de Ponta a Ponta (100% Largura):** Adicionado suporte a `fullBleed` no `BaseLayout.astro`, permitindo que o Hero expanda sem restrições de container, com altura imersiva de até 820px e preservação do céu estrelado e dos guindastes históricos ingleses amarelos. As seções inferiores são organizadas no `.site-container`.
  2. **Textos Livres (Fora da Caixa) e Centralizados:** Remoção completa do container de card/box (`hero-editorial-card`), posicionando headline e lead no centro da composição sobre um scrim aerado de alto contraste.
  3. **Tipografia com Destaques Culturais Vivos:** Headline com gradientes luminosos de Belém — `highlight-cyan` (turquesa amazônica) em "arte, música" e `highlight-gold` (dourado e coral) em "memória amazônica", com sombras profundas multicamadas para legibilidade impecável sobre a pintura.
  4. **Remoção de Selos Antigos:** Exclusão definitiva de "Edição Principal", "Cultura Amazônica · Belém do Pará" e "Cultura do Pará".
  5. **Botão de Gancho com Efeitos Culturais de Belém:** Botão centralizado em formato pílula com gradiente azul-rio e turquesa, borda dourada, animação de pulso contínuo (`belemPulse` simulando as ondas do banzeiro), brilho fluídico das águas (`waterShimmer`), ícone da água e seta direcionadora para a seção de destaques.
- 2026-10-02: Ferramenta de Posicionamento e Corte de Imagens em Destaque no Editor:
  1. **Correção de Sobreposição de Input:** Adicionado `display: none !important` no dropzone quando uma imagem está carregada, eliminando o botão nativo flutuante ("Nenhum arquivo escolhido") sobre as ações.
  2. **Controle de Enquadramento Focal Não-Destrutivo (`coverImagePosition`):** Suporte completo ao atributo CSS `object-position` salvo no frontmatter do Markdown (`coverImagePosition: "50% 30%"`), com suporte nos schemas Zod, no gerador de frontmatter, na renderização do artigo (`/ensaios/[slug]`), nos cards de acervo (`EssayCard`), na Home (`FeaturedStories`) e no preview ao vivo.
  3. **Controles Rápidos no Editor:** Slider vertical de enquadramento (0% topo a 100% base) e botões rápidos ("Topo", "Centro", "Base") diretamente abaixo da miniatura 16:9.
  4. **Modal de Corte e Ajuste 16:9 Avançado:** Viewport com proporção de revista 16:9, linhas guias de terços fotográficos, zoom de 1.0x a 2.5x, controles de arrasto (drag & drop com mouse ou toque), opção "Aplicar Enquadramento" (salva a posição focal sem gerar novo arquivo) e opção "Recortar & Salvar Imagem" (renderiza recorte limpo via Canvas HTML5 a 92% JPEG e salva via `/api/editor/upload-image`).
- 2026-10-02: Implementação do Painel Administrativo Local e Gerenciador de Categorias em Lista (spec `0006`):
  1. **Novo Painel `/admin/` (dev-only):** interface em azul-marinho profundo (`src/pages/admin/index.astro` e `src/styles/admin.css`) com guard `import.meta.env.DEV`, cards de métricas (total de publicações, publicadas vs rascunhos, total de categorias), barra de pesquisa instantânea de publicações com filtros por categoria e status, e links diretos para edição rápida em `/editor/?slug=...`.
  2. **Gerenciamento de Categorias em Lista:** interface estruturada para adicionar novas categorias (com slug automático/personalizado), editar o nome de categorias existentes e remover categorias (com confirmação segura e contagem de publicações vinculadas), persistindo diretamente em `src/data/categories.json` sem manipulação de JSON bruto.
  3. **Simplificação do `/editor/`:** remoção definitiva do seletor dropdown de posts do cabeçalho (substituído por botão "← Painel Admin" e indicador limpo de modo "Nova Publicação" vs "Editando: [slug]") e remoção da modal de edição de JSON bruto do formulário, integrando link direto "Gerenciar Categorias ↗" para o painel admin.
  4. **Atalho de Desenvolvimento no Footer:** adicionado link discreto "Painel Admin [DEV]" no rodapé do portal (visível estritamente em ambiente DEV).
- 2026-10-02: Evolução do Editor de Conteúdo Local (spec `0005` - AC-13 & Terminologia):
  1. **Simplificação radical da barra de ações:** Remoção dos botões desnecessários "Restaurar", "Limpar" e "Baixar .md". A barra agora conta com o seletor de publicações e apenas duas ações diretas: "Excluir" (visível apenas ao editar uma publicação existente) e "Salvar Publicação" (gravação direta no disco).
  2. **Exclusão de publicações locais:** Adicionado botão "Excluir" (visível dinamicamente quando uma publicação existente é carregada) com modal de confirmação acessível e endpoint `DELETE /api/editor/essay?slug=...` que apaga permanentemente o arquivo correspondente em `src/content/ensaios/`.
  3. **Padronização de Terminologia:** Todo o editor e os atalhos de desenvolvimento foram atualizados de "Ensaio" para "Publicação" ("Nova Publicação", "Salvar Publicação", "Excluir Publicação", "Editar Publicação", "Corpo da Publicação", etc.).
  3. **Categorias dinâmicas via JSON:** fonte de verdade em `src/data/categories.json` com modal de edição JSON integrada no editor e schema do Zod atualizado para aceitar qualquer categoria criada.
  4. **Data de publicação automática:** campo de data modificado para ser gerado automaticamente (não-editável pelo usuário) com exibição formatada amigável e preservação da data original em publicações já salvas.
  5. **Persistência local direta:** botão "Salvar Publicação" que grava diretamente o arquivo `.md` em `src/content/ensaios/${slug}.md` via middleware dev no Vite, além de suporte a upload de imagem para `public/images/`.
  6. **Edição de publicações existentes:** dropdown no topo do editor listando as publicações locais para carregamento instantâneo, e botão "Editar Publicação" adicionado às páginas de ensaio no modo dev (`/ensaios/[slug]`).
- 2026-10-02: Implementação inicial do Editor de Conteúdo Local (spec `0005`) — interface dev-only em `src/pages/editor/index.astro` com guard `import.meta.env.DEV`. O Astro SSG não emite a rota no build estático. Recursos: editor Markdown com toolbar, upload de imagem, inserção de links, preview em tempo real (marked.js + DOMPurify) e download de `.md`.
- 2026-10-01: Posicionamento autoral alinhado com o criador: remoção completa de quaisquer menções a "curadoria" ou papel de curador institucional em todo o frontend, metadados e documentação. O projeto assume sua essência genuína: um espaço afetivo e pessoal de **compartilhamento da cultura, música, memórias e saberes do Pará e de Belém** por Thalyson.
- 2026-10-01: Aprimoramento da visibilidade da imagem principal no Editorial Hero: proporção expandida para 16:9 com altura de até 720px, gradiente escuro global substituído por scrim direcional leve no canto e card editorial compacto em vidro fosco (glassmorphism), liberando mais de 70% da área da pintura para contemplação da arte.
- 2026-10-01: Incorporação da nova imagem principal do Editorial Hero: pintura expressionista noturna da **Estação das Docas de Belém do Pará** (`public/images/docas-belem-noite-estrelada.jpg`), retratando os guindastes históricos ingleses amarelos, os galpões de ferro, as palmeiras e a Baía do Guajará sob um céu estrelado em espirais.
- 2026-10-01: Implementação completa da spec `0004-home-revista-editorial-para` — Refatoração total da Home para o padrão de revista cultural digital contemporânea de Belém e Pará. Novo universo cromático com 75% azul-marinho profundo (`#070D22`, `#0B1739`), 15% neutros claros (`#E8EDF7`) e 10% acentos vibrantes do Norte (cobalto `#2457A6`, turquesa `#17A9B8`, dourado `#F4B63F`, laranja `#F27A32`, coral `#EC5B5B`).
- 2026-10-01: Novo Header em linha única contínua com links editoriais discretos + drawer mobile acessível (WCAG AA).
- 2026-10-01: Editorial Hero com proporção 21:9/16:9, imagem artística de suporte com overlay gradiente escuro e headline dominante ("Belém entre arte, música e memória amazônica").
- 2026-10-01: Blocos editoriais implementados: "Em Destaque" (2fr/1fr), "Explore a Cultura" (cards tipográficos), "Belém & Pará" (narrativas regionais) e "Últimas Histórias" (cards de revista sem estilo SaaS).
- 2026-10-01: Tipografia refinada com `Fraunces` (display e títulos) e `Noto Sans` (corpo e UI) com escala `clamp()`.
- 2026-10-01: Implementação completa da spec `0003-portal-cultura-paraense` — Home page reimaginada com Hero dos pilares culturais do Pará (Carimbó, Guitarrada, Círio, Abridores de Letras), abas de território (Pará & Belém, Brasil, Mundo), novos ensaios regionais e badges de localidade.
- 2026-10-01: Implementação completa da spec `0002-fundacao-editorial-astro` (Astro SSG, Design System Vanilla CSS com paleta vibrante e fontes Google Rye/Newsreader/Inter, Content Collections tipadas e rotas dinâmicas).
- 2026-10-01: Conclusão do Kickoff (Lean Inception + 5 eixos técnicos) — [overview.md](architecture/overview.md)
- 2026-10-01: [ADR-0002](architecture/adr/0002-tech-stack-astro-typescript.md) — Adoção do Astro (SSG) e TypeScript.
- 2026-10-01: [ADR-0003](architecture/adr/0003-conteudo-local-content-collections.md) — Gestão de conteúdo local em Markdown/MDX com Content Collections.
- 2026-10-01: [ADR-0004](architecture/adr/0004-design-system-vanilla-css-editorial.md) — Design System editorial em Vanilla CSS atualizado com a paleta oficial de cores vibrantes (Fusion Red, Orange Hibiscus, Flirtatious, Reptile Green, Maximum Blue Green e variações) e tokens em `src/styles/tokens.css`.
- 2026-10-01: [ADR-0005](architecture/adr/0005-infra-docker-flyio.md) — Infraestrutura e deploy conteinerizado via Docker no Fly.io.

## Bloqueios
- *Nenhum no momento.*

## Ideias adiadas / backlog técnico
- Busca estática indexada com Pagefind (Onda 2).
- Grafo visual de referências cruzadas entre obras e ensaios (Onda 2).

## Todos soltos
- [ ] Inicializar o projeto Astro com as dependências essenciais na raiz/src.
