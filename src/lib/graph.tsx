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

export type DagNode = {
  id: string;
};

export type DagEdge = {
  from: string;
  to: string;
};

export type PlacedNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  layer: number;
};

export type RoutedEdge = {
  from: string;
  to: string;
  /** Camino SVG listo para `d`. */
  d: string;
  /** Punto medio para la etiqueta. */
  mx: number;
  my: number;
  /** Lazo sobre sí mismo. */
  self: boolean;
};

export type DagLayout = {
  nodes: Map<string, PlacedNode>;
  edges: RoutedEdge[];
  width: number;
  height: number;
};

export function layoutDag(
  ids: string[],
  edges: DagEdge[],
  opts?: {
    direction?: "TB" | "LR";
    nodeW?: number;
    nodeH?: number;
    gapX?: number;
    gapY?: number;
    /** Ancho/alto mínimos del lienzo (evita diagramas gigantes). */
    minW?: number;
    minH?: number;
  },
): DagLayout {
  const direction = opts?.direction ?? "TB";
  const w = opts?.nodeW ?? 150;
  const h = opts?.nodeH ?? 52;
  const gapX = opts?.gapX ?? 36;
  const gapY = opts?.gapY ?? 56;
  const minW = opts?.minW ?? 0;
  const minH = opts?.minH ?? 0;

  const known = new Set(ids);
  const clean = edges.filter((e) => known.has(e.from) && known.has(e.to));

  // Capas por Kahn: en cada nivel salen los nodos sin entrantes pendientes.
  // Si solo quedan ciclos, se avanza con el primero (ruptura estable).
  const indeg = new Map<string, number>(ids.map((id) => [id, 0]));
  for (const e of clean) {
    if (e.from !== e.to) indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1);
  }
  const depth = new Map<string, number>();
  const remaining = new Set(ids);
  let layer = 0;
  while (remaining.size > 0) {
    const ready = [...remaining].filter((id) => (indeg.get(id) ?? 0) === 0);
    const level = ready.length > 0 ? ready : [[...remaining][0] as string];
    for (const id of level) {
      depth.set(id, layer);
      remaining.delete(id);
      for (const e of clean) {
        if (e.from === id && remaining.has(e.to)) {
          indeg.set(e.to, (indeg.get(e.to) ?? 0) - 1);
        }
      }
    }
    layer++;
  }

  const layers = new Map<number, string[]>();
  for (const id of ids) {
    const l = depth.get(id) ?? 0;
    const arr = layers.get(l) ?? [];
    arr.push(id);
    layers.set(l, arr);
  }
  const maxLayer = layers.size === 0 ? 0 : Math.max(...layers.keys());

  const posIn = (layer: number, id: string) =>
    layers.get(layer)?.indexOf(id) ?? 0;

  // Orden baricentro: 2 pasadas contra vecinos de capas adyacentes.
  for (let pass = 0; pass < 2; pass++) {
    for (let l = 0; l <= maxLayer; l++) {
      const arr = layers.get(l);
      if (!arr || arr.length < 2) continue;
      const score = new Map<string, number>();
      for (const id of arr) {
        const neighbors = clean
          .filter((e) => e.from === id && (depth.get(e.to) ?? 0) === l + 1)
          .map((e) => posIn(l + 1, e.to))
          .concat(
            clean
              .filter((e) => e.to === id && (depth.get(e.from) ?? 0) === l - 1)
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
    if (direction === "TB") extraRight = Math.max(48, gapX * 1.25) + 48;
    else extraBottom = Math.max(56, gapY) + 32;
  }

  const width = Math.max(1, Math.max(minW, spanX) + extraRight);
  const height = Math.max(1, Math.max(minH, spanY) + extraBottom);

  const nodes = new Map<string, PlacedNode>();
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

  const routed: RoutedEdge[] = clean.map((e) => {
    const a = nodes.get(e.from);
    const b = nodes.get(e.to);
    if (!a || !b)
      return { from: e.from, to: e.to, d: "", mx: 0, my: 0, self: false };
    if (e.from === e.to) {
      const rx = a.w / 2 + 14;
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
      const off = Math.max(48, gapX * 1.25);
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
      const sag = Math.max(56, gapY);
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

/** Etiqueta de arista: píldora mono centrada en (mx, my). */
export function EdgeLabel({
  mx,
  my,
  text,
}: {
  mx: number;
  my: number;
  text: string;
}) {
  const w = Math.max(28, text.length * 6.5 + 12);
  return (
    <g transform={`translate(${mx},${my})`}>
      <rect
        x={-w / 2}
        y={-9}
        width={w}
        height={18}
        rx={9}
        fill="var(--background)"
        stroke="var(--border)"
        strokeWidth={1}
      />
      <text
        textAnchor="middle"
        dy={3.5}
        fontSize={10}
        fontFamily="var(--font-mono, monospace)"
        fill="var(--color-muted-foreground)"
      >
        {text}
      </text>
    </g>
  );
}

/**
 * Ancho estimado de un texto SVG (sin medir el DOM): `0.6em` por carácter
 * en monoespaciada, `0.58em` en sans. Suficiente para dimensionar nodos.
 */
export function measureText(text: string, fontSize = 11, mono = false): number {
  return text.length * fontSize * (mono ? 0.6 : 0.58);
}

/**
 * Ancho uniforme de nodo a partir del contenido (etiquetas + sub).
 * Lo calculan flow/state/ER/clase/usecase/architecture antes del layout
 * para que el diagrama se dimensione solo.
 */
export function fitNodeWidth(
  labels: string[],
  opts?: { min?: number; max?: number; size?: number; pad?: number },
): number {
  const size = opts?.size ?? 12;
  const pad = opts?.pad ?? 32;
  const widest = Math.max(0, ...labels.map((l) => measureText(l, size)));
  return Math.min(
    opts?.max ?? 240,
    Math.max(opts?.min ?? 150, Math.ceil(widest + pad)),
  );
}
