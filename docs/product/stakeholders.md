---
name: stakeholders
description: Mapa de stakeholders — quem influencia ou é impactado pelo produto. Puxe ao priorizar, alinhar ou comunicar decisões.
alwaysApply: false
---

# Mapa de Stakeholders — cult.thalyson.com

> Quem tem **interesse** ou **influência** no produto (Lean Inception). Define quem engajar de perto vs manter informado.

## Stakeholders
| Stakeholder          | Papel                 | Interesse (o que quer)                                         | Influência | Como engajar                     |
|----------------------|-----------------------|----------------------------------------------------------------|------------|----------------------------------|
| **Curador / Autor**  | Criador de Conteúdo   | Facilidade para escrever em Markdown, categorizar e publicar   | Alta       | Feedback contínuo no fluxo SDD   |
| **Leitores / Usuários** | Consumidores finais| Leitura prazerosa, navegação rápida, tipografia elegante       | Alta       | Métricas de engajamento e leitura|
| **Mantenedor / DevOps** | Engenharia / Infra | Estabilidade do Docker/Fly.io, build veloz e baixo custo       | Média      | CI automatizado e testes estritos|

## Matriz interesse × influência

```
Influência ▲
     alta │  Mantenedor / DevOps        │  Curador / Autor
          │                             │  Leitores Principais
          │─────────────────────────────┼─────────────────────────────
    baixa │  Visitantes Casuais         │  Comunidade Editorial
          └─────────────────────────────┴─────────────────────────────►
                 baixo                 Interesse                 alto
```

## Personas-chave (resumo)
- **Leitor Crítico:** Busca ensaios de alta densidade sem anúncios ou distrações; valoriza tipografia e estética refinada.
- **Explorador Cult:** Busca conexões entre cinema, música e literatura; valoriza listas temáticas e tags precisas.
- **Curador:** Responsável pela linha editorial, criação dos textos e curadoria das obras indicadas.
