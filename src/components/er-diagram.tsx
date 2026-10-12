/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
import type { DagLayout } from "../lib/graph";
import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { stableKey } from "../lib/keys";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type ErAttribute = {
  name: string;
  key?: "PK" | "FK";
};

export type ErEntity = {
  id: string;
  name: string;
  attributes: ErAttribute[];
};

export type ErRelation = {
  from: string;
  to: string;
  /** Cardinalidad (`1:N`, `N:M`, `1:1`). */
  label?: string;
};

const NODE_FONT_SIZE = 12;
const NODE_RX_PROCESS = 8;
const HEADER = 30;
const ROW = 22;
const BODY_PAD = 6;
const MIN_NODE_H = 60;
const NODE_FIT = { min: 170, max: 280, size: 11, pad: 40 } as const;
const LAYOUT = {
  GAP_X: 60,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
const TITLE_DY = 20;
const ATTR_X = 10;
const ATTR_DY = 16;

/** Props del diagrama entidad-relación. */
export type ErDiagramProps = {
  entities: ErEntity[];
  relations: ErRelation[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/**
 * Cómputo puro del layout ER (alturas por atributo + DAG con cap SSR).
 */
export function computeErLayout(
  entities: ErEntity[],
  relations: ErRelation[],
  direction: "TB" | "LR" = "LR",
): {
  layout: DagLayout;
  byId: Map<string, ErEntity>;
  heights: Map<string, number>;
  width: number;
  height: number;
} {
  const heights = new Map(
    entities.map((e) => [e.id, HEADER + e.attributes.length * ROW + BODY_PAD]),
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const W = fitNodeWidth(
    entities.flatMap((e) => [
      e.name,
      ...e.attributes.map((a) => `${a.key ? `${a.key} ` : ""}${a.name}`),
    ]),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const layout = layoutDag(
    entities.map((e) => e.id),
    relations,
    {
      direction,
      nodeW: W,
      nodeH: H,
      gapX: LAYOUT.GAP_X,
      gapY: LAYOUT.GAP_Y,
      minW: LAYOUT.MIN_W,
      maxNodes: LAYOUT.MAX_NODES,
    },
  );
  return {
    layout,
    byId: new Map(entities.map((e) => [e.id, e])),
    heights,
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}

/**
 * Entidad-relación SSR (entidades con atributos + cardinalidades).
 */
export function ErDiagram({
  entities,
  relations,
  ariaLabel,
  direction = "LR",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ErDiagramProps) {
  if (entities.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, heights, width, height } = computeErLayout(
    entities,
    relations,
    direction,
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const relByKey = new Map(
    relations.map((r) => [`${r.from}→${r.to}`, r] as const),
  );

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        style={{ minWidth: width }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
        {layout.edges.map((e, i) => (
          <path
            key={stableKey([e.from, e.to], i)}
            d={e.d}
            fill="none"
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
          />
        ))}
        {[...layout.nodes.values()].map((p, pi) => {
          const entity = byId.get(p.id);
          if (!entity) return null;
          const h = heights.get(p.id) ?? H;
          const y0 = p.cy - h / 2;
          const tip = `${entity.name} (${entity.attributes.length} atributos)`;
          return (
            <g key={stableKey([p.id], pi)}>
              <title>{tip}</title>
              <rect
                x={p.x}
                y={y0}
                width={p.w}
                height={h}
                rx={NODE_RX_PROCESS}
                fill={CHART_TOKEN.card}
                stroke={CHART_TOKEN.border}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              <line
                x1={p.x}
                y1={y0 + HEADER}
                x2={p.x + p.w}
                y2={y0 + HEADER}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={p.cx}
                y={y0 + TITLE_DY}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(entity.name, 22)}
              </text>
              {entity.attributes.map((a, i) => (
                <text
                  key={stableKey([a.name, a.key ?? ""], i)}
                  x={p.x + ATTR_X}
                  y={y0 + HEADER + ATTR_DY + i * ROW}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fontWeight={a.key === "PK" ? FONT_SEMIBOLD : 400}
                  textDecoration={a.key === "PK" ? "underline" : "none"}
                  fill={CHART_TOKEN.muted}
                >
                  {`${a.key ? `${a.key} ` : ""}${truncateLabel(a.name, 24)}`}
                </text>
              ))}
            </g>
          );
        })}
        {layout.edges.map((e, i) => {
          const rel = relByKey.get(`${e.from}→${e.to}`);
          return rel?.label ? (
            <EdgeLabel
              key={stableKey([e.from, e.to, rel.label], i)}
              mx={e.mx}
              my={e.my}
              text={rel.label}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
