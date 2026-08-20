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
      // 输出目录（与 build.outDir 保持一致）
      outDir: resolve(__dirname, '../src/core/dist'),
      // 跳过类型检查（先确保生成文件，后续再优化）
      skipDiagnostics: true,
      // 只生成 .d.ts，不生成 .d.ts.map
      declarationMap: false,
      // 排除测试文件
      exclude: ['**/*.test.ts', '**/*.spec.ts'],
      // 明确指定入口文件
      entryRoot: resolve(__dirname, '../src/core'),
      // 静默模式，减少日志干扰
      logLevel: 'warn'
    })
  ]
});