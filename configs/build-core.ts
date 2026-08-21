import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../src/core/index.ts'),
      name: 'EidosCore',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.es.js';
        if (format === 'umd') return 'index.umd.js';
        return `index.${format}.js`;
      }
    },
    outDir: resolve(__dirname, '../src/core/dist'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
  optimizeDeps: {
    entries: [resolve(__dirname, '../src/core/index.ts')]
  },
  plugins: [
    dts({
      // 指定根目录，让 dts 插件能找到正确的 tsconfig
      root: resolve(__dirname, '..'),
      // 只生成 core 目录下的声明文件，避免把 playground/configs/scripts 也打进 dist
      include: ['src/core'],
      // 输出目录（与 build.outDir 保持一致）
      outDirs: resolve(__dirname, '../src/core/dist'),
      // 明确指定入口文件，输出路径基于此计算
      entryRoot: resolve(__dirname, '../src/core'),
      // 排除测试文件
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      // 生成类型入口文件 index.d.ts
      insertTypesEntry: true
    })
  ]
});