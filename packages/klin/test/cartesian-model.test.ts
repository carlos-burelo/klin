/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { describe, expect, test } from "vitest";
import {
  buildValueAxis,
  placeEndValueLabel,
  placeTopValueLabel,
} from "../src/core/cartesian-model";
import { markerId, markerUrl } from "../src/render/markers";

describe("buildValueAxis", () => {
  test("lineal honesto con cero", () => {
    const axis = buildValueAxis({ values: [10, 20] }, [100, 0]);
    expect(axis.lo).toBe(0);
    expect(axis.hi).toBe(20);
    expect(axis.log).toBe(false);
    expect(axis.y(0)).toBe(100);
    expect(axis.ticks.length).toBeGreaterThan(0);
    expect(axis.ticksCount).toBeGreaterThanOrEqual(1);
    expect(axis.fmt(20)).toBe(axis.fmt(20));
  });
  test("overrides yMin/yMax", () => {
    const axis = buildValueAxis(
      { values: [10, 20], yMin: 5, yMax: 30 },
      [100, 0],
    );
    expect(axis.lo).toBe(5);
    expect(axis.hi).toBe(30);
  });
  test("percent → [0, 1]", () => {
    const axis = buildValueAxis({ values: [3, 7], percent: true }, [100, 0]);
    expect(axis.lo).toBe(0);
    expect(axis.hi).toBe(1);
    expect(axis.log).toBe(false);
  });
  test("log: piso para no-positivos", () => {
    const axis = buildValueAxis(
      { values: [1, 10, 100], scale: "log" },
      [100, 0],
    );
    expect(axis.log).toBe(true);
    expect(axis.lift(-5)).toBe(axis.lo);
    expect(axis.lift(10)).toBe(10);
  });
  test("lineal: lift identidad", () => {
    const axis = buildValueAxis({ values: [1, 2] }, [100, 0]);
    expect(axis.lift(-5)).toBe(-5);
  });
  test("formato override y locale", () => {
    const axis = buildValueAxis(
      { values: [1.5], format: (v) => `!${v}` },
      [100, 0],
    );
    expect(axis.fmt(1.5)).toBe("!1.5");
  });
});

describe("placeTopValueLabel / placeEndValueLabel", () => {
  test("arriba: fuera salvo recorte (entra con contraste)", () => {
    expect(placeTopValueLabel(100, 12, 11)).toEqual({ pos: 96, inside: false });
    expect(placeTopValueLabel(14, 12, 11)).toEqual({ pos: 29, inside: true });
  });
  test("final: fuera salvo recorte (entra con contraste)", () => {
    expect(placeEndValueLabel(500, 628, 40)).toEqual({
      pos: 505,
      inside: false,
    });
    expect(placeEndValueLabel(600, 628, 40)).toEqual({
      pos: 555,
      inside: true,
    });
  });
});
describe("markers", () => {
  test("ids estables por diagrama", () => {
    expect(markerId("charts-flow", "arrow")).toBe("charts-flow-arrow");
    expect(markerId("charts-class", "chevron")).toBe("charts-class-arrow");
    expect(markerId("charts-class", "inherit")).toBe("charts-class-inherit");
    expect(markerId("charts-class", "composite")).toBe(
      "charts-class-composite",
    );
    expect(markerUrl("charts-seq", "arrow")).toBe("url(#charts-seq-arrow)");
  });
});
