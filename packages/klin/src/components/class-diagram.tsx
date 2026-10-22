/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  ATTR_DY,
  ATTR_X,
  CLASS_MEMBER_LIMIT,
  classMemberView,
  computeClassLayout,
  DASH_DEPENDENCY,
  DIVIDER_PAD,
  METHOD_DY,
  MIN_NODE_H,
  NODE_FONT_SIZE,
  NODE_RX_PROCESS,
  ROW,
  TITLE_DY,
  TITLE_H,
} from "./class-diagram.compute";
import type {
  ClassDiagramProps,
  ClassEdge,
  ClassMemberOptions,
} from "./class-diagram.types";

export { computeClassLayout } from "./class-diagram.compute";
export type {
  ClassDiagramProps,
  ClassEdge,
  ClassNode,
} from "./class-diagram.types";

/**
 * Diagrama de clases UML SSR (herencia, asociación, composición, dependencia).
 */
export function ClassDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  showMethods = true,
  showAttributes = true,
  visibility = "all",
  memberLimit = CLASS_MEMBER_LIMIT,
  showLegend = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ClassDiagramProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const opts: ClassMemberOptions = {
    showMethods,
    showAttributes,
    visibility,
    memberLimit,
  };
  const { layout, byId, heights, width, height } = computeClassLayout(
    nodes,
    edges,
    direction,
    opts,
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

  const markerFor = (kind: ClassEdge["kind"]) =>
    kind === "inheritance"
      ? markerUrl("charts-class", "inherit")
      : kind === "composition"
        ? markerUrl("charts-class", "composite")
        : markerUrl("charts-class", "chevron");

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
        <SvgMarkers
          prefix="charts-class"
          kinds={["chevron", "inherit", "composite"]}
        />
        {layout.edges.map((e, i) => {
          const edge = edgeByKey.get(`${e.from}→${e.to}`);
          const kind = edge?.kind ?? "association";
          return (
            <path
              key={stableKey([e.from, e.to], i)}
              d={e.d}
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              strokeDasharray={
                kind === "dependency" ? DASH_DEPENDENCY : undefined
              }
              markerEnd={markerFor(kind)}
            />
          );
        })}
        {[...layout.nodes.values()].map((p, pi) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const h = heights.get(p.id) ?? H;
          const y0 = p.cy - h / 2;
          const view = classMemberView(n, opts);
          const attrs = view.attributes;
          const methods = view.methods;
          return (
            <g key={stableKey([p.id], pi)}>
              <rect
                x={p.x}
                y={y0}
                width={p.w}
                height={h}
                rx={NODE_RX_PROCESS}
                fill={CHART_TOKEN.card}
                stroke={CHART_TOKEN.border}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={n.name}
              />
              <line
                x1={p.x}
                y1={y0 + TITLE_H}
                x2={p.x + p.w}
                y2={y0 + TITLE_H}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              {methods.length > 0 ? (
                <line
                  x1={p.x}
                  y1={y0 + TITLE_H + attrs.length * ROW + DIVIDER_PAD}
                  x2={p.x + p.w}
                  y2={y0 + TITLE_H + attrs.length * ROW + DIVIDER_PAD}
                  stroke={CHART_TOKEN.border}
                  strokeWidth={GRID_WIDTH}
                />
              ) : null}
              <text
                x={p.cx}
                y={y0 + TITLE_DY}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.name, 22)}
              </text>
              {attrs.map((a, ai) => (
                <text
                  key={stableKey([`a-${a}`], ai)}
                  x={p.x + ATTR_X}
                  y={y0 + TITLE_H + ATTR_DY + ai * ROW}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(a, 24)}
                </text>
              ))}
              {methods.map((m, mi) => (
                <text
                  key={stableKey([`m-${m}`], mi)}
                  x={p.x + ATTR_X}
                  y={y0 + TITLE_H + attrs.length * ROW + METHOD_DY + mi * ROW}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(m, 24)}
                </text>
              ))}
              {view.hidden > 0 ? (
                <text
                  x={p.x + ATTR_X}
                  y={
                    y0 +
                    TITLE_H +
                    (attrs.length + methods.length) * ROW +
                    METHOD_DY
                  }
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {`+${view.hidden} más`}
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
          items={[
            "inheritance",
            "association",
            "composition",
            "dependency",
          ].map((k) => ({
            label: k,
            color: CHART_TOKEN.muted,
          }))}
        />
      ) : null}
    </div>
  );
}
