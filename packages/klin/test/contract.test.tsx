import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

/** Props universales: todo tipo con ariaLabel (gráfica/diagrama) las exige. */
const UNIVERSAL = [
  "ariaLabel",
  "className",
  "style",
  "ariaDescribedBy",
  "emptyTitle",
  "emptyDescription",
];

/** `locale` solo donde se formatea (número/fecha); en el resto sería API muerta. */
const FORMATS = /formatDefault|toLocale(Date|String)?\(|Intl\./;

/** Extrae bloques `export type XProps... = { ... }` con llaves balanceadas. */
function propsBlocks(src: string): string[] {
  const out: string[] = [];
  const re = /export type \w*Props\w* = \{/g;
  for (const m of src.matchAll(re)) {
    let i = (m.index ?? 0) + m[0].length;
    let depth = 1;
    while (i < src.length && depth > 0) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") depth--;
      i++;
    }
    out.push(src.slice(m.index, i));
  }
  return out;
}

describe("contrato de props universales", () => {
  const dir = new URL("../src/components/", import.meta.url);
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .sort();
  test("cada gráfica/diagrama expone las universales (+locale si formatea)", () => {
    expect(files.length).toBeGreaterThan(70);
    const missing: string[] = [];
    for (const f of files) {
      const src = readFileSync(new URL(f, dir), "utf8");
      const needsLocale = FORMATS.test(src);
      for (const block of propsBlocks(src)) {
        if (!block.includes("ariaLabel")) continue;
        const name = block.match(/export type (\w+)/)?.[1] ?? f;
        const keys = needsLocale ? [...UNIVERSAL, "locale"] : UNIVERSAL;
        for (const key of keys) {
          if (!new RegExp(`\\b${key}\\b`).test(block))
            missing.push(`${f}:${name} sin ${key}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
