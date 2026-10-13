/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { AreaChart } from "../src/components/area-chart";
import { BoxPlot } from "../src/components/box-plot";
import { Histogram } from "../src/components/histogram";
import { LineChart } from "../src/components/line-chart";
import { ParetoChart } from "../src/components/pareto-chart";
import { ScatterPlot } from "../src/components/scatter-plot";
import { Streamgraph } from "../src/components/streamgraph";
import { WaterfallChart } from "../src/components/waterfall-chart";

function count(html: string, tag: string): number {
  return html.match(new RegExp(tag, "g"))?.length ?? 0;
}

const data = [
  { month: "Ene", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 240, mobile: 150 },
];

const series = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

describe("paridad S cartesianos II", () => {
  test("LineChart: puntos, área, dominio y ticks", () => {
    const base = renderToStaticMarkup(
      <LineChart ariaLabel="lineas" data={data} xKey="month" series={series} />,
    );
    expect(count(base, "<circle")).toBe(6);
    expect(
      renderToStaticMarkup(
        <LineChart
          ariaLabel="lineas"
          data={data}
          xKey="month"
          series={series}
          showPoints={false}
        />,
      ),
    ).not.toContain("<circle");
    expect(
      renderToStaticMarkup(
        <LineChart
          ariaLabel="lineas"
          data={data}
          xKey="month"
          series={series}
          showArea
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <LineChart
          ariaLabel="lineas"
          data={data}
          xKey="month"
          series={series}
          yMin={100}
          yMax={400}
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <LineChart
          ariaLabel="lineas"
          data={data}
          xKey="month"
          series={series}
          gridTicks={10}
        />,
      ),
    ).not.toBe(base);
  });

  test("AreaChart: curva, puntos, opacidad, dominio y ticks", () => {
    const base = renderToStaticMarkup(
      <AreaChart ariaLabel="areas" data={data} xKey="month" series={series} />,
    );
    expect(
      renderToStaticMarkup(
        <AreaChart
          ariaLabel="areas"
          data={data}
          xKey="month"
          series={series}
          curve="linear"
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <AreaChart
          ariaLabel="areas"
          data={data}
          xKey="month"
          series={series}
          showPoints={false}
        />,
      ),
    ).not.toContain("<circle");
    expect(
      renderToStaticMarkup(
        <AreaChart
          ariaLabel="areas"
          data={data}
          xKey="month"
          series={series}
          fillOpacity={0.5}
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <AreaChart
          ariaLabel="areas"
          data={data}
          xKey="month"
          series={series}
          yMin={0}
          yMax={500}
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <AreaChart
          ariaLabel="areas"
          data={data}
          xKey="month"
          series={series}
          gridTicks={10}
        />,
      ),
    ).not.toBe(base);
  });

  test("Streamgraph: curva, puntos y offset", () => {
    const base = renderToStaticMarkup(
      <Streamgraph ariaLabel="rios" data={data} xKey="month" series={series} />,
    );
    expect(
      renderToStaticMarkup(
        <Streamgraph
          ariaLabel="rios"
          data={data}
          xKey="month"
          series={series}
          curve="linear"
        />,
      ),
    ).not.toBe(base);
    const pts = renderToStaticMarkup(
      <Streamgraph
        ariaLabel="rios"
        data={data}
        xKey="month"
        series={series}
        showPoints
      />,
    );
    expect(count(pts, "<circle")).toBeGreaterThan(0);
    expect(
      renderToStaticMarkup(
        <Streamgraph
          ariaLabel="rios"
          data={data}
          xKey="month"
          series={series}
          offset="zero"
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <Streamgraph
          ariaLabel="rios"
          data={data}
          xKey="month"
          series={series}
          offset="silhouette"
        />,
      ),
    ).not.toBe(base);
  });

  test("Histogram: media y dominio", () => {
    const values = [1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10];
    const base = renderToStaticMarkup(
      <Histogram ariaLabel="histo" values={values} />,
    );
    const mean = renderToStaticMarkup(
      <Histogram ariaLabel="histo" values={values} showMean />,
    );
    expect(mean).not.toBe(base);
    expect(mean).toContain("media");
    expect(
      renderToStaticMarkup(
        <Histogram ariaLabel="histo" values={values} domain={[2, 8]} />,
      ),
    ).not.toBe(base);
  });

  test("ScatterPlot: cuadrantes", () => {
    const points = [
      { label: "A", x: 1, y: 2 },
      { label: "B", x: 8, y: 9 },
    ];
    const base = renderToStaticMarkup(
      <ScatterPlot ariaLabel="disp" points={points} />,
    );
    expect(count(base, "<circle")).toBe(2);
    expect(
      renderToStaticMarkup(
        <ScatterPlot ariaLabel="disp" points={points} quadrants />,
      ),
    ).not.toBe(base);
  });

  test("BoxPlot: atípicos, bigotes, n y muesca", () => {
    const groups = [
      { label: "A", values: [1, 2, 3, 4, 5, 6, 7, 8, 50] },
      { label: "B", values: [2, 3, 4, 5, 6] },
    ];
    const base = renderToStaticMarkup(
      <BoxPlot ariaLabel="cajas" groups={groups} />,
    );
    expect(count(base, "<circle")).toBeGreaterThan(0);
    const noOut = renderToStaticMarkup(
      <BoxPlot ariaLabel="cajas" groups={groups} showOutliers={false} />,
    );
    expect(count(noOut, "<circle")).toBe(0);
    expect(
      renderToStaticMarkup(
        <BoxPlot ariaLabel="cajas" groups={groups} whisker="minmax" />,
      ),
    ).not.toBe(base);
    const n = renderToStaticMarkup(
      <BoxPlot ariaLabel="cajas" groups={groups} showSampleSize />,
    );
    expect(n).toContain("n 9");
    expect(
      renderToStaticMarkup(<BoxPlot ariaLabel="cajas" groups={groups} notch />),
    ).toContain("<path");
  });

  test("WaterfallChart: conectores, colores y acumulado", () => {
    const steps = [
      { label: "Inicio", value: 100 },
      { label: "Bajas", value: -30 },
      { label: "Altas", value: 20 },
    ];
    const base = renderToStaticMarkup(
      <WaterfallChart ariaLabel="cascada" steps={steps} />,
    );
    expect(count(base, "data-chart-tip")).toBe(4);
    expect(
      renderToStaticMarkup(
        <WaterfallChart
          ariaLabel="cascada"
          steps={steps}
          showConnectors={false}
        />,
      ),
    ).not.toContain("3 3");
    expect(
      renderToStaticMarkup(
        <WaterfallChart
          ariaLabel="cascada"
          steps={steps}
          positiveColor="var(--chart-2)"
          negativeColor="var(--chart-3)"
          totalColor="var(--chart-4)"
        />,
      ),
    ).not.toBe(base);
    const delta = renderToStaticMarkup(
      <WaterfallChart ariaLabel="cascada" steps={steps} runningTotal={false} />,
    );
    expect(delta).not.toBe(base);
    expect(delta).toContain("-30");
  });

  test("ParetoChart: topN, umbral y etiquetas", () => {
    const pdata = [
      { causa: "A", n: 50 },
      { causa: "B", n: 30 },
      { causa: "C", n: 15 },
      { causa: "D", n: 5 },
    ];
    const base = renderToStaticMarkup(
      <ParetoChart ariaLabel="pareto" data={pdata} xKey="causa" yKey="n" />,
    );
    expect(base).toContain("Umbral 80%");
    const top = renderToStaticMarkup(
      <ParetoChart
        ariaLabel="pareto"
        data={pdata}
        xKey="causa"
        yKey="n"
        topN={2}
      />,
    );
    expect(top).toContain("Otros");
    expect(
      renderToStaticMarkup(
        <ParetoChart
          ariaLabel="pareto"
          data={pdata}
          xKey="causa"
          yKey="n"
          threshold={50}
        />,
      ),
    ).toContain("Umbral 50%");
    const labels = renderToStaticMarkup(
      <ParetoChart
        ariaLabel="pareto"
        data={pdata}
        xKey="causa"
        yKey="n"
        showCumLabels
      />,
    );
    expect(count(labels, "<text")).toBeGreaterThan(count(base, "<text"));
  });
});
