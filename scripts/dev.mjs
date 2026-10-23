import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { createEditorServer } from './editor/server.mjs';

process.env.NODE_ENV = 'development';
const require = createRequire(import.meta.url);
const port = Number(process.env.EDITOR_PORT || 3001);
const server = createEditorServer();
let next;

server.on('error', (error) => {
  console.error(`Não foi possível abrir o editor: ${error.message}. Use EDITOR_PORT para escolher outra porta.`);
  next?.kill('SIGTERM');
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`\nEditor local CULT ativo em: http://127.0.0.1:${server.address().port}\n`);
  next = spawn(
    process.execPath,
    [require.resolve('next/dist/bin/next'), 'dev', '--hostname', '127.0.0.1', ...process.argv.slice(2)],
    { stdio: 'inherit' }
  );
  next.on('error', (error) => {
    console.error(error);
    server.close();
    process.exitCode = 1;
  });
  next.on('exit', (code) => {
    server.close();
    process.exitCode = code ?? 0;
  });
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    next?.kill(signal);
    server.close();
  });
}
