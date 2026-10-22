---
name: spec
description: Contrato da feature 0012 - Admin layout e caixa de rascunhos.
alwaysApply: false
---

# Admin: layout e caixa de rascunhos

Escopo autorizado: melhorar layout, eliminar sobreposições e guardar rascunhos.

- Publicações e categorias não transbordam a página entre 320 e 1440 px; a tabela pode rolar dentro de seu container.
- Caixa permite criar, salvar e reabrir múltiplos rascunhos de título/texto, persistidos neste navegador, com indicação clara desse limite.
- Abrir no editor carrega o rascunho selecionado como draft sem publicar e preserva a cópia da caixa.
- Falha no armazenamento apresenta erro e preserva os campos digitados.
- Dados digitados são renderizados como texto, sem interpretar HTML.

Fora de escopo: sincronização entre dispositivos e publicação automática.

- Cada rascunho pode ser excluído mediante confirmação. Cancelar preserva os dados; falhas de armazenamento exibem erro. O texto aberto permanece disponível para ser guardado novamente.
