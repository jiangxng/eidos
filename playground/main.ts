import { createStore, createApp } from '@eidos/core';

// -------- 1. 定义状态 --------
const store = createStore({
  todos: [
    { id: 1, text: '学习 Eidos 框架', done: true },
    { id: 2, text: '实现列表渲染', done: false },
    { id: 3, text: '写一份 AI 原生文档', done: false }
  ],
  filter: 'all',        // 'all' | 'active' | 'completed'
  loading: false,
  error: null as string | null
});

// -------- 2. 视图函数（永远返回有效 VNode）--------
const view = (state: typeof store.get) => {
  // 根据 filter 过滤列表
  let filteredTodos = state.todos;
  if (state.filter === 'active') {
    filteredTodos = state.todos.filter(t => !t.done);
  } else if (state.filter === 'completed') {
    filteredTodos = state.todos.filter(t => t.done);
  }

  // 列表项渲染
  const todoItems = filteredTodos.map((todo) => ({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        marginBottom: '6px',
        background: todo.done ? '#f0f0f0' : '#ffffff',
        borderRadius: '6px',
        border: '1px solid #e8e8e8',
        opacity: todo.done ? 0.7 : 1
      }
    },
    children: [
      {
        type: 'span',
        props: {
          text: todo.text,
          style: {
            textDecoration: todo.done ? 'line-through' : 'none',
            color: todo.done ? '#999' : '#333'
          }
        }
      },
      {
        type: 'button',
        props: {
          text: todo.done ? '↩️ 撤销' : '✅ 完成',
          onClick: `TOGGLE_${todo.id}`,
          style: {
            padding: '4px 12px',
            background: todo.done ? '#faad14' : '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }
        }
      }
    ]
  }));

  // 空状态占位（始终是有效 VNode）
  const emptyPlaceholder = filteredTodos.length === 0
    ? { type: 'p', props: { text: '🎉 列表为空，暂无待办', style: { color: '#bbb', textAlign: 'center', padding: '20px 0' } } }
    : null; // null 在渲染时会被忽略（框架已处理）

  // Loading 和 Error 提示（可为 null，框架会自动过滤）
  const loadingIndicator = state.loading
    ? { type: 'p', props: { text: '⏳ 加载中...', style: { color: '#1890ff', textAlign: 'center', padding: '10px 0' } } }
    : null;

  const errorIndicator = state.error
    ? { type: 'p', props: { text: '❌ ' + state.error, style: { color: '#ff4d4f', textAlign: 'center', padding: '10px 0', background: '#fff2f0', borderRadius: '4px' } } }
    : null;

  // 主容器（永远返回一个 div）
  return {
    type: 'div',
    props: {
      style: {
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, sans-serif',
        maxWidth: '500px',
        margin: '0 auto'
      }
    },
    children: [
      { type: 'h2', props: { text: '📋 我的待办', style: { margin: '0 0 16px 0' } } },
      // 过滤按钮组
      {
        type: 'div',
        props: { style: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' } },
        children: [
          { type: 'button', props: { text: '全部', onClick: 'FILTER_ALL', style: { padding: '4px 16px', border: '1px solid #d9d9d9', borderRadius: '4px', background: state.filter === 'all' ? '#1890ff' : 'white', color: state.filter === 'all' ? 'white' : '#333', cursor: 'pointer' } } },
          { type: 'button', props: { text: '未完成', onClick: 'FILTER_ACTIVE', style: { padding: '4px 16px', border: '1px solid #d9d9d9', borderRadius: '4px', background: state.filter === 'active' ? '#1890ff' : 'white', color: state.filter === 'active' ? 'white' : '#333', cursor: 'pointer' } } },
          { type: 'button', props: { text: '已完成', onClick: 'FILTER_COMPLETED', style: { padding: '4px 16px', border: '1px solid #d9d9d9', borderRadius: '4px', background: state.filter === 'completed' ? '#1890ff' : 'white', color: state.filter === 'completed' ? 'white' : '#333', cursor: 'pointer' } } }
        ]
      },
      // 加载、错误、列表容器
      loadingIndicator,
      errorIndicator,
      {
        type: 'div',
        props: { style: { marginBottom: '16px' } },
        children: emptyPlaceholder ? [emptyPlaceholder] : (todoItems.length ? todoItems : [])
      },
      // 输入和按钮组
      {
        type: 'div',
        props: { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
        children: [
          {
            type: 'input',
            props: {
              id: 'new-todo-input',
              placeholder: '输入新待办...',
              style: { flex: 1, padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '4px', minWidth: '120px' }
            }
          },
          {
            type: 'button',
            props: {
              text: '➕ 添加',
              onClick: 'ADD_TODO',
              style: { padding: '8px 16px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
            }
          },
          {
            type: 'button',
            props: {
              text: '📥 加载模拟数据',
              onClick: 'FETCH_TODOS',
              style: { padding: '8px 16px', background: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
            }
          }
        ]
      },
      {
        type: 'div',
        props: {
          style: { marginTop: '16px', fontSize: '12px', color: '#bbb', borderTop: '1px solid #eee', paddingTop: '12px', textAlign: 'center' }
        },
        children: [{ type: 'span', props: { text: '🤖 AI 原生 · 异步三态(loading/error/data) 显式管理' } }]
      }
    ]
  };
};

// -------- 3. 启动应用 --------
const app = createApp({ store, view, container: '#app' });

// -------- 4. 事件处理 --------
window.addEventListener('eidos-event', (e: any) => {
  const { type } = e.detail;

  if (type === 'FILTER_ALL') {
    store.dispatch((prev) => ({ ...prev, filter: 'all' }), ['filter']);
  } else if (type === 'FILTER_ACTIVE') {
    store.dispatch((prev) => ({ ...prev, filter: 'active' }), ['filter']);
  } else if (type === 'FILTER_COMPLETED') {
    store.dispatch((prev) => ({ ...prev, filter: 'completed' }), ['filter']);
  } else if (type === 'ADD_TODO') {
    const input = document.getElementById('new-todo-input') as HTMLInputElement;
    const text = input?.value.trim();
    if (!text) return alert('请输入待办内容');
    const newId = Math.max(0, ...store.get().todos.map(t => t.id)) + 1;
    store.dispatch(
      (prev) => ({
        ...prev,
        todos: [...prev.todos, { id: newId, text, done: false }]
      }),
      ['todos']
    );
    if (input) input.value = '';
  } else if (type === 'FETCH_TODOS') {
    if (store.get().loading) return;
    store.dispatch(
      (prev) => ({ ...prev, loading: true, error: null }),
      ['loading', 'error']
    );
    setTimeout(() => {
      if (Math.random() > 0.2) {
        const currentTodos = store.get().todos;
        const newId1 = Math.max(0, ...currentTodos.map(t => t.id)) + 1;
        const newId2 = newId1 + 1;
        store.dispatch(
          (prev) => ({
            ...prev,
            loading: false,
            todos: [
              ...prev.todos,
              { id: newId1, text: '📦 从 AI 接口加载的数据 #1', done: false },
              { id: newId2, text: '📦 从 AI 接口加载的数据 #2', done: false }
            ]
          }),
          ['loading', 'todos']
        );
      } else {
        store.dispatch(
          (prev) => ({
            ...prev,
            loading: false,
            error: '网络繁忙，请稍后重试'
          }),
          ['loading', 'error']
        );
      }
    }, 1000);
  } else if (type.startsWith('TOGGLE_')) {
    const id = parseInt(type.split('_')[1], 10);
    store.dispatch(
      (prev) => ({
        ...prev,
        todos: prev.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
      }),
      ['todos']
    );
  }
});

// 调试
(window as any).__EIDOS_APP__ = app;
console.log('✅ Eidos Todo 应用已启动 (确认无误版)');