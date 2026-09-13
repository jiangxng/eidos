import fs from "node:fs";for(const f of ["demo/index.html","demo/app.js","demo/styles.css"]){if(!fs.existsSync(f))throw new Error(`Missing ${f}`)}console.log("EIDOS six-track demo PASS");
