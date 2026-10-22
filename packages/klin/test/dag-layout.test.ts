/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { describe, expect, test } from "vitest";
import { DAG_DEFAULTS, layoutDag } from "../src/core/dag/layout";

describe("layoutDag", () => {
  test("determinista: misma entrada, misma salida", () => {
    const ids = ["a", "b", "c"];
    const edges = [
      { from: "a", to: "b" },
      { from: "b", to: "c" },
    ];
    const first = layoutDag(ids, edges);
    const second = layoutDag(ids, edges);
    expect([...second.nodes.keys()]).toEqual([...first.nodes.keys()]);
    expect(second.edges.map((e) => e.d)).toEqual(first.edges.map((e) => e.d));
    expect(second.width).toBe(first.width);
    expect(second.height).toBe(first.height);
  });
  test("ciclos no cuelgan (ruptura estable)", () => {
    const layout = layoutDag(
      ["a", "b"],
      [
        { from: "a", to: "b" },
        { from: "b", to: "a" },
      ],
    );
    expect(layout.nodes.size).toBe(2);
    expect(layout.edges).toHaveLength(2);
  });
  test("self-loop marcado", () => {
    const layout = layoutDag(["a"], [{ from: "a", to: "a" }]);
    expect(layout.edges[0]?.self).toBe(true);
  });
  test("ids vacíos/duplicados y aristas huérfanas se ignoran", () => {
    const layout = layoutDag(["a", "", "a"], [{ from: "a", to: "fantasma" }]);
    expect(layout.nodes.size).toBe(1);
    expect(layout.edges).toHaveLength(0);
  });
  test("respeta topes SSR", () => {
    const ids = Array.from({ length: 10 }, (_, i) => `n${i}`);
    const layout = layoutDag(ids, [], { maxNodes: 3 });
    expect(layout.nodes.size).toBeLessThanOrEqual(3);
    expect(DAG_DEFAULTS.nodeW).toBe(150);
  });
});
