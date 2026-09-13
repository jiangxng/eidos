import fs from "node:fs";import path from "node:path";import crypto from "node:crypto";import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const required=["CONSTITUTION.md","START-HERE.md","README.md","PUBLIC-API.md","LLM.md","capabilities/catalog.json","llm/repository-map.json","docs/architecture/EXPERIENCE-ARCHITECTURE.md","docs/ec/EC-EXPECTATIONS.md","contracts/experience-context/v0.1.0/schema.json","contracts/experience-composition/v0.1.0/schema.json"];
const failures=[];for(const f of required)if(!fs.existsSync(path.join(root,f)))failures.push(`missing: ${f}`);
const cat=JSON.parse(fs.readFileSync(path.join(root,"capabilities/catalog.json"),"utf8"));const ids=new Set();
for(const c of cat.capabilities){if(ids.has(c.id))failures.push(`duplicate capability id: ${c.id}`);ids.add(c.id);if(!fs.existsSync(path.join(root,"capabilities",c.id,"CAPABILITY.md")))failures.push(`capability without documentation: ${c.id}`);}
if(failures.length){console.error("EIDOS repository validation FAILED");for(const f of failures)console.error(`- ${f}`);process.exit(1);}
console.log("EIDOS repository validation PASS");
console.log(crypto.createHash("sha256").update(fs.readFileSync(path.join(root,"CONSTITUTION.md"))).digest("hex"),"CONSTITUTION.md");
