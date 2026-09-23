import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const port = Number(process.env.PORT ?? 4200);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};

export function resolveRepoFile(urlPath) {
  const requested = urlPath === "/" ? "/examples/app-host-mvp/index.html" : urlPath;
  const decoded = decodeURIComponent(requested);
  if (decoded.includes("\0")) return undefined;

  const relativePath = decoded.replace(/^[/\\]+/, "");
  const candidate = resolve(root, relativePath);
  const fromRoot = relative(root, candidate);

  if (fromRoot === "" || fromRoot === ".." || fromRoot.startsWith(`..${sep}`)) {
    return undefined;
  }

  return candidate;
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const path = resolveRepoFile(url.pathname);

  if (!path) {
    response.statusCode = 400;
    return response.end("Invalid path");
  }

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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(port, () => {
    console.log(`Eidos App Host MVP: http://localhost:${port}`);
    console.log("Expected App Manager: http://localhost:4100");\n    console.log("Expected Enterprise Agent: http://localhost:4300");
  });
}
