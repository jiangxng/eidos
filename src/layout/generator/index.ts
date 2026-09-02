// ---------- 生成器入口 ----------
// 统一导出生成器所有能力

export * from './types'
export { parseIntent, getSupportedScenes } from './intent'
export { buildLayout, registerScene } from './builder'

import { parseIntent, getSupportedScenes } from './intent'
import { buildLayout, registerScene } from './builder'

export const Generator = {
  parseIntent,
  getSupportedScenes,
  buildLayout,
  registerScene
}

export default Generator