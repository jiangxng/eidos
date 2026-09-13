export interface ReportSection {
  id:string;
  kind:"text"|"metric"|"table"|"chart"|"group"|"page-break"|"header"|"footer";
  title?:string;
  sourceRef?:string;
}
export interface ReportSpecV010 {
  contractVersion:"0.1.0";
  reportId:string;
  title:string;
  sections:ReportSection[];
  page?:{size:"A4"|"Letter"|"Auto";orientation:"portrait"|"landscape"};
  export?:Array<"pdf"|"html"|"csv"|"xlsx">;
}
