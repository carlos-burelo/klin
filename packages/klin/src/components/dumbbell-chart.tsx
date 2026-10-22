/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  AXIS_LABEL_OFFSET,
  buildDumbbellScales,
  clampDumbbellAnnotation,
  cleanDumbbellRows,
  LABEL_MAX_X,
  MARGIN,
  orderDumbbellRows,
  resolveDumbbellDomain,
  resolveDumbbellHeight,
  resolveDumbbellRadius,
  resolveDumbbellTicks,
  W,
} from "./dumbbell-chart.compute";
import type { DumbbellChartProps } from "./dumbbell-chart.types";

export type { DumbbellChartProps, DumbbellSort } from "./dumbbell-chart.types";

/**
 * Mancuernas SSR horizontales (dos puntos por categoría unidos por
 * conector chart1→chart2). Altura automática según filas salvo
 * override por `height`. Filtra no-finitos; tope DEFAULT_MAX_ROWS.
 */
export function DumbbellChart({
  data,
  categoryKey,
  aKey,
  bKey,
  aLabel,
  bLabel,
  ariaLabel,
  height,
  locale = DEFAULT_LOCALE,
  formatX,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  domain,
  gridTicks = GRID_TICKS,
  showValues = false,
  sortGroups = "none",
  pointRadius = POINT_RADIUS_SCATTER,
  aColor,
  bColor,
  showDiff = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DumbbellChartProps) {
  const computed = cleanDumbbellRows(data, categoryKey, aKey, bKey);
  if (isBlank(computed)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered = orderDumbbellRows(computed, sortGroups);

  const chartH = resolveDumbbellHeight(ordered.length, height);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = chartH - MARGIN.top - MARGIN.bottom;

  const { lo, hi } = resolveDumbbellDomain(ordered, domain);
  const safeTicks = resolveDumbbellTicks(gridTicks);
  const dotR = resolveDumbbellRadius(pointRadius);
  const { x, y0, ticks } = buildDumbbellScales(
    ordered,
    lo,
    hi,
    safeTicks,
    innerW,
    innerH,
  );
  const fmtX = resolveFormatter(formatX, locale);
  const aFill = aColor ?? CHART_TOKEN.chart1;
  const bFill = bColor ?? CHART_TOKEN.chart2;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={chartH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left + x(t)}
              x2={MARGIN.left + x(t)}
              y1={MARGIN.top}
              y2={chartH - MARGIN.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={MARGIN.left + x(t)}
              y={chartH - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
        {(annotations ?? []).map((a, ai) => {
          const clamped = clampDumbbellAnnotation(a.value, lo, hi);
          const ax = MARGIN.left + x(clamped);
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g
              key={stableKey([a.label ?? `${a.value}`], ai)}
              data-chart-tip={a.label ?? fmtX(a.value)}
            >
              <line
                x1={ax}
                x2={ax}
                y1={MARGIN.top}
                y2={chartH - MARGIN.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              {a.label ? (
                <text
                  x={ax + TICK_GAP_PX}
                  y={MARGIN.top + TICK_GAP_PX}
                  fontSize={TICK_FONT_SIZE}
                  fill={stroke}
                >
                  {a.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {ordered.map((r, ri) => {
          const cy = MARGIN.top + (y0(r.label) ?? 0) + y0.bandwidth() / 2;
          const xa = MARGIN.left + x(r.a);
          const xb = MARGIN.left + x(r.b);
          const mid = (xa + xb) / 2;
          const tipA = `${r.label} · ${aLabel}: ${fmtX(r.a)}`;
          const tipB = `${r.label} · ${bLabel}: ${fmtX(r.b)}`;
          return (
            <g key={stableKey([r.label], ri)}>
              <text
                x={MARGIN.left - TICK_GAP_PX}
                y={cy}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={r.label}
              >
                {truncateLabel(r.label, LABEL_MAX_X)}
              </text>
              <line
                x1={xa}
                x2={mid}
                y1={cy}
                y2={cy}
                stroke={aFill}
                strokeWidth={LINE_WIDTH}
              />
              <line
                x1={mid}
                x2={xb}
                y1={cy}
                y2={cy}
                stroke={bFill}
                strokeWidth={LINE_WIDTH}
              />
              <g>
                <circle
                  cx={xa}
                  cy={cy}
                  r={dotR}
                  fill={aFill}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={tipA}
                />
              </g>
              <g>
                <circle
                  cx={xb}
                  cy={cy}
                  r={dotR}
                  fill={bFill}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={tipB}
                />
              </g>
              {showDiff ? (
                <text
                  x={mid}
                  y={cy - dotR - TICK_GAP_PX / 2}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                  data-chart-tip={`${r.label}: diferencia ${fmtX(r.b - r.a)}`}
                >
                  {fmtX(r.b - r.a)}
                </text>
              ) : null}
              {showValues ? (
                <>
                  <text
                    x={xa - TICK_GAP_PX}
                    y={cy}
                    dy={TICK_DY}
                    textAnchor="end"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.foreground}
                  >
                    {fmtX(r.a)}
                  </text>
                  <text
                    x={xb + TICK_GAP_PX}
                    y={cy}
                    dy={TICK_DY}
                    textAnchor="start"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.foreground}
                  >
                    {fmtX(r.b)}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: aLabel, color: aFill },
            { label: bLabel, color: bFill },
          ]}
        />
      ) : null}
    </div>
  );
}
