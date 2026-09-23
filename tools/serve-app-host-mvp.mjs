import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT ?? 4200);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const requested = url.pathname === "/" ? "/examples/app-host-mvp/index.html" : url.pathname;
  const safe = normalize(requested).replace(/^([.][.][/\\])+/, "");
  const path = join(root, safe);

  try {
    const stat = statSync(path);
    if (!stat.isFile()) throw new Error("not file");
    response.statusCode = 200;
    response.setHeader("content-type", contentTypes[extname(path)] ?? "application/octet-stream");
    createReadStream(path).pipe(response);
  } catch {
    response.statusCode = 404;
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Eidos App Host MVP: http://localhost:${port}`);
  console.log("Expected App Manager: http://localhost:4100");
});
