/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import {
  ChordDiagram,
  computeChordLayout,
  MAX_CHORD,
} from "../src/components/chord-diagram";
import {
  computeDensityContours,
  DensityContourPlot,
} from "../src/components/density-contour-plot";
import { computeHexbins, HexbinPlot } from "../src/components/hexbin-plot";
import { EMPTY_TITLE } from "../src/render/empty";

const CHORD_LABELS = ["A", "B", "C"];
const CHORD_MATRIX = [
  [0, 5, 3],
  [2, 0, 4],
  [1, 1, 0],
];

const DENSITY_POINTS = [
  { x: 5, y: 5, label: "c1" },
  { x: 5.4, y: 5.2, label: "c2" },
  { x: 4.8, y: 5.5 },
  { x: 5.2, y: 4.7 },
  { x: 5.1, y: 5.1 },
  { x: 4.9, y: 4.9 },
  { x: 5.3, y: 5.4 },
  { x: 5.0, y: 5.3 },
  { x: 8, y: 2, label: "lejos" },
  { x: 8.2, y: 2.1 },
];

const HEX_POINTS = [
  { x: 1, y: 1 },
  { x: 1.1, y: 1.2 },
  { x: 1.2, y: 1.1 },
  { x: 5, y: 5 },
  { x: 5.1, y: 5.2 },
  { x: 5.2, y: 5.1 },
  { x: 9, y: 2 },
  { x: 9.1, y: 2.2 },
];

/** Tips === `data-chart-tip` por forma (`<title>` prohibido en todo src). */
function expectTipsMatchTitles(html: string) {
  const titles = html.match(/<title>/g)?.length ?? 0;
  const tips = html.match(/data-chart-tip/g)?.length ?? 0;
  expect(titles).toBe(0);
  expect(tips).toBeGreaterThan(0);
}

describe("ronda 2c SSR (sin JS)", () => {
  test("ChordDiagram pinta anillo + cintas con tips y aria-label", () => {
    const html = renderToStaticMarkup(
      <ChordDiagram
        ariaLabel="flujos demo"
        labels={CHORD_LABELS}
        matrix={CHORD_MATRIX}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="flujos demo"');
    // 3 arcos + 3 cintas (pares bidireccionales combinados).
    expect(html.match(/<path/g)?.length).toBe(6);
    expect(html.match(/data-chart-tip/g)?.length).toBe(6);
    expectTipsMatchTitles(html);
    expect(html).toContain("A → B:");
    expect(html).toContain("A:");
  });

  test("ChordDiagram vacío pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <ChordDiagram ariaLabel="vacío" labels={[]} matrix={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const htmlCero = renderToStaticMarkup(
      <ChordDiagram
        ariaLabel="vacío"
        labels={["A", "B"]}
        matrix={[
          [0, 0],
          [0, 0],
        ]}
      />,
    );
    expect(htmlCero).toContain(EMPTY_TITLE);
    expect(htmlCero).not.toContain("<svg");
  });

  test("computeChordLayout trunca la matriz a MAX_CHORD", () => {
    const labels = Array.from({ length: 15 }, (_, i) => `N${i}`);
    const matrix = labels.map((_, i) =>
      labels.map((_, j) => (i === j ? 0 : i + j + 1)),
    );
    const out = computeChordLayout(labels, matrix);
    expect(MAX_CHORD).toBe(12);
    expect(out.labels.length).toBe(12);
    expect(out.matrix.length).toBe(12);
    expect(out.matrix[0]?.length).toBe(12);
    expect(out.total).toBeGreaterThan(0);
  });

  test("DensityContourPlot pinta contornos + puntos con tips y aria-label", () => {
    const html = renderToStaticMarkup(
      <DensityContourPlot ariaLabel="densidad demo" points={DENSITY_POINTS} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="densidad demo"');
    // Un círculo por punto de la muestra.
    expect(html.match(/<circle/g)?.length).toBe(DENSITY_POINTS.length);
    // Al menos un contorno con su tip de densidad.
    expect(html).toContain("densidad ≥");
    expectTipsMatchTitles(html);
    expect(html).toContain("c1:");
  });

  test("DensityContourPlot vacío pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <DensityContourPlot ariaLabel="vacío" points={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const htmlRaro = renderToStaticMarkup(
      <DensityContourPlot
        ariaLabel="vacío"
        points={[
          { x: Number.NaN, y: 1 },
          { x: 1, y: Number.NaN },
        ]}
      />,
    );
    expect(htmlRaro).toContain(EMPTY_TITLE);
    expect(htmlRaro).not.toContain("<svg");
  });

  test("computeDensityContours posiciona toda la muestra", () => {
    const out = computeDensityContours(DENSITY_POINTS, 584, 216);
    expect(out.positioned.length).toBe(DENSITY_POINTS.length);
    expect(out.contours.length).toBeGreaterThan(0);
  });

  test("HexbinPlot pinta celdas con tips y aria-label", () => {
    const html = renderToStaticMarkup(
      <HexbinPlot ariaLabel="celdas demo" points={HEX_POINTS} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="celdas demo"');
    // Una celda por hexágono agregado, cada una con su tip.
    const paths = html.match(/<path/g)?.length ?? 0;
    expect(paths).toBeGreaterThan(0);
    expect(html.match(/data-chart-tip/g)?.length).toBe(paths);
    expectTipsMatchTitles(html);
    expect(html).toContain("celda:");
    expect(html).toContain("puntos (");
    expect(html).toContain("%)");
  });

  test("HexbinPlot vacío pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <HexbinPlot ariaLabel="vacío" points={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });

  test("computeHexbins agrega sin perder puntos", () => {
    const out = computeHexbins(HEX_POINTS, 584, 216);
    expect(out.total).toBe(HEX_POINTS.length);
    expect(out.maxCount).toBeGreaterThan(0);
    const sum = out.bins.reduce((acc, b) => acc + b.count, 0);
    expect(sum).toBe(HEX_POINTS.length);
    expect(out.bins.length).toBeLessThanOrEqual(HEX_POINTS.length);
    expect(out.hexagon.length).toBeGreaterThan(0);
  });
});
