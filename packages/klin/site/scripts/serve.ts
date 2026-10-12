/**
 * Servidor estático mínimo para previsualizar `site/out/` (sin dependencias).
 *
 * Uso: pnpm site:dev  (= site:build + tsx site/scripts/serve.ts [puerto])
 */
import { readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "out",
);
const port = Number(process.argv[2] ?? 3100);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

async function resolve(urlPath: string): Promise<string | null> {
  const clean = urlPath.split("?")[0] ?? "/";
  const candidates = clean.endsWith("/")
    ? [path.join(clean, "index.html")]
    : [clean, `${clean}.html`, path.join(clean, "index.html")];
  for (const c of candidates) {
    const full = path.normalize(path.join(root, c));
    if (!full.startsWith(root)) return null;
    try {
      const st = await stat(full);
      if (st.isFile()) return full;
    } catch {
      // Siguiente candidato.
    }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const file = await resolve(req.url ?? "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, {
    "content-type": MIME[path.extname(file)] ?? "application/octet-stream",
  });
  res.end(body);
});

server.listen(port, () => {
  console.log(`site: http://localhost:${port}/`);
});
