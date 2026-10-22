/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { AreaChart } from "../src/components/area-chart";
import { BarChart } from "../src/components/bar-chart";
import { CohortChart } from "../src/components/cohort-chart";
import { ComboChart } from "../src/components/combo-chart";
import { ECDFChart } from "../src/components/ecdf-chart";
import { Histogram } from "../src/components/histogram";
import { HorizonChart } from "../src/components/horizon-chart";
import { LineChart } from "../src/components/line-chart";
import { ParallelCoordinates } from "../src/components/parallel-coordinates";
import { ScatterPlot } from "../src/components/scatter-plot";
import { computeStripPositions, StripPlot } from "../src/components/strip-plot";
import { EMPTY_TITLE } from "../src/render/empty";

const comboData = [
  { t: "Ene", web: 120, tienda: 80, ticket: 45 },
  { t: "Feb", web: 200, tienda: 95, ticket: 52 },
  { t: "Mar", web: 150, tienda: 110, ticket: 48 },
];

describe("ComboChart SSR (sin JS)", () => {
  test("pinta barras y líneas con leyenda combinada", () => {
    const html = renderToStaticMarkup(
      <ComboChart
        ariaLabel="combo demo"
        data={comboData}
        xKey="t"
        bars={[
          { key: "web", label: "Web" },
          { key: "tienda", label: "Tienda" },
        ]}
        lines={[{ key: "ticket", label: "Ticket" }]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="combo demo"');
    // 3 grupos × 2 barras.
    expect(html.match(/<rect/g)?.length).toBe(6);
    expect(html.match(/data-chart-tip/g)?.length).toBe(15);
    expect(html).toContain("Web");
    expect(html).toContain("Ticket");
    expect(html).toContain("Ene · Web: 120");
  });

  test("yAxisRight dibuja ticks a la derecha", () => {
    const base = renderToStaticMarkup(
      <ComboChart
        ariaLabel="combo"
        data={comboData}
        xKey="t"
        bars={[{ key: "web", label: "Web" }]}
        lines={[{ key: "ticket", label: "Ticket" }]}
      />,
    );
    const right = renderToStaticMarkup(
      <ComboChart
        ariaLabel="combo"
        data={comboData}
        xKey="t"
        bars={[{ key: "web", label: "Web" }]}
        lines={[{ key: "ticket", label: "Ticket" }]}
        yAxisRight
      />,
    );
    expect(right).not.toBe(base);
    expect(right).toContain('text-anchor="start"');
  });

  test("vacío sin datos o sin series", () => {
    const html = renderToStaticMarkup(
      <ComboChart ariaLabel="vacío" data={[]} xKey="t" bars={[]} lines={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});

describe("CohortChart SSR (sin JS)", () => {
  const cohorts = [
    { label: "Ene", values: [100, 60, 40] },
    { label: "Feb", values: [80, 48] },
    { label: "Mar", values: [90] },
  ];
  test("pinta triángulo con % de retención", () => {
    const html = renderToStaticMarkup(
      <CohortChart ariaLabel="cohorte demo" cohorts={cohorts} />,
    );
    expect(html).toContain('role="img"');
    // 3 + 2 + 1 celdas.
    expect(html.match(/<rect/g)?.length).toBe(6);
    expect(html).toContain("Ene · P1: 100% retención");
    expect(html).toContain("Ene · P2: 60% retención");
    expect(html).toContain("Feb");
  });

  test("vacío sin cohortes con datos", () => {
    const html = renderToStaticMarkup(
      <CohortChart ariaLabel="vacío" cohorts={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});

describe("ParallelCoordinates SSR (sin JS)", () => {
  const axes = [{ key: "a" }, { key: "b", label: "B" }];
  const rows = [
    { label: "X", values: { a: 10, b: 20 } },
    { label: "Y", values: { a: 30, b: 5 } },
  ];
  test("pinta una polilínea por fila con vértices", () => {
    const html = renderToStaticMarkup(
      <ParallelCoordinates
        ariaLabel="paralelas demo"
        axes={axes}
        rows={rows}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html.match(/<circle/g)?.length).toBe(4);
    expect(html).toContain("X · B: 20");
    expect(html).toContain("B");
  });

  test("determinista y vacío sin filas útiles", () => {
    const a = renderToStaticMarkup(
      <ParallelCoordinates ariaLabel="p" axes={axes} rows={rows} />,
    );
    const b = renderToStaticMarkup(
      <ParallelCoordinates ariaLabel="p" axes={axes} rows={rows} />,
    );
    expect(a).toBe(b);
    const html = renderToStaticMarkup(
      <ParallelCoordinates ariaLabel="vacío" axes={[]} rows={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
  });
});

describe("StripPlot SSR (sin JS)", () => {
  const groups = [
    { label: "A", values: [1, 2, 3, 4, 5] },
    { label: "B", values: [10, 20] },
  ];
  test("pinta un punto por valor con determinismo por semilla", () => {
    const html = renderToStaticMarkup(
      <StripPlot ariaLabel="tira demo" groups={groups} />,
    );
    expect(html).toContain('role="img"');
    expect(html.match(/<circle/g)?.length).toBe(7);
    expect(html).toContain("A: 3");
    const again = renderToStaticMarkup(
      <StripPlot ariaLabel="tira demo" groups={groups} />,
    );
    expect(again).toBe(html);
    const other = renderToStaticMarkup(
      <StripPlot ariaLabel="tira demo" groups={groups} seed={7} />,
    );
    expect(other).not.toBe(html);
  });

  test("computeStripPositions acota y es determinista", () => {
    const a = computeStripPositions(5, 42, 10);
    expect(a).toHaveLength(5);
    expect(a.every((v) => v >= -10 && v <= 10)).toBe(true);
    expect(computeStripPositions(5, 42, 10)).toEqual(a);
    expect(computeStripPositions(0, 42, 10)).toEqual([]);
  });

  test("vacío sin valores finitos", () => {
    const html = renderToStaticMarkup(
      <StripPlot
        ariaLabel="vacío"
        groups={[{ label: "A", values: [Number.NaN] }]}
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});

describe("HorizonChart SSR (sin JS)", () => {
  const series = [
    { label: "Web", values: [10, 40, 20, 80] },
    { label: "Tienda", values: [5, -30, 15, 25] },
  ];
  test("pliega en bandas con modos mirror y offset", () => {
    const mirror = renderToStaticMarkup(
      <HorizonChart ariaLabel="horizonte demo" series={series} />,
    );
    expect(mirror).toContain('role="img"');
    expect(mirror.match(/data-chart-tip/g)?.length).toBe(10);
    expect(mirror).toContain("Web · 1: 10");
    const offset = renderToStaticMarkup(
      <HorizonChart ariaLabel="horizonte demo" series={series} mode="offset" />,
    );
    expect(offset).not.toBe(mirror);
    const again = renderToStaticMarkup(
      <HorizonChart ariaLabel="horizonte demo" series={series} />,
    );
    expect(again).toBe(mirror);
  });

  test("vacío con todo-ceros o sin series", () => {
    const html = renderToStaticMarkup(
      <HorizonChart
        ariaLabel="vacío"
        series={[{ label: "A", values: [0, 0] }]}
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});

describe("ECDFChart SSR (sin JS)", () => {
  const groups = [
    { label: "A", values: [1, 2, 3, 4] },
    { label: "B", values: [2, 2, 5] },
  ];
  test("pinta un escalón por grupo que termina en 100%", () => {
    const html = renderToStaticMarkup(
      <ECDFChart ariaLabel="ecdf demo" groups={groups} />,
    );
    expect(html).toContain('role="img"');
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html).toContain("A: n 4");
    expect(html).toContain("B: n 3");
  });

  test("puntos opcionales con tips y vacío sin finitos", () => {
    const html = renderToStaticMarkup(
      <ECDFChart ariaLabel="ecdf puntos" groups={groups} showPoints />,
    );
    expect(html.match(/<circle/g)?.length).toBe(7);
    expect(html).toContain("A · 3: 75%");
    const empty = renderToStaticMarkup(
      <ECDFChart ariaLabel="vacío" groups={[{ label: "A", values: [] }]} />,
    );
    expect(empty).toContain(EMPTY_TITLE);
  });
});

describe("escala log SSR (sin JS)", () => {
  const data = [
    { t: "A", v: 10 },
    { t: "B", v: 1000 },
    { t: "C", v: 0 },
  ];
  const series = [{ key: "v", label: "V" }];
  test("BarChart yScale=log renderiza y fija no-positivos", () => {
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="log demo"
        data={data}
        xKey="t"
        series={series}
        yScale="log"
      />,
    );
    expect(html).toContain('role="img"');
    expect(html.match(/<rect/g)?.length).toBe(3);
    // El tip conserva el crudo aunque la geometría se fije al piso.
    expect(html).toContain("C · V: 0");
  });

  test("LineChart yScale=log difiere de linear", () => {
    const linear = renderToStaticMarkup(
      <LineChart ariaLabel="l" data={data} xKey="t" series={series} />,
    );
    const log = renderToStaticMarkup(
      <LineChart
        ariaLabel="l"
        data={data}
        xKey="t"
        series={series}
        yScale="log"
      />,
    );
    expect(log).not.toBe(linear);
    expect(log).toContain('role="img"');
  });

  test("AreaChart yScale=log y ScatterPlot con ejes log", () => {
    const area = renderToStaticMarkup(
      <AreaChart
        ariaLabel="a"
        data={data}
        xKey="t"
        series={series}
        yScale="log"
      />,
    );
    expect(area).toContain('role="img"');
    const scatter = renderToStaticMarkup(
      <ScatterPlot
        ariaLabel="s"
        points={[
          { x: 1, y: 10 },
          { x: 100, y: 1000 },
        ]}
        xScale="log"
        yScale="log"
      />,
    );
    expect(scatter).toContain('role="img"');
    expect(scatter.match(/<circle/g)?.length).toBe(2);
  });
});

describe("bandas de anotación e histograma con curva", () => {
  test("ValueAnnotation con to pinta banda sombreada", () => {
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="banda demo"
        data={[{ t: "A", v: 5 }]}
        xKey="t"
        series={[{ key: "v", label: "V" }]}
        annotations={[{ value: 2, to: 4, label: "Meta" }]}
      />,
    );
    expect(html).toContain("Meta");
    expect(html.match(/<rect/g)?.length).toBeGreaterThanOrEqual(2);
  });

  test("Histogram showCurve dibuja línea y área KDE", () => {
    const values = [1, 2, 2, 3, 3, 3, 4, 4, 5];
    const base = renderToStaticMarkup(
      <Histogram ariaLabel="h" values={values} />,
    );
    const curve = renderToStaticMarkup(
      <Histogram ariaLabel="h" values={values} showCurve />,
    );
    expect(curve).not.toBe(base);
    expect(curve).toContain("Densidad estimada (KDE)");
    expect(curve.match(/<path/g)?.length).toBe(2);
    const again = renderToStaticMarkup(
      <Histogram ariaLabel="h" values={values} showCurve />,
    );
    expect(again).toBe(curve);
  });
});
