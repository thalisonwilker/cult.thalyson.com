import { createEditorServer } from './server.mjs';

const port = Number(process.env.EDITOR_PORT || 3001);
const server = createEditorServer();

server.listen(port, '127.0.0.1', () => {
  console.log(`\nEditor local CULT ativo em: http://127.0.0.1:${port}/\n`);
});
