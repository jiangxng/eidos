import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'playground',
  server: {
    port: 3000,
    open: true,
    force: true // 强制刷新缓存
  },
  optimizeDeps: {
    include: ['@eidos/core'],
    force: true // 强制重新预构建
  },
  resolve: {
    alias: {
      '@eidos/core': resolve(__dirname, 'src/core/index.ts')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'playground/index.html')
      }
    }
  }
});