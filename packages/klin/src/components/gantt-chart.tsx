/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_WIDTH,
  GRID_WIDTH,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import type { ChartMargin } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { markerUrl, SvgMarkers } from "../render/markers";
import {
  AXIS_LABEL_BOTTOM_PAD,
  buildGanttScale,
  buildGanttTip,
  DEFAULT_LABEL_WIDTH,
  ganttProgressWidth,
  ganttTaskGeometry,
  LABEL_MAX_TASK,
  ROW_H,
  resolveGanttHeight,
  resolveGanttMargin,
  resolveGanttRows,
  resolveGanttToday,
  sortGanttTasks,
  W,
} from "./gantt-chart.compute";
import type { GanttChartProps } from "./gantt-chart.types";

export { sortGanttTasks } from "./gantt-chart.compute";
export type { GanttChartProps, GanttTask } from "./gantt-chart.types";

/**
 * Gantt SSR (tareas en el tiempo, con % de avance opcional).
 * Fechas `YYYY-MM-DD` o `Date`.
 */
export function GanttChart({
  tasks,
  ariaLabel,
  showProgress = true,
  today,
  rowHeight = ROW_H,
  labelWidth = DEFAULT_LABEL_WIDTH,
  height: heightProp,
  formatDate,
  locale = DEFAULT_LOCALE,
  showLegend = true,
  showDependencies,
  sortBy,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: GanttChartProps) {
  if (isBlank(tasks)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { effectiveRowH, effectiveLabelW } = resolveGanttRows(
    rowHeight,
    labelWidth,
  );
  const ordered = sortGanttTasks(tasks, sortBy, locale);
  const margin: ChartMargin = resolveGanttMargin(effectiveLabelW);
  const height = resolveGanttHeight(
    ordered.length,
    effectiveRowH,
    margin,
    heightProp,
  );
  const innerW = W - margin.left - margin.right;

  const { x, lo, hi, ticks } = buildGanttScale(ordered, innerW);
  const fmt =
    formatDate ??
    ((d: Date) =>
      d.toLocaleDateString(locale, { day: "numeric", month: "short" }));
  const { todayDate, todayX, showToday } = resolveGanttToday(
    today,
    x,
    margin.left,
    innerW,
  );
  const showDeps =
    showDependencies ?? ordered.some((t) => (t.dependsOn?.length ?? 0) > 0);
  const byLabel = new Map(ordered.map((t, i) => [t.label, i] as const));
  const geos = ordered.map((task, i) =>
    ganttTaskGeometry(task, x, margin.left, margin.top, effectiveRowH, i),
  );
  const depEdges = showDeps
    ? ordered.flatMap((task, i) =>
        (task.dependsOn ?? [])
          .map((dep) => {
            const j = byLabel.get(dep);
            if (j === undefined || j === i) return null;
            const a = geos[j];
            const b = geos[i];
            if (!a || !b) return null;
            return { from: j, to: i, a, b };
          })
          .filter((d): d is NonNullable<typeof d> => d !== null),
      )
    : [];

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {showDeps && depEdges.length > 0 ? (
          <SvgMarkers prefix="charts-gantt" kinds={["arrow"]} />
        ) : null}
        {ticks.map((t) => (
          <g key={t.getTime()}>
            <line
              x1={margin.left + x(t)}
              x2={margin.left + x(t)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={margin.left + x(t)}
              y={height - AXIS_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {showToday && todayDate ? (
          <g>
            <line
              x1={todayX ?? margin.left}
              x2={todayX ?? margin.left}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={CHART_TOKEN.destructive}
              strokeWidth={GRID_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
              data-chart-tip={`Hoy: ${fmt(todayDate)}`}
            />
          </g>
        ) : null}
        {ordered.map((task, i) => {
          const { s, e, bx, bw, by, bh, color, pct, days } = ganttTaskGeometry(
            task,
            x,
            margin.left,
            margin.top,
            effectiveRowH,
            i,
          );
          const tip = buildGanttTip(task.label, s, e, pct, days, fmt, locale);
          return (
            <g key={stableKey([task.label], i)}>
              <text
                x={margin.left - TICK_GAP_PX}
                y={by + bh / 2}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={task.label}
              >
                {truncateLabel(task.label, LABEL_MAX_TASK)}
              </text>
              <g>
                {showProgress ? (
                  <>
                    <rect
                      x={bx}
                      y={by}
                      width={bw}
                      height={bh}
                      rx={bh / 2}
                      fill={CHART_TOKEN.track}
                    />
                    <rect
                      x={bx}
                      y={by}
                      width={ganttProgressWidth(bw, bh, pct)}
                      height={bh}
                      rx={bh / 2}
                      fill={color}
                      data-chart-tip={tip}
                    />
                  </>
                ) : (
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={bh}
                    rx={bh / 2}
                    fill={color}
                    data-chart-tip={tip}
                  />
                )}
              </g>
            </g>
          );
        })}
        {depEdges.map((d, i) => {
          const sx = d.a.bx + d.a.bw;
          const sy = d.a.by + d.a.bh / 2;
          const tx = d.b.bx;
          const ty = d.b.by + d.b.bh / 2;
          return (
            <path
              key={stableKey([d.from, d.to], i)}
              d={`M ${sx} ${sy} C ${sx + 20} ${sy}, ${tx - 20} ${ty}, ${tx} ${ty}`}
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              markerEnd={markerUrl("charts-gantt", "arrow")}
            />
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Programado", color: CHART_TOKEN.track },
            { label: "Avance", color: CHART_TOKEN.chart1 },
          ]}
        />
      ) : null}
      <p className="sr-only">{`Del ${fmt(new Date(lo))} al ${fmt(new Date(hi))}`}</p>
    </div>
  );
}
