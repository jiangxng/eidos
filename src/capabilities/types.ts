import type { JsonValue } from "../runtime/contracts.js";
export type CapabilityMaturity = "legacy" | "candidate" | "stable";
export type RendererId = "web-vnode" | "html" | "mobile" | "voice" | "terminal" | "agent";
export interface CapabilityDescriptor {
  id:string; version:string; title:string; description:string; maturity:CapabilityMaturity;
  category:"input"|"display"|"navigation"|"decision"|"exception"|"attention"|"layout"|"collaboration"|"feedback";
  useWhen:string[]; doNotUseWhen:string[]; inputs:string[]; outputs:string[];
  ownsState:"none"|"interaction-only"|"presentation-only";
  sideEffects:"none"|"request-only"; renderers:RendererId[];
  composesWith?:string[]; constraints?:string[]; metadata?:Record<string,JsonValue>;
}
