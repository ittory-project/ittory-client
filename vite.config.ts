import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
  ],
  define: {
    global: 'window',
  },
  server: {
    allowedHosts: ['dev-client.ittory.co.kr'],
  },
  // build: {
  // outDir: 'build',
  // emptyOutDir: true,
  // rollupOptions: {
  //   input: './src/main.tsx',
  // },
  // },
});
