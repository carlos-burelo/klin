// Limpia dist/ y el tsbuildinfo antes de compilar (tsc incremental
// omite la emisión si el .tsbuildinfo dice "al día", aunque dist/ falte).
import { rmSync } from "node:fs";

rmSync(new URL("../dist/", import.meta.url), { recursive: true, force: true });
rmSync(
  new URL("../node_modules/.cache/tsconfig.build.tsbuildinfo", import.meta.url),
  {
    force: true,
  },
);
