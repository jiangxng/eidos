// -------- 异步模块 --------
// 职责：演示显式 loading / error 状态管理

import { store } from '../../app/store'

export const renderAsyncModule = () => {
  const s = store.get().asyncState

  return {
    type: 'div',
    children: [
      { type: 'h2', props: { text: '⏳ 异步操作（显式 loading / error）', style: { margin: '0 0 16px 0' } } },
      { type: 'p', props: { text: '异步操作通过多次 dispatch + 显式 changedKeys 表达，loading / error 都是普通状态字段。' } },
      {
        type: 'button',
        props: {
          text: '🔄 加载数据',
          onClick: 'ASYNC_LOAD',
          style: {
            padding: '6px 12px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '12px'
          }
        }
      },
      s.loading ? { type: 'p', props: { text: '⏳ 加载中...' } } : null,
      s.error ? { type: 'p', props: { text: '❌ 错误: ' + s.error, style: { color: '#ff4d4f' } } } : null,
      s.data ? { type: 'p', props: { text: '✅ 数据: ' + s.data } } : null
    ]
  }
}