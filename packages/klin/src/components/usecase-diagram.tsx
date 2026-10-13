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
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type ActorNode = {
  id: string;
  label: string;
};

export type UseCaseNode = {
  id: string;
  label: string;
};

export type UseCaseEdge = {
  from: string;
  to: string;
  /** `include` / `extend` (punteada) o asociación simple. */
  kind?: "association" | "include" | "extend";
};

const NODE_FIT = { min: 150, max: 210, size: 11, pad: 48 } as const;
const LAYOUT = {
  NODE_H: 56,
  GAP_X: 72,
  GAP_Y: 36,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
const ACTOR_STROKE = 1.75;
const ACTOR_HEAD_R = 7;
const ACTOR_HEAD_DY = 9;
const ACTOR_NECK_DY = 16;
const ACTOR_TORSO_DY = 34;
const ACTOR_ARM_DY = 22;
const ACTOR_ARM_HALF = 10;
const ACTOR_LEG_DY = 48;
const ACTOR_LEG_HALF = 9;
const ACTOR_LABEL_DY = -2;
const USECASE_LABEL_DY = 4;
const EDGE_TAG_DY = -4;
const DASH_RELATION = "5 4";
/** Marco del sistema: relleno, radio, guion y posición de la etiqueta. */
const USECASE_BOUNDARY_PAD = 20;
const USECASE_BOUNDARY_RX = 10;
const USECASE_BOUNDARY_DASH = "6 4";
const USECASE_BOUNDARY_LABEL_X = 12;
const USECASE_BOUNDARY_LABEL_DY = 18;

/** Props del diagrama de casos de uso. */
export type UseCaseDiagramProps = {
  actors: ActorNode[];
  usecases: UseCaseNode[];
  edges: UseCaseEdge[];
  ariaLabel: string;
  /** Título del rectángulo de sistema que enmarca los casos de uso. */
  boundary?: string;
  /** Muestra las etiquetas de estereotipo (`«include»`/`«extend»`). */
  showStereotypes?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/**
 * Cómputo puro del layout de casos de uso (DAG LR con cap SSR).
 */
export function computeUseCaseLayout(
  actors: ActorNode[],
  usecases: UseCaseNode[],
  edges: UseCaseEdge[],
): {
  layout: DagLayout;
  actorIds: Set<string>;
  names: Map<string, string>;
  width: number;
  height: number;
} {
  const W = fitNodeWidth(
    [...actors.map((a) => a.label), ...usecases.map((u) => u.label)],
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const H = LAYOUT.NODE_H;
  const all = [...actors.map((a) => a.id), ...usecases.map((u) => u.id)];
  const layout = layoutDag(all, edges, {
    direction: "LR",
    nodeW: W,
    nodeH: H,
    gapX: LAYOUT.GAP_X,
    gapY: LAYOUT.GAP_Y,
    minW: LAYOUT.MIN_W,
    maxNodes: LAYOUT.MAX_NODES,
  });
  return {
    layout,
    actorIds: new Set(actors.map((a) => a.id)),
    names: new Map([
      ...actors.map((a) => [a.id, a.label] as const),
      ...usecases.map((u) => [u.id, u.label] as const),
    ]),
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}

/**
 * Casos de uso UML SSR (actores + elipses + include/extend).
 */
export function UseCaseDiagram({
  actors,
  usecases,
  edges,
  ariaLabel,
  boundary,
  showStereotypes = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: UseCaseDiagramProps) {
  if (actors.length === 0 && usecases.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, actorIds, names, width, height } = computeUseCaseLayout(
    actors,
    usecases,
    edges,
  );
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );
  const caseBoxes = [...layout.nodes.values()].filter(
    (p) => !actorIds.has(p.id),
  );
  const frame =
    boundary && caseBoxes.length > 0
      ? {
          x: Math.min(...caseBoxes.map((p) => p.x)) - USECASE_BOUNDARY_PAD,
          y: Math.min(...caseBoxes.map((p) => p.y)) - USECASE_BOUNDARY_PAD,
          w:
            Math.max(...caseBoxes.map((p) => p.x + p.w)) -
            Math.min(...caseBoxes.map((p) => p.x)) +
            USECASE_BOUNDARY_PAD * 2,
          h:
            Math.max(...caseBoxes.map((p) => p.y + p.h)) -
            Math.min(...caseBoxes.map((p) => p.y)) +
            USECASE_BOUNDARY_PAD * 2,
        }
      : null;

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
        {frame ? (
          <g>
            <rect
              x={frame.x}
              y={frame.y}
              width={frame.w}
              height={frame.h}
              rx={USECASE_BOUNDARY_RX}
              fill="none"
              stroke={CHART_TOKEN.border}
              strokeWidth={EDGE_WIDTH}
              strokeDasharray={USECASE_BOUNDARY_DASH}
            />
            <text
              x={frame.x + USECASE_BOUNDARY_LABEL_X}
              y={frame.y + USECASE_BOUNDARY_LABEL_DY}
              fontSize={TICK_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.muted}
            >
              {truncateLabel(boundary ?? "", 28)}
            </text>
          </g>
        ) : null}
        {layout.edges.map((e, i) => {
          const edge = edgeByKey.get(`${e.from}→${e.to}`);
          const dashed = edge?.kind === "include" || edge?.kind === "extend";
          return (
            <line
              key={stableKey([e.from, e.to], i)}
              x1={layout.nodes.get(e.from)?.cx ?? 0}
              y1={layout.nodes.get(e.from)?.cy ?? 0}
              x2={layout.nodes.get(e.to)?.cx ?? 0}
              y2={layout.nodes.get(e.to)?.cy ?? 0}
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              strokeDasharray={dashed ? DASH_RELATION : undefined}
            />
          );
        })}
        {[...layout.nodes.values()].map((p, i) => {
          const label = names.get(p.id) ?? p.id;
          const tip = label;
          if (actorIds.has(p.id)) {
            return (
              <g key={stableKey([p.id], i)}>
                <title>{tip}</title>
                <g
                  stroke={CHART_TOKEN.foreground}
                  strokeWidth={ACTOR_STROKE}
                  fill="none"
                  data-chart-tip={tip}
                >
                  <circle cx={p.cx} cy={p.y + ACTOR_HEAD_DY} r={ACTOR_HEAD_R} />
                  <line
                    x1={p.cx}
                    y1={p.y + ACTOR_NECK_DY}
                    x2={p.cx}
                    y2={p.y + ACTOR_TORSO_DY}
                  />
                  <line
                    x1={p.cx - ACTOR_ARM_HALF}
                    y1={p.y + ACTOR_ARM_DY}
                    x2={p.cx + ACTOR_ARM_HALF}
                    y2={p.y + ACTOR_ARM_DY}
                  />
                  <line
                    x1={p.cx}
                    y1={p.y + ACTOR_TORSO_DY}
                    x2={p.cx - ACTOR_LEG_HALF}
                    y2={p.y + ACTOR_LEG_DY}
                  />
                  <line
                    x1={p.cx}
                    y1={p.y + ACTOR_TORSO_DY}
                    x2={p.cx + ACTOR_LEG_HALF}
                    y2={p.y + ACTOR_LEG_DY}
                  />
                </g>
                <text
                  x={p.cx}
                  y={p.y + p.h + ACTOR_LABEL_DY}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(label, 20)}
                </text>
              </g>
            );
          }
          return (
            <g key={stableKey([p.id], i)}>
              <title>{tip}</title>
              <ellipse
                cx={p.cx}
                cy={p.cy}
                rx={p.w / 2}
                ry={p.h / 2}
                fill={CHART_TOKEN.card}
                stroke={CHART_TOKEN.accent}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              <text
                x={p.cx}
                y={p.cy}
                dy={USECASE_LABEL_DY}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(label, 22)}
              </text>
            </g>
          );
        })}
        {layout.edges.map((e, i) => {
          const edge = edgeByKey.get(`${e.from}→${e.to}`);
          const tag =
            showStereotypes &&
            (edge?.kind === "include" || edge?.kind === "extend")
              ? `«${edge.kind}»`
              : null;
          return tag ? (
            <EdgeLabel
              key={stableKey([e.from, e.to, tag], i)}
              mx={e.mx}
              my={e.my + EDGE_TAG_DY}
              text={tag}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
