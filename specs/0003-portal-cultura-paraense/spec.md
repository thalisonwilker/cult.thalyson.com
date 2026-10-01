---
name: spec
description: Contrato da feature 0003 - Portal e Home da Cultura Paraense.
alwaysApply: true
---

# Spec — 0003: Portal & Home da Cultura Paraense

> **Fonte da verdade.** Status: aprovado

## Resumo
Recriar a página inicial do portal transformando o `cult.thalyson.com` no ponto de encontro e acervo de curadoria aprofundada da cultura do Pará e de Belém (Música, Cinema, Literatura, Tradições, Gastronomia e Patrimônio), mantendo janelas de diálogo com a arte nacional e internacional.

## Critérios de aceite

### AC-1: Extensão do Schema de Conteúdo com Território e Localidade
- **Dado** o schema Zod em `src/content/config.ts`
- **Quando** um ensaio for criado com os campos opcionais `territory` (`'para'` | `'nacional'` | `'global'`) e `locality` (`'Belém'`, etc.)
- **Então** a tipagem deve validar os dados e expor nos componentes sem erros de compilação.

### AC-2: Hero Temático da Cultura Paraense na Home
- **Dado** a página inicial `/`
- **Quando** o leitor acessar o site
- **Então** deve visualizar o Hero com manchete celebrando a cultura paraense, referências estéticas a Belém (Ver-o-Peso, rios, ritmo e tradição) e botões de atalho temáticos.

### AC-3: Filtro e Segmentação por Território
- **Dado** a lista de ensaios na Home
- **Quando** o usuário clica nas abas de território (`Todos`, `Pará & Belém`, `Nacional`, `Mundo`)
- **Então** a visualização deve filtrar os ensaios de forma responsiva de acordo com o escopo selecionado.

### AC-4: Destaque das Manifestações Culturais do Pará
- **Dado** o feed de publicações
- **Quando** houver ensaios do Pará
- **Então** cada card deve exibir o badge da localidade (ex: 📍 Belém do Pará) e da categoria temática.

### AC-5: Ensaios Icônicos da Tradição e Modernidade Paraense
- **Dado** o acervo de conteúdo em `src/content/ensaios/`
- **Quando** o build estático rodar
- **Então** devem existir ensaios dedicados às manifestações do Pará (ex: Carimbó/Dona Onete, Guitarrada/Mestre Vieira, Círio de Nazaré) renderizando perfeitamente.

## Rastreabilidade
- Product: [`./product.md`](./product.md)
- Design: [`./design.md`](./design.md)
- Domínio: [`./domain.md`](./domain.md)
- Tasks: [`./tasks.md`](./tasks.md)
