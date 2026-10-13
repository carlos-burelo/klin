/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import type { DagLayout } from "../lib/graph";
import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { stableKey } from "../lib/keys";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_REGULAR,
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
  /** Entidad débil (doble borde cuando `showWeak` está activo). */
  weak?: boolean;
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
/** Sangría del borde interior de entidad débil. */
const ER_WEAK_INSET = 4;
/** Pata de gallo: largo de púa, apertura y separación del borde. */
const ER_CROWFOOT_LEN = 12;
const ER_CROWFOOT_SPREAD = 6;
const ER_CROWFOOT_GAP = 6;
/** Truncado de la etiqueta de entidad. */
const ER_LABEL_MAX = 22;

/** Indica si el lado destino de una cardinalidad (`1:N`) es múltiple. */
function isManySide(label: string | undefined): boolean {
  if (!label) return false;
  const side = label.split(":")[1]?.trim().toUpperCase();
  return side === "N" || side === "M" || side === "*";
}

/** Props del diagrama entidad-relación. */
export type ErDiagramProps = {
  entities: ErEntity[];
  relations: ErRelation[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra las insignias de clave (`PK`/`FK`) en los atributos. */
  showKeys?: boolean;
  /** Dibuja pata de gallo en el extremo múltiple (`N`/`M`) de cada relación. */
  crowFoot?: boolean;
  /** Resalta con doble borde las entidades débiles (`weak`). */
  showWeak?: boolean;
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
  showKeys = true,
  crowFoot = true,
  showWeak = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ErDiagramProps) {
  if (isBlank(entities)) {
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
        {crowFoot
          ? layout.edges.map((e, i) => {
              const rel = relByKey.get(`${e.from}→${e.to}`);
              if (!rel || !isManySide(rel.label) || e.from === e.to) {
                return null;
              }
              const a = layout.nodes.get(e.from);
              const b = layout.nodes.get(e.to);
              if (!a || !b) return null;
              const dx = b.cx - a.cx;
              const dy = b.cy - a.cy;
              let px: number;
              let py: number;
              let ux: number;
              let uy: number;
              let qx: number;
              let qy: number;
              if (Math.abs(dx) >= Math.abs(dy)) {
                const s = dx >= 0 ? 1 : -1;
                px =
                  s > 0 ? b.x - ER_CROWFOOT_GAP : b.x + b.w + ER_CROWFOOT_GAP;
                py = b.cy;
                ux = s;
                uy = 0;
                qx = 0;
                qy = 1;
              } else {
                const s = dy >= 0 ? 1 : -1;
                px = b.cx;
                py =
                  s > 0 ? b.y - ER_CROWFOOT_GAP : b.y + b.h + ER_CROWFOOT_GAP;
                ux = 0;
                uy = s;
                qx = 1;
                qy = 0;
              }
              const toes = [-ER_CROWFOOT_SPREAD, 0, ER_CROWFOOT_SPREAD].map(
                (o) => ({
                  x: px - ux * ER_CROWFOOT_LEN + qx * o,
                  y: py - uy * ER_CROWFOOT_LEN + qy * o,
                }),
              );
              return (
                <g
                  key={stableKey([e.from, e.to, "pata"], i)}
                  stroke={CHART_TOKEN.muted}
                  strokeWidth={EDGE_WIDTH}
                >
                  {toes.map((t, ti) => (
                    <line
                      key={stableKey([t.x, t.y], ti)}
                      x1={px}
                      y1={py}
                      x2={t.x}
                      y2={t.y}
                    />
                  ))}
                </g>
              );
            })
          : null}
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
              {showWeak && entity.weak ? (
                <rect
                  x={p.x + ER_WEAK_INSET}
                  y={y0 + ER_WEAK_INSET}
                  width={p.w - ER_WEAK_INSET * 2}
                  height={h - ER_WEAK_INSET * 2}
                  rx={NODE_RX_PROCESS}
                  fill="none"
                  stroke={CHART_TOKEN.border}
                  strokeWidth={EDGE_WIDTH}
                />
              ) : null}
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
                {truncateLabel(entity.name, ER_LABEL_MAX)}
              </text>
              {entity.attributes.map((a, i) => (
                <text
                  key={stableKey([a.name, a.key ?? ""], i)}
                  x={p.x + ATTR_X}
                  y={y0 + HEADER + ATTR_DY + i * ROW}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fontWeight={
                    showKeys && a.key === "PK" ? FONT_SEMIBOLD : FONT_REGULAR
                  }
                  textDecoration={
                    showKeys && a.key === "PK" ? "underline" : "none"
                  }
                  fill={CHART_TOKEN.muted}
                >
                  {showKeys && a.key
                    ? `${a.key} ${truncateLabel(a.name, 24)}`
                    : truncateLabel(a.name, 24)}
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
