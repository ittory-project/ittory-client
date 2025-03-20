import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    allowedHosts: ["dev-client.ittory.co.kr"],
  },
  // build: {
  // outDir: 'build',
  // emptyOutDir: true,
  // rollupOptions: {
  //   input: './src/main.tsx',
  // },
  // },
});
