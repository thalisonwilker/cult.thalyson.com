---
name: roadmap
description: Prioridades atuais em horizontes Now/Next/Later.
alwaysApply: true
---

# Roadmap — cult.thalyson.com

> Plano incremental para implementar com o time. Gerado no kickoff.
> Greenfield: sequência de entrega do MVP (Onda 1).

## Objetivo do roadmap
Entregar a plataforma editorial do `cult.thalyson.com` em Astro/TypeScript com experiência de leitura de primeira linha, garantindo fluxo automatizado de publicação e deploy no Fly.io.

## Horizontes

### 🟢 Agora (este ciclo - MVP / Onda 1)
| # | Item                                            | Valor | Esforço | Dono  | Depende de | Pronto quando                                                |
|---|-------------------------------------------------|-------|---------|-------|------------|--------------------------------------------------------------|
| 1 | Setup do projeto Astro + TS + Vanilla CSS       | Alto  | Baixo   | Dev   | —          | Projeto compilando, tipagem estrita e tokens CSS estruturados|
| 2 | Schemas de Content Collections (Ensaios)        | Alto  | Baixo   | Dev   | #1         | Schemas Zod com validação de metadados, autores e categorias |
| 3 | Layout Editorial & Leitor de Artigo Imersivo    | Alto  | Baixo   | Dev   | #1, #2     | Página de leitura com tipografia refinada e tema Dark/Light  |
| 4 | Home Editorial & Navegação por Categorias       | Alto  | Baixo   | Dev   | #2, #3     | Listagem de ensaios com filtros e cards informativos         |
| 5 | Feed RSS, SEO, OpenGraph & Sitemap              | Médio | Baixo   | Dev   | #4         | Geração automática de RSS/Sitemap e tags OpenGraph validadas |
| 6 | Containerização Docker & Deploy no Fly.io       | Alto  | Baixo   | Dev   | #1         | Dockerfile multi-stage e fly.toml funcionando em produção    |

### 🟡 Próximo (Onda 2)
| # | Item                                            | Valor | Esforço | Dono  | Depende de |
|---|-------------------------------------------------|-------|---------|-------|------------|
| 1 | Sistema de Referências Cruzadas entre Obras     | Alto  | Médio   | Dev   | MVP        |
| 2 | Mecanismo de Busca Estática Instantânea (Pagefind)| Médio| Médio   | Dev   | MVP        |
| 3 | Fichas detalhadas de obras culturais            | Médio | Médio   | Dev   | #1         |

### ⚪ Depois (Onda 3)
| # | Item                                            | Por que esperar                                    |
|---|-------------------------------------------------|----------------------------------------------------|
| 1 | Guias e trilhas temáticas de leitura/cinema     | Necessita de volume inicial de ensaios cadastrados |
| 2 | Integração de Newsletter e engajamento estático | Validar interesse dos leitores no MVP primeiro     |

## Como rodar com o time
- **Cadência de revisão do roadmap:** A cada conclusão de spec / feature.
- **Quem decide prioridade:** Curador / Mantenedor.
- **Definition of Ready/Done:** Conforme definido no [`README.md`](../README.md) e [`TESTING.md`](../engineering/TESTING.md).
