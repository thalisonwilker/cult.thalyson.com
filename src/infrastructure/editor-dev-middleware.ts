import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  getCategories,
  saveCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  listEssays,
  getEssay,
  saveEssay,
  setFeatured,
  deleteEssay,
  saveImageLocally
} from './editor-storage.ts';

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export async function handleEditorApi(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const url = new URL(req.url || '/', 'http://localhost');
  const pathname = url.pathname.replace(/\/+$/, '') || '/';

  if (!pathname.startsWith('/api/editor')) {
    return next();
  }

  res.setHeader('Content-Type', 'application/json');

  try {
    if (pathname === '/api/editor/categories') {
      if (req.method === 'GET') {
        const categories = await getCategories();
        res.end(JSON.stringify({ ok: true, categories }));
        return;
      }
      if (req.method === 'POST') {
        const raw = await readBody(req);
        const data = JSON.parse(raw.toString('utf-8'));

        if (data.action === 'add' && data.item) {
          const updated = await addCategory(data.item);
          res.end(JSON.stringify({ ok: true, categories: updated }));
          return;
        }

        if (data.action === 'update' && data.value && data.label) {
          const updated = await updateCategory(data.value, data.label);
          res.end(JSON.stringify({ ok: true, categories: updated }));
          return;
        }

        if (data.action === 'delete' && data.value) {
          const updated = await deleteCategory(data.value);
          res.end(JSON.stringify({ ok: true, categories: updated }));
          return;
        }

        const categories = data.categories || data;
        const updated = await saveCategories(categories);
        res.end(JSON.stringify({ ok: true, categories: updated }));
        return;
      }
    }

    if (pathname === '/api/editor/essays') {
      if (req.method === 'GET') {
        const essays = await listEssays();
        res.end(JSON.stringify({ ok: true, essays }));
        return;
      }
    }

    if (pathname === '/api/editor/essay') {
      if (req.method === 'GET') {
        const slug = url.searchParams.get('slug');
        if (!slug) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: 'Parâmetro slug é obrigatório.' }));
          return;
        }
        const essay = await getEssay(slug);
        if (!essay) {
          res.statusCode = 404;
          res.end(JSON.stringify({ ok: false, error: 'Publicação não encontrada.' }));
          return;
        }
        res.end(JSON.stringify({ ok: true, essay }));
        return;
      }

      if (req.method === 'DELETE') {
        const slug = url.searchParams.get('slug');
        if (!slug) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: 'Parâmetro slug é obrigatório.' }));
          return;
        }
        const deleted = await deleteEssay(slug);
        if (!deleted) {
          res.statusCode = 404;
          res.end(JSON.stringify({ ok: false, error: 'Publicação não encontrada para exclusão.' }));
          return;
        }
        res.end(JSON.stringify({ ok: true, message: 'Publicação excluída com sucesso.' }));
        return;
      }
    }

    if (pathname === '/api/editor/delete' && req.method === 'POST') {
      const raw = await readBody(req);
      const data = JSON.parse(raw.toString('utf-8'));
      const slug = data.slug;
      if (!slug) {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'Parâmetro slug é obrigatório.' }));
        return;
      }
      const deleted = await deleteEssay(slug);
      if (!deleted) {
        res.statusCode = 404;
        res.end(JSON.stringify({ ok: false, error: 'Publicação não encontrada para exclusão.' }));
        return;
      }
      res.end(JSON.stringify({ ok: true, message: 'Publicação excluída com sucesso.' }));
      return;
    }

    if (pathname === '/api/editor/save' && req.method === 'POST') {
      const raw = await readBody(req);
      const data = JSON.parse(raw.toString('utf-8'));
      const { originalSlug, ...essayData } = data;
      const result = await saveEssay(essayData, originalSlug);
      res.end(JSON.stringify(result));
      return;
    }

    if (pathname === '/api/editor/featured' && req.method === 'POST') {
      const raw = await readBody(req);
      const data = JSON.parse(raw.toString('utf-8'));
      const slug = data.slug;
      const featured = Boolean(data.featured);
      if (!slug) {
        res.statusCode = 400;
        res.end(JSON.stringify({ ok: false, error: 'Parâmetro slug é obrigatório.' }));
        return;
      }
      try {
        const result = await setFeatured(slug, featured);
        res.end(JSON.stringify(result));
      } catch (err: any) {
        res.statusCode = 404;
        res.end(JSON.stringify({ ok: false, error: err.message || 'Erro ao alterar destaque.' }));
      }
      return;
    }

    if (pathname === '/api/editor/upload-image' && req.method === 'POST') {
      const headerFilename = req.headers['x-filename'];
      const filename = headerFilename
        ? decodeURIComponent(Array.isArray(headerFilename) ? headerFilename[0] : headerFilename)
        : 'imagem.jpg';
      const raw = await readBody(req);
      const result = await saveImageLocally(filename, raw);
      res.end(JSON.stringify(result));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ ok: false, error: 'Rota não encontrada.' }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ ok: false, error: err.message || 'Erro interno no servidor.' }));
  }
}
