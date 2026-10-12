/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
import type { ChartMargin } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { clamp01, toNumber } from "../lib/number";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  LABEL_GAP_PX,
  NODE_BORDER_WIDTH,
  NODE_RADIUS,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Nodo de Wardley (posición x/y normalizada 0–1). */
export type WardleyNode = {
  id: string;
  label: string;
  /** 0 (génesis) – 1 (commodity). */
  x: number;
  /** 0 (base) – 1 (visible/usuario). */
  y: number;
  color?: string;
};

/** Enlace de Wardley (ids de origen y destino). */
export type WardleyEdge = {
  from: string;
  to: string;
};

/** Props del mapa de Wardley SSR (cadena de valor vs. evolución). */
export type WardleyMapProps = {
  nodes: WardleyNode[];
  edges: WardleyEdge[];
  ariaLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const W = 640;
const H = 420;
const MARGIN: ChartMargin = { top: 16, right: 16, bottom: 44, left: 16 };
const STAGES = ["Génesis", "Custom", "Producto", "Commodity"];
/** Fracciones de grid vertical, trazo punteado y geometría de etiquetas. */
const GRID_FRACTIONS = [0.25, 0.5, 0.75];
const GRID_DASHARRAY = "4 4";
const STAGE_LABEL_BOTTOM_PAD = 24;
const AXIS_LABEL_BOTTOM_PAD = 8;
const Y_LABEL_X = 12;
const NODE_LABEL_DX = 13;
const NODE_VALUE_DY = 22;
/** Máximo de truncado de etiqueta de nodo. */
const LABEL_MAX_NODE = 20;

/**
 * Cómputo puro de posiciones Wardley (normaliza con toNumber + clamp01).
 */
export function computeWardleyLayout(
  nodes: WardleyNode[],
  edges: WardleyEdge[],
): {
  points: Array<WardleyNode & { nx: number; ny: number }>;
  cleanEdges: WardleyEdge[];
  byId: Map<string, WardleyNode>;
} {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const known = new Set(nodes.map((n) => n.id));
  const cleanEdges = edges.filter((e) => known.has(e.from) && known.has(e.to));
  const points = nodes.map((n) => ({
    ...n,
    nx: clamp01(toNumber(n.x)),
    ny: clamp01(toNumber(n.y)),
  }));
  return { points, cleanEdges, byId };
}

/**
 * Mapa de Wardley SSR (cadena de valor vs. evolución).
 */
export function WardleyMap({
  nodes,
  edges,
  ariaLabel,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: WardleyMapProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { points, cleanEdges } = computeWardleyLayout(nodes, edges);
  const pointById = new Map(points.map((p) => [p.id, p]));

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = H - MARGIN.top - MARGIN.bottom;
  const px = (v: number) => MARGIN.left + clamp01(v) * innerW;
  const py = (v: number) => MARGIN.top + (1 - clamp01(v)) * innerH;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
      {GRID_FRACTIONS.map((f, i) => (
        <line
          key={stableKey([f], i)}
          x1={MARGIN.left + f * innerW}
          x2={MARGIN.left + f * innerW}
          y1={MARGIN.top}
          y2={MARGIN.top + innerH}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
          strokeDasharray={GRID_DASHARRAY}
        />
      ))}
      {STAGES.map((s, i) => (
        <text
          key={stableKey([s], i)}
          x={MARGIN.left + (i / (STAGES.length - 1)) * innerW}
          y={H - STAGE_LABEL_BOTTOM_PAD}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {s}
        </text>
      ))}
      <text
        x={MARGIN.left + innerW / 2}
        y={H - AXIS_LABEL_BOTTOM_PAD}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
      >
        Evolución →
      </text>
      <text
        x={Y_LABEL_X}
        y={MARGIN.top + innerH / 2}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fill={CHART_TOKEN.muted}
        transform={`rotate(-90, ${Y_LABEL_X}, ${MARGIN.top + innerH / 2})`}
      >
        Cadena de valor →
      </text>
      {cleanEdges.map((e, i) => {
        const a = pointById.get(e.from);
        const b = pointById.get(e.to);
        if (!a || !b) return null;
        return (
          <line
            key={stableKey([e.from, e.to], i)}
            x1={px(a.nx)}
            y1={py(a.ny)}
            x2={px(b.nx)}
            y2={py(b.ny)}
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
          />
        );
      })}
      {points.map((n, i) => {
        const color = seriesColor(i, n.color);
        const stageIdx = Math.round(n.nx * (STAGES.length - 1));
        const tip = `${n.label} (${STAGES[stageIdx] ?? ""})`;
        return (
          <g key={stableKey([n.id], i)}>
            <title>{tip}</title>
            <circle
              cx={px(n.nx)}
              cy={py(n.ny)}
              r={NODE_RADIUS}
              fill={color}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              data-chart-tip={tip}
            />
            <text
              x={px(n.nx) + NODE_LABEL_DX}
              y={py(n.ny) + LABEL_GAP_PX}
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {truncateLabel(n.label, LABEL_MAX_NODE)}
            </text>
            <text
              x={px(n.nx)}
              y={py(n.ny) + NODE_VALUE_DY}
              textAnchor="middle"
              fontSize={EDGE_LABEL_FONT_SIZE}
              fontFamily={FONT_MONO}
              fill={CHART_TOKEN.muted}
            >
              {`${formatDefault(Math.round(n.nx * PERCENT_FACTOR))}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
