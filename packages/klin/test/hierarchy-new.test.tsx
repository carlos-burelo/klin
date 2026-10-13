/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import {
  CirclePackChart,
  computeCirclePackLayout,
} from "../src/components/circle-pack-chart";
import {
  computeDendrogramLayout,
  DendrogramChart,
} from "../src/components/dendrogram-chart";
import { EMPTY_TITLE } from "../src/components/empty";
import {
  computeIcicleLayout,
  IcicleChart,
} from "../src/components/icicle-chart";

const root = {
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

describe("jerarquías nuevas SSR (sin JS)", () => {
  test("DendrogramChart pinta un círculo por nodo con su ruta", () => {
    const html = renderToStaticMarkup(
      <DendrogramChart ariaLabel="dendro demo" root={root} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="dendro demo"');
    // A, B, C, B1, B2 = 5 círculos con tooltip.
    expect(html.match(/<circle/g)?.length).toBe(5);
    expect(html.match(/data-chart-tip/g)?.length).toBe(5);
    expect(html).toContain("A &gt; B &gt; B1");
    const { nodes, links } = computeDendrogramLayout(root, 640, 400);
    expect(nodes).toHaveLength(5);
    expect(links).toHaveLength(4);
  });

  test("DendrogramChart horizontal también pinta codos", () => {
    const html = renderToStaticMarkup(
      <DendrogramChart
        ariaLabel="dendro h"
        root={root}
        orientation="horizontal"
      />,
    );
    expect(html.match(/<circle/g)?.length).toBe(5);
    expect(html.match(/<path/g)?.length).toBe(4);
  });

  test("DendrogramChart sin hijos pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <DendrogramChart ariaLabel="vacío" root={{ label: "Solo" }} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });

  test("IcicleChart pinta una banda por nodo con valor y %", () => {
    const html = renderToStaticMarkup(
      <IcicleChart ariaLabel="icicle demo" root={root} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="icicle demo"');
    // B, C, B1, B2 = 4 rects con tooltip (la raíz no es banda).
    expect(html.match(/<rect/g)?.length).toBe(4);
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
    expect(html).toContain("B1");
    expect(html).toContain("%");
    const { bands, total } = computeIcicleLayout(root, 640, 360);
    expect(bands).toHaveLength(4);
    expect(total).toBe(25);
  });

  test("IcicleChart ignora valores no-finitos y vacía sin valores", () => {
    const html = renderToStaticMarkup(
      <IcicleChart
        ariaLabel="icicle raro"
        root={{ label: "A", children: [{ label: "X", value: Number.NaN }] }}
      />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });

  test("CirclePackChart pinta una burbuja por nodo con su parte", () => {
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="pack demo" root={root} />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="pack demo"');
    // Raíz + B, C, B1, B2 = 5 círculos con tooltip.
    expect(html.match(/<circle/g)?.length).toBe(5);
    expect(html.match(/data-chart-tip/g)?.length).toBe(5);
    expect(html).toContain("C");
    expect(html).toContain("%");
    const { bubbles, total } = computeCirclePackLayout(root, 640, 420);
    expect(bubbles).toHaveLength(5);
    expect(total).toBe(25);
  });

  test("CirclePackChart sin hijos pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <CirclePackChart ariaLabel="vacío" root={{ label: "Solo" }} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
  });
});
