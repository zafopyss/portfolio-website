import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// Stands in for api/views.ts under `vite dev`, where Vercel functions don't run.
function devViewsApi(): Plugin {
  let views = 41;
  return {
    name: 'dev-views-api',
    configureServer(server) {
      server.middlewares.use('/api/views', (req, res) => {
        if (req.method === 'POST') views += 1;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ views }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devViewsApi()],
  server: { host: true },
});
