// Bench SSR de klin (node contra dist/). Uso: `pnpm bench` (tras `pnpm build`).
// Mide mediana de 7 corridas tras 2 de calentamiento. Determinista (LCG).
import { performance } from "node:perf_hooks";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { computeBeeswarmPositions } from "../dist/components/beeswarm-plot.compute.js";
import { computeNetworkPositions } from "../dist/components/network-graph.compute.js";
import { NetworkTopology } from "../dist/components/network-topology.js";
import { computeSunburstLayout } from "../dist/components/sunburst-chart.compute.js";
import { computeTreemapLayout } from "../dist/components/treemap-chart.compute.js";
import { ViolinPlot } from "../dist/components/violin-plot.js";
import { buildValueAxis } from "../dist/core/cartesian-model.js";
import { layoutDag } from "../dist/core/dag/layout.js";
import { kdeOf } from "../dist/core/kde.js";
import { buildStackedMatrix } from "../dist/core/stacked-model.js";

function lcg(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function bench(name, fn, runs = 7) {
  fn();
  fn();
  const ts = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    fn();
    ts.push(performance.now() - t0);
  }
  console.log(`${name} | ${median(ts).toFixed(2)} ms`);
}

function chainIds(v) {
  return Array.from({ length: v }, (_, i) => `n${i}`);
}
function chainEdges(v) {
  return Array.from({ length: v - 1 }, (_, i) => ({
    from: `n${i}`,
    to: `n${i + 1}`,
  }));
}
function denseEdges(v, k, rand) {
  const edges = [];
  for (let i = 0; i < v; i++) {
    for (let j = 1; j <= k; j++) {
      if (i + j < v && rand() < 0.7)
        edges.push({ from: `n${i}`, to: `n${i + j}` });
    }
  }
  return edges;
}

console.log("caso | mediana (7 runs, 2 warmup)");
console.log("---|---");

for (const v of [50, 100, 200, 400]) {
  const ids = chainIds(v);
  const edges = chainEdges(v);
  bench(`layoutDag cadena V=${v} E=${v - 1}`, () => layoutDag(ids, edges));
}
{
  const rand = lcg(7);
  for (const v of [50, 100, 200]) {
    const ids = chainIds(v);
    const edges = denseEdges(v, 6, rand);
    bench(`layoutDag denso V=${v} E=${edges.length}`, () =>
      layoutDag(ids, edges),
    );
  }
}

for (const n of [100, 1000, 10000]) {
  const rand = lcg(11);
  const values = Array.from({ length: n }, () => rand() * 100);
  bench(`kdeOf n=${n} bins=48`, () => kdeOf(values, 0, 0, 100));
}

for (const [g, s] of [
  [50, 5],
  [200, 5],
  [200, 20],
]) {
  const rand = lcg(13);
  const series = Array.from({ length: s }, (_, i) => ({
    key: `s${i}`,
    label: `S${i}`,
  }));
  const data = Array.from({ length: g }, (_, i) => {
    const d = { x: `g${i}` };
    for (const q of series) d[q.key] = rand() * 100 - 20;
    return d;
  });
  bench(`stackedMatrix G=${g} S=${s}`, () => buildStackedMatrix(data, series));
}

for (const n of [1000, 10000]) {
  const rand = lcg(17);
  const values = Array.from({ length: n }, () => rand() * 100 - 10);
  bench(`buildValueAxis n=${n}`, () => buildValueAxis({ values }, [300, 0]));
}

for (const n of [100, 400]) {
  const rand = lcg(19);
  const points = Array.from({ length: n }, (_, i) => ({
    value: rand() * 100,
    label: `p${i}`,
  }));
  bench(`beeswarm n=${n} 300ticks`, () =>
    computeBeeswarmPositions(points, 560, 240),
  );
}

for (const v of [50, 200]) {
  const rand = lcg(23);
  const nodes = Array.from({ length: v }, (_, i) => ({
    id: `n${i}`,
    label: `N${i}`,
  }));
  const edges = Array.from({ length: v * 2 }, () => ({
    from: `n${Math.floor(rand() * v)}`,
    to: `n${Math.floor(rand() * v)}`,
  }));
  bench(`network-force V=${v} 300ticks`, () =>
    computeNetworkPositions(nodes, edges),
  );
}

function nestedLeaves(n, per = 10) {
  const groups = [];
  for (let i = 0; i < Math.ceil(n / per); i++) {
    groups.push({
      label: `g${i}`,
      children: Array.from({ length: per }, (_, j) => ({
        label: `l${i}-${j}`,
        value: 1 + ((i * per + j) % 9),
      })),
    });
  }
  return groups;
}
for (const n of [200, 800]) {
  const data = nestedLeaves(n);
  bench(`treemap hojas~${n}`, () => computeTreemapLayout(data));
  bench(`sunburst hojas~${n}`, () => computeSunburstLayout(data, 640));
}

{
  const rand = lcg(29);
  const groups = Array.from({ length: 5 }, (_, g) => ({
    label: `g${g}`,
    values: Array.from({ length: 200 }, () => rand() * 100),
  }));
  bench("SSR ViolinPlot 5x200", () =>
    renderToStaticMarkup(
      createElement(ViolinPlot, { groups, ariaLabel: "bench" }),
    ),
  );
  const nodes = Array.from({ length: 100 }, (_, i) => ({
    id: `n${i}`,
    label: `Nodo ${i}`,
    sub: `s${i}`,
  }));
  const edges = Array.from({ length: 120 }, (_, i) => ({
    from: `n${i % 100}`,
    to: `n${(i * 7 + 1) % 100}`,
  }));
  bench("SSR NetworkTopology V=100", () =>
    renderToStaticMarkup(
      createElement(NetworkTopology, { nodes, edges, ariaLabel: "bench" }),
    ),
  );
}
