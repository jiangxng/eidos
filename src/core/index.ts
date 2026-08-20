// ---------- 类型定义 ----------
export type VNode = {
  type: string;
  props?: Record<string, any>;
  children?: (VNode | null | undefined)[];
};

// ---------- 状态管理器 ----------
export function createStore<T extends Record<string, any>>(initial: T) {
  let state = { ...initial };
  const listeners = new Set<() => void>();

  return {
    get: () => ({ ...state }),
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    dispatch: (updater: (prev: T) => T, changedKeys: string[]) => {
      if (!changedKeys || changedKeys.length === 0) {
        throw new Error(JSON.stringify({
          code: 'EIDOS_MISSING_AFFECTS',
          message: '❌ dispatch 必须显式声明 changedKeys',
          fix: '请在 dispatch 第二个参数传入 ["key1", "key2"]'
        }));
      }
      state = { ...updater(state) };
      listeners.forEach(cb => cb());
    }
  };
}

// ---------- 渲染引擎 ----------
function renderVNode(vnode: any): Node {
  if (vnode == null || typeof vnode !== 'object' || !('type' in vnode)) {
    return document.createTextNode('');
  }

  const el = document.createElement(vnode.type);

  if (vnode.props) {
    for (const [key, val] of Object.entries(vnode.props)) {
      if (key === 'style' && typeof val === 'object') {
        Object.assign(el.style, val);
      } else if (key === 'text') {
        el.textContent = val;
      } else if (key === 'onClick') {
        el.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('eidos-event', {
            detail: { type: val, target: el }
          }));
        });
      } else {
        el.setAttribute(key, String(val));
      }
    }
  }

  if (vnode.children && Array.isArray(vnode.children)) {
    for (const child of vnode.children) {
      el.appendChild(renderVNode(child));
    }
  }

  return el;
}

// ---------- 创建应用 ----------
export function createApp<T extends Record<string, any>>(
  config: {
    store: ReturnType<typeof createStore<T>>;
    view: (state: T) => any;
    container: string;
  }
) {
  const { store, view, container } = config;
  const root = document.querySelector(container);
  
  if (!root) {
    throw new Error(`[Eidos] 容器 ${container} 未找到`);
  }

  // 使用非空断言，因为上面已经判断了 root 不为 null
  const rootElement: Element = root;

  function render() {
    const state = store.get();
    const newTree = view(state);
    rootElement.innerHTML = '';
    const domNode = renderVNode(newTree);
    rootElement.appendChild(domNode);
  }

  store.subscribe(render);
  render();

  return { store, render, refresh: () => render() };
}