import type { VNode } from '../../core/index.js';
import type { FormRenderModelV010, JsonValue, UidlControl } from '../../runtime/contracts.js';
export interface ControlRenderContext { runtimeInstanceId:string; interactionId:string; fieldKey:string; value?:JsonValue }
export interface ControlRenderer { control:UidlControl; render(field:FormRenderModelV010['fields'][number],context:ControlRenderContext):VNode }
export interface ControlRegistry { get(control:UidlControl):ControlRenderer|undefined }
export interface RuntimeUiEvent {runtimeInstanceId:string;interactionId:string;actionId?:string;fieldKey?:string;type:'input'|'change'|'submit'|'cancel';value?:JsonValue}
export interface VNodeBridgeContext {runtimeInstanceId:string;interactionId:string;registry:ControlRegistry;values?:Record<string,JsonValue>;emit(event:RuntimeUiEvent):void}
export function renderToVNode(model:FormRenderModelV010,context:VNodeBridgeContext):VNode{
 const fields=model.fields.map(field=>{const renderer=context.registry.get(field.control);if(!renderer)throw new Error(`No renderer registered for UIDL control: ${field.control}`);return renderer.render(field,{runtimeInstanceId:context.runtimeInstanceId,interactionId:context.interactionId,fieldKey:field.key,value:context.values?.[field.key]});});
 return{type:'div',props:{'data-eidos-runtime':context.runtimeInstanceId,'data-eidos-interaction':context.interactionId},children:[{type:'h1',props:{text:model.title}},...fields,{type:'button',props:{text:model.submitAction.label,onClick:`UIDL_SUBMIT_${context.runtimeInstanceId}_${context.interactionId}_${model.submitAction.id}`}},...model.cancelActions.map(a=>({type:'button',props:{text:a.label,onClick:`UIDL_CANCEL_${context.runtimeInstanceId}_${context.interactionId}_${a.id}`}}))]};
}
export { defaultControlRegistry } from './default-registry.js';
export { parseUidlEvent } from './events.js';
