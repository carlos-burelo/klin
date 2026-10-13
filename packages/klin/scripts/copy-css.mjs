// Copia el CSS suelto a dist/ (tsc solo emite TS).
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync(new URL("../dist/", import.meta.url), { recursive: true });
copyFileSync(
  new URL("../src/styles.css", import.meta.url),
  new URL("../dist/styles.css", import.meta.url),
);
