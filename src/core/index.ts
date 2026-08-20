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

// ---------- 渲染引擎（支持错误边界） ----------
function renderVNode(vnode: any): Node {
  // 处理 null/undefined
  if (vnode == null || typeof vnode !== 'object' || !('type' in vnode)) {
    return document.createTextNode('');
  }

  // ---------- 错误边界处理 ----------
  if (vnode.type === 'error-boundary') {
    try {
      const children = vnode.children || [];
      if (children.length > 0) {
        return renderVNode(children[0]);
      }
    } catch (error) {
      const fallback = vnode.props?._fallback || defaultFallback;
      const errorObj = error instanceof Error ? error : new Error(String(error));
      if (vnode.props?._onError) {
        vnode.props._onError(errorObj);
      }
      console.error(JSON.stringify({
        code: 'EIDOS_ERROR_BOUNDARY',
        message: errorObj.message,
        fix: '检查子组件的渲染逻辑，确保所有数据都有默认值'
      }));
      return renderVNode(fallback(errorObj));
    }
  }

  // ---------- 正常渲染 ----------
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
      } else if (key === 'onInput') {
        el.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          window.dispatchEvent(new CustomEvent('eidos-event', {
            detail: { type: val, value: target.value, target: el }
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

// ---------- 默认错误降级 UI ----------
function defaultFallback(error: Error): VNode {
  return {
    type: 'div',
    props: {
      style: {
        padding: '16px',
        background: '#fff2f0',
        border: '1px solid #ff4d4f',
        borderRadius: '4px',
        color: '#ff4d4f'
      }
    },
    children: [
      { type: 'strong', props: { text: '⚠️ 组件渲染出错' } },
      { type: 'p', props: { text: error.message } }
    ]
  };
}

// ---------- 创建错误边界辅助函数 ----------
export function createErrorBoundary(props: {
  children: VNode;
  fallback?: (error: Error) => VNode;
  onError?: (error: Error) => void;
}): VNode {
  return {
    type: 'error-boundary',
    props: {
      _fallback: props.fallback,
      _onError: props.onError
    },
    children: [props.children]
  };
}

// ---------- 路由模块 ----------
export type RouteConfig = {
  path: string;
  component: (params: Record<string, string>) => VNode;
};

export function createRouter(
  routes: RouteConfig[],
  store: ReturnType<typeof createStore<any>>
) {
  function getCurrentPath(): string {
    return window.location.hash.slice(1) || '/';
  }

  function matchRoute(path: string): { route: RouteConfig; params: Record<string, string> } | null {
    for (const route of routes) {
      const pathParts = route.path.split('/');
      const currentParts = path.split('/');
      if (pathParts.length !== currentParts.length) continue;

      const params: Record<string, string> = {};
      let match = true;
      for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i].startsWith(':')) {
          params[pathParts[i].slice(1)] = currentParts[i];
        } else if (pathParts[i] !== currentParts[i]) {
          match = false;
          break;
        }
      }
      if (match) return { route, params };
    }
    return null;
  }

  function navigate(path: string): void {
    const match = matchRoute(path);
    if (match) {
      store.dispatch(
        (prev: any) => ({ ...prev, route: match.route.path, params: match.params }),
        ['route', 'params']
      );
      window.location.hash = path;
    } else {
      console.warn(`[Eidos Router] 路径 ${path} 未匹配`);
    }
  }

  // 监听 hash 变化
  window.addEventListener('hashchange', () => {
    const path = getCurrentPath();
    const match = matchRoute(path);
    if (match) {
      store.dispatch(
        (prev: any) => ({ ...prev, route: match.route.path, params: match.params }),
        ['route', 'params']
      );
    }
  });

  // 初始化
  const initPath = getCurrentPath();
  const initMatch = matchRoute(initPath);
  if (initMatch) {
    store.dispatch(
      (prev: any) => ({ ...prev, route: initMatch.route.path, params: initMatch.params }),
      ['route', 'params']
    );
  }

  return { navigate, getCurrentPath };
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
  if (!root) throw new Error(`[Eidos] 容器 ${container} 未找到`);

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