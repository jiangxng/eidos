import http from "node:http";
import {readFile,stat} from "node:fs/promises";
import path from "node:path";
const root=path.resolve(process.argv[2]||"release");
const port=Number(process.env.PORT||4173);
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
const server=http.createServer(async(req,res)=>{
  try{
    let pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    let file=path.join(root,pathname);
    if(!(await stat(file).catch(()=>null))?.isFile()) file=path.join(file,"index.html");
    if(!file.startsWith(root)){res.writeHead(403).end();return}
    const body=await readFile(file);res.setHeader("Content-Type",mime[path.extname(file)]||"application/octet-stream");
    res.setHeader("Cache-Control",path.extname(file)===".html"?"no-cache":"public,max-age=3600");
    res.end(body);
  }catch{res.writeHead(404).end("Not found")}
});
server.listen(port,()=>console.log(`Eidos release: http://localhost:${port}`));
