import { describe, it, expect, beforeEach } from 'vitest';
import { createStore, createApp } from './index';

describe('key-based diff', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('列表重排时，按 key 复用 DOM 节点', () => {
    const store = createStore({
      items: [
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
        { id: 3, text: 'c' }
      ]
    });

    const view = (state: any) => ({
      type: 'div',
      children: state.items.map((item: any) => ({
        type: 'div',
        key: item.id,
        props: { 'data-id': String(item.id) },
        children: [{ type: 'span', props: { text: item.text } }]
      }))
    });

    createApp({ store, view, container: '#app' });

    const [el1, el2, el3] = document.querySelectorAll('#app > div > div');

    // 打乱顺序：3, 1, 2
    store.dispatch(
      (prev: any) => ({
        ...prev,
        items: [
          { id: 3, text: 'c' },
          { id: 1, text: 'a' },
          { id: 2, text: 'b' }
        ]
      }),
      ['items']
    );

    const reordered = document.querySelectorAll('#app > div > div');
    expect(reordered[0]).toBe(el3);
    expect(reordered[1]).toBe(el1);
    expect(reordered[2]).toBe(el2);
  });

  it('删除中间项时，保留其余节点', () => {
    const store = createStore({
      items: [
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
        { id: 3, text: 'c' }
      ]
    });

    const view = (state: any) => ({
      type: 'div',
      children: state.items.map((item: any) => ({
        type: 'div',
        key: item.id,
        props: { 'data-id': String(item.id) },
        children: [{ type: 'span', props: { text: item.text } }]
      }))
    });

    createApp({ store, view, container: '#app' });

    const [el1, , el3] = document.querySelectorAll('#app > div > div');

    // 删除中间项 id=2
    store.dispatch(
      (prev: any) => ({
        ...prev,
        items: [
          { id: 1, text: 'a' },
          { id: 3, text: 'c' }
        ]
      }),
      ['items']
    );

    const after = document.querySelectorAll('#app > div > div');
    expect(after.length).toBe(2);
    expect(after[0]).toBe(el1);
    expect(after[1]).toBe(el3);
  });

  it('无 key 时按类型 fallback 复用', () => {
    const store = createStore({ count: 1 });

    const view = (state: any) => ({
      type: 'div',
      children: [
        { type: 'h1', props: { text: `标题 ${state.count}` } },
        { type: 'p', props: { text: `内容 ${state.count}` } }
      ]
    });

    createApp({ store, view, container: '#app' });

    const h1 = document.querySelector('#app h1');

    store.dispatch((prev: any) => ({ ...prev, count: 2 }), ['count']);

    const h1After = document.querySelector('#app h1');
    expect(h1After).toBe(h1);
    expect(h1After?.textContent).toBe('标题 2');
  });
});