import type { VNode } from '../../core/index.js';
import type { UidlControl } from '../../runtime/contracts.js';
import type { ControlRegistry,ControlRenderer } from './index.js';
function fieldVNode(field:any,context:any):VNode{const common:any={name:field.inputName,value:context.value??'',disabled:field.readOnly===true,required:field.required===true,onInput:`UIDL_INPUT_${context.runtimeInstanceId}_${context.interactionId}_${field.key}`};if(field.control==='select')return{type:'select',props:common,children:(field.options||[]).map((o:any)=>({type:'option',props:{value:o.value,text:o.label}}))};return{type:'input',props:{...common,type:field.control==='number'||field.control==='money'?'number':field.control==='date'?'date':'text',min:field.validation?.min,max:field.validation?.max,pattern:field.validation?.pattern}};}
const map=new Map<UidlControl,ControlRenderer>();for(const control of ['text','number','money','select','date','reference'] as UidlControl[])map.set(control,{control,render:fieldVNode});
export const defaultControlRegistry:ControlRegistry={get:(control)=>map.get(control)};
