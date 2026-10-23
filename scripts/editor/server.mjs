import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createStore } from './store.mjs';

const DEFAULT_CONTENT_DIR = fileURLToPath(new URL('../../src/content/ensaios', import.meta.url));
const CATEGORIES_FILE = fileURLToPath(new URL('../../src/data/categories.json', import.meta.url));

export function createEditorServer({ contentDir = DEFAULT_CONTENT_DIR } = {}) {
  const store = createStore(contentDir);
  const token = randomBytes(32).toString('hex');

  return http.createServer(async (req, res) => {
    const origin = `http://127.0.0.1:${req.socket.localPort}`;
    const send = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(body));
    };

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    try {
      const url = new URL(req.url, origin);
      const pathname = url.pathname;

      // Validação de Host
      if (req.headers.host && !req.headers.host.startsWith('127.0.0.1') && !req.headers.host.startsWith('localhost')) {
        return send(403, { error: 'Acesse pelo endereço 127.0.0.1 exibido no terminal.' });
      }

      // Servir arquivos estáticos do editor e dashboard
      const assets = {
        '/': ['index.html', 'text/html'],
        '/editor.js': ['editor.js', 'text/javascript'],
        '/editor.css': ['editor.css', 'text/css'],
        '/admin': ['admin.html', 'text/html'],
        '/dashboard': ['admin.html', 'text/html'],
        '/admin.js': ['admin.js', 'text/javascript'],
        '/admin.css': ['admin.css', 'text/css'],
      };

      if (req.method === 'GET' && assets[pathname]) {
        const [filename, contentType] = assets[pathname];
        const filePath = fileURLToPath(new URL(filename, import.meta.url));
        try {
          const content = await readFile(filePath);
          res.writeHead(200, { 'Content-Type': `${contentType}; charset=utf-8` });
          return res.end(content);
        } catch {
          return send(404, { error: 'Arquivo não encontrado.' });
        }
      }

      // API: Categorias
      if (pathname === '/api/categories' && req.method === 'GET') {
        try {
          const raw = await readFile(CATEGORIES_FILE, 'utf8');
          return send(200, JSON.parse(raw));
        } catch {
          return send(200, []);
        }
      }

      // API: Métricas do Dashboard Admin
      if (pathname === '/api/admin/metrics' && req.method === 'GET') {
        const data = await store.metrics();
        return send(200, { ...data, token });
      }

      // API: Toggle de Destaque na Home
      if (pathname === '/api/admin/featured' && req.method === 'POST') {
        if (req.headers['x-editor-token'] !== token) {
          return send(403, { error: 'Token de sessão inválido ou expirado.' });
        }

        let body = '';
        req.setEncoding('utf8');
        for await (const chunk of req) {
          body += chunk;
        }

        let payload;
        try {
          payload = JSON.parse(body);
        } catch {
          return send(400, { error: 'JSON inválido.' });
        }

        if (!payload.slug) {
          return send(400, { error: 'Slug do ensaio é obrigatório.' });
        }

        const result = await store.toggleFeatured(payload.slug);
        return send(200, result);
      }

      // API: Lista de Ensaios / Obter Token
      if (pathname === '/api/essays' && req.method === 'GET') {
        const essays = await store.list();
        return send(200, { essays, token });
      }

      // API: Salvar Ensaio
      if (pathname === '/api/essays' && req.method === 'POST') {
        if (req.headers['x-editor-token'] !== token) {
          return send(403, { error: 'Token de sessão inválido ou expirado. Recarregue a página.' });
        }

        let body = '';
        req.setEncoding('utf8');
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 2000000) {
            return send(413, { error: 'O ensaio excede o limite de 2 MB.' });
          }
        }

        let payload;
        try {
          payload = JSON.parse(body);
        } catch {
          return send(400, { error: 'JSON inválido.' });
        }

        const saved = await store.save(payload);
        return send(200, { success: true, essay: saved });
      }

      // API: Detalhe do Ensaio / Exclusão
      const essayMatch = pathname.match(/^\/api\/essays\/([a-z0-9-]+)$/);
      if (essayMatch) {
        const slug = essayMatch[1];

        if (req.method === 'GET') {
          const essay = await store.get(slug);
          if (!essay) {
            return send(404, { error: 'Ensaio não encontrado.' });
          }
          return send(200, { essay, token });
        }

        if (req.method === 'DELETE') {
          if (req.headers['x-editor-token'] !== token) {
            return send(403, { error: 'Token de sessão inválido.' });
          }
          await store.remove(slug);
          return send(200, { success: true, slug });
        }
      }

      return send(404, { error: 'Rota não encontrada.' });
    } catch (err) {
      console.error('[Editor Server Error]', err);
      send(err.status || 500, { error: err.message || 'Erro interno no servidor do editor.' });
    }
  });
}
