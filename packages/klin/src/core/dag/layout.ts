/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
/**
 * Motor de layout para diagramas de nodos y aristas (flow, state, ER, clase,
 * casos de uso, arquitectura). Determinista y SSR puro: sin simulación ni DOM.
 *
 * Capas por Kahn con ruptura de ciclos (estable aunque haya back-edges),
 * orden baricentro (2 pasadas) y rutas curvas. Las aristas se dibujan centro
 * a centro y los nodos se pintan encima, así no hay que recortar extremos.
 */
import type { DagEdge, DagLayout, DagOptions } from "./types";

/** Defaults del layout DAG (dimensiones de nodo y canales). */
export const DAG_DEFAULTS = {
  nodeW: 150,
  nodeH: 52,
  gapX: 36,
  gapY: 56,
  backtrackLane: 48,
  backtrackSagMin: 56,
  backtrackPad: 32,
  selfLoopPad: 14,
} as const;

/** Dedup preservando orden + ignora ids vacíos (Map/Set colapsarían). */
function dedupIds(ids: string[], maxNodes: number): string[] {
  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    deduped.push(id);
    if (deduped.length >= maxNodes) break;
  }
  return deduped;
}

/** Índice de adyacencia (una pasada sobre aristas, resto O(grado)). */
function indexEdges(clean: DagEdge[]): {
  outgoing: Map<string, DagEdge[]>;
  incoming: Map<string, DagEdge[]>;
} {
  const outgoing = new Map<string, DagEdge[]>();
  const incoming = new Map<string, DagEdge[]>();
  for (const e of clean) {
    const out = outgoing.get(e.from) ?? [];
    out.push(e);
    outgoing.set(e.from, out);
    const inn = incoming.get(e.to) ?? [];
    inn.push(e);
    incoming.set(e.to, inn);
  }
  return { outgoing, incoming };
}

/** Capas por Kahn: en cada nivel salen los nodos sin entrantes pendientes. Si solo quedan ciclos, se avanza con el primero (ruptura estable). */
function assignLayers(
  deduped: string[],
  clean: DagEdge[],
): Map<string, number> {
  const indeg = new Map<string, number>(deduped.map((id) => [id, 0]));
  for (const e of clean) {
    if (e.from !== e.to) indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  const { outgoing } = indexEdges(clean);
  // Posición en entrada para orden estable (igual que filtrar el Set).
  const order = new Map(deduped.map((id, i) => [id, i]));
  const depth = new Map<string, number>();
  const remaining = new Set(deduped);
  let wave = deduped.filter((id) => (indeg.get(id) ?? 0) === 0);
  let layer = 0;
  while (remaining.size > 0) {
    // Oleada completa antes de subir de capa (misma semántica que antes).
    const level = wave.length > 0 ? wave : [[...remaining][0] as string];
    level.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
    const next: string[] = [];
    for (const id of level) {
      depth.set(id, layer);
      remaining.delete(id);
      for (const e of outgoing.get(id) ?? []) {
        if (e.from !== e.to && remaining.has(e.to)) {
          const left = (indeg.get(e.to) ?? 0) - 1;
          indeg.set(e.to, left);
          if (left === 0) next.push(e.to);
        }
      }
    }
    wave = next;
    layer++;
  }
  return depth;
}

/** Orden baricentro: 2 pasadas contra vecinos de capas adyacentes. */
function orderLayers(
  layers: Map<number, string[]>,
  maxLayer: number,
  clean: DagEdge[],
  depth: Map<string, number>,
): void {
  const { outgoing, incoming } = indexEdges(clean);
  const posIn = (layer: number, id: string) =>
    layers.get(layer)?.indexOf(id) ?? 0;
  for (let pass = 0; pass < 2; pass++) {
    for (let l = 0; l <= maxLayer; l++) {
      const arr = layers.get(l);
      if (!arr || arr.length < 2) continue;
      const score = new Map<string, number>();
      for (const id of arr) {
        const neighbors = (outgoing.get(id) ?? [])
          .filter((e) => (depth.get(e.to) ?? 0) === l + 1)
          .map((e) => posIn(l + 1, e.to))
          .concat(
            (incoming.get(id) ?? [])
              .filter((e) => (depth.get(e.from) ?? 0) === l - 1)
              .map((e) => posIn(l - 1, e.from)),
          );
        score.set(
          id,
          neighbors.length === 0
            ? posIn(l, id)
            : neighbors.reduce((a, b) => a + b, 0) / neighbors.length,
        );
      }
      arr.sort((a, b) => (score.get(a) ?? 0) - (score.get(b) ?? 0));
    }
  }
}

export function layoutDag(
  ids: string[],
  edges: DagEdge[],
  opts?: DagOptions,
): DagLayout {
  const direction = opts?.direction ?? "TB";
  const w = opts?.nodeW ?? DAG_DEFAULTS.nodeW;
  const h = opts?.nodeH ?? DAG_DEFAULTS.nodeH;
  const gapX = opts?.gapX ?? DAG_DEFAULTS.gapX;
  const gapY = opts?.gapY ?? DAG_DEFAULTS.gapY;
  const minW = opts?.minW ?? 0;
  const minH = opts?.minH ?? 0;
  const maxNodes = opts?.maxNodes ?? 400;
  const maxEdges = opts?.maxEdges ?? 1000;

  const deduped = dedupIds(ids, maxNodes);

  const known = new Set(deduped);
  const clean = edges
    .filter((e) => e.from && e.to && known.has(e.from) && known.has(e.to))
    .slice(0, maxEdges);

  const depth = assignLayers(deduped, clean);

  const layers = new Map<number, string[]>();
  for (const id of deduped) {
    const l = depth.get(id) ?? 0;
    const arr = layers.get(l) ?? [];
    arr.push(id);
    layers.set(l, arr);
  }
  const maxLayer = layers.size === 0 ? 0 : Math.max(...layers.keys());

  orderLayers(layers, maxLayer, clean, depth);

  const maxCount = Math.max(1, ...[...layers.values()].map((a) => a.length));
  const layerCount = maxLayer + 1;
  // Extensión por dirección (en LR las capas avanzan en X con w/gapX).
  const spanX =
    direction === "TB"
      ? maxCount * w + (maxCount - 1) * gapX
      : layerCount * w + (layerCount - 1) * gapX;
  const spanY =
    direction === "TB"
      ? layerCount * h + (layerCount - 1) * gapY
      : maxCount * h + (maxCount - 1) * gapY;

  // Reserva para canales laterales de aristas de retorno (ciclos).
  let extraRight = 0;
  let extraBottom = 0;
  for (const e of clean) {
    if (e.from === e.to) continue;
    const da = depth.get(e.from) ?? 0;
    const db = depth.get(e.to) ?? 0;
    if (db > da) continue;
    if (direction === "TB")
      extraRight =
        Math.max(DAG_DEFAULTS.backtrackLane, gapX * 1.25) +
        DAG_DEFAULTS.backtrackLane;
    else
      extraBottom =
        Math.max(DAG_DEFAULTS.backtrackSagMin, gapY) +
        DAG_DEFAULTS.backtrackPad;
  }

  const width = Math.max(1, Math.max(minW, spanX) + extraRight);
  const height = Math.max(1, Math.max(minH, spanY) + extraBottom);

  const nodes: DagLayout["nodes"] = new Map();
  for (const [l, arr] of layers) {
    if (direction === "TB") {
      const rowW = arr.length * w + (arr.length - 1) * gapX;
      arr.forEach((id, i) => {
        const x = (width - extraRight - rowW) / 2 + i * (w + gapX);
        const y = l * (h + gapY);
        nodes.set(id, {
          id,
          x,
          y,
          w,
          h,
          cx: x + w / 2,
          cy: y + h / 2,
          layer: l,
        });
      });
    } else {
      const colH = arr.length * h + (arr.length - 1) * gapY;
      arr.forEach((id, i) => {
        const x = l * (w + gapX);
        const y = (height - extraBottom - colH) / 2 + i * (h + gapY);
        nodes.set(id, {
          id,
          x,
          y,
          w,
          h,
          cx: x + w / 2,
          cy: y + h / 2,
          layer: l,
        });
      });
    }
  }

  const routed: DagLayout["edges"] = clean.map((e) => {
    const a = nodes.get(e.from);
    const b = nodes.get(e.to);
    if (!a || !b)
      return { from: e.from, to: e.to, d: "", mx: 0, my: 0, self: false };
    if (e.from === e.to) {
      const rx = a.w / 2 + DAG_DEFAULTS.selfLoopPad;
      const d = `M ${a.cx + a.w / 2 - 6} ${a.cy} C ${a.cx + a.w / 2 + rx} ${a.cy - a.h}, ${a.cx + a.w / 2 + rx} ${a.cy + a.h}, ${a.cx + a.w / 2 - 6} ${a.cy + 10}`;
      return {
        from: e.from,
        to: e.to,
        d,
        mx: a.cx + a.w / 2 + rx - 8,
        my: a.cy,
        self: true,
      };
    }
    const vertical = direction === "TB";
    // Si la arista retrocede (ciclo), va por un canal lateral para no
    // encimarse sobre la arista de ida.
    const backTB = vertical && b.cy < a.cy;
    const backLR = !vertical && b.cx < a.cx;
    if (backTB) {
      const off = Math.max(DAG_DEFAULTS.backtrackLane, gapX * 1.25);
      const sx = a.x + a.w;
      const sy = a.cy;
      const tx = b.x + b.w;
      const ty = b.cy;
      return {
        from: e.from,
        to: e.to,
        d: `M ${sx} ${sy} C ${sx + off} ${sy}, ${tx + off} ${ty}, ${tx} ${ty}`,
        mx: tx + off * 0.7,
        my: (sy + ty) / 2,
        self: false,
      };
    }
    if (backLR) {
      const sag = Math.max(DAG_DEFAULTS.backtrackSagMin, gapY);
      const sx = a.cx;
      const sy = a.y + a.h;
      const tx = b.cx;
      const ty = b.y + b.h;
      return {
        from: e.from,
        to: e.to,
        d: `M ${sx} ${sy} C ${sx} ${sy + sag}, ${tx} ${ty + sag}, ${tx} ${ty}`,
        mx: (sx + tx) / 2,
        my: Math.max(sy, ty) + sag * 0.7,
        self: false,
      };
    }
    const sx = vertical ? a.cx : a.x + a.w;
    const sy = vertical ? a.y + a.h : a.cy;
    const tx = vertical ? b.cx : b.x;
    const ty = vertical ? b.y : b.cy;
    const my = (sy + ty) / 2;
    const mx = (sx + tx) / 2;
    const d = vertical
      ? `M ${sx} ${sy} C ${sx} ${my}, ${tx} ${my}, ${tx} ${ty}`
      : `M ${sx} ${sy} C ${sx + gapX / 2} ${sy}, ${tx - gapX / 2} ${ty}, ${tx} ${ty}`;
    return { from: e.from, to: e.to, d, mx, my, self: false };
  });

  return { nodes, edges: routed, width, height };
}
