import { execSync } from 'child_process';
import { resolve } from 'path';
import { handleBuildError } from './error-handler.js';

const steps = [
  {
    name: '📦 构建核心库 @eidos/core',
    cmd: `vite build --config ${resolve(__dirname, '../configs/build-core.ts')}`
  },
  {
    name: '🌐 构建演示应用 playground',
    cmd: `vite build --config ${resolve(__dirname, '../configs/build-playground.ts')}`
  }
];

console.log('🚀 开始 Eidos AI-Native 构建流程...\n');

for (const step of steps) {
  try {
    console.log(`▶️  ${step.name}`);
    execSync(step.cmd, {
      stdio: 'inherit',
      cwd: resolve(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'production' }
    });
    console.log(`✅ ${step.name} 完成\n`);
  } catch (error) {
    handleBuildError(error);
  }
}

console.log('🎉 全部构建完成！输出目录：');
console.log('   - 核心库: src/core/dist/');
console.log('   - 演示应用: dist/playground/');