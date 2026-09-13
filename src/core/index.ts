// >>> EIDOS CORE BUILD: Architecture Convergence candidate <<<
export type VNode = {
  type: string;
  props?: Record<string, any>;
  children?: (VNode | null | undefined)[];
  key?: string | number;
};

export function createStore<T extends Record<string, any>>(initial: T) {
  let state = { ...initial };
  const listeners = new Set<() => void>();
  return {
    get: () => ({ ...state }),
    subscribe: (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); },
    dispatch: (updater: (prev: T) => T, changedKeys: string[]) => {
      if (!changedKeys || changedKeys.length === 0) {
        throw new Error(JSON.stringify({ code: 'EIDOS_MISSING_AFFECTS', message: 'dispatch 必须显式声明 changedKeys', fix: '请在 dispatch 第二个参数传入 ["key1", "key2"]' }));
      }
      state = { ...updater(state) };
      listeners.forEach(cb => cb());
    }
  };
}

type BoundHandler = { eventName: string; value: string; listener: EventListener };
const handlerStore = new WeakMap<HTMLElement, Map<string, BoundHandler>>();
const eventPropMap: Record<string,string> = {
  onClick:'click', onInput:'input', onChange:'change', onFocus:'focus', onBlur:'blur',
  onMouseEnter:'mouseenter', onMouseLeave:'mouseleave', onDragOver:'dragover', onDragLeave:'dragleave', onDrop:'drop'
};
const booleanProps = new Set(['checked','disabled','selected','multiple','required','readOnly','autofocus']);

function eventValue(event: Event): any {
  const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  if (!target) return undefined;
  if (target instanceof HTMLInputElement && target.type === 'checkbox') return target.checked;
  if (target instanceof HTMLInputElement && target.type === 'file') return target.files ? Array.from(target.files) : [];
  if ('value' in target) return target.value;
  return undefined;
}

function bindEvent(el: HTMLElement, propKey: string, eventName: string, value: unknown) {
  let map = handlerStore.get(el); if (!map) { map = new Map(); handlerStore.set(el, map); }
  const old = map.get(propKey); if (old) { el.removeEventListener(old.eventName, old.listener); map.delete(propKey); }
  if (typeof value !== 'string' || value.length === 0) return;
  const listener: EventListener = (event) => {
    if (eventName === 'dragover' || eventName === 'drop') event.preventDefault();
    window.dispatchEvent(new CustomEvent('eidos-event', { detail: { type: value, value: eventValue(event), target: el, originalEvent: event } }));
  };
  el.addEventListener(eventName, listener); map.set(propKey, { eventName, value, listener });
}

function applyProperty(el: HTMLElement, key: string, value: unknown) {
  if (booleanProps.has(key)) {
    const prop = key === 'readOnly' ? 'readOnly' : key;
    (el as any)[prop] = value === true;
    if (value === true) el.setAttribute(key.toLowerCase(), ''); else el.removeAttribute(key.toLowerCase());
    return;
  }
  if (key === 'value' && 'value' in el) { (el as HTMLInputElement).value = value == null ? '' : String(value); return; }
  if (value == null || value === false) el.removeAttribute(key); else el.setAttribute(key, String(value));
}

function createElement(vnode: VNode | null | undefined): Node {
  if (vnode == null || typeof vnode !== 'object' || !('type' in vnode)) return document.createTextNode('');
  if (vnode.type === 'error-boundary') {
    try { return createElement((vnode.children || [])[0]); }
    catch (error) { const err = error instanceof Error ? error : new Error(String(error)); vnode.props?._onError?.(err); return createElement((vnode.props?._fallback || defaultFallback)(err)); }
  }
  const el = document.createElement(vnode.type); setProps(el, vnode.props || {}); for (const child of vnode.children || []) el.appendChild(createElement(child)); return el;
}

function setProps(el: HTMLElement, props: Record<string, any>) {
  for (const [key,val] of Object.entries(props)) {
    if (key === 'style' && val && typeof val === 'object') { for (const [s,v] of Object.entries(val)) if (s && v != null) try { (el.style as any)[s] = String(v); } catch {} }
    else if (key === 'text') el.textContent = val ?? '';
    else if (eventPropMap[key]) bindEvent(el,key,eventPropMap[key],val);
    else applyProperty(el,key,val);
  }
}

function updateProps(el: HTMLElement, oldProps: Record<string, any>, newProps: Record<string, any>) {
  const allKeys = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);
  for (const key of allKeys) {
    const oldVal = oldProps?.[key], newVal = newProps?.[key]; if (oldVal === newVal) continue;
    if (key === 'style') {
      const oldStyle = oldVal || {}, newStyle = newVal || {};
      for (const styleKey of new Set([...Object.keys(oldStyle), ...Object.keys(newStyle)])) {
        if (!styleKey) continue; const v = newStyle[styleKey]; try { (el.style as any)[styleKey] = v == null ? '' : String(v); } catch {}
      }
    } else if (key === 'text') el.textContent = newVal ?? '';
    else if (eventPropMap[key]) bindEvent(el,key,eventPropMap[key],newVal);
    else applyProperty(el,key,newVal);
  }
}

function patchNode(oldEl: Node | null, oldVNode: VNode | null | undefined, newVNode: VNode | null | undefined): Node {
  if (newVNode == null) return document.createTextNode('');
  if (oldVNode == null || oldVNode.type !== newVNode.type) { const next=createElement(newVNode); if(oldEl?.parentNode) oldEl.parentNode.replaceChild(next,oldEl); return next; }
  if (oldEl == null) return createElement(newVNode);
  const el=oldEl as HTMLElement; updateProps(el,oldVNode.props||{},newVNode.props||{});
  if (el.nodeType===1 && ((oldVNode.children||[]).length || (newVNode.children||[]).length)) patchChildren(el,oldVNode.children||[],newVNode.children||[]);
  return el;
}

function patchChildren(el: HTMLElement, oldChildren: (VNode|null|undefined)[], newChildren: (VNode|null|undefined)[]) {
  const oldKeyMap=new Map<string|number,number>(); oldChildren.forEach((c,i)=>{ if(c?.key!=null) oldKeyMap.set(c.key,i); });
  const used=new Array(oldChildren.length).fill(false); const newNodes:Node[]=[];
  for(const newChild of newChildren){ if(!newChild){newNodes.push(document.createTextNode(''));continue;} let matched=-1;
    if(newChild.key!=null&&oldKeyMap.has(newChild.key)){const i=oldKeyMap.get(newChild.key)!; if(!used[i]) matched=i;}
    if(matched===-1) for(let i=0;i<oldChildren.length;i++){if(!used[i]&&oldChildren[i]?.type===newChild.type){matched=i;break;}}
    if(matched>=0){used[matched]=true;newNodes.push(patchNode(el.childNodes[matched]||null,oldChildren[matched],newChild));} else newNodes.push(createElement(newChild));
  }
  for(let i=oldChildren.length-1;i>=0;i--) if(!used[i]) {const n=el.childNodes[i]; if(n?.parentNode===el) el.removeChild(n);}
  let anchor:Node|null=null; for(let i=newNodes.length-1;i>=0;i--){const n=newNodes[i]; if(n.parentNode!==el||Array.from(el.childNodes).indexOf(n as ChildNode)!==i) el.insertBefore(n,anchor); anchor=n;}
  while(el.childNodes.length>newNodes.length) el.removeChild(el.lastChild!);
}

function defaultFallback(error: Error): VNode { return { type:'div', props:{style:{padding:'16px',background:'#fff2f0',border:'1px solid #ff4d4f',borderRadius:'4px',color:'#ff4d4f'}}, children:[{type:'strong',props:{text:'⚠️ 组件渲染出错'}},{type:'p',props:{text:error.message}}] }; }
export function createErrorBoundary(props:{children:VNode;fallback?:(error:Error)=>VNode;onError?:(error:Error)=>void;}):VNode{return{type:'error-boundary',props:{_fallback:props.fallback,_onError:props.onError},children:[props.children]};}

export type RouteConfig={path:string;component:(params:Record<string,string>)=>VNode};
export function createRouter(routes:RouteConfig[],store:ReturnType<typeof createStore<any>>){
  const getCurrentPath=()=>window.location.hash.slice(1)||'/';
  const matchRoute=(path:string)=>{for(const route of routes){const a=route.path.split('/'),b=path.split('/');if(a.length!==b.length)continue;const params:Record<string,string>={};let ok=true;for(let i=0;i<a.length;i++){if(a[i].startsWith(':'))params[a[i].slice(1)]=b[i];else if(a[i]!==b[i]){ok=false;break;}}if(ok)return{route,params};}return null;};
  const apply=(path:string)=>{const match=matchRoute(path);if(match)store.dispatch((prev:any)=>({...prev,route:match.route.path,params:match.params}),['route','params']);};
  const onHashChange=()=>apply(getCurrentPath()); window.addEventListener('hashchange',onHashChange); apply(getCurrentPath());
  const navigate=(path:string)=>{if(matchRoute(path))window.location.hash=path;else console.warn(`[Eidos Router] 路径 ${path} 未匹配`);};
  return {navigate,getCurrentPath,dispose:()=>window.removeEventListener('hashchange',onHashChange)};
}

export function createApp<T extends Record<string,any>>(config:{store:ReturnType<typeof createStore<T>>;view:(state:T)=>any;container:string;}){
  const {store,view,container}=config;const root=document.querySelector<HTMLElement>(container);if(!root)throw new Error(`[Eidos] 容器 ${container} 未找到`);let prevVNode:VNode|null=null;
  const render=()=>{const state=store.get();let newVNode:VNode;try{newVNode=view(state);}catch(error){const err=error instanceof Error?error:new Error(String(error));newVNode=defaultFallback(err);}if(prevVNode==null){root.innerHTML='';root.appendChild(createElement(newVNode));}else patchNode(root.firstChild,prevVNode,newVNode);prevVNode=newVNode;};
  const unsubscribe=store.subscribe(render);render();return{store,render,refresh:render,dispose:()=>unsubscribe()};
}
export function renderIf(condition:boolean,vnode:VNode|null):VNode|null{return condition?vnode:null;}
export { renderForm } from './form'; export type { FormField } from './form';
