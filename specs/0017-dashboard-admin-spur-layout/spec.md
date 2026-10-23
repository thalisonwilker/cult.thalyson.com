---
name: spec
description: Contrato da feature 0017 (Dashboard Administrativo no Modelo Spur).
alwaysApply: true
---

# Spec — 0017: Dashboard Administrativo no Modelo Spur

> **Fonte da verdade.** Status: aprovado
> Recodificação da interface do painel administrativo local (`http://127.0.0.1:3001/admin`) para seguir o modelo de layout Spur (sidebar escura vertical, topbar clara com busca e ações rápidas, cards de métricas em blocos coloridos vibrantes e seção central em duas colunas com gráfico de barras e alertas).

## Resumo
O painel administrativo local (`127.0.0.1:3001/admin`) passará a ter o design e organização do template de dashboard Spur, preservando a integração com os endpoints locais de métricas, controle de acervo e staging de ideias, funcionando exclusivamente em ambiente local.

## Critérios de aceite

### AC-1: Estrutura em duas áreas principais com Sidebar escura e Topbar clara
- **Dado** o servidor local do editor/admin em execução (`http://127.0.0.1:3001`)
- **Quando** o usuário acessar `/admin` ou `/dashboard`
- **Então** a interface deve apresentar layout Spur com:
  1. Sidebar escura à esquerda (`#1b2432` / `#131924`) contendo a marca CULT Admin [DEV] e itens de navegação com ícones (Dashboard, Estatísticas, Publicações, Ideias, Editor de Ensaios e Ver Site).
  2. Botão de alternância (hamburger) na topbar clara para colapsar/expandir a sidebar.

### AC-2: Topbar clara com busca e atalhos rápidos
- **Dado** o dashboard carregado no navegador
- **Quando** o usuário interage com a topbar clara superior
- **Então** ela deve exibir:
  1. Botão hamburger para recolhimento da sidebar lateral.
  2. Campo de busca global com ícone de lupa para filtrar rapidamente publicações.
  3. Atalhos à direita com ícone de link para o site público (`:3000`), sino de notificações com badge e avatar do autor editorial.

### AC-3: Cards de métricas estilo Spur com blocos sólidos vibrantes
- **Dado** que a API `/api/admin/metrics` retorne os dados editoriais
- **Quando** a grade de métricas for renderizada
- **Então** os cards devem seguir a estética dos cards do Spur:
  1. **Card Azul (#2979ff / #3483fa):** "Ensaios Publicados" com valor grande no canto superior/direito, ícone de livro/documento no canto inferior esquerdo e legenda de status.
  2. **Card Verde (#27ae60 / #10b981):** "Destaques na Home" com indicador `X / 3`, ícone de estrela e indicação de vagas abertas.
  3. **Card Vermelho (#f5365c / #e74c3c):** "Rascunhos em Progresso" com total de rascunhos, ícone de rascunho e indicador de pendência.
  4. **Card Laranja / Âmbar (#f39c12):** "Média de Leitura" com tempo médio em minutos e ícone de relógio.

### AC-4: Seção intermediária em duas colunas com Gráfico de Barras e Alertas
- **Dado** o acervo de ensaios com distribuição por categorias
- **Quando** a seção central for renderizada
- **Então** deve exibir duas colunas lado a lado no desktop:
  1. Coluna esquerda: Card "Distribuição por Vertentes" com gráfico de barras visual em CSS/SVG proporcional à quantidade de artigos em cada categoria.
  2. Coluna direita: Card "Notificações Editoriais" com lista de alertas contextuais (status dos destaques na Home, rascunhos pendentes e atalho para criar ensaio).

### AC-5: Tabela de acervo e ideias integradas no visual claro e moderno
- **Dado** o acervo retornado pela API
- **Quando** a tabela for renderizada
- **Então** ela deve ficar acomodada em um card branco com abas de filtro (*Todas*, *Publicadas*, *Rascunhos*, *Destaques*), botão de estrela para toggle de destaque em 1 clique, badges de categoria, link "Editar" (`/?slug=...`) e "Ver Site" (`:3000/[category]/[slug]`).
- **E** a caixa de ideias e pautas locais deve permanecer acessível na navegação da sidebar.

### AC-6: Isolamento estrito de produção
- **Dado** a execução de `npm run build`
- **Quando** o build estático do Next.js finalizar
- **Então** o diretório `./out` não deve conter a pasta `admin` ou rotas do dashboard, operando estritamente no servidor local do editor (`127.0.0.1:3001`).

## Casos de borda e erros
- Servidor offline ou porta fechada: Exibir mensagem clara de erro de conexão com orientação para rodar `npm run dev`.
- Resoluções mobile: A sidebar escura recolhe automaticamente via overlay quando o botão hamburger for clicado.

## Fora de escopo
- Autenticação por banco de dados ou multi-usuários (o ambiente é 100% monousuário e local).
- Dependências pesadas de bibliotecas de gráficos (o gráfico de barras será estilizado nativamente com CSS/HTML puro de alto desempenho).

## Rastreabilidade
- Spec anterior relacionada: `specs/0016-dashboard-admin-local/spec.md`
