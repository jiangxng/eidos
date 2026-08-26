import { VNode } from '../../core/index'

export function createDetailPage(manager: any, data: Record<string, any>): VNode {
  const { fields } = manager

  return {
    type: 'div',
    props: { style: { padding: '16px', maxWidth: '600px' } },
    children: [
      {
        type: 'h2',
        props: { text: `${manager.name} 详情` }
      },
      ...fields.filter(f => f.detail !== false).map(f => ({
        type: 'div',
        props: { style: { display: 'flex', padding: '8px 0', borderBottom: '1px solid #f0f0f0' } },
        children: [
          {
            type: 'div',
            props: { style: { width: '120px', fontWeight: 'bold', flexShrink: 0 }, text: f.label || f.name }
          },
          {
            type: 'div',
            props: { text: String(data[f.name] ?? '-') }
          }
        ]
      })),
      {
        type: 'button',
        props: {
          text: '返回列表',
          onClick: `LIST_BACK_${manager.name}`,
          style: { padding: '8px 16px', marginTop: '16px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }
        }
      }
    ]
  }
}