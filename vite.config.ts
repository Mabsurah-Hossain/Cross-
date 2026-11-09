import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function indexHtmlSupport(): Plugin {
  return {
    name: 'index-html-support',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && /^\/index\.html/i.test(req.url)) {
          const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          req.url = '/index.html' + query;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && /^\/index\.html/i.test(req.url)) {
          const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          req.url = '/index.html' + query;
        }
        next();
      });
    },
    closeBundle() {
      try {
        const distIndex = path.resolve('dist', 'index.html');
        const distUpperIndex = path.resolve('dist', 'Index.HTML');
        if (fs.existsSync(distIndex)) {
          fs.copyFileSync(distIndex, distUpperIndex);
        }
      } catch {}
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), indexHtmlSupport()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});

