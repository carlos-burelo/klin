/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { describe, expect, test } from "vitest";
import {
  cleanValues,
  GAUSS_NORM,
  KDE_BINS,
  kdeBandwidth,
  kdeOf,
  kdePeak,
} from "../src/core/kde";

describe("kdeBandwidth", () => {
  test("vacío → fallback 1", () => {
    expect(kdeBandwidth([])).toBe(1);
  });
  test("Silverman 1.06·sd·n^-0.2", () => {
    const h = kdeBandwidth([0, 2]);
    expect(h).toBeCloseTo(1.06 * 1 * 2 ** -0.2, 10);
  });
  test("constantes → rango/10 o 1", () => {
    expect(kdeBandwidth([5, 5, 5])).toBe(1);
    expect(kdeBandwidth([0, 0, 10, 10])).toBeGreaterThan(0);
  });
  test("nunca ≤ 0 ni NaN", () => {
    for (const v of [[1], [0, 1, 2, 3, 100], [-5, -5]]) {
      const h = kdeBandwidth(v);
      expect(Number.isFinite(h)).toBe(true);
      expect(h).toBeGreaterThan(0);
    }
  });
});

describe("kdeOf", () => {
  test("vacío → []", () => {
    expect(kdeOf([], 1, 0, 1)).toEqual([]);
  });
  test("rejilla con `bins` puntos y densidades finitas", () => {
    const pts = kdeOf([0, 1, 2], 0.5, 0, 2, 5);
    expect(pts).toHaveLength(5);
    expect(pts[0]?.value).toBe(0);
    expect(pts[4]?.value).toBe(2);
    for (const p of pts) {
      expect(Number.isFinite(p.value)).toBe(true);
      expect(Number.isFinite(p.density)).toBe(true);
      expect(p.density).toBeGreaterThanOrEqual(0);
    }
  });
  test("un solo valor → pico centrado", () => {
    const pts = kdeOf([4], 1, 0, 8, 9);
    expect(kdePeak(pts)).toBe(4);
  });
  test("rango invertido se corrige", () => {
    const a = kdeOf([1, 2], 0.5, 0, 4, 5);
    const b = kdeOf([1, 2], 0.5, 4, 0, 5);
    expect(a).toEqual(b);
  });
  test("constante de normalización fijada (pin histórico)", () => {
    expect(GAUSS_NORM).toBe(0.204_179_955_571_658_05);
    expect(KDE_BINS).toBe(48);
  });
});

describe("kdePeak", () => {
  test("vacío → 0", () => {
    expect(kdePeak([])).toBe(0);
  });
});

describe("cleanValues", () => {
  test("filtra no-finitos", () => {
    expect(cleanValues([1, Number.NaN, 2, Infinity, 3])).toEqual([1, 2, 3]);
  });
});
