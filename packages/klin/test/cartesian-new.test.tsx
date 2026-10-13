/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CandlestickChart } from "../src/components/candlestick-chart";
import { DumbbellChart } from "../src/components/dumbbell-chart";
import { EMPTY_TITLE } from "../src/components/empty";
import { RangeChart } from "../src/components/range-chart";

const ohlc = [
  { d: "Lun", o: 10, h: 14, l: 9, c: 13 },
  { d: "Mar", o: 13, h: 15, l: 11, c: 12 },
  { d: "Mié", o: 12, h: 16, l: 12, c: 16 },
];

describe("cartesianas nuevas SSR (sin JS)", () => {
  test("CandlestickChart pinta una vela por fila con tip OHLC", () => {
    const html = renderToStaticMarkup(
      <CandlestickChart
        ariaLabel="velas demo"
        data={ohlc}
        labelKey="d"
        openKey="o"
        highKey="h"
        lowKey="l"
        closeKey="c"
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="velas demo"');
    expect(html.match(/<rect/g)?.length).toBe(3);
    expect(html.match(/data-chart-tip/g)?.length).toBe(3);
    expect(html).toContain("Lun: O");
    expect(html).toContain("· H ");
    expect(html).toContain("· L ");
    expect(html).toContain("· C ");
  });

  test("CandlestickChart vacía sin filas válidas (sin <svg>)", () => {
    const html = renderToStaticMarkup(
      <CandlestickChart
        ariaLabel="vacío"
        data={[{ d: "X", o: Number.NaN, h: 1, l: 1, c: 1 }]}
        labelKey="d"
        openKey="o"
        highKey="h"
        lowKey="l"
        closeKey="c"
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const empty = renderToStaticMarkup(
      <CandlestickChart
        ariaLabel="vacío"
        data={[]}
        labelKey="d"
        openKey="o"
        highKey="h"
        lowKey="l"
        closeKey="c"
      />,
    );
    expect(empty).toContain(EMPTY_TITLE);
    expect(empty).not.toContain("<svg");
  });

  test("CandlestickChart topa filas en DEFAULT_MAX_ROWS", () => {
    const big = Array.from({ length: 405 }, (_, i) => ({
      d: `F${i}`,
      o: 1,
      h: 2,
      l: 0,
      c: 2,
    }));
    const html = renderToStaticMarkup(
      <CandlestickChart
        ariaLabel="muchas velas"
        data={big}
        labelKey="d"
        openKey="o"
        highKey="h"
        lowKey="l"
        closeKey="c"
        showLegend={false}
      />,
    );
    expect(html.match(/<rect/g)?.length).toBe(400);
    expect(html.match(/data-chart-tip/g)?.length).toBe(400);
  });

  test("DumbbellChart pinta dos puntos por fila con su tip", () => {
    const html = renderToStaticMarkup(
      <DumbbellChart
        ariaLabel="mancuernas demo"
        data={[
          { cat: "A", x: 10, y: 20 },
          { cat: "B", x: 5, y: 7 },
        ]}
        categoryKey="cat"
        aKey="x"
        bKey="y"
        aLabel="Antes"
        bLabel="Después"
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="mancuernas demo"');
    expect(html.match(/<circle/g)?.length).toBe(4);
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
    expect(html).toContain("A · Antes:");
    expect(html).toContain("B · Después:");
  });

  test("DumbbellChart vacía sin filas válidas (sin <svg>)", () => {
    const html = renderToStaticMarkup(
      <DumbbellChart
        ariaLabel="vacío"
        data={[]}
        categoryKey="cat"
        aKey="x"
        bKey="y"
        aLabel="Antes"
        bLabel="Después"
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });

  test("RangeChart pinta un rango por grupo con resumen completo", () => {
    const html = renderToStaticMarkup(
      <RangeChart
        ariaLabel="rangos demo"
        groups={[
          { label: "A", low: 2, high: 9, value: 7 },
          { label: "B", low: 1, high: 5 },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="rangos demo"');
    expect(html.match(/<circle/g)?.length).toBe(2);
    expect(html.match(/data-chart-tip/g)?.length).toBe(2);
    expect(html).toContain("A: min");
    expect(html).toContain("valor");
    expect(html).toContain("B: min");
    expect(html).toContain("medio");
  });

  test("RangeChart vacía sin grupos válidos (sin <svg>)", () => {
    const html = renderToStaticMarkup(
      <RangeChart ariaLabel="vacío" groups={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});
