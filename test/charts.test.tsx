/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { BarChart } from "../src/components/bar-chart";
import { BoxPlot } from "../src/components/box-plot";
import { BulletChart } from "../src/components/bullet-chart";
import { DonutChart } from "../src/components/donut-chart";
import { FlowChart } from "../src/components/flow-chart";
import { MindmapDiagram } from "../src/components/mindmap-diagram";
import { NetworkGraph } from "../src/components/network-graph";
import { NetworkTopology } from "../src/components/network-topology";
import { ParetoChart } from "../src/components/pareto-chart";
import { SankeyDiagram } from "../src/components/sankey-diagram";
import { StackedBar } from "../src/components/stacked-bar";
import { SunburstChart } from "../src/components/sunburst-chart";
import { TreeView } from "../src/components/tree-view";
import { VennDiagram } from "../src/components/venn-diagram";
import { WaffleChart } from "../src/components/waffle-chart";
import { WaterfallChart } from "../src/components/waterfall-chart";
import { layoutDag } from "../src/lib/graph";

const data = [
  { month: "Ene", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
];

const series = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

describe("gráficas SSR (sin JS)", () => {
  test("BarChart pinta una barra por serie y categoría", () => {
    const html = renderToStaticMarkup(
      <BarChart ariaLabel="demo" data={data} xKey="month" series={series} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="demo"');
    // 2 categorías × 2 series = 4 rects con tooltip.
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
  });

  test("BarChart vacía pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <BarChart
        ariaLabel="demo"
        data={[]}
        xKey="month"
        series={series}
        emptyTitle="Nada aún"
      />,
    );
    expect(html).toContain("Nada aún");
    expect(html).not.toContain("<svg");
  });

  test("StackedBar muestra el % del segmento principal", () => {
    const html = renderToStaticMarkup(
      <StackedBar
        ariaLabel="avance"
        rows={[{ label: "A", values: { hechas: 3, resto: 1 } }]}
        segments={[
          { key: "hechas", label: "Hechas" },
          { key: "resto", label: "Resto" },
        ]}
        percentOf="hechas"
      />,
    );
    expect(html).toContain("75%");
    expect(html.match(/data-chart-tip/g)?.length).toBe(2);
  });

  test("DonutChart suma el total al centro", () => {
    const html = renderToStaticMarkup(
      <DonutChart
        ariaLabel="dona"
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 70 },
        ]}
      />,
    );
    expect(html).toContain("100");
    expect(html.match(/<path/g)?.length).toBe(2);
  });

  test("WaterfallChart acumula y cierra con el total", () => {
    const html = renderToStaticMarkup(
      <WaterfallChart
        ariaLabel="caja"
        steps={[
          { label: "Inicio", value: 100 },
          { label: "Gasto", value: -30 },
        ]}
      />,
    );
    expect(html).toContain("Total");
    expect(html).toContain("70");
  });

  test("BoxPlot resume cuartiles en el tooltip", () => {
    const html = renderToStaticMarkup(
      <BoxPlot
        ariaLabel="cajas"
        groups={[{ label: "G1", values: [1, 2, 3, 4, 5, 6, 7, 8] }]}
      />,
    );
    expect(html).toContain("mediana");
    expect(html).toContain("Q1");
  });

  test("layoutDag ordena por capas y tolera ciclos", () => {
    const layout = layoutDag(
      ["a", "b", "c"],
      [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "a" },
      ],
      { direction: "TB" },
    );
    expect(layout.nodes.size).toBe(3);
    expect(layout.edges.length).toBe(3);
    // Sin NaN ni caminos vacíos en ninguna arista.
    for (const e of layout.edges) {
      expect(e.d).toContain("M");
      expect(e.d).not.toContain("NaN");
    }
    // Capas estables y acotadas (sin huida por el ciclo).
    const layers = [...layout.nodes.values()].map((n) => n.layer);
    expect(Math.max(...layers)).toBeLessThanOrEqual(2);
  });

  test("layoutDag desvía el retorno por canal lateral", () => {
    const layout = layoutDag(
      ["a", "b"],
      [
        { from: "a", to: "b" },
        { from: "b", to: "a" },
      ],
      { direction: "TB", nodeW: 150, nodeH: 52, gapX: 36, gapY: 56 },
    );
    const ida = layout.edges.find((e) => e.to === "b");
    const vuelta = layout.edges.find((e) => e.to === "a");
    expect(ida && vuelta && Math.abs(ida.mx - vuelta.mx)).toBeGreaterThan(20);
  });

  test("FlowChart pinta nodos, decisiones y etiquetas", () => {
    const html = renderToStaticMarkup(
      <FlowChart
        ariaLabel="flujo"
        nodes={[
          { id: "ini", label: "Inicio", kind: "start" },
          { id: "rev", label: "¿OK?", kind: "decision" },
          { id: "fin", label: "Fin", kind: "end" },
        ]}
        edges={[
          { from: "ini", to: "rev" },
          { from: "rev", to: "fin", label: "sí" },
        ]}
      />,
    );
    expect(html).toContain("¿OK?");
    expect(html).toContain("sí");
    expect(html).toContain("polygon");
  });

  test("VennDiagram de 3 pinta intersecciones con valor", () => {
    const html = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="venn"
        sets={[
          { label: "A", value: 10 },
          { label: "B", value: 20 },
          { label: "C", value: 30 },
        ]}
        intersections={[{ sets: [0, 1, 2], value: 5 }]}
      />,
    );
    expect(html.match(/<circle/g)?.length).toBe(3);
    expect(html).toContain(">5<");
  });

  test("MindmapDiagram pinta la ruta jerárquica", () => {
    const html = renderToStaticMarkup(
      <MindmapDiagram
        ariaLabel="mapa"
        root={{
          label: "Raíz",
          children: [{ label: "Rama", children: [{ label: "Hoja" }] }],
        }}
      />,
    );
    expect(html).toContain("Raíz › Rama › Hoja");
  });

  test("NetworkGraph es determinista con la misma semilla", () => {
    const props: {
      ariaLabel: string;
      nodes: { id: string }[];
      edges: { from: string; to: string }[];
    } = {
      ariaLabel: "red",
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
      ],
    };
    const one = renderToStaticMarkup(<NetworkGraph {...props} />);
    const two = renderToStaticMarkup(<NetworkGraph {...props} />);
    expect(one).toBe(two);
    expect(one).toContain("(2 conexiones)");
  });

  test("TreeView anida sin JS con details", () => {
    const html = renderToStaticMarkup(
      <TreeView
        ariaLabel="arbol"
        items={[
          {
            label: "Raíz",
            badge: 2,
            children: [{ label: "Hoja", detail: "x" }],
          },
        ]}
      />,
    );
    expect(html).toContain('role="tree"');
    expect(html).toContain("<details");
    expect(html).toContain("Hoja");
  });

  test("NetworkTopology pinta roles y estados", () => {
    const html = renderToStaticMarkup(
      <NetworkTopology
        ariaLabel="topo"
        nodes={[
          { id: "inet", label: "Internet", role: "internet" },
          { id: "fw", label: "FW", role: "firewall" },
          { id: "srv", label: "App", role: "server" },
        ]}
        edges={[
          { from: "inet", to: "fw" },
          { from: "fw", to: "srv", status: "down", label: "caído" },
        ]}
      />,
    );
    expect(html).toContain("Enlace activo");
    expect(html).toContain("Caído");
    expect(html).toContain("caído");
  });

  test("SankeyDiagram pinta bandas proporcionales", () => {
    const html = renderToStaticMarkup(
      <SankeyDiagram
        ariaLabel="sankey"
        nodes={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        flows={[{ from: "a", to: "b", value: 10 }]}
      />,
    );
    expect(html).toContain("A → B: 10");
  });

  test("ParetoChart ordena y acumula al 100", () => {
    const html = renderToStaticMarkup(
      <ParetoChart
        ariaLabel="pareto"
        data={[
          { causa: "A", n: 30 },
          { causa: "B", n: 70 },
        ]}
        xKey="causa"
        yKey="n"
      />,
    );
    // B primero (70) y acumulado final 100 %.
    expect(html.indexOf(">B<")).toBeLessThan(html.indexOf(">A<"));
    expect(html).toContain("100%");
  });

  test("BulletChart marca valor y meta", () => {
    const html = renderToStaticMarkup(
      <BulletChart
        ariaLabel="bala"
        rows={[
          { label: "Captura", value: 72, target: 90, ranges: [40, 70, 100] },
        ]}
      />,
    );
    expect(html).toContain("72 / 90");
  });

  test("WaffleChart suma 100 celdas", () => {
    const html = renderToStaticMarkup(
      <WaffleChart
        ariaLabel="waffle"
        parts={[
          { label: "A", value: 60 },
          { label: "B", value: 40 },
        ]}
      />,
    );
    expect(html.match(/<rect/g)?.length).toBe(100);
  });

  test("SunburstChart pinta anillos con caminos no vacíos", () => {
    const html = renderToStaticMarkup(
      <SunburstChart
        ariaLabel="sol"
        data={[
          {
            label: "A",
            children: [
              { label: "A1", value: 30 },
              { label: "A2", value: 70 },
            ],
          },
        ]}
      />,
    );
    const paths = [...html.matchAll(/<path d="([^"]*)"/g)].map((m) => m[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const d of paths) {
      expect(d).toContain("M");
      expect(d).not.toContain("NaN");
    }
    expect(html).toContain("A › A1");
  });
});
