import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cult.thalyson.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [
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
