/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_LINKS, DEFAULT_MAX_NODES } from "../lib/limits";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_WIDTH,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type ArcNode = {
  id: string;
  label: string;
  color?: string;
};

export type ArcEdge = {
  from: string;
  to: string;
  label?: string;
};

/** Props del diagrama de arcos. */
export type ArcDiagramProps = {
  nodes: ArcNode[];
  edges: ArcEdge[];
  ariaLabel: string;
  /** Tamaño del nodo: fijo (`auto`) o por grado de conexión (`degree`). */
  nodeSize?: "auto" | "degree";
  /** Orden de los nodos sobre el eje: por grado, alfabético o de entrada. */
  sortBy?: "degree" | "label" | "order";
  /** Qué etiquetas de nodo mostrar (`ends` solo pinta la primera y la última). */
  showLabels?: "all" | "ends" | "none";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const ARC_W = 680;
const BASE_Y = 120;
const R = 7;
const MAX_STEP = 150;
const AXIS_PAD_X = 48;
const VIEW_PAD_BOTTOM = 48;
const LABEL_DY = 22;
const ARC_MIN_H = 24;
const ARC_JITTER = 37;
const ARC_SPREAD = 90;
const MAX_GROWTH = 5;
const ARC_OPACITY = 0.8;

/** Caps SSR (alias de los límites centrales, compat). */
export const MAX_ARC_NODES = DEFAULT_MAX_NODES;
export const MAX_ARC_LINKS = DEFAULT_MAX_LINKS;

/**
 * Cómputo puro del layout de arcos (eje de nodos + grado + orden).
 * Trunca determinista para SSR.
 */
export function computeArcLayout(
  nodes: ArcNode[],
  edges: ArcEdge[],
  sortBy: "degree" | "label" | "order" = "degree",
) {
  const base = nodes.slice(0, MAX_ARC_NODES);
  const known = new Set(base.map((n) => n.id));
  const clean = edges
    .filter((e) => known.has(e.from) && known.has(e.to))
    .slice(0, MAX_ARC_LINKS);
  const degree = new Map<string, number>(base.map((n) => [n.id, 0]));
  for (const e of clean) {
    degree.set(e.from, (degree.get(e.from) ?? 0) + 1);
    degree.set(e.to, (degree.get(e.to) ?? 0) + 1);
  }
  const baseIndex = new Map(base.map((n, i) => [n.id, i]));
  const cappedNodes = [...base].sort((a, b) => {
    if (sortBy === "label") {
      if (a.label !== b.label) return a.label < b.label ? -1 : 1;
    } else if (sortBy === "degree") {
      const diff = (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0);
      if (diff !== 0) return diff;
    }
    return (baseIndex.get(a.id) ?? 0) - (baseIndex.get(b.id) ?? 0);
  });
  const step = Math.min(
    MAX_STEP,
    (ARC_W - AXIS_PAD_X) / Math.max(1, cappedNodes.length),
  );
  const totalW = step * Math.max(0, cappedNodes.length - 1);
  const ox = (ARC_W - totalW) / 2;
  const H = BASE_Y + VIEW_PAD_BOTTOM;
  const order = new Map(cappedNodes.map((n, i) => [n.id, i]));
  return { cappedNodes, clean, step, totalW, ox, H, degree, order };
}

/**
 * Diagrama de arcos SSR (relaciones sobre un eje de nodos).
 */
export function ArcDiagram({
  nodes,
  edges,
  ariaLabel,
  nodeSize = "degree",
  sortBy = "degree",
  showLabels = "all",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ArcDiagramProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { cappedNodes, clean, step, ox, H, degree, order } = computeArcLayout(
    nodes,
    edges,
    sortBy,
  );
  const xOf = (id: string) => ox + (order.get(id) ?? 0) * step;

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${ARC_W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(ARC_W, DIAGRAM_MIN_SCROLL) }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
        {clean.map((e, i) => {
          const a = xOf(e.from);
          const b = xOf(e.to);
          const left = Math.min(a, b);
          const right = Math.max(a, b);
          const h = ARC_MIN_H + ((i * ARC_JITTER) % ARC_SPREAD);
          const tip = e.label
            ? `${e.from} ↔ ${e.to}: ${e.label}`
            : `${e.from} ↔ ${e.to}`;
          return (
            <g key={stableKey([e.from, e.to], i)}>
              <title>{tip}</title>
              <path
                d={`M ${left} ${BASE_Y} C ${left} ${BASE_Y - h}, ${right} ${BASE_Y - h}, ${right} ${BASE_Y}`}
                fill="none"
                stroke={CHART_TOKEN.accent}
                strokeWidth={EDGE_WIDTH}
                strokeOpacity={ARC_OPACITY}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
        {cappedNodes.map((n, i) => {
          const deg = degree.get(n.id) ?? 0;
          const color = seriesColor(i, n.color);
          const tip = `${n.label} (${deg} relaciones)`;
          const showLabel =
            showLabels === "all" ||
            (showLabels === "ends" &&
              (i === 0 || i === cappedNodes.length - 1));
          return (
            <g key={stableKey([n.id], i)}>
              <title>{tip}</title>
              <circle
                cx={xOf(n.id)}
                cy={BASE_Y}
                r={nodeSize === "degree" ? R + Math.min(MAX_GROWTH, deg) : R}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={NODE_BORDER_WIDTH}
                data-chart-tip={tip}
              />
              {showLabel ? (
                <text
                  x={xOf(n.id)}
                  y={BASE_Y + LABEL_DY}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(n.label, 14)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
