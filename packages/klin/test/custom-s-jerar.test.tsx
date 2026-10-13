/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 *
 * Props (S) de jerárquicos: default preserva + cada prop cambia el output.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { QuadrantChart } from "../src/components/quadrant-chart";
import { SunburstChart } from "../src/components/sunburst-chart";
import { TreemapChart } from "../src/components/treemap-chart";
import { VennDiagram } from "../src/components/venn-diagram";
import { WardleyMap } from "../src/components/wardley-map";

const treemapData = [
  { label: "Alfa", value: 50 },
  { label: "Beta", value: 30 },
  { label: "Gamma", value: 20 },
];

const sunData = [
  {
    label: "A",
    children: [
      { label: "A1", value: 30 },
      { label: "A2", value: 70 },
    ],
  },
  { label: "B", value: 20 },
];

describe("TreemapChart (S)", () => {
  test("default equivale a defaults explícitos", () => {
    const def = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={treemapData} />,
    );
    const exp = renderToStaticMarkup(
      <TreemapChart
        ariaLabel="t"
        data={treemapData}
        tiling="squarify"
        showValues
      />,
    );
    expect(def).toBe(exp);
  });
  test("tiling slice/dice cambia el layout", () => {
    const nested = [
      {
        label: "A",
        children: [
          { label: "A1", value: 30 },
          { label: "A2", value: 20 },
          { label: "A3", value: 10 },
        ],
      },
      { label: "B", value: 50 },
      { label: "C", value: 25 },
    ];
    const def = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={nested} />,
    );
    const slice = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={nested} tiling="slice" />,
    );
    const dice = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={nested} tiling="dice" />,
    );
    expect(slice).not.toBe(def);
    expect(dice).not.toBe(def);
    expect(slice).not.toBe(dice);
  });
  test("showValues=false quita textos de valor", () => {
    const def = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={treemapData} />,
    );
    const noVals = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={treemapData} showValues={false} />,
    );
    const texts = (h: string) => h.match(/<text/g)?.length ?? 0;
    expect(texts(noVals)).toBeLessThan(texts(def));
    expect(noVals).not.toBe(def);
  });
  test("minLabelArea gigante oculta etiquetas", () => {
    const def = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={treemapData} />,
    );
    const hide = renderToStaticMarkup(
      <TreemapChart
        ariaLabel="t"
        data={treemapData}
        minLabelArea={1_000_000_000}
      />,
    );
    expect(hide.match(/<text/g)?.length ?? 0).toBe(0);
    expect(hide).not.toBe(def);
  });
  test("depthColors cambia los rellenos", () => {
    const def = renderToStaticMarkup(
      <TreemapChart ariaLabel="t" data={treemapData} />,
    );
    const custom = renderToStaticMarkup(
      <TreemapChart
        ariaLabel="t"
        data={treemapData}
        depthColors={["var(--color-destructive)"]}
      />,
    );
    expect(custom).toContain("var(--color-destructive)");
    expect(custom).not.toBe(def);
  });
});

describe("SunburstChart (S)", () => {
  test("default equivale a defaults explícitos", () => {
    const def = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} />,
    );
    const exp = renderToStaticMarkup(
      <SunburstChart
        ariaLabel="s"
        data={sunData}
        showRootLabel
        cornerRadius={0}
        padAngle={0}
      />,
    );
    expect(def).toBe(exp);
  });
  test("depth poda anillos profundos", () => {
    const def = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} />,
    );
    const pruned = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} depth={1} />,
    );
    expect(pruned.match(/<path/g)?.length).toBeLessThan(
      def.match(/<path/g)?.length ?? 0,
    );
    expect(pruned).not.toContain("A › A1");
    expect(pruned).not.toBe(def);
  });
  test("showRootLabel=false quita el total central", () => {
    const def = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} />,
    );
    const noRoot = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} showRootLabel={false} />,
    );
    expect(def).toContain(">120<");
    expect(noRoot).not.toContain(">120<");
    expect(noRoot).not.toBe(def);
  });
  test("cornerRadius cambia los arcos", () => {
    const def = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} />,
    );
    const round = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} cornerRadius={4} />,
    );
    expect(round).not.toBe(def);
  });
  test("padAngle cambia los arcos", () => {
    const def = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} />,
    );
    const pad = renderToStaticMarkup(
      <SunburstChart ariaLabel="s" data={sunData} padAngle={0.02} />,
    );
    expect(pad).not.toBe(def);
  });
});

describe("VennDiagram (S)", () => {
  test("default equivale a showPercent=false", () => {
    const def = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="v"
        sets={[
          { label: "A", value: 40 },
          { label: "B", value: 60 },
        ]}
        intersections={[{ sets: [0, 1], value: 20 }]}
      />,
    );
    const exp = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="v"
        sets={[
          { label: "A", value: 40 },
          { label: "B", value: 60 },
        ]}
        intersections={[{ sets: [0, 1], value: 20 }]}
        showPercent={false}
      />,
    );
    expect(def).toBe(exp);
    expect(def).not.toContain("%");
  });
  test("showPercent+universe añade %", () => {
    const def = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="v"
        sets={[
          { label: "A", value: 40 },
          { label: "B", value: 60 },
        ]}
        intersections={[{ sets: [0, 1], value: 20 }]}
      />,
    );
    const pct = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="v"
        sets={[
          { label: "A", value: 40 },
          { label: "B", value: 60 },
        ]}
        intersections={[{ sets: [0, 1], value: 20 }]}
        showPercent
        universe={100}
      />,
    );
    expect(pct).toContain("20%");
    expect(pct).not.toBe(def);
  });
  test("showPercent sin universe no rompe ni añade %", () => {
    const noUni = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="v"
        sets={[
          { label: "A", value: 40 },
          { label: "B", value: 60 },
        ]}
        intersections={[{ sets: [0, 1], value: 20 }]}
        showPercent
      />,
    );
    expect(noUni).not.toContain("%");
  });
});

describe("WardleyMap (S)", () => {
  const nodes = [
    { id: "a", label: "Nodo A", x: 0.1, y: 0.9 },
    { id: "b", label: "Nodo B", x: 0.8, y: 0.2 },
    { id: "c", label: "Nodo C", x: 0.5, y: 0.5 },
  ];
  const edges = [{ from: "a", to: "b" }];
  test("default equivale a defaults explícitos", () => {
    const def = renderToStaticMarkup(
      <WardleyMap ariaLabel="w" nodes={nodes} edges={edges} />,
    );
    const exp = renderToStaticMarkup(
      <WardleyMap
        ariaLabel="w"
        nodes={nodes}
        edges={edges}
        showGridLabels
        stages={["Génesis", "Custom", "Producto", "Commodity"]}
        nodeSize="fixed"
      />,
    );
    expect(def).toBe(exp);
  });
  test("showGridLabels=false oculta etiquetas de ejes", () => {
    const def = renderToStaticMarkup(
      <WardleyMap ariaLabel="w" nodes={nodes} edges={edges} />,
    );
    const bare = renderToStaticMarkup(
      <WardleyMap
        ariaLabel="w"
        nodes={nodes}
        edges={edges}
        showGridLabels={false}
      />,
    );
    const texts = (h: string) => h.match(/<text/g)?.length ?? 0;
    expect(def).toContain("Génesis");
    // Los tooltips conservan la etapa; solo caen las etiquetas de grid/ejes.
    expect(bare).not.toContain("Evolución");
    expect(bare).not.toContain("Cadena de valor");
    expect(texts(bare)).toBeLessThan(texts(def));
    expect(bare).not.toBe(def);
  });
  test("stages custom renombra etapas", () => {
    const def = renderToStaticMarkup(
      <WardleyMap ariaLabel="w" nodes={nodes} edges={edges} />,
    );
    const custom = renderToStaticMarkup(
      <WardleyMap
        ariaLabel="w"
        nodes={nodes}
        edges={edges}
        stages={["Uno", "Dos", "Tres", "Cuatro"]}
      />,
    );
    expect(custom).toContain("Uno");
    expect(custom).not.toContain("Génesis");
    expect(custom).not.toBe(def);
  });
  test("nodeSize=edges agranda nodos conectados", () => {
    const fixed = renderToStaticMarkup(
      <WardleyMap ariaLabel="w" nodes={nodes} edges={edges} />,
    );
    const byEdges = renderToStaticMarkup(
      <WardleyMap ariaLabel="w" nodes={nodes} edges={edges} nodeSize="edges" />,
    );
    expect(byEdges).toContain('r="11"');
    expect(byEdges).not.toBe(fixed);
  });
});

describe("QuadrantChart (S)", () => {
  const points = [
    { x: 20, y: 80, label: "A" },
    { x: 80, y: 80, label: "B" },
    { x: 20, y: 20, label: "C" },
  ];
  test("default equivale a defaults explícitos", () => {
    const def = renderToStaticMarkup(
      <QuadrantChart ariaLabel="q" points={points} />,
    );
    const exp = renderToStaticMarkup(
      <QuadrantChart
        ariaLabel="q"
        points={points}
        showCounts={false}
        thresholds={{ x: 50, y: 50 }}
      />,
    );
    expect(def).toBe(exp);
  });
  test("showCounts añade n por cuadrante", () => {
    const def = renderToStaticMarkup(
      <QuadrantChart ariaLabel="q" points={points} />,
    );
    const counts = renderToStaticMarkup(
      <QuadrantChart ariaLabel="q" points={points} showCounts />,
    );
    expect(counts).toContain("Apuestas (1)");
    expect(def).not.toContain("(1)");
    expect(counts).not.toBe(def);
  });
  test("thresholds mueve la cruz", () => {
    const def = renderToStaticMarkup(
      <QuadrantChart ariaLabel="q" points={points} />,
    );
    const moved = renderToStaticMarkup(
      <QuadrantChart
        ariaLabel="q"
        points={points}
        thresholds={{ x: 80, y: 20 }}
      />,
    );
    expect(moved).not.toBe(def);
  });
});
