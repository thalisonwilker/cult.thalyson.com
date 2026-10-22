---
name: spec
description: Contrato da feature 0014 - Editor visual e organização da escrita.
alwaysApply: false
---

# Editor visual e organização da escrita

Pedido de 2026-10-07 substitui a restrição WYSIWYG da spec 0013.

- Escrita visual com Milkdown Crepe, menu de blocos `/` e formatação contextual ao selecionar texto; sem barra fixa de formatação.
- Seletor segmentado discreto `Editor | Markdown` na área de escrita; título grande no topo e corpo centralizado (~780px).
- Metadados, capa e referências organizados em seções recolhíveis; corpo do texto em destaque.
- Markdown continua sendo o formato de preview, rascunhos, exportação e salvamento (nenhuma mudança de API/backend).
- Modo Markdown preserva HTML dos artigos anteriores sem conversão silenciosa. Conteúdo com tags HTML relevantes (`div|p|span|figure|table|iframe|center|section|details|img|br|video|audio|a` ou comentários) abre nesse modo; migrar para o visual exige confirmação explícita do usuário.
- Falha de inicialização mantém acesso ao textarea e ao conteúdo.
- Validar seleção, digitação, menu, Markdown serializado, restauração e layout mobile; typecheck e testes.

## Nota de arquitetura
O projeto é Astro + TS + Vanilla CSS (sem React). O Crepe é usado diretamente (`@milkdown/crepe`), não via `@milkdown/react`; o estado único é o `<textarea id="field-body">` (adaptador), alimentado pelos dois modos via `listener.updated` / CodeMirror.
