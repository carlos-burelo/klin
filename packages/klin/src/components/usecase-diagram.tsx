/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  ACTOR_ARM_DY,
  ACTOR_ARM_HALF,
  ACTOR_HEAD_DY,
  ACTOR_HEAD_R,
  ACTOR_LABEL_DY,
  ACTOR_LEG_DY,
  ACTOR_LEG_HALF,
  ACTOR_NECK_DY,
  ACTOR_STROKE,
  ACTOR_TORSO_DY,
  computeUseCaseLayout,
  DASH_RELATION,
  EDGE_TAG_DY,
  USECASE_BOUNDARY_DASH,
  USECASE_BOUNDARY_LABEL_DY,
  USECASE_BOUNDARY_LABEL_X,
  USECASE_BOUNDARY_PAD,
  USECASE_BOUNDARY_RX,
  USECASE_LABEL_DY,
} from "./usecase-diagram.compute";
import type { UseCaseDiagramProps } from "./usecase-diagram.types";

export { computeUseCaseLayout } from "./usecase-diagram.compute";
export type {
  ActorNode,
  UseCaseDiagramProps,
  UseCaseEdge,
  UseCaseNode,
} from "./usecase-diagram.types";

/**
 * Casos de uso UML SSR (actores + elipses + include/extend).
 */
export function UseCaseDiagram({
  actors,
  usecases,
  edges,
  ariaLabel,
  direction = "LR",
  boundary,
  showStereotypes = true,
  showLegend = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: UseCaseDiagramProps) {
  if (isBlank(actors) && isBlank(usecases)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, actorIds, names, width, height } = computeUseCaseLayout(
    actors,
    usecases,
    edges,
    direction,
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
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Asociación", color: CHART_TOKEN.muted },
            { label: "«include»", color: CHART_TOKEN.muted },
            { label: "«extend»", color: CHART_TOKEN.muted },
          ]}
        />
      ) : null}
    </div>
  );
}
