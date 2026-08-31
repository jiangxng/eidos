// ---------- 类型定义 ----------
export type VNode = {
  type: string;
  props?: Record<string, any>;
  children?: (VNode | null | undefined)[];
  key?: string | number;
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

// ---------- 渲染引擎（包含 Diff 算法）----------

// 创建真实 DOM 节点
function createElement(vnode: VNode | null | undefined): Node {
  if (vnode == null || typeof vnode !== 'object' || !('type' in vnode)) {
    return document.createTextNode('');
  }

  // 错误边界处理（如果有）
  if (vnode.type === 'error-boundary') {
    try {
      const children = vnode.children || [];
      if (children.length > 0) {
        return createElement(children[0]);
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
        fix: '检查子组件的渲染逻辑'
      }));
      return createElement(fallback(errorObj));
    }
  }

  const el = document.createElement(vnode.type);
  setProps(el, vnode.props || {});
  if (vnode.children) {
    for (const child of vnode.children) {
      el.appendChild(createElement(child));
    }
  }
  return el;
}

// 设置属性（包括事件）
function setProps(el: HTMLElement, props: Record<string, any>) {
  for (const [key, val] of Object.entries(props)) {
    if (key === 'style' && typeof val === 'object') {
      Object.assign(el.style, val);
    } else if (key === 'text') {
      el.textContent = val;
    } else if (key === 'onClick') {
      el.addEventListener('click', (event) => {
        window.dispatchEvent(new CustomEvent('eidos-event', {
          detail: { type: val, target: el, originalEvent: event }
        }));
      });
    } else if (key === 'onInput') {
      el.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        window.dispatchEvent(new CustomEvent('eidos-event', {
          detail: { type: val, value: target.value, target: el, originalEvent: event }
        }));
      });
    } else {
      el.setAttribute(key, String(val));
    }
  }
}

// 更新属性（比较新旧 props）
function updateProps(el: HTMLElement, oldProps: Record<string, any>, newProps: Record<string, any>) {
  const allKeys = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);
  for (const key of allKeys) {
    const oldVal = oldProps?.[key];
    const newVal = newProps?.[key];
    if (oldVal === newVal) continue;

    // 处理特殊键
    if (key === 'style') {
      const oldStyle = oldVal || {};
      const newStyle = newVal || {};
      // 获取所有样式键（合并新旧）
      const styleKeys = new Set([
        ...Object.keys(oldStyle),
        ...Object.keys(newStyle)
      ]);
      for (const styleKey of styleKeys) {
        // 跳过 undefined 或 null 的键名
        if (styleKey === undefined || styleKey === null) continue;
        const newStyleValue = newStyle[styleKey];
        if (newStyleValue !== undefined && newStyleValue !== null) {
          el.style[styleKey as any] = String(newStyleValue);
        } else {
          el.style[styleKey as any] = '';
        }
      }
    } else if (key === 'text') {
      el.textContent = newVal ?? '';
    } else if (key === 'onClick') {
      // 事件通过全局 eidos-event 处理，不需要重新绑定
    } else if (key === 'onInput') {
      // 同 onClick
    } else {
      if (newVal != null && newVal !== false) {
        el.setAttribute(key, String(newVal));
      } else {
        el.removeAttribute(key);
      }
    }
  }
}

// ---------- Diff 算法核心（Key-based） ----------

// patch 单个节点：给定旧 DOM（可能为 null）、旧/新 VNode，返回更新后的 DOM
function patchNode(
  oldEl: Node | null,
  oldVNode: VNode | null | undefined,
  newVNode: VNode | null | undefined
): Node {
  // 如果新节点为空，返回空文本节点
  if (newVNode == null) {
    return document.createTextNode('');
  }

  // 如果旧节点为空，或类型不同，直接创建新节点
  if (oldVNode == null || oldVNode.type !== newVNode.type) {
    const newEl = createElement(newVNode);
    if (oldEl && oldEl.parentNode) {
      oldEl.parentNode.replaceChild(newEl, oldEl);
    }
    return newEl;
  }

  // 如果旧 DOM 节点为空，直接创建新节点
  if (oldEl == null) {
    return createElement(newVNode);
  }

  // 类型相同，复用节点
  const el = oldEl as HTMLElement;
  updateProps(el, oldVNode.props || {}, newVNode.props || {});
  
  // 确保 el 存在且是 HTMLElement 才调用 patchChildren
  if (el && el.childNodes) {
    patchChildren(el, oldVNode.children || [], newVNode.children || []);
  }
  
  return el;
}

// 子节点 diff：优先按 key 匹配，无 key 时按位置 fallback（类型相同才复用）
function patchChildren(
  el: HTMLElement | null,
  oldChildren: (VNode | null | undefined)[],
  newChildren: (VNode | null | undefined)[]
): void {
  // 防御：如果 el 不存在或没有 childNodes，直接返回
  if (!el || !el.childNodes) {
    return;
  }

  const oldKeyMap = new Map<string | number, number>();
  oldChildren.forEach((child, i) => {
    if (child != null && child.key != null) {
      oldKeyMap.set(child.key, i);
    }
  });

  const used = new Array(oldChildren.length).fill(false);
  const newNodes: Node[] = [];

  for (const newChild of newChildren) {
    if (newChild == null) {
      newNodes.push(document.createTextNode(''));
      continue;
    }

    let matchedIndex = -1;
    if (newChild.key != null && oldKeyMap.has(newChild.key)) {
      const idx = oldKeyMap.get(newChild.key)!;
      if (!used[idx]) matchedIndex = idx;
    }

    if (matchedIndex === -1) {
      for (let j = 0; j < oldChildren.length; j++) {
        if (used[j]) continue;
        const oldC = oldChildren[j];
        if (oldC != null && oldC.type === newChild.type) {
          matchedIndex = j;
          break;
        }
      }
    }

    if (matchedIndex >= 0) {
      used[matchedIndex] = true;
      const oldC = oldChildren[matchedIndex];
      const oldNode = (el.childNodes && el.childNodes[matchedIndex]) ? el.childNodes[matchedIndex] : null;
      const patchedNode = patchNode(oldNode, oldC, newChild);
      if (patchedNode && patchedNode instanceof Node) {
        newNodes.push(patchedNode);
      } else {
        newNodes.push(document.createTextNode(''));
      }
    } else {
      const createdNode = createElement(newChild);
      if (createdNode && createdNode instanceof Node) {
        newNodes.push(createdNode);
      } else {
        newNodes.push(document.createTextNode(''));
      }
    }
  }

  // 删除未被复用的旧节点
  for (let i = 0; i < oldChildren.length; i++) {
    if (!used[i]) {
      const oldNode = (el.childNodes && el.childNodes[i]) ? el.childNodes[i] : null;
      if (oldNode && oldNode.parentNode) {
        oldNode.parentNode.removeChild(oldNode);
      }
    }
  }

  // 按新顺序重排 DOM
  let anchor: Node | null = null;
  for (let i = newNodes.length - 1; i >= 0; i--) {
    const node = newNodes[i];
    if (!(node instanceof Node)) {
      continue;
    }
    // 如果节点已经有父节点，先移除
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
    // 确保 el 存在且是 Node 才调用 insertBefore
    if (el && el.insertBefore) {
      el.insertBefore(node, anchor);
    }
    anchor = node;
  }
}
// 默认错误降级 UI
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

// ---------- 创建应用（带 Diff） ----------
export function createApp<T extends Record<string, any>>(
  config: {
    store: ReturnType<typeof createStore<T>>;
    view: (state: T) => any;
    container: string;
  }
) {
  const { store, view, container } = config;
  const root = document.querySelector<HTMLElement>(container);
  if (!root) throw new Error(`[Eidos] 容器 ${container} 未找到`);

  let prevVNode: VNode | null = null;

  function render() {
    const state = store.get();
    const newVNode = view(state);
    if (prevVNode == null) {
      // 首次渲染：直接创建
      root!.innerHTML = '';
      const el = createElement(newVNode);
      root!.appendChild(el);
    } else {
      // 后续渲染：使用 key-based diff
      patchNode(root!.firstChild, prevVNode, newVNode);
    }
    prevVNode = newVNode;
  }

  store.subscribe(render);
  render();

  return { store, render, refresh: () => render() };
}

// ---------- 条件渲染辅助函数 ----------
// 条件为真时返回 VNode，否则返回 null（框架会自动过滤 null 子节点）
export function renderIf(condition: boolean, vnode: VNode | null): VNode | null {
  return condition ? vnode : null
}

// ---------- 表单模块（re-export，保持单一入口） ----------
export { renderForm } from './form';
export type { FormField } from './form';