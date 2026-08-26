import { VNode } from '../../core/index'

export function createListPage(manager: any): VNode {
  const { fields, listStore, goToPage, setFilters, setSort, remove } = manager

  return {
    type: 'div',
    props: { style: { padding: '16px' } },
    children: [
      // 标题 + 操作栏
      {
        type: 'div',
        props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
        children: [
          { type: 'h2', props: { text: `${manager.name} 列表` } },
          {
            type: 'button',
            props: {
              text: '新增',
              onClick: `FORM_OPEN_${manager.name}`,
              style: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
            }
          }
        ]
      },
      // 搜索栏（简化）
      {
        type: 'div',
        props: { style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' } },
        children: fields.filter(f => f.list).map(f => ({
          type: 'input',
          props: {
            placeholder: `搜索 ${f.label || f.name}...`,
            onInput: `FILTER_${manager.name}_${f.name}`,
            style: { padding: '6px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '14px', flex: '1', minWidth: '150px' }
          }
        }))
      },
      // 表格（渲染列表）
      {
        type: 'div',
        props: { style: { overflow: 'auto', border: '1px solid #e8e8e8', borderRadius: '4px' } },
        children: [
          // 表头
          {
            type: 'div',
            props: { style: { display: 'flex', background: '#fafafa', borderBottom: '1px solid #e8e8e8', fontWeight: 'bold' } },
            children: fields.filter(f => f.list).map(f => ({
              type: 'div',
              props: {
                style: { padding: '8px 12px', flex: 1, minWidth: '120px', cursor: 'pointer' },
                text: f.label || f.name
              }
            }))
          },
          // 表格行（从 store 读取）
          {
            type: 'div',
            props: { style: { minHeight: '200px' } },
            children: listStore.get().items.map((item: any) => ({
              type: 'div',
              props: { style: { display: 'flex', borderBottom: '1px solid #f0f0f0' } },
              children: [
                ...fields.filter(f => f.list).map(f => ({
                  type: 'div',
                  props: { style: { padding: '8px 12px', flex: 1, minWidth: '120px' }, text: String(item[f.name] ?? '-') }
                })),
                // 操作列
                {
                  type: 'div',
                  props: { style: { padding: '8px 12px', display: 'flex', gap: '8px' } },
                  children: [
                    {
                      type: 'button',
                      props: {
                        text: '编辑',
                        onClick: `FORM_OPEN_${manager.name}_${item.id}`,
                        style: { padding: '2px 8px', background: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
                      }
                    },
                    {
                      type: 'button',
                      props: {
                        text: '删除',
                        onClick: `DELETE_${manager.name}_${item.id}`,
                        style: { padding: '2px 8px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
                      }
                    }
                  ]
                }
              ]
            }))
          }
        ]
      },
      // 分页
      {
        type: 'div',
        props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' } },
        children: [
          {
            type: 'span',
            props: { text: `共 ${listStore.get().total} 条，第 ${listStore.get().page}/${Math.ceil(listStore.get().total / listStore.get().pageSize)} 页` }
          },
          {
            type: 'div',
            props: { style: { display: 'flex', gap: '8px' } },
            children: [
              {
                type: 'button',
                props: {
                  text: '上一页',
                  onClick: `PAGE_${manager.name}_${listStore.get().page - 1}`,
                  style: { padding: '4px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', background: 'white', cursor: 'pointer' }
                }
              },
              {
                type: 'button',
                props: {
                  text: '下一页',
                  onClick: `PAGE_${manager.name}_${listStore.get().page + 1}`,
                  style: { padding: '4px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', background: 'white', cursor: 'pointer' }
                }
              }
            ]
          }
        ]
      },
      // Loading 状态
      listStore.get().loading ? {
        type: 'div',
        props: { style: { textAlign: 'center', padding: '16px', color: '#666' }, text: '加载中...' }
      } : null,
      // Error 状态
      listStore.get().error ? {
        type: 'div',
        props: { style: { textAlign: 'center', padding: '16px', color: '#ff4d4f' }, text: '错误: ' + listStore.get().error }
      } : null
    ]
  }
}