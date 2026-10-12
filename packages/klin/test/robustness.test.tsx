/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { BarChart } from "../src/components/bar-chart";
import { ChartEmpty } from "../src/components/empty";
import { HorizontalBarChart } from "../src/components/horizontal-bar-chart";
import { ChartLegend } from "../src/components/legend";
import { LineChart } from "../src/components/line-chart";
import { computeNetworkPositions } from "../src/components/network-graph";
import { computeSankeyLayout } from "../src/components/sankey-diagram";
import { ChartTooltipPortal } from "../src/components/tooltip-portal";
import { VerticalStackedBar } from "../src/components/vertical-stacked-bar";
import { WaffleChart } from "../src/components/waffle-chart";
import { domainWithZero, topPositive } from "../src/lib/domain";
import { EdgeLabel, layoutDag } from "../src/lib/graph";
import { stableKey } from "../src/lib/keys";
import { toNumber } from "../src/lib/number";
import { formatDefault, seriesColors, truncateLabel } from "../src/lib/palette";

describe("lib número/dominio/paleta", () => {
  test("toNumber filtra no-finitos", () => {
    expect(toNumber("12")).toBe(12);
    expect(toNumber("foo")).toBe(0);
    expect(toNumber(Number.NaN)).toBe(0);
    expect(toNumber(Number.POSITIVE_INFINITY)).toBe(0);
    expect(toNumber(undefined)).toBe(0);
  });

  test("domainWithZero incluye negativos y maneja vacío", () => {
    expect(domainWithZero([5, 10])).toEqual([0, 10]);
    expect(domainWithZero([-5, -2])).toEqual([-5, 0]);
    expect(domainWithZero([-5, 10])).toEqual([-5, 10]);
    expect(domainWithZero([])).toEqual([0, 1]);
    expect(domainWithZero([Number.NaN])).toEqual([0, 1]);
    expect(topPositive([3, 7])).toBe(7);
    expect(topPositive([])).toBe(1);
  });

  test("formatDefault no emite NaN y truncate es determinista", () => {
    expect(formatDefault(Number.NaN)).toBe("—");
    expect(formatDefault(1234.5)).toContain("1");
    expect(truncateLabel("abcdefghij", 5)).toBe("abcd…");
    expect(truncateLabel("abc", 5)).toBe("abc");
    expect(seriesColors([{ color: "red" }, {}])[0]).toBe("red");
    expect(seriesColors([{}])[0]).toBe("var(--chart-1)");
    expect(stableKey(["a"], 0)).not.toBe(stableKey(["a"], 1));
  });
});

describe("cartesianos robustos", () => {
  const series = [{ key: "v", label: "V" }];

  test("BarChart soporta negativos sin NaN", () => {
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="neg"
        data={[
          { x: "A", v: -5 },
          { x: "B", v: 10 },
        ]}
        xKey="x"
        series={series}
      />,
    );
    expect(html).toContain('aria-label="neg"');
    expect(html).toContain("-5");
    expect(html).toContain("10");
    expect(html).not.toContain("NaN");
    expect(html.match(/data-chart-tip/g)?.length).toBe(2);
  });

  test("BarChart filtra NaN/strings como 0", () => {
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="nan"
        data={[{ x: "A", v: "foo" }]}
        xKey="x"
        series={series}
      />,
    );
    expect(html).not.toContain("NaN");
    expect(html).toContain("data-chart-tip");
  });

  test("BarChart con xKey duplicado pinta ambas (keys únicas)", () => {
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="dup"
        data={[
          { x: "A", v: 1 },
          { x: "A", v: 2 },
        ]}
        xKey="x"
        series={series}
      />,
    );
    expect(html.match(/data-chart-tip/g)?.length).toBe(2);
  });

  test("HorizontalBarChart negativos sin NaN", () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart
        ariaLabel="hneg"
        data={[{ y: "A", v: -4 }]}
        yKey="y"
        series={series}
      />,
    );
    expect(html).not.toContain("NaN");
    expect(html).toContain("-4");
  });

  test("LineChart negativos: path válido", () => {
    const html = renderToStaticMarkup(
      <LineChart
        ariaLabel="lneg"
        data={[
          { x: "A", v: -3 },
          { x: "B", v: 4 },
        ]}
        xKey="x"
        series={series}
      />,
    );
    expect(html).toContain("<path");
    expect(html).not.toContain("NaN");
  });

  test("VerticalStackedBar normalize con negativos no revienta", () => {
    const html = renderToStaticMarkup(
      <VerticalStackedBar
        ariaLabel="vs"
        data={[{ x: "A", a: 5, b: -3 }]}
        xKey="x"
        series={[
          { key: "a", label: "A" },
          { key: "b", label: "B" },
        ]}
        normalize
      />,
    );
    expect(html).not.toContain("NaN");
    expect(html).toContain("data-chart-tip");
  });

  test("WaffleChart siempre suma 100 celdas", () => {
    const html = renderToStaticMarkup(
      <WaffleChart
        ariaLabel="w"
        parts={[
          { label: "A", value: 33.3 },
          { label: "B", value: 33.3 },
          { label: "C", value: 33.4 },
        ]}
      />,
    );
    expect(html.match(/<rect/g)?.length).toBeGreaterThanOrEqual(100);
  });
});

describe("leyenda, vacío, tooltip", () => {
  test("ChartLegend con labels duplicados pinta ambos", () => {
    const html = renderToStaticMarkup(
      <ChartLegend
        items={[
          { label: "A", color: "red" },
          { label: "A", color: "blue" },
        ]}
      />,
    );
    expect(html.match(/<span/g)?.length).toBeGreaterThanOrEqual(2);
  });

  test("ChartEmpty tiene role status", () => {
    const html = renderToStaticMarkup(<ChartEmpty title="Nada" />);
    expect(html).toContain('role="status"');
    expect(html).toContain("Nada");
  });

  test("ChartTooltipPortal SSR pinta hijos y preserva relative", () => {
    const html = renderToStaticMarkup(
      <ChartTooltipPortal className="extra">
        <span>hola</span>
      </ChartTooltipPortal>,
    );
    expect(html).toContain("hola");
    expect(html).toContain("relative");
    expect(html).toContain("extra");
    expect(html).not.toContain('role="tooltip"');
  });
});

describe("grafos y layouts", () => {
  test("layoutDag dedupa ids y limita tamaño", () => {
    const layout = layoutDag(
      ["a", "a", "", "b"],
      [
        { from: "a", to: "b" },
        { from: "x", to: "y" },
      ],
    );
    expect(layout.nodes.has("a")).toBe(true);
    expect(layout.nodes.has("")).toBe(false);
    expect(layout.edges.length).toBe(1);
    const big = layoutDag(
      Array.from({ length: 600 }, (_, i) => `n${i}`),
      [],
      { maxNodes: 400 },
    );
    expect(big.nodes.size).toBeLessThanOrEqual(400);
  });

  test("layoutDag self-loop no da NaN", () => {
    const layout = layoutDag(["a"], [{ from: "a", to: "a" }]);
    expect(layout.edges[0]?.d).toContain("M");
    expect(layout.edges[0]?.d).not.toContain("NaN");
  });

  test("EdgeLabel trunca texto largo", () => {
    const html = renderToStaticMarkup(
      <svg role="img" aria-label="edge">
        <EdgeLabel mx={10} my={10} text={"x".repeat(60)} />
      </svg>,
    );
    expect(html).toContain("…");
  });

  test("computeNetworkPositions capa nodos", () => {
    const nodes = Array.from({ length: 500 }, (_, i) => ({ id: `n${i}` }));
    const pos = computeNetworkPositions(nodes, [], 1);
    expect(pos.positioned.length).toBeLessThanOrEqual(400);
  });

  test("computeSankeyLayout ignora flujos no-positivos", () => {
    const out = computeSankeyLayout(
      [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      [
        { from: "a", to: "b", value: 0 },
        { from: "a", to: "b", value: -5 },
      ],
    );
    expect(out.graph.links.length).toBe(0);
  });
});

describe("tooltip perfecto (valor + contexto)", () => {
  test("Donut muestra % del total", async () => {
    const { DonutChart } = await import("../src/components/donut-chart");
    const html = renderToStaticMarkup(
      <DonutChart
        ariaLabel="d"
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 70 },
        ]}
      />,
    );
    expect(html).toContain("A: 30 (30% del total)");
  });

  test("Bar multi-serie muestra % del grupo; single no", async () => {
    const { BarChart } = await import("../src/components/bar-chart");
    const multi = renderToStaticMarkup(
      <BarChart
        ariaLabel="m"
        data={[{ x: "G", a: 30, b: 70 }]}
        xKey="x"
        series={[
          { key: "a", label: "A" },
          { key: "b", label: "B" },
        ]}
      />,
    );
    expect(multi).toContain("G · A: 30 (30% del grupo)");
    const single = renderToStaticMarkup(
      <BarChart
        ariaLabel="s"
        data={[{ x: "G", a: 30 }]}
        xKey="x"
        series={[{ key: "a", label: "A" }]}
      />,
    );
    expect(single).toContain("G · A: 30");
    expect(single).not.toContain("del grupo");
  });

  test("Pareto incluye acumulado numérico", async () => {
    const { ParetoChart } = await import("../src/components/pareto-chart");
    const html = renderToStaticMarkup(
      <ParetoChart
        ariaLabel="p"
        data={[
          { causa: "A", n: 30 },
          { causa: "B", n: 70 },
        ]}
        xKey="causa"
        yKey="n"
      />,
    );
    expect(html).toMatch(/acumulado \d+%/);
  });

  test("Sankey muestra % del total en link y nodo", async () => {
    const { SankeyDiagram } = await import("../src/components/sankey-diagram");
    const html = renderToStaticMarkup(
      <SankeyDiagram
        ariaLabel="s"
        nodes={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        flows={[{ from: "a", to: "b", value: 10 }]}
      />,
    );
    expect(html).toContain("A → B: 10 (100% del total)");
    expect(html).toContain("A: 10 (100%)");
  });

  test("Calendar añade weekday y Gantt duración", async () => {
    const { CalendarHeatmap } = await import(
      "../src/components/calendar-heatmap"
    );
    const cal = renderToStaticMarkup(
      <CalendarHeatmap
        ariaLabel="c"
        values={{ "2026-01-05": 3 }}
        end="2026-01-11"
        weeks={2}
      />,
    );
    expect(cal).toContain("2026-01-05 (");
    const { GanttChart } = await import("../src/components/gantt-chart");
    const g = renderToStaticMarkup(
      <GanttChart
        ariaLabel="g"
        tasks={[
          { label: "T", start: "2026-01-01", end: "2026-01-03", progress: 50 },
        ]}
      />,
    );
    expect(g).toContain("3 d");
  });
});

describe("API universal (passthrough + flags)", () => {
  test("className/style/aria-describedby llegan a la raíz", async () => {
    const { BarChart } = await import("../src/components/bar-chart");
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="r"
        data={[{ x: "A", v: 1 }]}
        xKey="x"
        series={[{ key: "v", label: "V" }]}
        className="mi-clase"
        style={{ marginTop: 7 }}
        ariaDescribedBy="desc-1"
      />,
    );
    expect(html).toContain("mi-clase");
    expect(html).toContain("margin-top:7");
    expect(html).toContain('aria-describedby="desc-1"');
  });

  test("showLegend=false oculta la leyenda", async () => {
    const { BarChart } = await import("../src/components/bar-chart");
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="r"
        data={[{ x: "A", v: 1 }]}
        xKey="x"
        series={[{ key: "v", label: "V" }]}
        showLegend={false}
      />,
    );
    expect(html).not.toContain("V</span>");
  });

  test("itemColor por dato gana a la serie (dona)", async () => {
    const { DonutChart } = await import("../src/components/donut-chart");
    const html = renderToStaticMarkup(
      <DonutChart
        ariaLabel="d"
        data={[
          { label: "A", value: 50 },
          { label: "B", value: 50 },
        ]}
        itemColor={(_, i) => (i === 0 ? "hotpink" : undefined)}
      />,
    );
    expect(html).toContain("hotpink");
  });

  test("annotations pinta línea de referencia", async () => {
    const { BarChart } = await import("../src/components/bar-chart");
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="r"
        data={[{ x: "A", v: 5 }]}
        xKey="x"
        series={[{ key: "v", label: "V" }]}
        annotations={[{ value: 3, label: "meta" }]}
      />,
    );
    expect(html).toContain("meta");
    expect(html).toContain("stroke-dasharray");
  });

  test("dona: totalLabel custom y showTotal=false", async () => {
    const { DonutChart } = await import("../src/components/donut-chart");
    const custom = renderToStaticMarkup(
      <DonutChart
        ariaLabel="d"
        data={[{ label: "A", value: 10 }]}
        totalLabel="Suma"
      />,
    );
    expect(custom).toContain("Suma");
    const hidden = renderToStaticMarkup(
      <DonutChart
        ariaLabel="d"
        data={[{ label: "A", value: 10 }]}
        showTotal={false}
      />,
    );
    expect(hidden).not.toContain("Total");
  });

  test("locale se aplica al formato por defecto", async () => {
    const { BarChart } = await import("../src/components/bar-chart");
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="r"
        data={[{ x: "A", v: 1234.5 }]}
        xKey="x"
        series={[{ key: "v", label: "V" }]}
        locale="en-US"
      />,
    );
    expect(html).toContain("1,234.5");
  });
});

describe("bundle limpio (site fuera del tarball)", () => {
  test("files no incluye site/demo/docs", async () => {
    const pkg = (await import("../package.json")).default as {
      files: string[];
    };
    const joined = pkg.files.join("\n");
    expect(joined).not.toContain("site");
    expect(joined).not.toContain("demo");
    expect(joined).not.toContain("docs");
    expect(pkg.files).toContain("src");
  });
});
