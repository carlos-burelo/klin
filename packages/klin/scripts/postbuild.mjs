// Post-build:
// 1. Copia el CSS suelto a dist/ (tsup solo empaqueta el entry TS).
// 2. Fija la extensión del portal externo: el núcleo referencia
//    "./components/tooltip-portal" sin extensión; cada formato necesita la
//    suya (.js en ESM, .cjs en CJS). Reemplazo en la misma línea: no desplaza
//    líneas, los sourcemaps del núcleo siguen válidos.
// 3. Antepone "use client" al portal (esbuild la elimina al empaquetar).
//    El portal sale sin sourcemap, así que no hay mapa que romper.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
copyFileSync(
  new URL("../src/styles.css", import.meta.url),
  new URL("../dist/styles.css", import.meta.url),
);

function replaceSameLine(file, from, to) {
  const url = new URL(file, import.meta.url);
  const src = readFileSync(url, "utf8");
  if (!src.includes(from))
    throw new Error(`postbuild: marcador no encontrado en ${file}`);
  writeFileSync(url, src.split(from).join(to));
}

replaceSameLine(
  "../dist/index.js",
  "from './components/tooltip-portal'",
  "from './components/tooltip-portal.js'",
);
replaceSameLine(
  "../dist/index.cjs",
  "require('./components/tooltip-portal')",
  "require('./components/tooltip-portal.cjs')",
);

for (const file of [
  "../dist/components/tooltip-portal.js",
  "../dist/components/tooltip-portal.cjs",
]) {
  const url = new URL(file, import.meta.url);
  const src = readFileSync(url, "utf8");
  if (!src.startsWith('"use client";'))
    writeFileSync(url, `"use client";\n${src}`);
}
