---
name: architecture-diagrams
description: Diagramas de arquitetura (C4, fluxo, deployment) em Mermaid.
alwaysApply: false
---

# Diagramas de Arquitetura — cult.thalyson.com

> Visão visual do sistema em Mermaid. Atualize ao modificar a arquitetura.

## 1. Visão de Contexto do Sistema (C4 Nível 1)

```mermaid
graph TD
    Leitor["Leitor / Usuário"]
    Curador["Curador / Autor"]
    
    subgraph Cult["cult.thalyson.com"]
        App["Plataforma Editorial (Astro SSG)"]
        ContentStore["Content Collections (Markdown/MDX)"]
    end
    
    Fly["Fly.io (Docker Edge)"]
    FeedReader["Leitores de Feed (RSS/Atom)"]
    
    Curador -->|"Escreve e versiona"| ContentStore
    ContentStore -->|"Build estático & validação"| App
    App -->|"Deploy contêiner"| Fly
    Fly -->|"HTML/CSS otimizado"| Leitor
    Fly -->|"Feed XML"| FeedReader
```

## 2. Fluxo de Publicação e Leitura (Sequência)

```mermaid
sequenceDiagram
    autonumber
    actor Autor as Curador / Autor
    participant Git as Repositório Git
    participant Build as Pipeline Build (Astro)
    participant Edge as Fly.io
    actor Leitor as Leitor

    Autor->>Git: Push de novo ensaio (.mdx)
    Git->>Build: Dispara validação de schema (Zod) e compilação HTML
    Build->>Build: Gera páginas estáticas, RSS e Sitemap
    Build->>Edge: Deploy da imagem Docker
    Leitor->>Edge: Requisita ensaio (/ensaios/slug)
    Edge-->>Leitor: Entrega HTML/CSS instantâneo (< 1s)
```

## 3. Estrutura de Bounded Contexts e Camadas

```mermaid
graph LR
    subgraph CoreDomain["Editorial & Ensaios (Core)"]
        Ensaio["Entidade Ensaio"]
        Resenha["Entidade Resenha"]
        ReadingTime["Cálculo de Leitura"]
    end

    subgraph SupportingDomain["Taxonomia & Obras (Supporting)"]
        Categoria["Categoria (Cinema/Livros/Música)"]
        Obra["Metadados de Obra"]
        Tag["Tags Temáticas"]
    end

    subgraph GenericDomain["Distribuição & SEO (Generic)"]
        RSS["Gerador RSS"]
        Sitemap["Gerador Sitemap"]
        OpenGraph["Metatags OpenGraph"]
    end

    CoreDomain --> SupportingDomain
    CoreDomain --> GenericDomain
```
