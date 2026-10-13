/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { BeeswarmPlot } from "../src/components/beeswarm-plot";
import { BumpChart } from "../src/components/bump-chart";
import { CandlestickChart } from "../src/components/candlestick-chart";
import { DumbbellChart } from "../src/components/dumbbell-chart";
import { RangeChart } from "../src/components/range-chart";
import { RidgelinePlot } from "../src/components/ridgeline-plot";
import { ViolinPlot } from "../src/components/violin-plot";

const ohlc: Array<Record<string, string | number>> = [
  { d: "Lun", o: 10, h: 14, l: 9, c: 13 },
  { d: "Mar", o: 13, h: 15, l: 11, c: 12 },
  { d: "Mié", o: 12, h: 16, l: 12, c: 16 },
];

const candleBase = {
  ariaLabel: "velas",
  data: ohlc,
  labelKey: "d",
  openKey: "o",
  highKey: "h",
  lowKey: "l",
  closeKey: "c",
};

const dumbbellBase = {
  ariaLabel: "mancuernas",
  data: [
    { cat: "A", x: 10, y: 20 },
    { cat: "B", x: 5, y: 7 },
  ] as Array<Record<string, string | number>>,
  categoryKey: "cat",
  aKey: "x",
  bKey: "y",
  aLabel: "Antes",
  bLabel: "Después",
};

const violinGroups = [
  { label: "A", values: [1, 2, 3, 4, 5, 4, 3, 2, 1] },
  { label: "B", values: [2, 3, 4, 5, 6, 7, 6, 5, 4] },
  { label: "C", values: [5, 5, 6, 6, 7, 7, 8] },
];

function count(html: string, tag: string): number {
  return html.match(new RegExp(tag, "g"))?.length ?? 0;
}

describe("paridad S en 7 componentes nuevos", () => {
  test("Candlestick: default intacto + cada prop cambia el output", () => {
    const base = renderToStaticMarkup(<CandlestickChart {...candleBase} />);
    expect(count(base, "<rect")).toBe(3);
    expect(count(base, "data-chart-tip")).toBe(3);
    expect(base).not.toContain('rx="0"');
    expect(
      renderToStaticMarkup(
        <CandlestickChart {...candleBase} yMin={0} yMax={100} />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(<CandlestickChart {...candleBase} gridTicks={2} />),
    ).not.toBe(base);
    const values = renderToStaticMarkup(
      <CandlestickChart {...candleBase} showValues />,
    );
    expect(count(values, "<text")).toBe(count(base, "<text") + 3);
    const desc = renderToStaticMarkup(
      <CandlestickChart {...candleBase} sortGroups="desc" />,
    );
    expect(desc.indexOf("Mié: O")).toBeLessThan(desc.indexOf("Lun: O"));
    const asc = renderToStaticMarkup(
      <CandlestickChart {...candleBase} sortGroups="asc" />,
    );
    expect(asc.indexOf("Mar: O")).toBeLessThan(asc.indexOf("Mié: O"));
    expect(
      renderToStaticMarkup(<CandlestickChart {...candleBase} barRadius={0} />),
    ).toContain('rx="0"');
  });

  test("Dumbbell: default intacto + cada prop cambia el output", () => {
    const base = renderToStaticMarkup(<DumbbellChart {...dumbbellBase} />);
    expect(count(base, "<circle")).toBe(4);
    expect(count(base, "data-chart-tip")).toBe(4);
    expect(
      renderToStaticMarkup(
        <DumbbellChart {...dumbbellBase} domain={[0, 30]} />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(<DumbbellChart {...dumbbellBase} gridTicks={2} />),
    ).not.toBe(base);
    const values = renderToStaticMarkup(
      <DumbbellChart {...dumbbellBase} showValues />,
    );
    expect(count(values, "<text")).toBe(count(base, "<text") + 4);
    expect(values).toContain("A · Antes:");
    const asc = renderToStaticMarkup(
      <DumbbellChart {...dumbbellBase} sortGroups="asc" />,
    );
    expect(asc.indexOf("B · Antes")).toBeLessThan(asc.indexOf("A · Antes"));
    expect(
      renderToStaticMarkup(<DumbbellChart {...dumbbellBase} pointRadius={8} />),
    ).toContain('r="8"');
  });

  test("Range: default intacto + cada prop cambia el output", () => {
    const groups = [
      { label: "A", low: 2, high: 9, value: 7 },
      { label: "B", low: 1, high: 5 },
    ];
    const base = renderToStaticMarkup(
      <RangeChart ariaLabel="rangos" groups={groups} />,
    );
    expect(count(base, "<circle")).toBe(2);
    expect(count(base, "data-chart-tip")).toBe(2);
    expect(
      renderToStaticMarkup(
        <RangeChart ariaLabel="rangos" groups={groups} yMin={0} yMax={20} />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <RangeChart ariaLabel="rangos" groups={groups} gridTicks={2} />,
      ),
    ).not.toBe(base);
    const values = renderToStaticMarkup(
      <RangeChart ariaLabel="rangos" groups={groups} showValues />,
    );
    expect(values).toContain(">7<");
    const asc = renderToStaticMarkup(
      <RangeChart ariaLabel="rangos" groups={groups} sortGroups="asc" />,
    );
    expect(asc.indexOf("B: min")).toBeLessThan(asc.indexOf("A: min"));
    expect(
      renderToStaticMarkup(
        <RangeChart ariaLabel="rangos" groups={groups} pointRadius={8} />,
      ),
    ).toContain('r="8"');
    const noPoints = renderToStaticMarkup(
      <RangeChart ariaLabel="rangos" groups={groups} showPoints={false} />,
    );
    expect(count(noPoints, "<circle")).toBe(0);
    expect(noPoints).toContain("<svg");
  });

  test("Violin: default intacto + cada prop cambia el output", () => {
    const base = renderToStaticMarkup(
      <ViolinPlot ariaLabel="violines" groups={violinGroups} />,
    );
    expect(count(base, "<path")).toBe(3);
    expect(count(base, "data-chart-tip")).toBe(3);
    expect(base).not.toContain("(n 9)");
    expect(
      renderToStaticMarkup(
        <ViolinPlot
          ariaLabel="violines"
          groups={violinGroups}
          yMin={0}
          yMax={20}
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <ViolinPlot ariaLabel="violines" groups={violinGroups} gridTicks={2} />,
      ),
    ).not.toBe(base);
    const desc = renderToStaticMarkup(
      <ViolinPlot
        ariaLabel="violines"
        groups={violinGroups}
        sortGroups="desc"
      />,
    );
    expect(desc.indexOf("C: n")).toBeLessThan(desc.indexOf("A: n"));
    expect(
      renderToStaticMarkup(
        <ViolinPlot
          ariaLabel="violines"
          groups={violinGroups}
          showSampleSize
        />,
      ),
    ).toContain("(n 9)");
  });

  test("Ridgeline: default intacto + cada prop cambia el output", () => {
    const base = renderToStaticMarkup(
      <RidgelinePlot ariaLabel="crestas" series={violinGroups} />,
    );
    expect(count(base, "<path")).toBe(3);
    expect(count(base, "data-chart-tip")).toBe(3);
    expect(
      renderToStaticMarkup(
        <RidgelinePlot
          ariaLabel="crestas"
          series={violinGroups}
          gridTicks={8}
        />,
      ),
    ).not.toBe(base);
    const asc = renderToStaticMarkup(
      <RidgelinePlot
        ariaLabel="crestas"
        series={violinGroups}
        sortGroups="asc"
      />,
    );
    expect(asc.indexOf("A: n")).toBeLessThan(asc.indexOf("C: n"));
    expect(
      renderToStaticMarkup(
        <RidgelinePlot
          ariaLabel="crestas"
          series={violinGroups}
          pointRadius={6}
        />,
      ),
    ).toContain('r="6"');
    expect(
      renderToStaticMarkup(
        <RidgelinePlot
          ariaLabel="crestas"
          series={violinGroups}
          showSampleSize
        />,
      ),
    ).toContain("(n 9)");
  });

  test("Beeswarm: default intacto + cada prop cambia el output", () => {
    const points = [
      { value: 10, label: "A" },
      { value: 20 },
      { value: 20, label: "C" },
    ];
    const base = renderToStaticMarkup(
      <BeeswarmPlot ariaLabel="enjambre" points={points} />,
    );
    expect(count(base, "<circle")).toBe(3);
    expect(count(base, "data-chart-tip")).toBe(3);
    expect(base).not.toContain("n = 3");
    expect(
      renderToStaticMarkup(
        <BeeswarmPlot ariaLabel="enjambre" points={points} domain={[0, 30]} />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <BeeswarmPlot ariaLabel="enjambre" points={points} gridTicks={2} />,
      ),
    ).not.toBe(base);
    const values = renderToStaticMarkup(
      <BeeswarmPlot ariaLabel="enjambre" points={points} showValues />,
    );
    expect(count(values, "<text")).toBe(count(base, "<text") + 3);
    expect(
      renderToStaticMarkup(
        <BeeswarmPlot ariaLabel="enjambre" points={points} showSampleSize />,
      ),
    ).toContain("n = 3");
  });

  test("Bump: default intacto + cada prop cambia el output", () => {
    const periods = ["Ene", "Feb", "Mar"];
    const series = [
      { label: "Rojo", ranks: [1, 5, 2] },
      { label: "Azul", ranks: [10, 1, 5] },
    ];
    const base = renderToStaticMarkup(
      <BumpChart ariaLabel="carrera" periods={periods} series={series} />,
    );
    expect(count(base, "<path")).toBe(2);
    expect(count(base, "<circle")).toBe(6);
    expect(count(base, "data-chart-tip")).toBe(6);
    expect(base).not.toContain("background-color");
    expect(
      renderToStaticMarkup(
        <BumpChart
          ariaLabel="carrera"
          periods={periods}
          series={series}
          gridTicks={10}
        />,
      ),
    ).not.toBe(base);
    const noPoints = renderToStaticMarkup(
      <BumpChart
        ariaLabel="carrera"
        periods={periods}
        series={series}
        showPoints={false}
      />,
    );
    expect(count(noPoints, "<circle")).toBe(0);
    expect(count(noPoints, "<path")).toBe(2);
    const values = renderToStaticMarkup(
      <BumpChart
        ariaLabel="carrera"
        periods={periods}
        series={series}
        showValues
      />,
    );
    expect(count(values, "<text")).toBe(count(base, "<text") + 6);
    expect(
      renderToStaticMarkup(
        <BumpChart
          ariaLabel="carrera"
          periods={periods}
          series={series}
          pointRadius={6}
        />,
      ),
    ).toContain('r="6"');
    const legend = renderToStaticMarkup(
      <BumpChart
        ariaLabel="carrera"
        periods={periods}
        series={series}
        showLegend
      />,
    );
    expect(legend).toContain("background-color");
    expect(
      renderToStaticMarkup(
        <BumpChart
          ariaLabel="carrera"
          periods={periods}
          series={series}
          formatRank={(v: number) => `#${v}`}
        />,
      ),
    ).toContain("#1");
    const top = renderToStaticMarkup(
      <BumpChart
        ariaLabel="carrera"
        periods={periods}
        series={series}
        topN={1}
      />,
    );
    expect(count(top, "<path")).toBe(1);
    expect(count(top, "<circle")).toBe(3);
    expect(top).toContain("Rojo");
    expect(top).not.toContain("Azul");
  });
});
