import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, '../playground'),
  build: {
    outDir: resolve(__dirname, '../dist/playground'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, '../playground/index.html')
      },
      external: ['@eidos/core']
    }
  },
  resolve: {
    alias: {
      '@eidos/core': resolve(__dirname, '../src/core/index.ts')
    }
  },
  server: {
    port: 3000,
    open: true,
    force: true
  },
  optimizeDeps: {
    include: ['@eidos/core']
  }
});