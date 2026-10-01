---
name: context-map
description: Bounded contexts e relações. Puxe ao modelar ou cruzar contextos.
alwaysApply: false
---

# Context Map — cult.thalyson.com

> Visão DDD estratégica: os bounded contexts do sistema e como se relacionam.

## Bounded Contexts

| Contexto                   | Subdomínio   | Responsabilidade                                               | Dono |
|----------------------------|--------------|----------------------------------------------------------------|------|
| **Editorial & Ensaios**    | Core         | Curadoria, textos dos ensaios, resenhas e formatação de leitura | Dev  |
| **Taxonomia & Obras**      | Supporting   | Categorias (Cinema, Livros, Música), tags e metadados de obras | Dev  |
| **Distribuição & SEO**     | Generic      | Geração de Feeds RSS, Sitemaps, OpenGraph e metadados de busca | Dev  |

## Relações entre contextos

```
[Editorial & Ensaios] ──(Shared Kernel / Published Language)──► [Taxonomia & Obras]
         │
         └──(Downstream)──► [Distribuição & SEO (RSS / OpenGraph)]
```

| Upstream                | Downstream            | Padrão                                | Por quê                                                           |
|-------------------------|-----------------------|---------------------------------------|-------------------------------------------------------------------|
| **Editorial & Ensaios** | **Taxonomia & Obras** | Shared Kernel / Published Language    | Os ensaios compartilham as definições de categorias e tags de obra|
| **Editorial & Ensaios** | **Distribuição & SEO**| Conformist                            | RSS e OpenGraph consomem diretamente as entidades de ensaio       |

## Diagramas
Os diagramas de arquitetura de alto nível ficam em [`diagrams.md`](./diagrams.md).
