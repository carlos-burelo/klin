/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import {
  BeeswarmPlot,
  computeBeeswarmPositions,
} from "../src/components/beeswarm-plot";
import { BumpChart } from "../src/components/bump-chart";
import { SlopeChart } from "../src/components/slope-chart";
import { EMPTY_TITLE } from "../src/render/empty";

describe("líneas nuevas SSR (sin JS)", () => {
  test("BeeswarmPlot pinta un círculo por punto con su tip", () => {
    const html = renderToStaticMarkup(
      <BeeswarmPlot
        ariaLabel="enjambre demo"
        points={[
          { value: 10, label: "A" },
          { value: 20 },
          { value: 20, label: "C" },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="enjambre demo"');
    expect(html.match(/<circle/g)?.length).toBe(3);
    expect(html.match(/data-chart-tip/g)?.length).toBe(3);
    expect(html).toContain("A: 10");
    expect(html).toContain("C: 20");
  });

  test("BeeswarmPlot es determinista y topa en DEFAULT_MAX_ROWS", () => {
    const pts = Array.from({ length: 500 }, (_, i) => ({
      value: i % 7,
      label: `P${i}`,
    }));
    const a = computeBeeswarmPositions(pts, 584, 216);
    const b = computeBeeswarmPositions(pts, 584, 216);
    expect(a).toEqual(b);
    expect(a).toHaveLength(400);
    const html1 = renderToStaticMarkup(
      <BeeswarmPlot ariaLabel="estable" points={pts} />,
    );
    const html2 = renderToStaticMarkup(
      <BeeswarmPlot ariaLabel="estable" points={pts} />,
    );
    expect(html1).toBe(html2);
  });

  test("BeeswarmPlot vacío sin puntos finitos", () => {
    const html = renderToStaticMarkup(
      <BeeswarmPlot
        ariaLabel="vacío"
        points={[{ value: Number.NaN, label: "X" }]}
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });

  test("BumpChart pinta una línea por serie con puntos y etiquetas", () => {
    const html = renderToStaticMarkup(
      <BumpChart
        ariaLabel="carrera demo"
        periods={["Ene", "Feb", "Mar"]}
        series={[
          { label: "Rojo", ranks: [1, 2, 1] },
          { label: "Azul", ranks: [2, 1, 2] },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="carrera demo"');
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html.match(/<circle/g)?.length).toBe(6);
    expect(html.match(/data-chart-tip/g)?.length).toBe(6);
    expect(html).toContain("Rojo · Ene: puesto 1 de 2");
    expect(html).toContain("Azul · Feb: puesto 1 de 2");
    expect(html).toContain("Rojo");
    expect(html).toContain("Azul");
  });

  test("BumpChart vacío sin periodos ni puestos", () => {
    const html = renderToStaticMarkup(
      <BumpChart ariaLabel="vacío" periods={[]} series={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });

  test("SlopeChart pinta una línea por fila con extremos y Δ", () => {
    const html = renderToStaticMarkup(
      <SlopeChart
        ariaLabel="pendiente demo"
        fromLabel="2024"
        toLabel="2025"
        data={[
          { label: "A", from: 10, to: 20 },
          { label: "B", from: 30, to: 15 },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="pendiente demo"');
    // 2 líneas de datos + 2 reglas de eje.
    expect(html.match(/<line/g)?.length).toBe(4);
    expect(html.match(/<circle/g)?.length).toBe(4);
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
    expect(html).toContain("A: 10 → 20 (Δ +10)");
    expect(html).toContain("B: 30 → 15 (Δ −15)");
    expect(html).toContain("2024");
    expect(html).toContain("2025");
  });

  test("SlopeChart vacío sin filas finitas", () => {
    const html = renderToStaticMarkup(
      <SlopeChart
        ariaLabel="vacío"
        fromLabel="A"
        toLabel="B"
        data={[{ label: "X", from: Number.NaN, to: 1 }]}
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});
