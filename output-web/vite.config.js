import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false, // Disable public dir since we're building directly to public
  build: {
    outDir: 'public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    // Copy JSON file to output
    copyPublicDir: false
  },
  server: {
    port: 3000
  }
});
