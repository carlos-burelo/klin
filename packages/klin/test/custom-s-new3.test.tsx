/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import {
  ChordDiagram,
  computeChordLayout,
} from "../src/components/chord-diagram";
import {
  computeDensityContours,
  DensityContourPlot,
} from "../src/components/density-contour-plot";
import { DotPlot } from "../src/components/dot-plot";
import {
  computeFishboneLayout,
  FishboneDiagram,
} from "../src/components/fishbone-diagram";
import { computeHexbins, HexbinPlot } from "../src/components/hexbin-plot";
import { IsotypeChart } from "../src/components/isotype-chart";
import { TernaryPlot } from "../src/components/ternary-plot";
import { EMPTY_TITLE } from "../src/render/empty";

function count(html: string, tag: string): number {
  return html.match(new RegExp(tag, "g"))?.length ?? 0;
}

const TERNARY_POINTS = [
  { a: 60, b: 30, c: 10, label: "Alfa" },
  { a: 20, b: 50, c: 30, label: "Beta" },
  { a: 10, b: 10, c: 80, label: "Gama" },
];

const DOT_DATA = [
  { cat: "A", v: 10 },
  { cat: "B", v: 5 },
  { cat: "C", v: 8 },
];

const ISOTYPE_SERIES = [
  { label: "Grupo Alfa", value: 30 },
  { label: "Grupo Beta", value: 10 },
  { label: "Grupo Gama", value: 20 },
];

const FISH_CAUSES = [
  {
    label: "Métodos",
    subcauses: ["Falta de estándar", "Pasos extra", "Sin checklist"],
  },
  { label: "Mano de obra", subcauses: ["Rotación", "Capacitación"] },
  { label: "Materiales", subcauses: ["Proveedor único"] },
];

const FISH_MANY = Array.from({ length: 3 }, (_, i) => ({
  label: `Causa ${i}`,
  subcauses: Array.from({ length: 8 }, (_, k) => `Sub ${k}`),
}));

const CHORD_LABELS = ["A", "B", "C"];
const CHORD_MATRIX = [
  [0, 5, 3],
  [2, 0, 4],
  [1, 1, 0],
];
const CHORD_SORTED_MATRIX = [
  [0, 1, 1],
  [5, 0, 5],
  [1, 1, 0],
];

const DENSITY_POINTS = [
  { x: 5, y: 5, label: "c1" },
  { x: 5.4, y: 5.2, label: "c2" },
  { x: 4.8, y: 5.5 },
  { x: 5.2, y: 4.7 },
  { x: 5.1, y: 5.1 },
  { x: 4.9, y: 4.9 },
  { x: 5.3, y: 5.4 },
  { x: 5.0, y: 5.3 },
  { x: 8, y: 2, label: "lejos" },
  { x: 8.2, y: 2.1 },
];

const HEX_POINTS = [
  { x: 1, y: 1 },
  { x: 1.1, y: 1.2 },
  { x: 1.2, y: 1.1 },
  { x: 5, y: 5 },
  { x: 5.1, y: 5.2 },
  { x: 5.2, y: 5.1 },
  { x: 9, y: 2 },
  { x: 9.1, y: 2.2 },
];

describe("paridad S tanda 3: defaults sin cambios", () => {
  test("TernaryPlot por defecto pinta 3 puntos + vértices + rejilla", () => {
    const html = renderToStaticMarkup(
      <TernaryPlot ariaLabel="ternario" points={TERNARY_POINTS} />,
    );
    expect(count(html, "<circle")).toBe(3);
    expect(html).toContain("Alfa");
    // GRID_TICKS=4 → 3 niveles × 3 líneas.
    expect(count(html, "<line")).toBe(9);
  });

  test("DotPlot por defecto pinta categorías + valores + grid", () => {
    const html = renderToStaticMarkup(
      <DotPlot
        ariaLabel="puntos"
        data={DOT_DATA}
        categoryKey="cat"
        valueKey="v"
      />,
    );
    expect(count(html, "<circle")).toBe(3);
    expect(html).toContain(">A<");
    expect(html).toContain(">5<");
  });

  test("IsotypeChart por defecto pinta etiquetas + conteos", () => {
    const html = renderToStaticMarkup(
      <IsotypeChart ariaLabel="isotipo" series={ISOTYPE_SERIES} unit={10} />,
    );
    // 3 + 1 + 2 pictogramas, 2 textos por fila.
    expect(count(html, "<circle")).toBe(6);
    expect(count(html, "<text")).toBe(6);
  });

  test("FishboneDiagram por defecto pinta tips + marcador", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="ishikawa"
        effect="Defectos"
        causes={FISH_CAUSES}
      />,
    );
    expect(count(html, "<line")).toBe(10);
    expect(count(html, "<text")).toBe(10);
    expect(html).toContain("Métodos: 3 subcausas");
    expect(html).toContain("fishbone-arrow");
  });

  test("ChordDiagram por defecto pinta anillo + cintas + etiquetas", () => {
    const html = renderToStaticMarkup(
      <ChordDiagram
        ariaLabel="flujos"
        labels={CHORD_LABELS}
        matrix={CHORD_MATRIX}
      />,
    );
    expect(count(html, "<path")).toBe(6);
    expect(count(html, "<text")).toBe(3);
    expect(html).toContain("A → B:");
  });

  test("DensityContourPlot por defecto pinta puntos + contornos + ejes", () => {
    const html = renderToStaticMarkup(
      <DensityContourPlot ariaLabel="densidad" points={DENSITY_POINTS} />,
    );
    expect(count(html, "<circle")).toBe(DENSITY_POINTS.length);
    expect(html).toContain("densidad ≥");
    expect(count(html, "<text")).toBeGreaterThan(0);
  });

  test("HexbinPlot por defecto pinta celdas con conteo", () => {
    const html = renderToStaticMarkup(
      <HexbinPlot ariaLabel="celdas" points={HEX_POINTS} />,
    );
    expect(html).toContain("celda:");
    expect(html).toContain("puntos (");
    expect(count(html, "<text")).toBeGreaterThan(0);
  });

  test("vacíos siguen pintando el estado homogéneo", () => {
    expect(
      renderToStaticMarkup(<TernaryPlot ariaLabel="v" points={[]} />),
    ).toContain(EMPTY_TITLE);
    expect(
      renderToStaticMarkup(
        <DotPlot ariaLabel="v" data={[]} categoryKey="c" valueKey="v" />,
      ),
    ).toContain(EMPTY_TITLE);
    expect(
      renderToStaticMarkup(
        <IsotypeChart ariaLabel="v" series={[]} unit={10} />,
      ),
    ).toContain(EMPTY_TITLE);
    expect(
      renderToStaticMarkup(
        <FishboneDiagram ariaLabel="v" effect="E" causes={[]} />,
      ),
    ).toContain(EMPTY_TITLE);
  });
});

describe("TernaryPlot: showLabels / gridLevels / maxItems", () => {
  test("showLabels=false quita los vértices", () => {
    const base = renderToStaticMarkup(
      <TernaryPlot
        ariaLabel="t"
        points={TERNARY_POINTS}
        aLabel="Vértice Alfa"
      />,
    );
    expect(base).toContain("Vértice Alfa");
    const html = renderToStaticMarkup(
      <TernaryPlot
        ariaLabel="t"
        points={TERNARY_POINTS}
        aLabel="Vértice Alfa"
        showLabels={false}
      />,
    );
    expect(html).not.toContain("Vértice Alfa");
    expect(count(html, "<circle")).toBe(3);
  });

  test("gridLevels cambia la rejilla", () => {
    const base = renderToStaticMarkup(
      <TernaryPlot ariaLabel="t" points={TERNARY_POINTS} />,
    );
    const html = renderToStaticMarkup(
      <TernaryPlot ariaLabel="t" points={TERNARY_POINTS} gridLevels={2} />,
    );
    expect(count(base, "<line")).toBe(9);
    expect(count(html, "<line")).toBe(3);
  });

  test("maxItems topa los puntos", () => {
    const html = renderToStaticMarkup(
      <TernaryPlot ariaLabel="t" points={TERNARY_POINTS} maxItems={2} />,
    );
    expect(count(html, "<circle")).toBe(2);
  });
});

describe("DotPlot: showLabels / showValues / gridTicks / sortBy / maxItems", () => {
  const base = {
    ariaLabel: "p",
    data: DOT_DATA,
    categoryKey: "cat",
    valueKey: "v",
  } as const;

  test("showValues=false quita el valor junto al punto", () => {
    expect(renderToStaticMarkup(<DotPlot {...base} />)).toContain(">5<");
    const html = renderToStaticMarkup(<DotPlot {...base} showValues={false} />);
    expect(html).not.toContain(">5<");
    expect(count(html, "<circle")).toBe(3);
  });

  test("showLabels=false quita las categorías", () => {
    const html = renderToStaticMarkup(<DotPlot {...base} showLabels={false} />);
    expect(html).not.toContain(">A<");
    expect(count(html, "<circle")).toBe(3);
  });

  test("gridTicks cambia el grid del eje X", () => {
    const a = renderToStaticMarkup(<DotPlot {...base} />);
    const b = renderToStaticMarkup(<DotPlot {...base} gridTicks={2} />);
    expect(count(a, "<line")).not.toBe(count(b, "<line"));
  });

  test("sortBy ordena por valor", () => {
    const asc = renderToStaticMarkup(<DotPlot {...base} sortBy="asc" />);
    expect(asc.indexOf("B: 5")).toBeLessThan(asc.indexOf("C: 8"));
    expect(asc.indexOf("C: 8")).toBeLessThan(asc.indexOf("A: 10"));
    const desc = renderToStaticMarkup(<DotPlot {...base} sortBy="desc" />);
    expect(desc.indexOf("A: 10")).toBeLessThan(desc.indexOf("C: 8"));
    expect(desc.indexOf("C: 8")).toBeLessThan(desc.indexOf("B: 5"));
  });

  test("maxItems topa las filas", () => {
    const html = renderToStaticMarkup(<DotPlot {...base} maxItems={2} />);
    expect(count(html, "<circle")).toBe(2);
  });
});

describe("IsotypeChart: showLabels / showCounts / sortBy / maxItems", () => {
  test("showLabels=false quita etiquetas pero deja conteos", () => {
    const base = renderToStaticMarkup(
      <IsotypeChart ariaLabel="i" series={ISOTYPE_SERIES} unit={10} />,
    );
    expect(count(base, "<text")).toBe(6);
    const html = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="i"
        series={ISOTYPE_SERIES}
        unit={10}
        showLabels={false}
      />,
    );
    expect(count(html, "<text")).toBe(3);
    expect(count(html, "<circle")).toBe(6);
  });

  test("showCounts=false quita conteos pero deja etiquetas", () => {
    const html = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="i"
        series={ISOTYPE_SERIES}
        unit={10}
        showCounts={false}
      />,
    );
    expect(count(html, "<text")).toBe(3);
    expect(html).toContain("Grupo Alfa");
  });

  test("sortBy=asc reordena por valor", () => {
    const html = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="i"
        series={ISOTYPE_SERIES}
        unit={10}
        sortBy="asc"
      />,
    );
    expect(html.indexOf("Grupo Beta")).toBeLessThan(html.indexOf("Grupo Gama"));
    expect(html.indexOf("Grupo Gama")).toBeLessThan(html.indexOf("Grupo Alfa"));
  });

  test("maxItems topa las filas", () => {
    const html = renderToStaticMarkup(
      <IsotypeChart
        ariaLabel="i"
        series={ISOTYPE_SERIES}
        unit={10}
        maxItems={2}
      />,
    );
    // Solo Alfa (3) + Beta (1).
    expect(count(html, "<circle")).toBe(4);
  });
});

describe("FishboneDiagram: showLabels / showCounts / sortGroups / maxItems / format / id", () => {
  test("showLabels=false quita causas y subcausas", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="f"
        effect="Defectos"
        causes={FISH_CAUSES}
        showLabels={false}
      />,
    );
    expect(count(html, "<text")).toBe(1);
    expect(count(html, "<line")).toBe(10);
  });

  test("showCounts=false quita el `+N más`", () => {
    const base = renderToStaticMarkup(
      <FishboneDiagram ariaLabel="f" effect="E" causes={FISH_MANY} />,
    );
    expect(base).toContain("más");
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="f"
        effect="E"
        causes={FISH_MANY}
        showCounts={false}
      />,
    );
    expect(html).not.toContain("más");
  });

  test("sortGroups ordena alfabéticamente", () => {
    const base = renderToStaticMarkup(
      <FishboneDiagram ariaLabel="f" effect="Defectos" causes={FISH_CAUSES} />,
    );
    expect(base.indexOf("Métodos")).toBeLessThan(base.indexOf("Mano de obra"));
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="f"
        effect="Defectos"
        causes={FISH_CAUSES}
        sortGroups
      />,
    );
    expect(html.indexOf("Mano de obra")).toBeLessThan(html.indexOf("Métodos"));
  });

  test("maxItems topa las causas", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="f"
        effect="Defectos"
        causes={FISH_CAUSES}
        maxItems={2}
      />,
    );
    // 2 causas + cabeza efecto.
    expect(count(html, "data-chart-tip")).toBe(3);
    const layout = computeFishboneLayout("E", FISH_CAUSES, 300, "es-MX", {
      maxItems: 2,
    });
    expect(layout.causes.length).toBe(2);
  });

  test("format cambia el conteo del tip", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="f"
        effect="Defectos"
        causes={FISH_CAUSES}
        format={(v: number) => `X${v}Y`}
      />,
    );
    expect(html).toContain("Métodos: X3Y subcausas");
  });

  test("id fija el marcador interno", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="f"
        effect="Defectos"
        causes={FISH_CAUSES}
        id="mio"
      />,
    );
    expect(html).toContain('id="mio-fishbone-arrow"');
    expect(html).toContain("url(#mio-fishbone-arrow)");
  });
});

describe("ChordDiagram: showLabels / sortGroups / maxItems", () => {
  test("showLabels=false quita etiquetas de grupo", () => {
    const html = renderToStaticMarkup(
      <ChordDiagram
        ariaLabel="c"
        labels={CHORD_LABELS}
        matrix={CHORD_MATRIX}
        showLabels={false}
      />,
    );
    expect(count(html, "<text")).toBe(0);
    expect(count(html, "<path")).toBe(6);
  });

  test("sortGroups reordena por flujo total", () => {
    const base = computeChordLayout(CHORD_LABELS, CHORD_SORTED_MATRIX);
    expect(base.labels[0]).toBe("A");
    const sorted = computeChordLayout(CHORD_LABELS, CHORD_SORTED_MATRIX, {
      sortGroups: true,
    });
    expect(sorted.labels[0]).toBe("B");
    const html = renderToStaticMarkup(
      <ChordDiagram
        ariaLabel="c"
        labels={CHORD_LABELS}
        matrix={CHORD_SORTED_MATRIX}
        sortGroups
      />,
    );
    expect(html.lastIndexOf("B")).toBeLessThan(html.lastIndexOf("A"));
  });

  test("maxItems topa los grupos", () => {
    const html = renderToStaticMarkup(
      <ChordDiagram
        ariaLabel="c"
        labels={CHORD_LABELS}
        matrix={CHORD_MATRIX}
        maxItems={2}
      />,
    );
    // 2 arcos + 1 cinta.
    expect(count(html, "<path")).toBe(3);
  });
});

describe("DensityContourPlot: showLabels / gridTicks / maxItems", () => {
  test("showLabels=false quita textos de ejes pero deja el grid", () => {
    const base = renderToStaticMarkup(
      <DensityContourPlot ariaLabel="d" points={DENSITY_POINTS} />,
    );
    expect(count(base, "<text")).toBeGreaterThan(0);
    const html = renderToStaticMarkup(
      <DensityContourPlot
        ariaLabel="d"
        points={DENSITY_POINTS}
        showLabels={false}
      />,
    );
    expect(count(html, "<text")).toBe(0);
    expect(count(html, "<line")).toBeGreaterThan(0);
    expect(count(html, "<circle")).toBe(DENSITY_POINTS.length);
  });

  test("gridTicks cambia el grid", () => {
    const a = renderToStaticMarkup(
      <DensityContourPlot ariaLabel="d" points={DENSITY_POINTS} />,
    );
    const b = renderToStaticMarkup(
      <DensityContourPlot
        ariaLabel="d"
        points={DENSITY_POINTS}
        gridTicks={8}
      />,
    );
    expect(count(a, "<line")).not.toBe(count(b, "<line"));
  });

  test("maxItems topa la muestra", () => {
    const html = renderToStaticMarkup(
      <DensityContourPlot ariaLabel="d" points={DENSITY_POINTS} maxItems={5} />,
    );
    expect(count(html, "<circle")).toBe(5);
    const out = computeDensityContours(DENSITY_POINTS, 584, 216, 20, 6, 4, 5);
    expect(out.positioned.length).toBe(5);
  });
});

describe("HexbinPlot: showLabels / showCounts / gridTicks / maxItems", () => {
  test("showLabels=false quita textos de ejes", () => {
    const html = renderToStaticMarkup(
      <HexbinPlot ariaLabel="h" points={HEX_POINTS} showLabels={false} />,
    );
    expect(count(html, "<text")).toBe(0);
    expect(count(html, "<line")).toBeGreaterThan(0);
    expect(html).toContain("celda:");
  });

  test("showCounts=false quita el conteo del tip", () => {
    const base = renderToStaticMarkup(
      <HexbinPlot ariaLabel="h" points={HEX_POINTS} />,
    );
    expect(base).toContain("puntos (");
    const html = renderToStaticMarkup(
      <HexbinPlot ariaLabel="h" points={HEX_POINTS} showCounts={false} />,
    );
    expect(html).not.toContain("puntos (");
    expect(html).toContain("celda:");
  });

  test("gridTicks cambia el grid", () => {
    const a = renderToStaticMarkup(
      <HexbinPlot ariaLabel="h" points={HEX_POINTS} />,
    );
    const b = renderToStaticMarkup(
      <HexbinPlot ariaLabel="h" points={HEX_POINTS} gridTicks={8} />,
    );
    expect(count(a, "<line")).not.toBe(count(b, "<line"));
  });

  test("maxItems topa la muestra", () => {
    const out = computeHexbins(HEX_POINTS, 584, 216, 12, 4, 4);
    expect(out.total).toBe(4);
    const html = renderToStaticMarkup(
      <HexbinPlot ariaLabel="h" points={HEX_POINTS} maxItems={4} />,
    );
    expect(html).toContain("celda:");
    expect(html).not.toBe(
      renderToStaticMarkup(<HexbinPlot ariaLabel="h" points={HEX_POINTS} />),
    );
  });
});
