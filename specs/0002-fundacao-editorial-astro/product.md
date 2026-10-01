---
name: product
description: PRD-lite da fundação editorial Astro, Design System e Content Collections.
alwaysApply: false
---

# Product — Fundação Editorial Astro & Design System

> **Tier:** arquitetural · **Status:** aprovado · **Dono:** Antigravity & Thalyson

## Problema
O repositório `cult.thalyson.com` possui apenas o scaffold da esteira SDD, sem o runtime executável do framework web, sem os componentes visuais editoriais e sem os esquemas de validação de conteúdo para ensaios e resenhas culturais.

## Para quem
- **Leitor Crítico & Explorador Cult:** Deseja acessar a plataforma e ler ensaios com alta velocidade, tipografia nítida e estética artesanal com suporte a temas claro/escuro.
- **Curador / Autor:** Precisa de um ambiente estruturado para criar e validar conteúdos Markdown/MDX com tipagem estrita de metadados.

## Resultado esperado / métrica de sucesso
- Projeto Astro compilando sem erros em modo estático (`npm run build`).
- Esquemas de Content Collections validados com Zod impedindo publicações malformatadas.
- Design System em Vanilla CSS integrado com os tokens de cores (Fusion Red, Orange Hibiscus, etc.) e tipografia (Rye, Newsreader, Inter).
- Página de artigo/ensaio renderizando texto longo com cálculo de tempo de leitura e alternador de tema funcional.

## Goals
- Inicializar a base Astro com TypeScript em modo estrito.
- Estruturar o Design System Vanilla CSS com tipografia editorial e temas Claro / Escuro.
- Implementar a Content Collection `ensaios` com schema Zod completo (título, autor, data, categoria, resumo, tags, capa).
- Criar o Layout Editorial base, cabeçalho com logotipo display, navegação e leitor de ensaios com rotas dinâmicas (`/ensaios/[slug]`).
- Fornecer ensaios de exemplo no acervo para validação ponta a ponta.

## Non-goals
- Mecanismo de busca indexada Pagefind (Onda 2).
- Grafo dinâmico de conexões de obras (Onda 2).
- Sistema de newsletter ou formulários de comentários externos (Onda 3).

## Riscos / premissas
- Premissa: Astro Content Collections oferece validação estrita em tempo de build, eliminando necessidade de banco de dados no MVP.
