/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { MarimekkoChart } from "../src/components/marimekko-chart";
import { NightingaleChart } from "../src/components/nightingale-chart";
import { RadialBarChart } from "../src/components/radial-bar-chart";

describe("polares nuevas SSR (sin JS)", () => {
  test("NightingaleChart pinta un arco por dato con tip", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart
        ariaLabel="coxcomb"
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 70 },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="coxcomb"');
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
    expect(html).toContain("A: 30 (30% del total)");
    expect(html).toContain("B: 70 (70% del total)");
  });

  test("NightingaleChart vacía pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="vacia" data={[]} />,
    );
    expect(html).toContain("Sin datos todavía");
    expect(html).not.toContain("<svg");
  });

  test("RadialBarChart pinta pista + arco por serie con tip", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart
        ariaLabel="anillos"
        series={[
          { label: "A", value: 30 },
          { label: "B", value: 70, max: 100 },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="anillos"');
    // 2 pistas + 2 arcos de valor = 4 paths.
    expect(html.match(/<path/g)?.length).toBe(4);
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
    expect(html).toContain("A: 30 de 100 (30%)");
    expect(html).toContain("B: 70 de 100 (70%)");
  });

  test("RadialBarChart vacía pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="vacia" series={[]} />,
    );
    expect(html).toContain("Sin datos todavía");
    expect(html).not.toContain("<svg");
  });

  test("MarimekkoChart apila 100% por columna con tip", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart
        ariaLabel="mari"
        data={[
          { seg: "X", w: 1, a: 30, b: 70 },
          { seg: "Y", w: 3, a: 50, b: 50 },
        ]}
        xKey="seg"
        widthKey="w"
        series={[
          { key: "a", label: "A" },
          { key: "b", label: "B" },
        ]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="mari"');
    // 2 columnas × 2 series = 4 rects con tooltip.
    expect(html.match(/data-chart-tip/g)?.length).toBe(6);
    expect(html).toContain("X · A: 30 (30% de la columna)");
    expect(html).toContain("Y · B: 50 (50% de la columna)");
    expect(html).toContain("100%");
  });

  test("MarimekkoChart vacía pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart
        ariaLabel="vacia"
        data={[]}
        xKey="seg"
        widthKey="w"
        series={[{ key: "a", label: "A" }]}
      />,
    );
    expect(html).toContain("Sin datos todavía");
    expect(html).not.toContain("<svg");
  });
});
