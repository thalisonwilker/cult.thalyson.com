import { Crepe } from '@milkdown/crepe';
import { replaceAll } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame-dark.css';

const textarea = document.querySelector<HTMLTextAreaElement>('#field-body');
const host = document.querySelector<HTMLElement>('#markdown-editor');
const sourceHost = document.querySelector<HTMLElement>('#markdown-source');
const visualButtonEl = document.querySelector<HTMLButtonElement>('#editor-mode-visual');
const sourceButtonEl = document.querySelector<HTMLButtonElement>('#editor-mode-source');
const hint = document.querySelector<HTMLElement>('#editor-mode-hint');

if (textarea && host && sourceHost && visualButtonEl && sourceButtonEl && hint) {
  const field = textarea, visualHost = host, codeHost = sourceHost, help = hint;
  const visualButton = visualButtonEl, sourceButton = sourceButtonEl;
  let visual: Crepe | undefined;
  let source: EditorView | undefined;
  let mode: 'visual' | 'source' = 'source';
  let syncing = false;
  let mounted = false;
  let visualBaseline: unknown;
  let pending = 0;
  let queue = Promise.resolve();
  // HTML legado deve permanecer intacto, sem passar pelo serializador visual.
  const requiresSource = (text: string) => /<(div|p|span|figure|table|iframe|center|section|details|img|br|video|audio|a)\b[^>]*>|<!--[\s\S]*?-->/i.test(text);
  const setPressed = () => {
    visualButton.setAttribute('aria-pressed', String(mode === 'visual'));
    sourceButton.setAttribute('aria-pressed', String(mode === 'source'));
  };
  const publish = (value: string) => {
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const sourceExtensions = [basicSetup, markdown(), oneDark, EditorView.lineWrapping,
    EditorView.contentAttributes.of({ 'aria-label': 'Código Markdown', lang: 'pt-BR' }),
    EditorView.updateListener.of(update => {
      if (update.docChanged && !syncing && !pending && mode === 'source') publish(update.state.doc.toString());
    })];
  function flush() {
    if (syncing || pending) return;
    if (mode === 'visual' && visual && visual.editor.action(ctx => ctx.get(editorViewCtx).state.doc !== visualBaseline)) field.value = visual.getMarkdown();
    if (mode === 'source' && source) field.value = source.state.doc.toString();
  }
  async function showMode(requested: 'visual' | 'source', value: string, explicit = false) {
    syncing = true;
    visualButton.disabled = true; sourceButton.disabled = true;
    try {
      const html = requiresSource(value) && !(explicit && requested === 'visual');
      mode = html ? 'source' : requested;
      if (mode === 'visual') {
        if (!visual) {
          visual = new Crepe({
            root: visualHost,
            defaultValue: value,
            features: {
              [Crepe.Feature.TopBar]: false,
              [Crepe.Feature.Toolbar]: true,
              [Crepe.Feature.BlockEdit]: true,
              [Crepe.Feature.ListItem]: true,
              [Crepe.Feature.LinkTooltip]: true,
              [Crepe.Feature.ImageBlock]: true,
              [Crepe.Feature.CodeMirror]: true,
              [Crepe.Feature.Table]: true,
              [Crepe.Feature.Latex]: false,
            },
            featureConfigs: {
              [Crepe.Feature.Toolbar]: { boldLabel: 'Negrito', italicLabel: 'Itálico', linkLabel: 'Link', codeLabel: 'Código', strikethroughLabel: 'Tachado' },
              [Crepe.Feature.BlockEdit]: {
                textGroup: { label: 'Texto', text: { label: 'Parágrafo' }, h1: { label: 'Título 1' }, h2: { label: 'Título 2' }, h3: { label: 'Título 3' }, h4: null, h5: null, h6: null, quote: { label: 'Citação' }, divider: { label: 'Divisor' } },
                listGroup: { label: 'Listas', bulletList: { label: 'Lista com marcadores' }, orderedList: { label: 'Lista numerada' }, taskList: { label: 'Lista de tarefas' } },
                advancedGroup: { label: 'Blocos', image: { label: 'Imagem' }, codeBlock: { label: 'Código' }, table: { label: 'Tabela' } },
              },
              [Crepe.Feature.Placeholder]: { text: 'Comece a escrever ou digite / para inserir um bloco…', mode: 'block' },
            },
          });
          visual.on(listener => listener.updated(() => {
            if (!syncing && !pending && mode === 'visual' && visual!.editor.action(ctx => ctx.get(editorViewCtx).state.doc !== visualBaseline)) {
              publish(visual!.getMarkdown());
            }
          }));
          await visual.create();
          visual.editor.action(ctx => {
            const dom = ctx.get(editorViewCtx).dom;
            dom.setAttribute('role', 'textbox');
            dom.setAttribute('aria-label', 'Conteúdo da publicação');
            dom.setAttribute('aria-multiline', 'true');
            dom.setAttribute('lang', 'pt-BR');
          });
        } else visual.editor.action(replaceAll(value, true));
        visualBaseline = visual.editor.action(ctx => ctx.get(editorViewCtx).state.doc);
      } else if (!source) {
        source = new EditorView({ parent: codeHost, state: EditorState.create({ doc: value, extensions: sourceExtensions }) });
      } else source.setState(EditorState.create({ doc: value, extensions: sourceExtensions }));
      field.hidden = true;
      visualHost.hidden = mode !== 'visual';
      codeHost.hidden = mode !== 'source';
      setPressed();
      help.textContent = html
        ? 'Este texto contém HTML. Ele foi aberto em Markdown para preservar a formatação original.'
        : mode === 'visual' ? 'Selecione um trecho para formatar. Digite / em uma linha vazia para inserir blocos.' : 'Edite o Markdown diretamente.';
      mounted = true;
    } catch (error) {
      console.error('Falha ao iniciar editor', error);
      mode = 'source'; setPressed();
      field.hidden = false; visualHost.hidden = true; codeHost.hidden = true;
      help.textContent = 'Editor visual indisponível. Seu texto está disponível no campo Markdown.';
    } finally { syncing = false; visualButton.disabled = false; sourceButton.disabled = false; }
  }
  function schedule(requested: 'visual' | 'source', explicit = false) {
    pending++;
    queue = queue.then(() => showMode(requested, field.value, explicit)).finally(() => { pending--; });
  }
  field.addEventListener('markdown-load', () => schedule('visual'));
  field.addEventListener('editor-flush', flush);
  const choose = (target: 'visual' | 'source') => {
    if (target === mode) return;
    flush();
    if (target === 'visual' && requiresSource(field.value) &&
      !confirm('Este texto contém HTML. O editor visual pode alterar ou descartar essa formatação ao salvar. Abrir mesmo assim?')) return;
    schedule(target, true);
  };
  visualButton.addEventListener('click', () => choose('visual'));
  sourceButton.addEventListener('click', () => choose('source'));
  // Captura o valor mais recente caso a restauração assíncrona termine antes da montagem.
  schedule('visual');
  window.addEventListener('pagehide', () => { if (mounted) flush(); });
}
