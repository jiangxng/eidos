import {createHash} from "node:crypto";
import {readFile,readdir,stat,writeFile} from "node:fs/promises";
import path from "node:path";
const root=path.resolve("release");
async function walk(dir){let out=[];for(const n of await readdir(dir)){const p=path.join(dir,n);(await stat(p)).isDirectory()?out.push(...await walk(p)):out.push(p)}return out}
const files=(await walk(root)).sort();const manifest=[];
for(const f of files){const b=await readFile(f);manifest.push({path:path.relative(root,f).replaceAll("\\\\","/"),bytes:b.length,sha256:createHash("sha256").update(b).digest("hex")})}
await writeFile(path.join(root,"release.manifest.json"),JSON.stringify({version:"1.0.0-rc.1",files:manifest},null,2)+"\n");
console.log(`Release manifest: ${manifest.length} files`);
