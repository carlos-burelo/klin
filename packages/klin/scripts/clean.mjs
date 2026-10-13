// Limpia dist/ antes de compilar (tsc no limpia restos previos).
import { rmSync } from "node:fs";

rmSync(new URL("../dist/", import.meta.url), { recursive: true, force: true });
