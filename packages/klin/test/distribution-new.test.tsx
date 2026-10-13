/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { EMPTY_TITLE } from "../src/components/empty";
import { RidgelinePlot } from "../src/components/ridgeline-plot";
import { ViolinPlot } from "../src/components/violin-plot";

const groups = [
  { label: "A", values: [1, 2, 3, 4, 5, 4, 3, 2, 1] },
  { label: "B", values: [2, 3, 4, 5, 6, 7, 6, 5, 4] },
  { label: "C", values: [5, 5, 6, 6, 7, 7, 8] },
];

describe("distribuciones nuevas SSR (sin JS)", () => {
  test("ViolinPlot pinta un violín por grupo con su tip", () => {
    const html = renderToStaticMarkup(
      <ViolinPlot ariaLabel="violines demo" groups={groups} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="violines demo"');
    // Un path espejado por grupo, cada uno con su tooltip.
    expect(html.match(/<path/g)?.length).toBe(3);
    expect(html.match(/data-chart-tip/g)?.length).toBe(3);
    expect(html).toContain("A: n 9 · mediana");
    expect(html).toContain("Q1");
    expect(html).toContain("Q3");
  });

  test("ViolinPlot filtra no-finitos y acepta bandwidth numérico", () => {
    const html = renderToStaticMarkup(
      <ViolinPlot
        ariaLabel="violín raro"
        groups={[{ label: "A", values: [1, Number.NaN, 2, Infinity, 3] }]}
        bandwidth={0.5}
      />,
    );
    expect(html.match(/<path/g)?.length).toBe(1);
    expect(html.match(/data-chart-tip/g)?.length).toBe(1);
    expect(html).toContain("A: n 3 · mediana");
  });

  test("ViolinPlot vacío pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <ViolinPlot ariaLabel="vacío" groups={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const htmlRaro = renderToStaticMarkup(
      <ViolinPlot
        ariaLabel="vacío"
        groups={[{ label: "X", values: [Number.NaN] }]}
      />,
    );
    expect(htmlRaro).toContain(EMPTY_TITLE);
    expect(htmlRaro).not.toContain("<svg");
  });

  test("RidgelinePlot pinta una cresta por serie con su tip", () => {
    const html = renderToStaticMarkup(
      <RidgelinePlot ariaLabel="crestas demo" series={groups} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="crestas demo"');
    // Una cresta por serie, cada una con su tooltip.
    expect(html.match(/<path/g)?.length).toBe(3);
    expect(html.match(/data-chart-tip/g)?.length).toBe(3);
    expect(html).toContain("B: n 9 · pico en");
    expect(html).toContain("C: n 7 · pico en");
  });

  test("RidgelinePlot filtra no-finitos y respeta el solape", () => {
    const html = renderToStaticMarkup(
      <RidgelinePlot
        ariaLabel="cresta rara"
        series={[
          { label: "A", values: [1, Number.NaN, 2, 2, 3] },
          { label: "B", values: [4, 5, 6, 5, 4] },
        ]}
        overlap={0.2}
      />,
    );
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html.match(/data-chart-tip/g)?.length).toBe(2);
    expect(html).toContain("A: n 4 · pico en");
  });

  test("RidgelinePlot vacío pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <RidgelinePlot ariaLabel="vacío" series={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const htmlRaro = renderToStaticMarkup(
      <RidgelinePlot
        ariaLabel="vacío"
        series={[{ label: "X", values: [Number.NaN] }]}
      />,
    );
    expect(htmlRaro).toContain(EMPTY_TITLE);
    expect(htmlRaro).not.toContain("<svg");
  });
});
