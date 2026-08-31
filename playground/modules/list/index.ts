// -------- 列表模块 --------
// 职责：Keyed 列表演示（验证 Diff 算法）

import { store } from '../../app/store'

export const renderListModule = () => {
  const items = store.get().list

  return {
    type: 'div',
    children: [
      { type: 'h2', props: { text: '📋 Keyed 列表（Diff 算法验证）', style: { margin: '0 0 16px 0' } } },
      { type: 'p', props: { text: '在输入框输入内容后，点击「添加 / 删除 / 打乱」，输入框内容应保持在正确的位置（这正是 key 的作用）。' } },
      {
        type: 'div',
        props: { style: { display: 'flex', gap: '8px', marginBottom: '12px' } },
        children: [
          { type: 'button', props: { text: '➕ 添加一项', onClick: 'LIST_ADD', style: { padding: '6px 12px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } } },
          { type: 'button', props: { text: '🔀 打乱顺序', onClick: 'LIST_SHUFFLE', style: { padding: '6px 12px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } } }
        ]
      },
      {
        type: 'div',
        props: { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        children: items.map((item: any) => ({
          type: 'div',
          key: item.id,
          props: { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
          children: [
            { type: 'input', props: { value: item.text, onInput: `LIST_INPUT_${item.id}`, style: { flex: 1, padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px' } } },
            { type: 'button', props: { text: '删除', onClick: `LIST_DELETE_${item.id}`, style: { padding: '6px 12px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } } }
          ]
        }))
      }
    ]
  }
}