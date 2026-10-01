---
name: integrations
description: Ferramentas do time e MCPs. Puxe ao integrar Jira/Confluence/cloud.
alwaysApply: false
---

# Integrações e MCPs — cult.thalyson.com

> Ferramentas que o time utiliza e a estratégia de integrações e MCPs para o projeto.

## Ferramentas do time
| Categoria          | Ferramenta                 | Processo / observação                                        |
|--------------------|----------------------------|--------------------------------------------------------------|
| Gestão de projeto  | Git / Local                | Controle local via repositório e esteira Spec-Driven          |
| Documentação       | In-repo Markdown (`docs/`) | Toda a documentação e contratos vivos moram no repositório    |
| Código & CI        | Git                        | Versionamento local / Git standard                           |
| Cloud / Deploy     | Fly.io / Docker            | Contêineres Docker e deploy via Fly.io                       |
| Observabilidade    | Standard / Logs locais     | Nenhuma ferramenta externa integrada no momento              |
| Comunicação        | N/A                        | Sem canal de comunicação externa por enquanto                |

## MCPs e Conexões
| Ferramenta        | MCP server (proposto/ativo) | Conta/workspace | O que habilita                         | Status     |
|-------------------|-----------------------------|-----------------|----------------------------------------|------------|
| Docker / Fly.io   | Docker / Fly CLI (local)    | Local/CLI       | Gerenciamento de containers e deploys  | Previsto   |

## Como conectar (resumo)
- **Estratégia In-repo**: O projeto opera de forma autônoma com SDD (Spec-Driven Development) diretamente no repositório Git, sem dependência de serviços externos de documentação (como Notion/Confluence) ou gestão de tarefas externa (Jira/Linear).
- **Segredos & Deploy**: Credenciais e tokens de deploy (ex.: Fly.io API tokens) devem ser injetados via variáveis de ambiente, nunca commitados.

## Fluxos habilitados
- Gestão de especificação e desenvolvimento via `specs/` e `docs/`.
- Pipeline de deploy empacotado em Docker e publicado no Fly.io.
