/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { describe, expect, test } from "vitest";
import {
  type CartesianXLabel,
  layoutXLabels,
} from "../src/render/cartesian-frame";

function labels(
  n: number,
  text = "Etiqueta larga de prueba",
): CartesianXLabel[] {
  return Array.from({ length: n }, (_, i) => ({
    x: i * 20,
    label: `${text} ${i}`,
    title: `${text} ${i}`,
  }));
}

describe("layoutXLabels", () => {
  test("0-1 etiquetas intactas, sin escalonar ni rotar", () => {
    expect(layoutXLabels([], 500)).toEqual({
      shown: [],
      stagger: false,
      rotate: false,
      maxW: 0,
    });
    const one = layoutXLabels(labels(1), 500);
    expect(one.shown).toHaveLength(1);
    expect(one.stagger).toBe(false);
    expect(one.rotate).toBe(false);
  });
  test("pocas y cortas: todo en una fila", () => {
    const out = layoutXLabels(
      Array.from({ length: 8 }, (_, i) => ({ x: i * 70, label: `G${i}` })),
      560,
    );
    expect(out.shown).toHaveLength(8);
    expect(out.stagger).toBe(false);
    expect(out.rotate).toBe(false);
  });
  test("medianas: todo en dos filas", () => {
    const out = layoutXLabels(
      Array.from({ length: 12 }, (_, i) => ({
        x: i * 46,
        label: `Región ${i}`,
      })),
      560,
    );
    expect(out.shown).toHaveLength(12);
    expect(out.stagger).toBe(true);
    expect(out.rotate).toBe(false);
  });
  test("24 largas: rotación 45° con raleo al paso diagonal", () => {
    const lbs = Array.from({ length: 24 }, (_, i) => ({
      x: i * 23,
      label: `Ingeniería en Sistemas ${i}`,
      title: `Ingeniería en Sistemas ${i}`,
    }));
    const out = layoutXLabels(lbs, 560);
    expect(out.rotate).toBe(true);
    expect(out.stagger).toBe(false);
    expect(out.shown.length).toBeGreaterThan(0);
    expect(out.shown.length).toBeLessThanOrEqual(24);
    // Paso diagonal: vecinas a ≥16px.
    const xs = out.shown.map((l) => l.x);
    for (let i = 1; i < xs.length; i++) {
      expect((xs[i] ?? 0) - (xs[i - 1] ?? 0)).toBeGreaterThanOrEqual(16);
    }
  });
});
