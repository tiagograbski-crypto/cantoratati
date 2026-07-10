import { defineConfig } from 'vite';
import { resolve } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

const AGENDA_FILE = resolve(__dirname, 'public/data/agenda.json');

function agendaDevApi() {
  return {
    name: 'agenda-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/api/agenda/save' || req.method !== 'POST') {
          next();
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

          const payload = {
            updatedAt: new Date().toISOString(),
            dates: body.dates || {},
          };

          await mkdir(dirname(AGENDA_FILE), { recursive: true });
          await writeFile(AGENDA_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, ...payload }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    host: true,
    port: 5173,
    open: false,
  },
  preview: {
    host: true,
    port: 4173,
  },
  plugins: [agendaDevApi()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    assetsInlineLimit: 4096,
  },
});
