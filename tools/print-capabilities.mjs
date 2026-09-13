import fs from "node:fs";
const catalog=JSON.parse(fs.readFileSync(new URL("../capabilities/catalog.json",import.meta.url),"utf8"));
for(const c of catalog.capabilities)console.log(`${c.id}@${c.version}\t${c.maturity}\t${c.category}\t${c.renderers.join(",")}`);
