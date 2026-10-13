/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CirclePackChart } from "../src/components/circle-pack-chart";
import { DendrogramChart } from "../src/components/dendrogram-chart";
import { IcicleChart } from "../src/components/icicle-chart";
import { MarimekkoChart } from "../src/components/marimekko-chart";
import { NightingaleChart } from "../src/components/nightingale-chart";
import { RadialBarChart } from "../src/components/radial-bar-chart";
import { SlopeChart } from "../src/components/slope-chart";

const SLOPE_DATA = [
  { label: "Alfa", from: 10, to: 15 },
  { label: "Beta", from: 10, to: 30 },
];

const COX_DATA = [
  { label: "A", value: 30 },
  { label: "B", value: 70 },
];

const RINGS = [
  { label: "A", value: 30 },
  { label: "B", value: 70, max: 100 },
];

const MARI_DATA = [
  { seg: "X", w: 1, a: 30, b: 70 },
  { seg: "Y", w: 3, a: 50, b: 50 },
];
const MARI_SERIES = [
  { key: "a", label: "A" },
  { key: "b", label: "B" },
];

const ROOT = {
  label: "A",
  children: [
    {
      label: "B",
      value: 10,
      children: [
        { label: "B1", value: 4 },
        { label: "B2", value: 6 },
      ],
    },
    { label: "C", value: 5 },
  ],
};

function count(html: string, tag: string): number {
  return html.match(new RegExp(tag, "g"))?.length ?? 0;
}

describe("SlopeChart props S", () => {
  const base = { data: SLOPE_DATA, fromLabel: "De", toLabel: "A" } as const;
  test("default preserva comportamiento (etiquetas + valores en orden)", () => {
    const html = renderToStaticMarkup(
      <SlopeChart ariaLabel="pendientes" {...base} />,
    );
    expect(html).toContain("Alfa");
    expect(html).toContain("Beta");
    expect(count(html, "<text")).toBe(6);
    expect(html.indexOf("Alfa")).toBeLessThan(html.indexOf("Beta"));
  });
  test("showLabels oculta etiquetas pero mantiene valores", () => {
    const html = renderToStaticMarkup(
      <SlopeChart ariaLabel="pendientes" {...base} showLabels={false} />,
    );
    expect(count(html, "<text")).toBe(4);
    expect(html).not.toContain(">Alfa<");
    expect(html).toContain("30");
  });
  test("showValues oculta valores pero mantiene etiquetas", () => {
    const html = renderToStaticMarkup(
      <SlopeChart ariaLabel="pendientes" {...base} showValues={false} />,
    );
    expect(count(html, "<text")).toBe(4);
    expect(html).toContain(">Alfa<");
  });
  test("sortGroups ordena por delta descendente", () => {
    const html = renderToStaticMarkup(
      <SlopeChart ariaLabel="pendientes" {...base} sortGroups />,
    );
    expect(html.indexOf("Beta")).toBeLessThan(html.indexOf("Alfa"));
  });
});

describe("NightingaleChart props S", () => {
  test("default preserva comportamiento (2 arcos, etiquetas, sin total)", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} />,
    );
    expect(count(html, "<path")).toBe(2);
    expect(html).toContain(">A<");
    expect(html).not.toContain(">Total<");
  });
  test("showLabels oculta etiquetas externas pero mantiene leyenda", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart
        ariaLabel="coxcomb"
        data={COX_DATA}
        showLabels={false}
      />,
    );
    expect(html).not.toContain(">A<");
    expect(html).toContain("A · 30");
  });
  test("showValues agrega el valor a la etiqueta externa", () => {
    const plain = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} />,
    );
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} showValues />,
    );
    expect(count(plain, "A · 30")).toBe(1);
    expect(count(html, "A · 30")).toBe(2);
  });
  test("sortSlices ordena por valor descendente", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} sortSlices />,
    );
    expect(html.indexOf("B: 70")).toBeLessThan(html.indexOf("A: 30"));
  });
  test("padAngle cambia los arcos", () => {
    const plain = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} />,
    );
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} padAngle={0.2} />,
    );
    expect(html).not.toBe(plain);
  });
  test("cornerRadius cambia los arcos", () => {
    const plain = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} />,
    );
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} cornerRadius={5} />,
    );
    expect(html).not.toBe(plain);
  });
  test("startAngle rota el coxcomb", () => {
    const plain = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} />,
    );
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} startAngle={1} />,
    );
    expect(html).not.toBe(plain);
  });
  test("showTotal pinta el total al centro", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart ariaLabel="coxcomb" data={COX_DATA} showTotal />,
    );
    expect(html).toContain(">Total<");
    expect(html).toContain(">100<");
  });
  test("totalLabel personaliza la etiqueta central", () => {
    const html = renderToStaticMarkup(
      <NightingaleChart
        ariaLabel="coxcomb"
        data={COX_DATA}
        showTotal
        totalLabel="Suma"
      />,
    );
    expect(html).toContain(">Suma<");
    expect(html).not.toContain(">Total<");
  });
});

describe("RadialBarChart props S", () => {
  test("default preserva comportamiento (pistas + arcos + etiquetas + valores)", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} />,
    );
    expect(count(html, "<path")).toBe(4);
    expect(count(html, "<circle")).toBe(2);
    expect(count(html, "<text")).toBe(4);
    expect(html.indexOf("A: 30")).toBeLessThan(html.indexOf("B: 70"));
  });
  test("showLabels oculta etiquetas y puntos", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} showLabels={false} />,
    );
    expect(count(html, "<circle")).toBe(0);
    expect(count(html, "<text")).toBe(2);
  });
  test("showValues oculta valores tabulares", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} showValues={false} />,
    );
    expect(count(html, "<text")).toBe(2);
    expect(html).toContain("A: 30");
  });
  test("sortSlices ordena por fracción descendente", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} sortSlices />,
    );
    expect(html.indexOf("B: 70")).toBeLessThan(html.indexOf("A: 30"));
  });
  test("startAngle cambia los arcos", () => {
    const plain = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} />,
    );
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} startAngle={0} />,
    );
    expect(html).not.toBe(plain);
  });
  test("cornerRadius cambia los arcos", () => {
    const plain = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} />,
    );
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} cornerRadius={0} />,
    );
    expect(html).not.toBe(plain);
  });
  test("showTotal pinta la suma al centro", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart ariaLabel="anillos" series={RINGS} showTotal />,
    );
    expect(html).toContain(">Total<");
    expect(html).toContain(">100<");
  });
  test("totalLabel personaliza la etiqueta central", () => {
    const html = renderToStaticMarkup(
      <RadialBarChart
        ariaLabel="anillos"
        series={RINGS}
        showTotal
        totalLabel="Suma"
      />,
    );
    expect(html).toContain(">Suma<");
    expect(html).not.toContain(">Total<");
  });
});

describe("MarimekkoChart props S", () => {
  const base = {
    data: MARI_DATA,
    xKey: "seg",
    widthKey: "w",
    series: MARI_SERIES,
  } as const;
  test("default preserva comportamiento (4 rects + % + etiquetas)", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} />,
    );
    expect(count(html, "data-chart-tip")).toBe(4);
    expect(html).toContain(">X<");
    expect(html).toContain(">30%<");
    expect(html.indexOf(">X<")).toBeLessThan(html.indexOf(">Y<"));
  });
  test("format personaliza valores de segmento", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} format={(v) => `#${v}#`} />,
    );
    expect(html).toContain("X · A: #30#");
  });
  test("showLabels oculta grupos del eje", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} showLabels={false} />,
    );
    expect(html).not.toContain(">X<");
    expect(html).toContain("X · A: 30");
  });
  test("showValues oculta % internos pero mantiene tips", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} showValues={false} />,
    );
    expect(html).not.toContain(">30%<");
    expect(html).toContain("X · A: 30 (30% de la columna)");
  });
  test("showCounts agrega el valor crudo junto al %", () => {
    const plain = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} />,
    );
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} showCounts />,
    );
    expect(plain).not.toContain(">30% (30)<");
    expect(html).toContain(">30% (30)<");
  });
  test("sortGroups ordena columnas por ancho descendente", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} sortGroups />,
    );
    expect(html.indexOf(">Y<")).toBeLessThan(html.indexOf(">X<"));
  });
  test("minLabelPct eleva el umbral de rótulo interno", () => {
    const html = renderToStaticMarkup(
      <MarimekkoChart ariaLabel="mari" {...base} minLabelPct={100} />,
    );
    expect(html).not.toContain(">30%<");
    expect(html).toContain("X · A: 30 (30% de la columna)");
  });
});

describe("DendrogramChart props S", () => {
  test("default preserva comportamiento (5 nodos con etiqueta)", () => {
    const html = renderToStaticMarkup(
      <DendrogramChart ariaLabel="dendro" root={ROOT} />,
    );
    expect(count(html, "<circle")).toBe(5);
    expect(count(html, "<text")).toBe(5);
  });
  test("depth limita la profundidad visible", () => {
    const html = renderToStaticMarkup(
      <DendrogramChart ariaLabel="dendro" root={ROOT} depth={1} />,
    );
    expect(count(html, "<circle")).toBe(3);
    expect(html).not.toContain("B1");
  });
  test("showLabels oculta etiquetas pero mantiene nodos", () => {
    const html = renderToStaticMarkup(
      <DendrogramChart ariaLabel="dendro" root={ROOT} showLabels={false} />,
    );
    expect(count(html, "<circle")).toBe(5);
    expect(count(html, "<text")).toBe(0);
  });
  test("showCounts agrega descendientes a cada rama", () => {
    const plain = renderToStaticMarkup(
      <DendrogramChart ariaLabel="dendro" root={ROOT} />,
    );
    const html = renderToStaticMarkup(
      <DendrogramChart ariaLabel="dendro" root={ROOT} showCounts />,
    );
    expect(plain).not.toContain("(2)");
    expect(html).toContain("(2)");
  });
});

describe("IcicleChart props S", () => {
  test("default preserva comportamiento (4 bandas con etiqueta)", () => {
    const html = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle" root={ROOT} />,
    );
    expect(count(html, "<rect")).toBe(4);
    expect(html).toContain("B1");
  });
  test("depth limita la profundidad visible", () => {
    const html = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle" root={ROOT} depth={1} />,
    );
    expect(count(html, "<rect")).toBe(2);
    expect(html).not.toContain("B1");
  });
  test("showLabels oculta etiquetas pero mantiene bandas", () => {
    const html = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle" root={ROOT} showLabels={false} />,
    );
    expect(count(html, "<rect")).toBe(4);
    expect(count(html, "<text")).toBe(0);
  });
  test("showValues agrega el valor a cada etiqueta", () => {
    const plain = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle" root={ROOT} />,
    );
    const html = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle" root={ROOT} showValues />,
    );
    expect(plain).not.toContain("· 20");
    expect(html).toContain("· 20");
  });
  test("minLabelWidth eleva el umbral de rótulo", () => {
    const html = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle" root={ROOT} minLabelWidth={10000} />,
    );
    expect(count(html, "<rect")).toBe(4);
    expect(count(html, "<text")).toBe(0);
  });
});

describe("CirclePackChart props S", () => {
  test("default preserva comportamiento (5 burbujas)", () => {
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} />,
    );
    expect(count(html, "<circle")).toBe(5);
  });
  test("depth limita la profundidad visible", () => {
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} depth={1} />,
    );
    expect(count(html, "<circle")).toBe(3);
  });
  test("showLabels oculta etiquetas pero mantiene burbujas", () => {
    const plain = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} />,
    );
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} showLabels={false} />,
    );
    expect(count(html, "<circle")).toBe(5);
    expect(count(html, "<text")).toBe(0);
    expect(count(plain, "<text")).toBeGreaterThan(0);
  });
  test("showValues agrega el valor a cada etiqueta", () => {
    const plain = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} />,
    );
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} showValues />,
    );
    expect(plain).not.toContain("· 20");
    expect(html).toContain("· 20");
  });
  test("minLabelDiameter eleva el umbral de rótulo", () => {
    const plain = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} />,
    );
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack" root={ROOT} minLabelDiameter={10000} />,
    );
    expect(count(plain, "<text")).toBeGreaterThan(0);
    expect(count(html, "<text")).toBe(0);
  });
});
