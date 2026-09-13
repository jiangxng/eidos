import assert from 'node:assert/strict';
import fs from 'node:fs';
import {toRenderModel} from '../../dist/runtime/index.js';
import {renderToVNode,defaultControlRegistry} from '../../dist/renderers/vnode/index.js';
const doc=JSON.parse(fs.readFileSync(new URL('../../examples/sales-order.uidl.json',import.meta.url),'utf8'));const model=toRenderModel(doc);const vnode=renderToVNode(model,{runtimeInstanceId:'rt1',interactionId:'i1',registry:defaultControlRegistry,values:{quantity:2},emit(){}});assert.equal(vnode.type,'div');assert.equal(vnode.children.at(-2).props.onClick,'UIDL_SUBMIT_rt1_i1_approve');console.log('EIDOS VNode bridge PASS');
