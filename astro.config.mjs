import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cult.thalyson.com',
  output: 'static',
  outDir: './out',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [
      {
        // Dev-only: /admin e /editor sem barra final redirecionam em vez de dar 404.
        name: 'cult-dev-trailing-slash-redirect',
        enforce: 'post',
        configureServer(server) {
          return () => {
            server.middlewares.stack.unshift({
              route: '',
              handle: (req, res, next) => {
                const [pathname, query = ''] = (req.url || '').split('?');
                if (pathname !== '/admin' && pathname !== '/editor') return next();
                res.statusCode = 308;
                res.setHeader('Location', `${pathname}/${query ? `?${query}` : ''}`);
                res.end();
              }
            });
          };
        }
      },
      {
        name: 'cult-editor-dev-api',
        enforce: 'pre',
        configureServer(server) {
          const apiMiddleware = async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/editor')) {
              try {
                const { handleEditorApi } = await server.ssrLoadModule('./src/infrastructure/editor-dev-middleware.ts');
                await handleEditorApi(req, res, next);
              } catch (err) {
                next(err);
              }
              return;
            }
            next();
          };

          if (server.middlewares.stack) {
            server.middlewares.stack.unshift({ route: '', handle: apiMiddleware });
          } else {
            server.middlewares.use(apiMiddleware);
          }
        }
      }
    ]
  }
});
