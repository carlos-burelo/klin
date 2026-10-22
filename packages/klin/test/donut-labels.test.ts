/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { PieArcDatum } from "d3-shape";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { DonutChart } from "../src/components/donut-chart";
import {
  type DonutSlice,
  layoutDonutOuterLabels,
  OUTER_LANE_MAX,
  resolveTotalPill,
  totalPillHits,
} from "../src/components/donut-chart.compute";

function fakeArcs(ns: number[]): PieArcDatum<DonutSlice>[] {
  const total = ns.reduce((a, b) => a + b, 0);
  let acc = 0;
  return ns.map((value, index) => {
    const startAngle = (acc / total) * Math.PI * 2;
    acc += value;
    const endAngle = (acc / total) * Math.PI * 2;
    return {
      data: { label: `S${index}`, value, index },
      index,
      value,
      startAngle,
      endAngle,
      padAngle: 0,
    };
  });
}

const SIZE = 220;
const RADIUS = 110;

describe("layoutDonutOuterLabels", () => {
  test("sin texto no genera etiquetas ni carril (sin conectores huérfanos)", () => {
    const out = layoutDonutOuterLabels(
      fakeArcs([50, 50]),
      RADIUS,
      SIZE,
      () => "",
    );
    expect(out).toEqual({ labels: [], lane: 0 });
  });
  test("carril medido, fuera del círculo y dentro del lienzo ampliado", () => {
    const out = layoutDonutOuterLabels(
      fakeArcs([62, 21, 11, 6]),
      RADIUS,
      SIZE,
      (d) => d.label,
    );
    expect(out.labels.length).toBe(4);
    expect(out.lane).toBeGreaterThan(0);
    expect(out.lane).toBeLessThanOrEqual(OUTER_LANE_MAX);
    const W = SIZE + out.lane * 2;
    for (const p of out.labels) {
      // Fuera del círculo (despeje) y dentro del lienzo.
      expect(Math.abs(p.x)).toBeGreaterThanOrEqual(RADIUS + 8 - 1e-9);
      const gx = p.x + W / 2;
      expect(gx).toBeGreaterThanOrEqual(0);
      expect(gx).toBeLessThanOrEqual(W);
      expect(p.leader).toContain("M");
    }
  });
  test("separación vertical mínima por lado", () => {
    const out = layoutDonutOuterLabels(
      fakeArcs([40, 30, 20, 10]),
      RADIUS,
      SIZE,
      (d) => `Etiqueta larga ${d.label}`,
      11,
    );
    for (const anchor of ["start", "end"] as const) {
      const ys = out.labels
        .filter((p) => p.anchor === anchor)
        .map((p) => p.y)
        .sort((a, b) => a - b);
      for (let i = 1; i < ys.length; i++) {
        expect((ys[i] ?? 0) - (ys[i - 1] ?? 0)).toBeGreaterThanOrEqual(
          11 * 1.15 - 1e-9,
        );
      }
    }
  });
  test("determinista", () => {
    const textFor = (d: DonutSlice) => d.label;
    const a = layoutDonutOuterLabels(
      fakeArcs([62, 21, 11, 6]),
      RADIUS,
      SIZE,
      textFor,
    );
    const b = layoutDonutOuterLabels(
      fakeArcs([62, 21, 11, 6]),
      RADIUS,
      SIZE,
      textFor,
    );
    expect(a).toEqual(b);
  });
  test("proporciones hostiles: 12 rebanadas con nombres largos", () => {
    const items = [30, 20, 15, 10, 8, 5, 4, 3, 2, 1.5, 1, 0.5].map(
      (value, i) => ({ label: `Serie número ${i + 1}`, value }),
    );
    const total = items.reduce((acc, b) => acc + b.value, 0);
    let acc = 0;
    const arcs = items.map((d, index) => {
      const startAngle = (acc / total) * Math.PI * 2;
      acc += d.value;
      return {
        data: { ...d, index },
        index,
        value: d.value,
        startAngle,
        endAngle: (acc / total) * Math.PI * 2,
        padAngle: 0,
      };
    });
    const out = layoutDonutOuterLabels(arcs, RADIUS, SIZE, (d) => d.label);
    expect(out.labels.length).toBe(items.length);
    expect(out.lane).toBeLessThanOrEqual(90);
    const W = SIZE + out.lane * 2;
    const H = SIZE + 32;
    for (const p of out.labels) {
      const w = p.text.length * 11 * 0.58;
      const gx = p.x + W / 2;
      const gy = p.y + H / 2;
      const x0 = p.anchor === "start" ? gx : gx - w;
      const x1 = p.anchor === "start" ? gx + w : gx;
      expect(x0).toBeGreaterThanOrEqual(-0.5);
      expect(x1).toBeLessThanOrEqual(W + 0.5);
      expect(gy).toBeGreaterThanOrEqual(-0.5);
      expect(gy).toBeLessThanOrEqual(H + 0.5);
      expect(Math.abs(p.x)).toBeGreaterThanOrEqual(RADIUS + 8 - 1e-9);
    }
  });
});

describe("resolveTotalPill / totalPillHits", () => {
  test("sin agujero siempre hay píldora", () => {
    expect(resolveTotalPill(10, 0).show).toBe(true);
  });
  test("con agujero amplio no hay píldora; con total ancho sí", () => {
    expect(resolveTotalPill(40, 144).show).toBe(false);
    expect(resolveTotalPill(200, 144).show).toBe(true);
  });
  test("veto bajo la píldora", () => {
    const pill = resolveTotalPill(200, 144);
    expect(totalPillHits(pill, 0, 0)).toBe(true);
    expect(totalPillHits(pill, 500, 500)).toBe(false);
    expect(totalPillHits({ show: false, w: 1, h: 1 }, 0, 0)).toBe(false);
  });
});

describe("total centrado con carriles", () => {
  test("textos y píldora usan el centro del viewBox, no el radio", () => {
    const html = renderToStaticMarkup(
      createElement(DonutChart, {
        ariaLabel: "dona",
        totalLabel: "Alumnos",
        innerLabels: "value",
        outerLabels: "label",
        showLegend: false,
        data: [
          { label: "Jalisco", value: 320 },
          { label: "Nuevo León", value: 280 },
          { label: "Puebla", value: 190 },
          { label: "Oaxaca", value: 140 },
          { label: "Yucatán", value: 110 },
        ],
      }),
    );
    const vb = html.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    expect(vb).not.toBeNull();
    const cx = Number(vb?.[1]) / 2;
    expect(cx).toBeGreaterThan(110);
    // Total: valor centrado en el viewBox real (no en el radio viejo).
    const valueEl = html.match(
      /<text x="([\d.]+)" y="([\d.]+)"[^>]*>1,040<\/text>/,
    );
    expect(valueEl).not.toBeNull();
    expect(Number(valueEl?.[1])).toBeCloseTo(cx, 6);
  });
});
