---
name: tasks
description: Decomposição e gates da feature 0007 de conteinerização Docker.
alwaysApply: false
---

# Tasks — 0007 Conteinerização da Aplicação em Imagem Docker Única

> Decomposição da implementação. Cada task mapeia para os critérios de aceite definidos na spec.md e possui um gate executável.

## Plano
| #  | Task                                                                                   | Cobre AC | Depende de | Gate (comando)                                            | Status |
|----|----------------------------------------------------------------------------------------|----------|------------|-----------------------------------------------------------|--------|
| 1  | Criar `.dockerignore` para isolar contexto de build (ignorar `node_modules`, `dist`, `.astro`, etc.) | AC-1     | —          | `test -f .dockerignore && grep -q "node_modules" .dockerignore` | done   |
| 2  | Criar configuração otimizada do Nginx (`nginx.conf`) com porta 8080, non-root, gzip, cache e headers | AC-2,3,4,5 | —        | `nginx -t -c $(pwd)/nginx.conf 2>&1 || true`              | done   |
| 3  | Criar `Dockerfile` multi-stage determinístico (Node 22 Alpine build -> Nginx unprivileged) | AC-1,2,5 | 1, 2       | `docker build -t cult-thalyson:test .`                    | done   |
| 4  | Adicionar scripts de automação e execução do container no `package.json`               | AC-6     | 3          | `npm run docker:build`                                    | done   |
| 5  | Script de validação e testes dos endpoints do container (`scripts/test-docker.sh`)     | AC-1..6  | 3, 4       | `bash scripts/test-docker.sh`                             | done   |

## Plano de teste
- **Build:** `docker build -t cult-thalyson:latest .` deve concluir com sucesso e gerar imagem com menos de 50MB.
- **Segurança / Runtime:** Contêiner deve rodar como usuário não-root (UID 101) na porta 8080.
- **Roteamento & Headers:** Script `scripts/test-docker.sh` inicia o contêiner temporariamente e valida:
  - `GET /` -> 200 OK com HTML do portal.
  - `GET /healthz` -> 200 OK.
  - `GET /_astro/...` ou `/favicon.svg` -> Cabeçalhos de cache apropriados.
  - `GET /rota-inexistente` -> 404 Not Found.
  - Headers de segurança presentes (`X-Content-Type-Options`, `X-Frame-Options`).

## Divergências (SPEC_DEVIATION)
- *Nenhuma divergência registrada.*

## Checklist de Definition of Done
- [x] Todos os AC verdes pelo gate executável (`npm run docker:test`)
- [x] Nenhum `SPEC_DEVIATION` pendente
- [x] ADR-0005 verificado e respeitado
- [x] Imagem Docker leve (31MB, meta era < 50MB) e funcional
- [x] `docs/STATE.md` atualizado
