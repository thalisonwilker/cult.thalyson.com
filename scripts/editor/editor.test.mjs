import { describe, it, expect, afterEach } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore, validateEssay } from './store.mjs';
import { createEditorServer } from './server.mjs';

const sampleEssay = {
  slug: 'teste-editor',
  title: 'Ensaio de Teste',
  description: 'Lead de teste do editor',
  category: 'musica',
  territory: 'para',
  pubDate: '2026-10-22',
  author: 'Thalyson',
  tags: ['carimbo', 'belem'],
  draft: false,
  featured: false,
  body: '## Corpo do Ensaio\n\nTexto de teste.',
};

describe('scripts/editor', () => {
  let tempDirs = [];

  afterEach(async () => {
    for (const d of tempDirs) {
      await rm(d, { recursive: true, force: true }).catch(() => {});
    }
    tempDirs = [];
  });

  async function createTempFixture() {
    const dir = await mkdtemp(join(tmpdir(), 'cult-editor-'));
    tempDirs.push(dir);
    return { dir, store: createStore(dir) };
  }

  it('store: cria, lista, consulta e remove um ensaio em markdown', async () => {
    const { store } = await createTempFixture();
    const saved = await store.save(sampleEssay);
    expect(saved.slug).toBe('teste-editor');

    const list = await store.list();
    expect(list.length).toBe(1);
    expect(list[0].slug).toBe('teste-editor');

    const fetched = await store.get('teste-editor');
    expect(fetched.title).toBe('Ensaio de Teste');
    expect(fetched.body).toBe('## Corpo do Ensaio\n\nTexto de teste.');

    await store.remove('teste-editor');
    const afterRemoveList = await store.list();
    expect(afterRemoveList.length).toBe(0);
  });

  it('store: validação rejeita slug e campos obrigatórios inválidos', () => {
    expect(() => validateEssay({ ...sampleEssay, slug: 'Slug Inválido!' })).toThrow();
    expect(() => validateEssay({ ...sampleEssay, title: '' })).toThrow();
    expect(() => validateEssay({ ...sampleEssay, body: '' })).toThrow();
  });

  it('AC-7: server responde 200 para /api/essays e emite token de sessão para dev isolado', async () => {
    const { dir } = await createTempFixture();
    const server = createEditorServer({ contentDir: dir });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    try {
      const port = server.address().port;
      const res = await fetch(`http://127.0.0.1:${port}/api/essays`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.token).toBeDefined();
      expect(Array.isArray(data.essays)).toBe(true);
    } finally {
      server.close();
    }
  });
});
