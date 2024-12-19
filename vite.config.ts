import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
  },
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/main.tsx',
    },
  },

});
