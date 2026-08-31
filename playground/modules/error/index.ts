// -------- 错误边界模块 --------
// 职责：演示 createErrorBoundary 用法

import { createErrorBoundary } from 'eidos-core'
import { store } from '../../app/store'

export const renderErrorBoundary = () => {
  // 故意触发错误的组件
  const dangerous = {
    type: 'div',
    children: [
      { type: 'p', props: { text: `用户: ${store.get().shouldError ? null : '正常'}` } }
    ]
  }

  return createErrorBoundary({
    children: dangerous,
    fallback: (error) => ({
      type: 'div',
      props: { style: { padding: '16px', background: '#fff2f0', border: '1px solid #ff4d4f', borderRadius: '4px' } },
      children: [
        { type: 'strong', props: { text: '⚠️ 捕获到错误：' } },
        { type: 'p', props: { text: error.message } }
      ]
    }),
    onError: (error) => {
      console.log('[错误边界] 捕获到错误:', error)
    }
  })
}