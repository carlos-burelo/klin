/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { describe, expect, test } from "vitest";
import { fitTextMiddle } from "../src/render/measure";

describe("fitTextMiddle", () => {
  test("conserva inicio y final con prefijos iguales", () => {
    const out = fitTextMiddle("Ingeniería en Sistemas", 70);
    expect(out).toContain("…");
    expect(out.startsWith("Ingen")).toBe(true);
    expect(out.endsWith("emas")).toBe(true);
  });
  test("cabe intacto y vacío sin hueco", () => {
    expect(fitTextMiddle("Corto", 200)).toBe("Corto");
    expect(fitTextMiddle("Corto", 0)).toBe("");
  });
});
