/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { describe, expect, test } from "vitest";
import type { ChartSeries } from "../src/core/series";
import {
  buildStackedMatrix,
  maxTotalIndex,
  sortByGroupTotal,
} from "../src/core/stacked-model";

const SERIES: ChartSeries[] = [
  { key: "a", label: "A" },
  { key: "b", label: "B" },
];

describe("buildStackedMatrix", () => {
  test("crudos + sumas pos/neg + totales", () => {
    const m = buildStackedMatrix(
      [
        { x: "g1", a: 3, b: -1 },
        { x: "g2", a: 1, b: 2 },
      ],
      SERIES,
    );
    expect(m.raws).toEqual([
      [3, -1],
      [1, 2],
    ]);
    expect(m.posSums).toEqual([3, 3]);
    expect(m.negSums).toEqual([-1, 0]);
    expect(m.totals).toEqual([2, 3]);
  });
  test("no-finitos como 0", () => {
    const m = buildStackedMatrix([{ x: "g", a: Number.NaN }, {}], SERIES);
    expect(m.raws).toEqual([
      [0, 0],
      [0, 0],
    ]);
    expect(m.totals).toEqual([0, 0]);
  });
});

describe("sortByGroupTotal", () => {
  const data: Array<Record<string, string | number>> = [
    { x: "mid", a: 2 },
    { x: "top", a: 5 },
    { x: "low", a: 1 },
  ];
  test("none preserva orden y no muta", () => {
    const out = sortByGroupTotal(data, SERIES.slice(0, 1), "none");
    expect(out.map((d) => d.x)).toEqual(["mid", "top", "low"]);
    expect(out).not.toBe(data);
    expect(data[0]?.x).toBe("mid");
  });
  test("asc / desc", () => {
    const one: ChartSeries[] = [{ key: "a", label: "A" }];
    expect(sortByGroupTotal(data, one, "asc").map((d) => d.x)).toEqual([
      "low",
      "mid",
      "top",
    ]);
    expect(sortByGroupTotal(data, one, "desc").map((d) => d.x)).toEqual([
      "top",
      "mid",
      "low",
    ]);
  });
});

describe("maxTotalIndex", () => {
  test("primero gana en empate (estable)", () => {
    expect(maxTotalIndex([2, 5, 5, 1])).toBe(1);
    expect(maxTotalIndex([])).toBe(0);
  });
});
