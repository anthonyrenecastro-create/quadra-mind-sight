import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Canonical origin of the deployed app (set VITE_APP_URL in .env).
  // Falls back to a relative id for local/dev builds.
  const appOrigin = (env.VITE_APP_URL || '').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: appOrigin || '/',
          start_url: '/',
          scope: '/',
          name: 'quadraminds.ai',
          short_name: 'quadraminds.ai',
          description: 'Guided consciousness-exploration, metacognitive training, binaural spatial audio, four-quadrant cognitive exercises, and AI-guided dialectic introspection.',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          dir: 'ltr',
          lang: 'en',
          categories: ['health', 'fitness', 'education'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        output: {
          // Split rarely-changing vendor code into long-lived cacheable chunks.
          // View code is already split via React.lazy in App.tsx.
          // (Function form: the object form fails to match subpath imports
          // like 'react-dom/client'.)
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('node_modules/react-dom') ||
                /node_modules\/react\//.test(id) ||
                id.includes('node_modules/scheduler')
              ) {
                return 'vendor-react';
              }
              if (id.includes('node_modules/lucide-react')) {
                return 'vendor-icons';
              }
            }
          },
        },
      },
    },
  };
});
