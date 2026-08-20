export function handleBuildError(error: unknown): never {
  if (error instanceof Error) {
    const viteError = error as any;
    const structuredError = {
      code: viteError.code || 'BUILD_FAILED',
      message: error.message,
      fix: viteError.fix || '请检查 configs/ 目录下的路径是否正确，或运行 pnpm install 重新安装依赖',
      location: viteError.loc || viteError.locations || null,
      type: error.constructor.name
    };
    console.error(JSON.stringify(structuredError, null, 2));
  } else {
    console.error(JSON.stringify({
      code: 'UNKNOWN_ERROR',
      message: String(error),
      fix: '请检查 Node.js 版本是否为 v18+，并确保所有路径使用 resolve(__dirname, ...)'
    }, null, 2));
  }
  process.exit(1);
}