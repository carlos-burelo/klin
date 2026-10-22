/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { formatDefault } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_LABEL_FONT_SIZE,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  LABEL_GAP_PX,
  NODE_BORDER_WIDTH,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  AXIS_LABEL_BOTTOM_PAD,
  buildWardleyDegrees,
  computeWardleyLayout,
  DEFAULT_WARDLEY_NODE_SIZE,
  DEFAULT_WARDLEY_SHOW_GRID_LABELS,
  DEFAULT_WARDLEY_STAGES,
  GRID_DASHARRAY,
  GRID_FRACTIONS,
  H,
  LABEL_MAX_NODE,
  MARGIN,
  NODE_LABEL_DX,
  NODE_VALUE_DY,
  STAGE_LABEL_BOTTOM_PAD,
  W,
  wardleyInner,
  wardleyNodeRadius,
  wardleyPx,
  wardleyPy,
  wardleyStageIndex,
  Y_LABEL_X,
} from "./wardley-map.compute";
import type { WardleyMapProps } from "./wardley-map.types";

export { computeWardleyLayout } from "./wardley-map.compute";
export type {
  WardleyEdge,
  WardleyMapProps,
  WardleyNode,
} from "./wardley-map.types";

/**
 * Mapa de Wardley SSR (cadena de valor vs. evolución).
 */
export function WardleyMap({
  nodes,
  edges,
  ariaLabel,
  showGridLabels = DEFAULT_WARDLEY_SHOW_GRID_LABELS,
  stages = DEFAULT_WARDLEY_STAGES,
  nodeSize = DEFAULT_WARDLEY_NODE_SIZE,
  locale = DEFAULT_LOCALE,
  xAxisLabel = "Evolución →",
  yAxisLabel = "Cadena de valor →",
  format,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: WardleyMapProps) {
  if (isBlank(nodes)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { points, cleanEdges } = computeWardleyLayout(nodes, edges);
  const pointById = new Map(points.map((p) => [p.id, p]));
  const stageLabels = stages;

  const { innerW, innerH } = wardleyInner();
  const px = (v: number) => wardleyPx(v, innerW);
  const py = (v: number) => wardleyPy(v, innerH);
  const degreeById = buildWardleyDegrees(cleanEdges, nodeSize);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className ? `h-auto w-full ${className}` : "h-auto w-full"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
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
      {showGridLabels
        ? stageLabels.map((s, i) => (
            <text
              key={stableKey([s], i)}
              x={MARGIN.left + (i / (stageLabels.length - 1)) * innerW}
              y={H - STAGE_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {s}
            </text>
          ))
        : null}
      {showGridLabels ? (
        <text
          x={MARGIN.left + innerW / 2}
          y={H - AXIS_LABEL_BOTTOM_PAD}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {xAxisLabel}
        </text>
      ) : null}
      {showGridLabels ? (
        <text
          x={Y_LABEL_X}
          y={MARGIN.top + innerH / 2}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
          transform={`rotate(-90, ${Y_LABEL_X}, ${MARGIN.top + innerH / 2})`}
        >
          {yAxisLabel}
        </text>
      ) : null}
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
        const stageIdx = wardleyStageIndex(n.nx, stageLabels.length);
        const tip = `${n.label} (${stageLabels[stageIdx] ?? ""})`;
        const r = wardleyNodeRadius(nodeSize, degreeById, n.id);
        return (
          <g key={stableKey([n.id], i)}>
            <circle
              cx={px(n.nx)}
              cy={py(n.ny)}
              r={r}
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
              {`${(format ?? ((v: number) => formatDefault(v, locale)))(Math.round(n.nx * PERCENT_FACTOR))}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
