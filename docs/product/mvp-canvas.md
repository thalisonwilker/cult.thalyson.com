---
name: mvp-canvas
description: Canvas do MVP. Puxe na descoberta e priorização do MVP.
alwaysApply: false
---

# MVP Canvas — cult.thalyson.com

> Lean Inception (Paulo Caroli). O MVP é a menor coisa que gera aprendizado validado.

## 1. Proposta do MVP (visão)
Lançar uma plataforma editorial veloz, minimalista e elegante em Astro/TypeScript hospedada em Docker/Fly.io, permitindo a publicação e leitura confortável de ensaios e resenhas culturais em Markdown sem distrações.

## 2. Personas e segmentos do MVP
- **Leitor Crítico:** Leitor de ensaios culturais que valoriza tipografia impecável, velocidade e conteúdo denso.
- **Curador / Autor:** Mantenedor que escreve conteúdos em Markdown localmente e publica de forma contínua e versionada.

## 3. Jornadas
- Navegação na home → Escolha de Ensaio/Categoria → Leitura imersiva do texto completo com suporte a temas (claro/escuro).

## 4. Funcionalidades (sequenciadas)
| # | Funcionalidade                                  | Valor | Esforço | Entra no MVP? |
|---|-------------------------------------------------|-------|---------|---------------|
| 1 | Setup Astro + Design System Vanilla CSS         | Alto  | Baixo   | Sim           |
| 2 | Content Collections tipadas (Ensaios / Resenhas)| Alto  | Baixo   | Sim           |
| 3 | Home Editorial e Listagem por Categorias        | Alto  | Baixo   | Sim           |
| 4 | Página de Artigo/Ensaio com Leitura Imersiva    | Alto  | Baixo   | Sim           |
| 5 | Feed RSS, Sitemap & SEO / OpenGraph             | Médio | Baixo   | Sim           |
| 6 | Container Docker & Configuração Fly.io          | Alto  | Baixo   | Sim           |
| 7 | Busca indexada local (Pagefind)                 | Médio | Médio   | Onda 2        |
| 8 | Grafo / Rede de Referências Cruzadas            | Alto  | Médio   | Onda 2        |

## 5. Resultado esperado / como validar
- Core Web Vitals perfeitos (LCP < 1.0s, CLS 0, FID < 50ms).
- Índice de leitura completo em ensaios longos sem quebras ou inconsistências de layout.
- Fluxo de publicação sem fricção (adicionar arquivo MDX e build automático).

## 6. Custo e cronograma
- Baixo custo de infraestrutura (Fly.io free/hobby tier compatível com contêiner estático/SSR leve).
- MVP executável em ciclos curtos de desenvolvimento Spec-Driven.

## 7. Hipóteses e aprendizados
| Hipótese                                                 | Como medir                         | Resultado      |
|----------------------------------------------------------|------------------------------------|----------------|
| Interface focada em leitura editorial aumenta retenção   | Tempo de permanência na página     | A validar      |
| Content Collections eliminam erros de schema no conteúdo | Zero falhas de schema no build CI  | A validar      |
