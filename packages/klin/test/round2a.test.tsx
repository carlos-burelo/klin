/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { DotPlot } from "../src/components/dot-plot";
import { IsotypeChart } from "../src/components/isotype-chart";
import { TernaryPlot } from "../src/components/ternary-plot";
import { EMPTY_TITLE } from "../src/render/empty";

describe("TernaryPlot SSR (sin JS)", () => {
  const pts = [
    { a: 50, b: 30, c: 20, label: "P1" },
    { a: 1, b: 1, c: 1, label: "P2" },
    { a: 0.2, b: 0.3, c: 0.5 },
  ];

  test("pinta un punto por fila con tip normalizado", () => {
    const html = renderToStaticMarkup(
      <TernaryPlot ariaLabel="ternario demo" points={pts} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="ternario demo"');
    expect(html.match(/<circle/g)?.length).toBe(3);
    expect(html.match(/data-chart-tip/g)?.length).toBe(3);
    expect(html).toContain('data-chart-tip="P1: 50% · 30% · 20%"');
    expect(html).toContain("P2: 33.3% · 33.3% · 33.3%");
    expect(html).toContain(">A<");
    expect(html).toContain(">B<");
    expect(html).toContain(">C<");
  });

  test("vacío sin puntos válidos (sin <svg>)", () => {
    const empty = renderToStaticMarkup(
      <TernaryPlot ariaLabel="vacío" points={[]} />,
    );
    expect(empty).toContain(EMPTY_TITLE);
    expect(empty).not.toContain("<svg");
    const zeroes = renderToStaticMarkup(
      <TernaryPlot
        ariaLabel="vacío"
        points={[{ a: 0, b: 0, c: 0, label: "Nulo" }]}
      />,
    );
    expect(zeroes).toContain(EMPTY_TITLE);
    expect(zeroes).not.toContain("<svg");
  });

  test("etiquetas de vértice personalizadas", () => {
    const html = renderToStaticMarkup(
      <TernaryPlot
        ariaLabel="vértices"
        points={pts}
        aLabel="Agua"
        bLabel="Tierra"
        cLabel="Aire"
        showLegend={false}
      />,
    );
    expect(html).toContain(">Agua<");
    expect(html).toContain(">Tierra<");
    expect(html).toContain(">Aire<");
  });

  test("topa puntos en DEFAULT_MAX_ROWS", () => {
    const big = Array.from({ length: 405 }, (_, i) => ({
      a: 1 + (i % 3),
      b: 1,
      c: 1,
      label: `P${i}`,
    }));
    const html = renderToStaticMarkup(
      <TernaryPlot ariaLabel="muchos" points={big} showLegend={false} />,
    );
    expect(html.match(/<circle/g)?.length).toBe(400);
    expect(html.match(/data-chart-tip/g)?.length).toBe(400);
  });
});

describe("DotPlot SSR (sin JS)", () => {
  const data = [
    { cat: "A", v: 10 },
    { cat: "B", v: -4 },
    { cat: "C", v: 7 },
  ];

  test("pinta un punto por categoría con tip categoría: valor", () => {
    const html = renderToStaticMarkup(
      <DotPlot
        ariaLabel="puntos demo"
        data={data}
        categoryKey="cat"
        valueKey="v"
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="puntos demo"');
    expect(html.match(/<circle/g)?.length).toBe(3);
    expect(html.match(/data-chart-tip/g)?.length).toBe(6);
    expect(html).toContain('data-chart-tip="A: 10"');
    expect(html).toContain("B: -4");
    expect(html).toContain("C: 7");
  });

  test("vacío sin filas válidas (sin <svg>)", () => {
    const html = renderToStaticMarkup(
      <DotPlot ariaLabel="vacío" data={[]} categoryKey="cat" valueKey="v" />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const nan = renderToStaticMarkup(
      <DotPlot
        ariaLabel="vacío"
        data={[{ cat: "X", v: Number.NaN }]}
        categoryKey="cat"
        valueKey="v"
      />,
    );
    expect(nan).toContain(EMPTY_TITLE);
    expect(nan).not.toContain("<svg");
  });

  test("topa filas en DEFAULT_MAX_ROWS", () => {
    const big = Array.from({ length: 405 }, (_, i) => ({
      cat: `F${i}`,
      v: i + 1,
    }));
    const html = renderToStaticMarkup(
      <DotPlot ariaLabel="muchos" data={big} categoryKey="cat" valueKey="v" />,
    );
    expect(html.match(/<circle/g)?.length).toBe(400);
    expect(html.match(/data-chart-tip/g)?.length).toBe(800);
  });
});

describe("IsotypeChart SSR (sin JS)", () => {
  test("pinta un pictograma por unidad con tip de conteo", () => {
    const html = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="isotipo demo"
        series={[
          { label: "Gatos", value: 25 },
          { label: "Perros", value: 10 },
        ]}
        unit={5}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="isotipo demo"');
    expect(html.match(/<circle/g)?.length).toBe(7);
    expect(html.match(/data-chart-tip/g)?.length).toBe(9);
    expect(html).toContain('data-chart-tip="Gatos: 25 (5 pictogramas)"');
    expect(html).toContain("Perros: 10 (2 pictogramas)");
    expect(html).toContain(">Gatos<");
  });

  test("vacío sin series válidas o sin unidad (sin <svg>)", () => {
    const empty = renderToStaticMarkup(
      <IsotypeChart ariaLabel="vacío" series={[]} unit={5} />,
    );
    expect(empty).toContain(EMPTY_TITLE);
    expect(empty).not.toContain("<svg");
    const noUnit = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="vacío"
        series={[{ label: "X", value: 10 }]}
        unit={0}
      />,
    );
    expect(noUnit).toContain(EMPTY_TITLE);
    expect(noUnit).not.toContain("<svg");
  });

  test("topa pictogramas totales en 200", () => {
    const html = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="muchos"
        series={[{ label: "X", value: 1000 }]}
        unit={1}
      />,
    );
    expect(html.match(/<circle/g)?.length).toBe(200);
    expect(html.match(/data-chart-tip/g)?.length).toBe(201);
    expect(html).toContain("(200 pictogramas)");
  });
});
