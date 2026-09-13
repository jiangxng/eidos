export interface Measure {
  id:string;
  aggregation:"sum"|"avg"|"min"|"max"|"count"|"distinct-count"|"none";
  format?:string;
}
export interface Dimension {
  id:string;
  type:"category"|"time"|"number"|"geo"|"hierarchy";
}
export interface BiQueryIntentV010 {
  contractVersion:"0.1.0";
  analysisId:string;
  measures:Measure[];
  dimensions:Dimension[];
  filters?:Array<{field:string;operator:"eq"|"neq"|"gt"|"gte"|"lt"|"lte"|"in"|"between";value:unknown}>;
  operations?:Array<"rank"|"variance"|"contribution"|"forecast"|"segment"|"drill-down">;
}
