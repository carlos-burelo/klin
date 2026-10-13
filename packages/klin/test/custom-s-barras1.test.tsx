/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 *
 * Props simples (S) de barras: el render por defecto no cambia
 * (defaults explícitos producen el mismo markup) y cada prop nueva
 * cambia el output.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { BarChart } from "../src/components/bar-chart";
import { DivergingBar } from "../src/components/diverging-bar";
import { HorizontalBarChart } from "../src/components/horizontal-bar-chart";
import { LollipopChart } from "../src/components/lollipop-chart";
import { PyramidChart } from "../src/components/pyramid-chart";
import { StackedBar } from "../src/components/stacked-bar";
import { VerticalStackedBar } from "../src/components/vertical-stacked-bar";

const barData = [
  { x: "A", a: 10, b: 20 },
  { x: "B", a: 30, b: 5 },
];
const barSeries = [
  { key: "a", label: "Serie A" },
  { key: "b", label: "Serie B" },
];

const countTexts = (html: string) => html.match(/<text/g)?.length ?? 0;
const countPct = (html: string) => html.match(/%/g)?.length ?? 0;

describe("BarChart (S)", () => {
  const base = {
    ariaLabel: "barras",
    data: barData,
    xKey: "x",
    series: barSeries,
  };
  const def = renderToStaticMarkup(<BarChart {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <BarChart
        {...base}
        layout="grouped"
        barRadius={4}
        showValues={false}
        gridTicks={4}
        sortGroups="none"
        highlightMax={false}
      />,
    );
    expect(explicit).toBe(def);
    expect(def).toContain("<svg");
  });
  test("layout stacked/percent cambia el output", () => {
    expect(
      renderToStaticMarkup(<BarChart {...base} layout="stacked" />),
    ).not.toBe(def);
    expect(
      renderToStaticMarkup(<BarChart {...base} layout="percent" />),
    ).not.toBe(def);
  });
  test("barRadius cambia el output", () => {
    const html = renderToStaticMarkup(<BarChart {...base} barRadius={0} />);
    expect(html).not.toBe(def);
    expect(html).toContain('rx="0"');
  });
  test("showValues agrega etiquetas", () => {
    const html = renderToStaticMarkup(<BarChart {...base} showValues />);
    expect(html).not.toBe(def);
    expect(countTexts(html)).toBeGreaterThan(countTexts(def));
  });
  test("yMax fijo cambia el output", () => {
    expect(renderToStaticMarkup(<BarChart {...base} yMax={100} />)).not.toBe(
      def,
    );
  });
  test("gridTicks cambia el output", () => {
    expect(renderToStaticMarkup(<BarChart {...base} gridTicks={8} />)).not.toBe(
      def,
    );
  });
  test("sortGroups desc reordena (B primero)", () => {
    const html = renderToStaticMarkup(<BarChart {...base} sortGroups="desc" />);
    expect(html).not.toBe(def);
    expect(html.indexOf("<title>B</title>")).toBeLessThan(
      html.indexOf("<title>A</title>"),
    );
  });
  test("highlightMax acentúa el máximo", () => {
    const html = renderToStaticMarkup(<BarChart {...base} highlightMax />);
    expect(html).not.toBe(def);
    expect(html).toContain("var(--chart-2)");
  });
  test("id prefija defs en apilado", () => {
    const html = renderToStaticMarkup(
      <BarChart {...base} layout="stacked" id="bc1" />,
    );
    expect(html).toContain("bc1-bc-0");
  });
});

describe("HorizontalBarChart (S)", () => {
  const base = {
    ariaLabel: "hbarras",
    data: barData,
    yKey: "x",
    series: barSeries,
  };
  const def = renderToStaticMarkup(<HorizontalBarChart {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <HorizontalBarChart
        {...base}
        barRadius={4}
        showValues
        sortGroups="none"
        gridTicks={4}
        labelWidth={132}
      />,
    );
    expect(explicit).toBe(def);
  });
  test("height fija cambia el output", () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart {...base} height={400} />,
    );
    expect(html).not.toBe(def);
    expect(html).toContain("400");
  });
  test("barRadius cambia el output", () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart {...base} barRadius={0} />,
    );
    expect(html).not.toBe(def);
    expect(html).toContain('rx="0"');
  });
  test("showValues=false quita etiquetas", () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart {...base} showValues={false} />,
    );
    expect(html).not.toBe(def);
    expect(countTexts(html)).toBeLessThan(countTexts(def));
  });
  test("sortGroups desc reordena", () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart {...base} sortGroups="desc" />,
    );
    expect(html).not.toBe(def);
    expect(html.indexOf("<title>B</title>")).toBeLessThan(
      html.indexOf("<title>A</title>"),
    );
  });
  test("gridTicks cambia el output", () => {
    expect(
      renderToStaticMarkup(<HorizontalBarChart {...base} gridTicks={8} />),
    ).not.toBe(def);
  });
  test("labelWidth cambia el output", () => {
    expect(
      renderToStaticMarkup(<HorizontalBarChart {...base} labelWidth={200} />),
    ).not.toBe(def);
  });
});

describe("VerticalStackedBar (S)", () => {
  const base = {
    ariaLabel: "vapiladas",
    data: barData,
    xKey: "x",
    series: barSeries,
  };
  const def = renderToStaticMarkup(<VerticalStackedBar {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <VerticalStackedBar
        {...base}
        barRadius={4}
        showValues={false}
        gridTicks={4}
        sortGroups="none"
      />,
    );
    expect(explicit).toBe(def);
  });
  test("barRadius cambia el output", () => {
    const html = renderToStaticMarkup(
      <VerticalStackedBar {...base} barRadius={0} />,
    );
    expect(html).not.toBe(def);
    expect(html).toContain('rx="0"');
  });
  test("showValues agrega etiquetas", () => {
    const html = renderToStaticMarkup(
      <VerticalStackedBar {...base} showValues />,
    );
    expect(html).not.toBe(def);
    expect(countTexts(html)).toBeGreaterThan(countTexts(def));
  });
  test("gridTicks cambia el output", () => {
    expect(
      renderToStaticMarkup(<VerticalStackedBar {...base} gridTicks={8} />),
    ).not.toBe(def);
  });
  test("sortGroups desc reordena", () => {
    const html = renderToStaticMarkup(
      <VerticalStackedBar {...base} sortGroups="desc" />,
    );
    expect(html).not.toBe(def);
    expect(html.indexOf("<title>B</title>")).toBeLessThan(
      html.indexOf("<title>A</title>"),
    );
  });
  test("id prefija defs", () => {
    const html = renderToStaticMarkup(
      <VerticalStackedBar {...base} id="custom" />,
    );
    expect(html).not.toBe(def);
    expect(html).toContain('id="custom-vs-0"');
  });
});

describe("StackedBar (S)", () => {
  const base = {
    ariaLabel: "apiladas",
    rows: [
      { label: "A", values: { x: 20, y: 30 } },
      { label: "B", values: { x: 50, y: 50 } },
    ],
    segments: [
      { key: "x", label: "X" },
      { key: "y", label: "Y" },
    ],
  };
  const def = renderToStaticMarkup(<StackedBar {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <StackedBar {...base} scale="global" showPercent barHeight={24} />,
    );
    expect(explicit).toBe(def);
  });
  test("scale=row cambia anchos", () => {
    expect(renderToStaticMarkup(<StackedBar {...base} scale="row" />)).not.toBe(
      def,
    );
  });
  test("showPercent=false quita insignia", () => {
    const html = renderToStaticMarkup(
      <StackedBar {...base} showPercent={false} />,
    );
    expect(html).not.toBe(def);
    expect(html).not.toContain("w-10");
  });
  test("barHeight cambia el output", () => {
    const html = renderToStaticMarkup(<StackedBar {...base} barHeight={32} />);
    expect(html).not.toBe(def);
    expect(html).toContain("0 0 600 32");
  });
  test("height fija cambia el output", () => {
    const html = renderToStaticMarkup(<StackedBar {...base} height={500} />);
    expect(html).not.toBe(def);
    expect(html).toContain("500");
  });
  test("id prefija clipPath", () => {
    const html = renderToStaticMarkup(<StackedBar {...base} id="sb" />);
    expect(html).not.toBe(def);
    expect(html).toContain("sb-st-0");
  });
});

describe("LollipopChart (S)", () => {
  const base = {
    ariaLabel: "paletas",
    data: [
      { x: "A", y: 10 },
      { x: "B", y: 30 },
    ],
    xKey: "x",
    yKey: "y",
  };
  const def = renderToStaticMarkup(<LollipopChart {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <LollipopChart
        {...base}
        stemStyle="solid"
        sortGroups="none"
        showValues
      />,
    );
    expect(explicit).toBe(def);
  });
  test("stemStyle=dashed puntea tallos", () => {
    const html = renderToStaticMarkup(
      <LollipopChart {...base} stemStyle="dashed" />,
    );
    expect(html).not.toBe(def);
    expect(html).toContain("stroke-dasharray");
  });
  test("sortGroups desc reordena", () => {
    const html = renderToStaticMarkup(
      <LollipopChart {...base} sortGroups="desc" />,
    );
    expect(html).not.toBe(def);
    expect(html.indexOf("<title>B</title>")).toBeLessThan(
      html.indexOf("<title>A</title>"),
    );
  });
  test("showValues=false quita etiquetas", () => {
    const html = renderToStaticMarkup(
      <LollipopChart {...base} showValues={false} />,
    );
    expect(html).not.toBe(def);
    expect(countTexts(html)).toBeLessThan(countTexts(def));
  });
});

describe("DivergingBar (S)", () => {
  const base = {
    ariaLabel: "divergentes",
    data: [
      { g: "A", l: 10, r: 15 },
      { g: "B", l: 50, r: 90 },
    ],
    yKey: "g",
    left: { key: "l", label: "Contra" },
    right: { key: "r", label: "Favor" },
  };
  const def = renderToStaticMarkup(<DivergingBar {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <DivergingBar
        {...base}
        midLabels="outside"
        showShare={false}
        sortBy="none"
      />,
    );
    expect(explicit).toBe(def);
  });
  test("height fija cambia el output", () => {
    expect(
      renderToStaticMarkup(<DivergingBar {...base} height={400} />),
    ).not.toBe(def);
  });
  test("midLabels=center cambia el output", () => {
    expect(
      renderToStaticMarkup(<DivergingBar {...base} midLabels="center" />),
    ).not.toBe(def);
  });
  test("showShare agrega etiquetas de %", () => {
    const html = renderToStaticMarkup(<DivergingBar {...base} showShare />);
    expect(html).not.toBe(def);
    expect(countPct(html)).toBeGreaterThan(countPct(def));
  });
  test("sortBy reordena (total y diff)", () => {
    const byTotal = renderToStaticMarkup(
      <DivergingBar {...base} sortBy="total" />,
    );
    expect(byTotal).not.toBe(def);
    expect(byTotal.indexOf("<title>B</title>")).toBeLessThan(
      byTotal.indexOf("<title>A</title>"),
    );
    expect(
      renderToStaticMarkup(<DivergingBar {...base} sortBy="diff" />),
    ).not.toBe(def);
  });
});

describe("PyramidChart (S)", () => {
  const base = {
    ariaLabel: "piramide",
    groups: ["A", "B"],
    left: { label: "H", values: [10, 50] },
    right: { label: "M", values: [15, 90] },
  };
  const def = renderToStaticMarkup(<PyramidChart {...base} />);
  test("default sin cambios con defaults explícitos", () => {
    const explicit = renderToStaticMarkup(
      <PyramidChart
        {...base}
        showShare={false}
        centerGap={0}
        sortGroups="none"
      />,
    );
    expect(explicit).toBe(def);
  });
  test("height fija cambia el output", () => {
    expect(
      renderToStaticMarkup(<PyramidChart {...base} height={400} />),
    ).not.toBe(def);
  });
  test("showShare agrega etiquetas de %", () => {
    const html = renderToStaticMarkup(<PyramidChart {...base} showShare />);
    expect(html).not.toBe(def);
    expect(countPct(html)).toBeGreaterThan(countPct(def));
  });
  test("centerGap cambia el output", () => {
    expect(
      renderToStaticMarkup(<PyramidChart {...base} centerGap={40} />),
    ).not.toBe(def);
  });
  test("sortGroups desc reordena", () => {
    const html = renderToStaticMarkup(
      <PyramidChart {...base} sortGroups="desc" />,
    );
    expect(html).not.toBe(def);
    expect(html.indexOf("<title>B</title>")).toBeLessThan(
      html.indexOf("<title>A</title>"),
    );
  });
});
