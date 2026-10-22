/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { pctOf } from "../core/tips";
import type { ChartMargin } from "../render/chart-svg";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { YGrid } from "../render/y-grid";
import {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  computeParetoModel,
  PARETO_DEFAULT_THRESHOLD,
  paretoCountOf,
} from "./pareto-chart.compute";
import type { ParetoChartProps } from "./pareto-chart.types";

export type { ParetoChartProps } from "./pareto-chart.types";

const W = 640;
const MARGIN: ChartMargin = { top: 12, right: 48, bottom: 32, left: 44 };

/**
 * Pareto SSR (barras ordenadas + % acumulado en segundo eje).
 */
export function ParetoChart({
  data,
  xKey,
  yKey,
  ariaLabel,
  height = 280,
  formatY,
  color,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  topN,
  threshold = PARETO_DEFAULT_THRESHOLD,
  showCumLabels = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ParetoChartProps) {
  if (isBlank(data)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const {
    ordered,
    total,
    top,
    y,
    yp,
    x,
    xp,
    ticks,
    fill,
    lineColor,
    fmtY,
    thresholdPct,
    cum,
    path,
  } = computeParetoModel({
    data,
    xKey,
    yKey,
    innerW,
    innerH,
    gridTicks: GRID_TICKS,
    formatY,
    locale,
    color,
    topN,
    threshold,
  });
  const countOf = paretoCountOf(yKey);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
        {(annotations ?? []).map((a, ai) => {
          if (a.value < 0 || a.value > top) return null;
          const ay = MARGIN.top + y(a.value);
          return (
            <g
              key={`ann-${a.value}-${ai}`}
              data-chart-tip={a.label ?? String(a.value)}
            >
              <line
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={ay}
                y2={ay}
                stroke={a.color ?? CHART_TOKEN.accent}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              <text
                x={W - MARGIN.right - ANNOTATION_LABEL_DX}
                y={ay}
                dy={ANNOTATION_LABEL_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={a.color ?? CHART_TOKEN.muted}
              >
                {a.label ?? String(a.value)}
              </text>
            </g>
          );
        })}
        {ticks.map((t) => (
          <text
            key={t}
            x={W - MARGIN.right + TICK_GAP_PX}
            y={MARGIN.top + yp((t / top) * PERCENT_FACTOR)}
            dy={TICK_DY}
            textAnchor="start"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {`${Math.round((t / top) * PERCENT_FACTOR)}%`}
          </text>
        ))}
        {ordered.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const value = countOf(d);
          const pct = pctOf(value, total);
          const cumPct = Math.round(cum[di]?.pct ?? 0);
          const tip = `${group}: ${fmtY(value)} (${pct}% · acumulado ${cumPct}%)`;
          return (
            <g key={stableKey([group], di)}>
              <rect
                x={MARGIN.left + (x(group) ?? 0)}
                y={MARGIN.top + y(value)}
                width={x.bandwidth()}
                height={Math.max(MIN_SHAPE_PX, innerH - y(value))}
                rx={BAR_RADIUS}
                fill={fill}
                data-chart-tip={tip}
              />
              <text
                x={MARGIN.left + (x(group) ?? 0) + x.bandwidth() / 2}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={group}
              >
                {truncateLabel(group)}
              </text>
            </g>
          );
        })}
        <path
          d={path}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
          fill="none"
          stroke={lineColor}
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
        {cum.map((c, ci) => (
          <g key={stableKey([c.label], ci)}>
            <circle
              cx={MARGIN.left + (xp(c.label) ?? 0) + x.bandwidth() / 2}
              cy={MARGIN.top + yp(c.pct)}
              r={POINT_RADIUS}
              fill={lineColor}
              stroke={CHART_TOKEN.background}
              strokeWidth={POINT_BORDER}
              data-chart-tip={`${c.label}: ${Math.round(c.pct)}% acumulado`}
            />
            {showCumLabels ? (
              <text
                x={MARGIN.left + (xp(c.label) ?? 0) + x.bandwidth() / 2}
                y={MARGIN.top + yp(c.pct) - TICK_GAP_PX}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {`${Math.round(c.pct)}%`}
              </text>
            ) : null}
          </g>
        ))}
        {thresholdPct !== null ? (
          <g data-chart-tip={`Umbral ${Math.round(thresholdPct)}%`}>
            <line
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={MARGIN.top + yp(thresholdPct)}
              y2={MARGIN.top + yp(thresholdPct)}
              stroke={CHART_TOKEN.muted}
              strokeWidth={GRID_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
            />
            <text
              x={W - MARGIN.right}
              y={MARGIN.top + yp(thresholdPct) - TICK_GAP_PX}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {`${Math.round(thresholdPct)}%`}
            </text>
          </g>
        ) : null}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Valor", color: fill },
            { label: "% acumulado", color: lineColor },
          ]}
        />
      ) : null}
    </div>
  );
}
