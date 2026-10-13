// Post-build:
// 1. Copia el CSS suelto a dist/ (tsup solo empaqueta el entry TS).
// 2. Fija la extensión del portal externo: el núcleo referencia
//    "./components/tooltip-portal" sin extensión y ESM exige ".js".
//    Reemplazo en la misma línea: no desplaza líneas, los sourcemaps
//    del núcleo siguen válidos.
// 3. Antepone "use client" al portal (esbuild la elimina al empaquetar).
//    El portal sale sin sourcemap, así que no hay mapa que romper.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
copyFileSync(
  new URL("../src/styles.css", import.meta.url),
  new URL("../dist/styles.css", import.meta.url),
);

const url = new URL("../dist/index.js", import.meta.url);
const src = readFileSync(url, "utf8");
const from = "from './components/tooltip-portal'";
if (!src.includes(from))
  throw new Error("postbuild: marcador no encontrado en ../dist/index.js");
writeFileSync(
  url,
  src.split(from).join("from './components/tooltip-portal.js'"),
);

const portal = new URL("../dist/components/tooltip-portal.js", import.meta.url);
const portalSrc = readFileSync(portal, "utf8");
if (!portalSrc.startsWith('"use client";'))
  writeFileSync(portal, `"use client";\n${portalSrc}`);
