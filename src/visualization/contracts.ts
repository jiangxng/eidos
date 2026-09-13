export type AnalysisIntent =
  | "compare"
  | "compare-over-time"
  | "distribution"
  | "composition"
  | "relationship"
  | "flow"
  | "geographic"
  | "ranking"
  | "variance"
  | "anomaly";

export interface MetricRef { id:string; label?:string; format?:string; }
export interface DimensionRef { id:string; label?:string; type?:"category"|"time"|"geo"|"hierarchy"; }

export interface VisualizationSpecV010 {
  contractVersion:"0.1.0";
  visualizationId:string;
  intent:AnalysisIntent;
  measures:MetricRef[];
  dimensions?:DimensionRef[];
  emphasis?:Array<"anomaly"|"top"|"bottom"|"target"|"change">;
  rendererPreference?:string;
}

export interface VisualizationRendererChoice {
  rendererId:string;
  rationaleCode:string;
}

export function chooseDefaultVisualization(spec:VisualizationSpecV010):VisualizationRendererChoice {
  if(spec.intent==="compare-over-time") return {rendererId:"line-chart",rationaleCode:"TIME_SERIES_DEFAULT"};
  if(spec.intent==="distribution") return {rendererId:"histogram",rationaleCode:"DISTRIBUTION_DEFAULT"};
  if(spec.intent==="composition") return {rendererId:"treemap",rationaleCode:"COMPOSITION_DEFAULT"};
  if(spec.intent==="flow") return {rendererId:"sankey",rationaleCode:"FLOW_DEFAULT"};
  if(spec.intent==="geographic") return {rendererId:"geo-map",rationaleCode:"GEO_DEFAULT"};
  if(spec.intent==="relationship") return {rendererId:"scatter-chart",rationaleCode:"RELATIONSHIP_DEFAULT"};
  return {rendererId:"bar-chart",rationaleCode:"GENERAL_COMPARE_DEFAULT"};
}
