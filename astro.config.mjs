import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cult.thalyson.com',
  output: 'static',
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [
      {
        name: 'cult-editor-dev-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
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
          });
        }
      }
    ]
  }
});
