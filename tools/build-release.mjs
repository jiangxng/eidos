import {cp,mkdir,rm,writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";

const root=process.cwd();
const out=path.join(root,"release");
if(existsSync(out)) await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});

await cp(path.join(root,"showcase"),path.join(out,"showcase"),{recursive:true});
await cp(path.join(root,"demo"),path.join(out,"demo"),{recursive:true});
await cp(path.join(root,"capabilities","catalog.large.json"),path.join(out,"capabilities.json"));
await cp(path.join(root,"contracts"),path.join(out,"contracts"),{recursive:true});
await cp(path.join(root,"llm"),path.join(out,"llm"),{recursive:true});
await cp(path.join(root,"feedback"),path.join(out,"feedback"),{recursive:true});
await cp(path.join(root,"docs","product"),path.join(out,"product"),{recursive:true});

const landing=`<!doctype html><meta charset="utf-8"><title>Eidos Release</title>
<style>body{font:16px system-ui;background:#0b0d12;color:#fff;max-width:760px;margin:10vh auto;padding:24px}a{color:#9db2ff}li{margin:12px 0}</style>
<h1>Eidos Release</h1><p>Production-static release bundle.</p><ul>
<li><a href="./showcase/index.html">Commercial Showcase</a></li>
<li><a href="./demo/index.html">Engineering Demo</a></li>
<li><a href="./capabilities.json">Capability Catalog</a></li>
</ul>`;
await writeFile(path.join(out,"index.html"),landing);
console.log("Eidos release built at ./release");
