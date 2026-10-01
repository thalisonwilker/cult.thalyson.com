---
name: TESTING
description: Comandos de gate e convenções de teste. Puxe ao codar, validar ou montar CI.
alwaysApply: false
---

# TESTING — Como verificar o projeto cult.thalyson.com

> **Fonte única dos comandos de gate** e das convenções de teste. É o que o **DoD**, a **CI** e os
> **subagentes** consomem para provar que uma task/feature está pronta — sem inspeção visual.

## Como rodar

| Nível            | Comando                                      | Quando                         |
|------------------|----------------------------------------------|--------------------------------|
| **Unidade**      | `npm run test:unit` (vitest run)             | sempre, rápido                 |
| **Integração**   | `npm run test:integration` (vitest / schemas)| validação de schemas Zod / RSS |
| **Aceite (E2E)** | `npm run test:e2e` (playwright test)         | um teste por `AC-N` da spec    |
| **Type Check**   | `npm run typecheck` (`astro check && tsc`)   | pré-commit / CI (bloqueante)   |
| **Lint / Format**| `npm run lint` / `npm run format:check`      | pré-commit / CI (bloqueante)   |
| **Build Check**  | `npm run build`                              | CI — validação de SSG limpo    |
| **Cobertura**    | `npm run test:coverage` (vitest run --coverage)| CI — relatório de cobertura  |

## Convenções
- Pirâmide: testes de unidade em funções de domínio (cálculo de tempo de leitura, filtros de taxonomia, ordenação), integração em carregamento de Content Collections, poucos testes E2E/Aceite para rotas críticas e renderização.
- **Cada `AC-N` da spec tem um teste de aceite que é o seu gate.** Nomeie o teste com o ID (`test_AC_1_*` / `AC-1: ...`) para rastreabilidade spec → teste.
- O build estático (`npm run build`) e o type-check (`astro check`) são barreiras bloqueantes de qualidade.

## Gates (Definition of Done executável)
- Uma **task** só vira `done` quando o **Gate (comando)** dela em `tasks.md` passa.
- Uma **feature** só faz merge quando todos os AC estão verdes + lint limpo + typecheck limpo + build bem-sucedido.
- A **CI roda exatamente estes comandos** — falhar bloqueia o merge.
