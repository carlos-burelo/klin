/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../core/theme";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
} from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import { YGrid } from "../render/y-grid";
import {
  ANNOTATION_LABEL_DX,
  ANNOTATION_LABEL_DY,
  AXIS_LABEL_OFFSET,
  BOX_FILL_OPACITY,
  BOX_LINE_WIDTH,
  BOX_MAX_WIDTH,
  GROUP_BAND_PADDING,
  MEAN_MARKER_HALF,
  NOTCH_DEPTH,
  NOTCH_HALF_HEIGHT,
  OUTLIER_RADIUS,
  resolveBoxHi,
  resolveBoxLo,
  resolveBoxRadius,
  resolveBoxTicks,
  SAMPLE_LABEL_SHIFT,
  statsOf,
} from "./box-plot.compute";
import type { BoxPlotProps } from "./box-plot.types";

export type { BoxGroup, BoxPlotProps } from "./box-plot.types";

/**
 * Cajas y bigotes SSR (distribución por grupo: min, Q1, mediana, Q3, max).
 * Soporta negativos; filtra no-finitos.
 */
export function BoxPlot({
  groups,
  ariaLabel,
  height = 260,
  formatY,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  showOutliers = true,
  whisker = 1.5,
  showSampleSize = false,
  notch = false,
  annotations,
  gridTicks = GRID_TICKS,
  yMin,
  yMax,
  showMean = false,
  pointRadius = OUTLIER_RADIUS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BoxPlotProps) {
  const computed = groups
    .map((g) => ({ group: g, stats: statsOf(g.values, whisker) }))
    .filter((c) => c.stats !== null);
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const all = computed.flatMap((c) => [
    c.stats?.min ?? 0,
    c.stats?.max ?? 0,
    ...(showOutliers ? (c.stats?.outliers ?? []) : []),
  ]);
  const safeTicks = resolveBoxTicks(gridTicks);
  const dotR = resolveBoxRadius(pointRadius);
  const hasOverride = yMin !== undefined || yMax !== undefined;
  const blo = resolveBoxLo(all, yMin);
  const bhi = resolveBoxHi(all, yMax, blo, hasOverride);
  const fmtY = resolveFormatter(formatY, locale);
  const y = scaleLinear().domain([blo, bhi]).nice(safeTicks).range([innerH, 0]);
  const x = scaleBand()
    .domain(computed.map((c) => c.group.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(safeTicks);
  const boxW = Math.min(BOX_MAX_WIDTH, x.bandwidth());

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
          if (a.value < blo || a.value > bhi) return null;
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
        {computed.map(({ group, stats }, gi) => {
          const s = stats;
          if (!s) return null;
          const cx = MARGIN.left + (x(group.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(gi, group.color);
          const n = group.values.filter((v) =>
            Number.isFinite(toNumber(v, Number.NaN)),
          ).length;
          const shownOutliers = showOutliers ? s.outliers : [];
          const tip =
            `${group.label}: min ${fmtY(s.min)} · Q1 ${fmtY(s.q1)} · ` +
            `mediana ${fmtY(s.median)} · Q3 ${fmtY(s.q3)} · max ${fmtY(s.max)}` +
            (shownOutliers.length > 0
              ? ` · atípicos ${shownOutliers.map(fmtY).join(", ")}`
              : "") +
            (showSampleSize ? ` · n ${n}` : "");
          const yq3 = MARGIN.top + y(s.q3);
          const yq1 = MARGIN.top + y(s.q1);
          const ymed = MARGIN.top + y(s.median);
          const notchPath =
            `M ${cx - boxW / 2} ${yq3} H ${cx + boxW / 2} ` +
            `V ${ymed + NOTCH_HALF_HEIGHT} L ${cx + boxW / 2 - NOTCH_DEPTH} ${ymed} ` +
            `L ${cx + boxW / 2} ${ymed - NOTCH_HALF_HEIGHT} V ${yq1} ` +
            `H ${cx - boxW / 2} V ${ymed - NOTCH_HALF_HEIGHT} ` +
            `L ${cx - boxW / 2 + NOTCH_DEPTH} ${ymed} ` +
            `L ${cx - boxW / 2} ${ymed + NOTCH_HALF_HEIGHT} Z`;
          return (
            <g key={stableKey([group.label], gi)}>
              <text
                x={cx}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={group.label}
              >
                {truncateLabel(group.label)}
              </text>
              {showSampleSize ? (
                <text
                  x={cx}
                  y={height - AXIS_LABEL_OFFSET + SAMPLE_LABEL_SHIFT}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  n {n}
                </text>
              ) : null}
              <line
                x1={cx}
                x2={cx}
                y1={MARGIN.top + y(s.max)}
                y2={MARGIN.top + y(s.min)}
                stroke={color}
                strokeWidth={BOX_LINE_WIDTH}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.max)}
                y2={MARGIN.top + y(s.max)}
                stroke={color}
                strokeWidth={BOX_LINE_WIDTH}
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.min)}
                y2={MARGIN.top + y(s.min)}
                stroke={color}
                strokeWidth={BOX_LINE_WIDTH}
              />
              {notch ? (
                <path
                  d={notchPath}
                  fill={color}
                  fillOpacity={BOX_FILL_OPACITY}
                  stroke={color}
                  strokeWidth={BOX_LINE_WIDTH}
                  data-chart-tip={tip}
                />
              ) : (
                <rect
                  x={cx - boxW / 2}
                  y={MARGIN.top + y(s.q3)}
                  width={boxW}
                  height={Math.max(ZERO_MARK_PX, y(s.q1) - y(s.q3))}
                  rx={BAR_RADIUS}
                  fill={color}
                  fillOpacity={BOX_FILL_OPACITY}
                  stroke={color}
                  strokeWidth={BOX_LINE_WIDTH}
                  data-chart-tip={tip}
                />
              )}
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={MARGIN.top + y(s.median)}
                y2={MARGIN.top + y(s.median)}
                stroke={color}
                strokeWidth={LINE_WIDTH}
              />
              {showOutliers
                ? s.outliers.map((o, oi) => (
                    <circle
                      // biome-ignore lint/suspicious/noArrayIndexKey: atípicos pueden duplicar valor
                      key={`${o}__${oi}`}
                      cx={cx}
                      cy={MARGIN.top + y(o)}
                      r={dotR}
                      fill={CHART_TOKEN.background}
                      stroke={color}
                      strokeWidth={POINT_BORDER}
                    />
                  ))
                : null}
              {showMean &&
              Number.isFinite(s.mean) &&
              s.mean >= blo &&
              s.mean <= bhi ? (
                <path
                  d={
                    `M ${cx} ${MARGIN.top + y(s.mean) - MEAN_MARKER_HALF} ` +
                    `L ${cx + MEAN_MARKER_HALF} ${MARGIN.top + y(s.mean)} ` +
                    `L ${cx} ${MARGIN.top + y(s.mean) + MEAN_MARKER_HALF} ` +
                    `L ${cx - MEAN_MARKER_HALF} ${MARGIN.top + y(s.mean)} Z`
                  }
                  fill={color}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={`${group.label}: media ${fmtY(s.mean)}`}
                />
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={computed.map(({ group }, gi) => ({
            label: group.label,
            color: seriesColor(gi, group.color),
          }))}
        />
      ) : null}
    </div>
  );
}
