import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@locator/babel-jsx/dist',
            {
              env: 'development',
            },
          ],
        ],
      },
    }),
    svgr(),
    mkcert(),
    sentryVitePlugin({
      org: 'ittory-dev',
      project: 'javascript-react',
    }),
  ],
  define: {
    global: 'window',
  },
  server: {
    allowedHosts: ['dev-client.ittory.co.kr', '*.ngrok-free.app'],
  },
  build: {
    // @see https://github.com/vitejs/vite/issues/19402
    assetsInlineLimit: 0,

    sourcemap: true,
  },

  // build: {
  // outDir: 'build',
  // emptyOutDir: true,
  // rollupOptions: {
  //   input: './src/main.tsx',
  // },
  // },
});
