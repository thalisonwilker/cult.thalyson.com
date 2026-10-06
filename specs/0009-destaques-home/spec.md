---
name: spec
description: Contrato da feature Destaques da Home (máx. 3 publicações destacadas, grade de 3). Base enquanto a feature está ativa.
alwaysApply: true
---

# Spec — Destaques da Home (0009)

> **Fonte da verdade.** Status: **implementado**
> Tier: **Pequeno** (`spec.md` + `tasks.md`) — adiciona um campo opcional ao frontmatter e
> reaproveita os endpoints DEV existentes; sem nova fronteira de domínio nem decisão irreversível.

## Resumo
O autor passa a escolher manualmente quais publicações aparecem no bloco **"Em Destaque"** da Home
(campo `featured` no frontmatter), com limite rígido de **3 Destaques** publicados — marcar um 4º
substitui automaticamente o mais antigo — e o bloco passa a ser uma **grade responsiva de 3 cards
de mesmo peso**, substituindo a composição atual 2fr/1fr com publicação primária fixa no código.

## Linguagem ubíqua (novo termo)
- **Destaque** — Publicação não-rascunho com `featured: true`, exibida no bloco "Em Destaque" da
  Home. Existem no máximo 3 Destaques. Um rascunho com `featured: true` **não** é Destaque
  (não aparece no site nem conta no limite).

## Critérios de aceite

### AC-1: Campo `featured` no frontmatter
- **Dado** um arquivo em `src/content/ensaios/*.md`
- **Quando** o frontmatter contém `featured: true`, `featured: false` ou não contém o campo
- **Então** o schema da Content Collection aceita os três casos, com `false` como padrão, e o
  build continua passando para publicações antigas sem o campo

### AC-2: Marcar/desmarcar Destaque no editor
- **Dado** o editor `/editor/` aberto (nova publicação ou edição de existente)
- **Quando** o autor marca ou desmarca o checkbox **"Destacar na Home (featured: true)"** e clica em
  "Salvar Publicação"
- **Então** o arquivo `.md` é gravado com `featured: true` ou `featured: false` no frontmatter, e ao
  reabrir a publicação (`?slug=`) o checkbox reflete o valor salvo

### AC-3: Marcar/desmarcar Destaque no painel admin
- **Dado** o painel `/admin/` listando as publicações
- **Quando** o autor clica no toggle de Destaque (ícone de estrela) na linha de uma publicação
- **Então** o campo `featured` daquele arquivo é invertido em disco (sem alterar nenhum outro campo
  do frontmatter nem o corpo), a linha passa a exibir o estado atualizado e um toast confirma a ação

### AC-4: Limite de 3 — substituição automática do Destaque mais antigo
- **Dado** que já existem 3 Destaques (publicações não-rascunho com `featured: true`)
- **Quando** o autor marca uma 4ª publicação não-rascunho como Destaque (pelo editor ou pelo admin)
- **Então** a publicação marcada é salva com `featured: true`, o Destaque com `pubDate` **mais
  antiga** entre os 3 anteriores é regravado com `featured: false`, e o toast informa qual foi
  substituído — ex.: *"Destaque salvo. "\<título\>" saiu dos destaques (limite de 3)."*

### AC-5: Rascunhos não contam no limite nem aparecem no site
- **Dado** uma publicação com `draft: true` e `featured: true`
- **Quando** o limite é avaliado (AC-4) ou a Home é renderizada (em DEV ou PROD)
- **Então** ela não conta para o limite de 3, nenhuma substituição é disparada por ela, e ela não
  aparece no bloco "Em Destaque"; ao ser salva depois com `draft: false`, passa a valer a regra AC-4

### AC-6: Home exibe somente os Destaques (0 a 3)
- **Dado** N Destaques no acervo
- **Quando** a Home (`/`, sem filtros ativos) é renderizada
- **Então** o bloco "Em Destaque" exibe exatamente os Destaques, ordenados por `pubDate`
  decrescente, no máximo 3; nenhuma publicação não-destacada é usada para completar a grade; e a
  seleção hardcoded por slug (`o-banzeiro-do-carimbo-e-a-voz-de-dona-onete`) deixa de existir

### AC-7: Seção oculta quando não há Destaques
- **Dado** que não existe nenhum Destaque
- **Quando** a Home é renderizada
- **Então** a seção `#em-destaque` não é emitida no HTML e o CTA do Hero ("Explorar histórias")
  aponta para `#todas-historias`

### AC-8: Grade responsiva de 3 itens
- **Dado** o bloco "Em Destaque" com 1 a 3 cards
- **Quando** visualizado em diferentes larguras de viewport
- **Então** os cards têm o mesmo peso visual e **proporção compacta** (não dominam a dobra):
  - imagem de capa em proporção **2:1** com altura máxima de **200px** (`object-fit: cover`,
    respeitando `coverImagePosition`)
  - título em fonte de card (≈ 1.15–1.3rem, `clamp`) limitado a **2 linhas**; lead limitado a
    **2 linhas** (reticências); rodapé com data, tempo de leitura e "Ler"
  - largura máxima de cada card de **380px**; a grade inteira fica contida no `site-container`
  - os cards se organizam em:
  - **≥ 1024px:** 3 colunas iguais
  - **640px – 1023px:** 2 colunas (3º card ocupa a próxima linha)
  - **< 640px:** 1 coluna
  - Com 1 ou 2 Destaques, os cards mantêm a largura de 1 coluna da grade de 3 (não esticam para
    preencher a linha)

## Matriz de decisão — efeito de salvar/alternar Destaque

| Publicação alvo: `draft` | Alvo: `featured` resultante | Destaques *outros* já existentes | Resultado esperado | AC |
|---|---|---|---|---|
| false | true  | 0, 1 ou 2 | Salva alvo; ninguém é desmarcado | AC-2, AC-3 |
| false | true  | 3         | Salva alvo; desmarca o Destaque de `pubDate` mais antiga; toast cita o título | AC-4 |
| false | true  | — (alvo já era Destaque, só re-salvo) | Nada é substituído (o alvo não conta como "outro") | AC-4 |
| false | false | —         | Salva alvo desmarcado; ninguém é afetado | AC-2, AC-3 |
| true  | true  | qualquer  | Salva alvo com `featured: true`; ninguém é desmarcado; não aparece na Home | AC-5 |
| true  | false | qualquer  | Salva alvo desmarcado; ninguém é afetado | AC-5 |

## Casos de borda e erros
- Empate de `pubDate` entre Destaques candidatos à substituição → sai o de **slug** em ordem
  alfabética crescente primeiro (desempate determinístico).
- Mais de 3 Destaques já no disco (edição manual do Markdown) → a Home exibe só os 3 mais recentes;
  ao próximo salvamento de um Destaque via editor/admin, os excedentes mais antigos são desmarcados
  até restarem 3 (incluindo o alvo).
- Renomear o slug de uma publicação Destaque (título alterado) → o `featured` é preservado no novo
  arquivo e o antigo é removido (comportamento atual do `saveEssay`), sem disparar substituição.
- Excluir uma publicação Destaque → simplesmente deixa de ser Destaque; nenhuma outra é promovida.
- Falha ao regravar o Destaque substituído → a resposta da API retorna erro e o toast exibe a
  mensagem; o alvo pode já estar salvo (sem transação), e o admin recarrega a lista refletindo o disco.
- Toggle no admin para slug inexistente → API responde 404 e o toast exibe
  "Publicação não encontrada."

## Fora de escopo
> Vinculante. Não implemente nada aqui.
- Ordenação manual dos Destaques (drag & drop / posição fixa) — a ordem é sempre `pubDate` desc.
- Destaques por categoria, por território ou na visualização filtrada da Home.
- Agendamento/expiração automática de Destaques.
- Alterar os demais blocos da Home ("Explore a Cultura", "Belém & Pará", "Últimas Histórias").
- Autenticação nas rotas `/editor/` e `/admin/`.

## Rastreabilidade
- Specs relacionadas: [0004 — Home revista](../0004-home-revista-editorial-para/spec.md),
  [0005 — Editor local](../0005-editor-conteudo-local/spec.md),
  [0006 — Painel admin](../0006-painel-admin-local/spec.md)
- ADRs relacionados: [ADR-0003](../../docs/architecture/adr/0003-conteudo-local-content-collections.md)
