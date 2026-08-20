import { createStore, createApp, createRouter, createErrorBoundary } from '../src/core/index';
import { renderForm, FormField } from '../src/core/form';

// -------- 1. 初始化 Store（包含路由状态和表单数据） --------
const store = createStore({
  // 路由状态
  route: '/',
  params: {},
  // 表单数据
  formValues: {
    username: '',
    email: '',
    bio: ''
  },
  // 演示错误边界
  shouldError: false
});

// -------- 2. 定义路由配置 --------
const routes = [
  {
    path: '/',
    component: () => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: '🏠 首页', style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: '欢迎使用 Eidos 完整功能演示！' } }
      ]
    })
  },
  {
    path: '/about',
    component: () => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: '📖 关于 Eidos', style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: 'Eidos 是一个 AI 原生前端框架，所有 UI 由 JSON 驱动。' } }
      ]
    })
  },
  {
    path: '/user/:id',
    component: (params) => ({
      type: 'div',
      children: [
        { type: 'h2', props: { text: `👤 用户 ${params.id}`, style: { margin: '0 0 16px 0' } } },
        { type: 'p', props: { text: `这是用户 ID 为 ${params.id} 的个人主页。` } }
      ]
    })
  },
  {
    path: '/form',
    component: () => {
      // 表单字段配置
      const fields: FormField[] = [
        {
          type: 'text',
          name: 'username',
          label: '用户名',
          value: store.get().formValues.username || '',
          rules: { required: true, minLength: 3, message: '用户名至少 3 个字符' }
        },
        {
          type: 'email',
          name: 'email',
          label: '邮箱',
          value: store.get().formValues.email || '',
          rules: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }
        },
        {
          type: 'textarea',
          name: 'bio',
          label: '个人简介',
          value: store.get().formValues.bio || '',
          rules: { maxLength: 200, message: '最多 200 个字符' }
        }
      ];

      return {
        type: 'div',
        children: [
          { type: 'h2', props: { text: '📝 注册表单', style: { margin: '0 0 16px 0' } } },
          renderForm(fields),
          {
            type: 'button',
            props: {
              text: '提交',
              onClick: 'FORM_SUBMIT',
              style: {
                padding: '8px 16px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '12px'
              }
            }
          }
        ]
      };
    }
  },
  {
    path: '/error',
    component: () => {
      // 故意触发错误的组件（访问 null 的属性）
      const dangerous = {
        type: 'div',
        children: [
          { type: 'p', props: { text: `用户: ${store.get().shouldError ? null : '正常'}` } }
        ]
      };
      // 用错误边界包裹
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
          console.log('[错误边界] 捕获到错误:', error);
        }
      });
    }
  }
];

// -------- 3. 初始化路由 --------
const router = createRouter(routes, store);

// -------- 4. 主视图（根据路由状态渲染内容 + 导航栏） --------
const view = (state: any) => {
  // 查找匹配的路由
  const match = routes.find(r => r.path === state.route);
  const content = match ? match.component(state.params) : { type: 'p', props: { text: '404 页面未找到' } };

  return {
    type: 'div',
    props: {
      style: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, sans-serif'
      }
    },
    children: [
      // 导航栏
      {
        type: 'nav',
        props: {
          style: {
            display: 'flex',
            gap: '16px',
            padding: '12px 0',
            borderBottom: '1px solid #e8e8e8',
            marginBottom: '20px'
          }
        },
        children: [
          { type: 'a', props: { href: '#/', text: '首页', style: { textDecoration: 'none', color: '#1890ff' } } },
          { type: 'a', props: { href: '#/about', text: '关于', style: { textDecoration: 'none', color: '#1890ff' } } },
          { type: 'a', props: { href: '#/user/123', text: '用户 123', style: { textDecoration: 'none', color: '#1890ff' } } },
          { type: 'a', props: { href: '#/form', text: '表单', style: { textDecoration: 'none', color: '#1890ff' } } },
          { type: 'a', props: { href: '#/error', text: '错误边界', style: { textDecoration: 'none', color: '#1890ff' } } }
        ]
      },
      // 当前路由内容
      content,
      // 底部信息（显示当前路径，方便调试）
      {
        type: 'div',
        props: {
          style: {
            marginTop: '30px',
            paddingTop: '12px',
            borderTop: '1px solid #e8e8e8',
            fontSize: '12px',
            color: '#bbb'
          }
        },
        children: [{ type: 'span', props: { text: `当前路由: ${state.route}` } }]
      }
    ]
  };
};

// -------- 5. 启动应用 --------
const app = createApp({ store, view, container: '#app' });

// -------- 6. 事件处理 --------
window.addEventListener('eidos-event', (e: any) => {
  const { type, value } = e.detail;

  // -------- 表单输入处理 --------
  if (type && type.startsWith('FORM_INPUT_')) {
    const fieldName = type.replace('FORM_INPUT_', '');
    store.dispatch(
      (prev: any) => ({
        ...prev,
        formValues: { ...prev.formValues, [fieldName]: value }
      }),
      ['formValues']
    );
  }

  // -------- 表单提交 --------
  if (type === 'FORM_SUBMIT') {
    const values = store.get().formValues;
    console.log('📤 提交表单数据:', values);
    alert('表单已提交，请查看控制台输出。');
  }
});

// 调试工具
(window as any).__EIDOS_APP__ = app;
console.log('✅ Eidos 完整 Demo 已启动！');
console.log('💡 尝试导航到不同路由，填写表单，或访问 /error 查看错误边界效果。');