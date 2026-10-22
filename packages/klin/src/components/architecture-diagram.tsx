/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
} from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  ACTOR_AVATAR_R,
  ACTOR_AVATAR_X,
  ACTOR_TEXT_X,
  ARCH_BADGE_DY,
  ARCH_BADGE_PAD_X,
  ARCH_KIND_BADGE,
  computeArchitectureLayout,
  DASH_EXTERNAL,
  DB_BOTTOM_PAD,
  DB_CAP_DY,
  DB_CAP_RY,
  LABEL_DY,
  LABEL_DY_WITH_SUB,
  LAYOUT,
  NODE_FONT_SIZE,
  NODE_RX_PROCESS,
  SUB_DY,
} from "./architecture-diagram.compute";
import type {
  ArchitectureDiagramProps,
  ArchNode,
} from "./architecture-diagram.types";

export { computeArchitectureLayout } from "./architecture-diagram.compute";
export type {
  ArchEdge,
  ArchitectureDiagramProps,
  ArchNode,
} from "./architecture-diagram.types";

/**
 * Arquitectura SSR (servicios, bases, colas, actores, externos).
 */
export function ArchitectureDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  statusColors,
  showBadges = true,
  compact = false,
  showLegend = false,
  maxItems = LAYOUT.MAX_NODES,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ArchitectureDiagramProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, width, height } = computeArchitectureLayout(
    nodes,
    edges,
    direction,
    compact,
    maxItems,
  );
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

  const strokeFor = (kind: ArchNode["kind"]) =>
    (kind && statusColors?.[kind]) ??
    (kind === "external"
      ? CHART_TOKEN.muted
      : kind === "database"
        ? CHART_TOKEN.chart3
        : kind === "queue"
          ? CHART_TOKEN.chart4
          : CHART_TOKEN.chart1);

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
        <SvgMarkers prefix="charts-arch" kinds={["arrow"]} />
        {layout.edges.map((e, i) => (
          <path
            key={stableKey([e.from, e.to], i)}
            d={e.d}
            fill="none"
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
            markerEnd={markerUrl("charts-arch", "arrow")}
          />
        ))}
        {[...layout.nodes.values()].map((p, i) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const kind = n.kind ?? "service";
          const tip = n.sub ? `${n.label} · ${n.sub}` : n.label;
          const stroke = strokeFor(kind);
          const dashed = kind === "external" ? DASH_EXTERNAL : undefined;
          return (
            <g key={stableKey([p.id], i)}>
              {kind === "database" ? (
                <g data-chart-tip={tip}>
                  <path
                    d={`M ${p.x} ${p.y + DB_CAP_DY} A ${p.w / 2} ${DB_CAP_RY} 0 0 1 ${p.x + p.w} ${p.y + DB_CAP_DY} L ${p.x + p.w} ${p.y + p.h - DB_BOTTOM_PAD} A ${p.w / 2} ${DB_CAP_RY} 0 0 1 ${p.x} ${p.y + p.h - DB_BOTTOM_PAD} Z`}
                    fill={CHART_TOKEN.card}
                    stroke={stroke}
                    strokeWidth={EDGE_WIDTH}
                  />
                  <ellipse
                    cx={p.cx}
                    cy={p.y + DB_CAP_DY}
                    rx={p.w / 2}
                    ry={DB_CAP_RY}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={EDGE_WIDTH}
                  />
                </g>
              ) : kind === "actor" ? (
                <g data-chart-tip={tip}>
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    rx={p.h / 2}
                    fill={CHART_TOKEN.card}
                    stroke={stroke}
                    strokeWidth={EDGE_WIDTH}
                    strokeDasharray={dashed}
                  />
                  <circle
                    cx={p.x + ACTOR_AVATAR_X}
                    cy={p.cy}
                    r={ACTOR_AVATAR_R}
                    fill={stroke}
                  />
                </g>
              ) : (
                <rect
                  x={p.x}
                  y={p.y}
                  width={p.w}
                  height={p.h}
                  rx={NODE_RX_PROCESS}
                  fill={CHART_TOKEN.card}
                  stroke={stroke}
                  strokeWidth={EDGE_WIDTH}
                  strokeDasharray={dashed}
                  data-chart-tip={tip}
                />
              )}
              <text
                x={kind === "actor" ? p.x + ACTOR_TEXT_X : p.cx}
                y={p.cy + (n.sub ? LABEL_DY_WITH_SUB : LABEL_DY)}
                textAnchor={kind === "actor" ? "start" : "middle"}
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.label, kind === "actor" ? 16 : 20)}
              </text>
              {n.sub ? (
                <text
                  x={kind === "actor" ? p.x + ACTOR_TEXT_X : p.cx}
                  y={p.cy + SUB_DY}
                  textAnchor={kind === "actor" ? "start" : "middle"}
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(n.sub, kind === "actor" ? 18 : 24)}
                </text>
              ) : null}
              {showBadges ? (
                <text
                  x={p.x + p.w - ARCH_BADGE_PAD_X}
                  y={p.y + ARCH_BADGE_DY}
                  textAnchor="end"
                  fontSize={EDGE_LABEL_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {ARCH_KIND_BADGE[kind]}
                </text>
              ) : null}
            </g>
          );
        })}
        {layout.edges.map((e, i) => {
          const edge = edgeByKey.get(`${e.from}→${e.to}`);
          return edge?.label ? (
            <EdgeLabel
              key={stableKey([e.from, e.to, edge.label], i)}
              mx={e.mx}
              my={e.my}
              text={edge.label}
            />
          ) : null;
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={(
            ["service", "database", "queue", "actor", "external"] as const
          ).map((k) => ({
            label: ARCH_KIND_BADGE[k],
            color: strokeFor(k),
          }))}
        />
      ) : null}
    </div>
  );
}
