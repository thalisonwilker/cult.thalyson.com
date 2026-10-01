---
name: journeys
description: Resumo das jornadas do produto — etapas que a persona percorre. Puxe ao desenhar features ou priorizar o MVP.
alwaysApply: false
---

# Jornadas do Produto — cult.thalyson.com

> As jornadas que o produto precisa cobrir ponta a ponta, do ponto de vista da persona (Lean Inception).

## Jornada 1: Descoberta e Leitura Imersiva (Leitor Crítico)
- **Persona:** Leitor Crítico · **Objetivo:** Ler um ensaio aprofundado sobre uma obra sem interrupções.
- **Etapas:**
  1. Acessa a home do `cult.thalyson.com` e vê os ensaios em destaque com tempo estimado de leitura e resumo.
  2. Clica no ensaio e entra em um layout focado em leitura (largura de texto ideal, tipografia serifada de alto contraste confortável, tema claro/escuro).
  3. Durante a leitura, encontra citações formatadas, notas de rodapé e referências a outras obras (livros/filmes relacionados).
  4. Chega ao final do ensaio e encontra recomendações contextuais para aprofundamento.
- **Dores / atritos:** Banners piscando, popups de newsletter, fontes desconfortáveis, carregamento lento de imagens.
- **Oportunidades:** Experiência de leitura editorial digna de revista impressa de prestígio, com performance instantânea (SSG/SSR).

## Jornada 2: Exploração por Temas e Obras (Explorador Cult)
- **Persona:** Explorador Cult · **Objetivo:** Descobrir novos filmes, livros ou álbuns a partir de um tópico ou movimento cultural.
- **Etapas:**
  1. Navega pela taxonomia do site (ex.: por categoria: Cinema, Literatura, Música, Ensaios ou por Movimento/Tema).
  2. Filtra ou visualiza fichas síntese de obras com nota crítica, ano, autor/diretor e ensaios associados.
  3. Clica em uma tag/obra e vê todas as análises e reflexões relacionadas.
- **Dores / atritos:** Falta de contexto histórico ou conexão entre resenhas isoladas.
- **Oportunidades:** Grafo de conexões culturais e navegação fluida entre resenhas e ensaios.

## Jornada 3: Criação e Publicação Editorial (Autor / Curador)
- **Persona:** Curador · **Objetivo:** Escrever um novo ensaio em Markdown/MDX com metadados estruturados e publicar no site.
- **Etapas:**
  1. Cria um arquivo `.md` ou `.mdx` na pasta de conteúdo do projeto.
  2. Preenche o frontmatter validado por esquema TypeScript (título, resumo, data, categoria, obras citadas, tags, capa).
  3. Testa o preview localmente com hot-reload.
  4. Faz commit/push e o deploy ocorre de forma determinística via Docker / Fly.io.
- **Dores / atritos:** Painéis CMS pesados que quebram formatações ou travam metadados.
- **Oportunidades:** Content Collections com tipagem estrita no Astro garantindo integridade dos dados em tempo de compilação.
