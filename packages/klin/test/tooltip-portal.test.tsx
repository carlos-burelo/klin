// @vitest-environment jsdom
/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";
import { BarChart } from "../src/components/bar-chart";
import { ChartTooltipPortal } from "../src/render/tooltip-portal";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(children: React.ReactNode): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(children);
  });
  return host;
}

const DATA = [
  { x: "Ene", v: 10 },
  { x: "Feb", v: 20 },
];
const SERIES = [{ key: "v", label: "Valor" }];

describe("ChartTooltipPortal sin doble tooltip", () => {
  test("cero <title> en todo el árbol; nombre solo en aria-label", () => {
    const host = mount(
      <ChartTooltipPortal>
        <BarChart data={DATA} series={SERIES} xKey="x" ariaLabel="barras" />
      </ChartTooltipPortal>,
    );
    // Invariante (igual que scripts/check-titles.mjs): ningún `<title>`.
    // El doble tooltip queda imposible por construcción.
    expect(host.querySelectorAll("title").length).toBe(0);
    expect(host.querySelector("svg")?.getAttribute("aria-label")).toBe(
      "barras",
    );
    const holders = [...host.querySelectorAll("[data-chart-tip]")];
    expect(holders.length).toBeGreaterThan(0);
  });

  test("sin portal tampoco hay <title>: el hover vive en data-chart-tip", () => {
    const host = mount(
      <BarChart data={DATA} series={SERIES} xKey="x" ariaLabel="barras" />,
    );
    expect(host.querySelectorAll("title").length).toBe(0);
    expect(host.querySelectorAll("[data-chart-tip]").length).toBeGreaterThan(0);
    expect(host.querySelector("svg")?.getAttribute("aria-label")).toBe(
      "barras",
    );
  });
});
