import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import * as klin from "../src/index";

/** Archivos cuyo export no sigue la convención PascalCase del nombre. */
const EXCEPTIONS: Record<string, string> = {
  empty: "ChartEmpty",
  legend: "ChartLegend",
  "tooltip-portal": "ChartTooltipPortal",
  "usecase-diagram": "UseCaseDiagram",
  "ecdf-chart": "ECDFChart",
};

function pascal(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

describe("subpaths por componente (barril completo)", () => {
  const files = readdirSync(new URL("../src/components/", import.meta.url))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.slice(0, -".tsx".length))
    // Módulos de parte (`.types`, `.compute`, `.glyphs`) no son componentes
    // públicos: se prueban aparte y no entran al barril por nombre propio.
    .filter((slug) => !slug.includes("."))
    .sort();
  test("cada archivo expone su componente en el barril", () => {
    expect(files.length).toBeGreaterThan(70);
    for (const slug of files) {
      const name = EXCEPTIONS[slug] ?? pascal(slug);
      expect(
        (klin as Record<string, unknown>)[name],
        `${slug} → ${name}`,
      ).toBeTypeOf("function");
    }
  });
});
