/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { quantileSorted } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";
import { seriesColor } from "../core/color";
import { domainWithZero } from "../core/domain";
import { resolveFormatter } from "../core/format";
import { cleanValues, kdeOf } from "../core/kde";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  AREA_FILL_OPACITY,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
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
  GROUP_BAND_PADDING,
  MEDIAN_TICK_FRAC,
  TICKS_MIN,
  VIOLIN_BOX_FRAC,
  VIOLIN_LINE_WIDTH,
  VIOLIN_WIDTH_FRAC,
} from "./violin-plot.compute";
import type { KdePoint, ViolinPlotProps } from "./violin-plot.types";

export {
  cleanValues,
  KDE_BINS,
  kdeBandwidth,
  kdeOf,
  kdePeak,
} from "../core/kde";
export type {
  KdePoint,
  ViolinGroup,
  ViolinPlotProps,
  ViolinSort,
} from "./violin-plot.types";

/**
 * Violines SSR (densidad por grupo con KDE gaussiana propia + mediana).
 * Soporta negativos; filtra no-finitos.
 */
export function ViolinPlot({
  groups,
  ariaLabel,
  height = 260,
  bandwidth = "auto",
  formatY,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  showSampleSize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ViolinPlotProps) {
  const safeH = toNumber(height, 260);
  const computed = groups
    .slice(0, DEFAULT_MAX_ROWS)
    .map((group, oi) => {
      const clean = cleanValues(group.values);
      const sorted = [...clean].sort((a, b) => a - b);
      const first = sorted[0] ?? 0;
      return { group, clean, oi, median: quantileSorted(sorted, 0.5) ?? first };
    })
    .filter((c) => c.clean.length > 0);
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered =
    sortGroups === "none"
      ? computed
      : [...computed].sort((a, b) =>
          sortGroups === "asc" ? a.median - b.median : b.median - a.median,
        );

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const auto = domainWithZero(ordered.flatMap((c) => c.clean));
  const fixedLo = toNumber(yMin, Number.NaN);
  const fixedHi = toNumber(yMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : auto[0];
  const bhi = Number.isFinite(fixedHi) ? fixedHi : auto[1];
  const fmtY = resolveFormatter(formatY, locale);
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const y = scaleLinear().domain([blo, bhi]).nice(safeTicks).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((c) => c.group.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(safeTicks);
  const halfMax = (x.bandwidth() / 2) * VIOLIN_WIDTH_FRAC;
  const given = bandwidth === "auto" ? 0 : toNumber(bandwidth);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
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
        {ordered.map(({ group, clean, oi, median: sortedMedian }, gi) => {
          const cx = MARGIN.left + (x(group.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(oi, group.color);
          const sorted = [...clean].sort((a, b) => a - b);
          const first = sorted[0] ?? 0;
          const q1 = quantileSorted(sorted, 0.25) ?? first;
          const median = sortedMedian;
          const q3 = quantileSorted(sorted, 0.75) ?? first;
          const gmin = sorted[0] ?? 0;
          const gmax = sorted[sorted.length - 1] ?? 0;
          const pts = kdeOf(clean, given, gmin, gmax);
          let dmax = 0;
          for (const p of pts) dmax = Math.max(dmax, p.density);
          const half = (d: number) => (dmax > 0 ? (d / dmax) * halfMax : 0);
          const silhouette =
            area<KdePoint>()
              .x0((p) => cx - half(p.density))
              .x1((p) => cx + half(p.density))
              .y((p) => MARGIN.top + y(p.value))
              .curve(curveCatmullRom)(pts) ?? "";
          const tickW = halfMax * 2 * MEDIAN_TICK_FRAC;
          const boxW = halfMax * 2 * VIOLIN_BOX_FRAC;
          const my = MARGIN.top + y(median);
          const yq3 = MARGIN.top + y(q3);
          const yq1 = MARGIN.top + y(q1);
          const tip =
            `${group.label}: n ${clean.length} · mediana ${fmtY(median)} · ` +
            `Q1 ${fmtY(q1)} · Q3 ${fmtY(q3)}`;
          return (
            <g key={stableKey([group.label], gi)}>
              <text
                x={cx}
                y={safeH - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={group.label}
              >
                {showSampleSize
                  ? `${truncateLabel(group.label)} (n ${clean.length})`
                  : truncateLabel(group.label)}
              </text>
              <path
                d={silhouette}
                fill={color}
                fillOpacity={AREA_FILL_OPACITY}
                stroke={color}
                strokeWidth={VIOLIN_LINE_WIDTH}
                strokeLinejoin="round"
                data-chart-tip={tip}
              />
              <rect
                x={cx - boxW / 2}
                y={yq3}
                width={boxW}
                height={Math.max(ZERO_MARK_PX, yq1 - yq3)}
                rx={BAR_RADIUS}
                fill={CHART_TOKEN.background}
                stroke={color}
                strokeWidth={VIOLIN_LINE_WIDTH}
              />
              <rect
                x={cx - tickW / 2}
                y={my - LINE_WIDTH / 2}
                width={tickW}
                height={LINE_WIDTH}
                rx={BAR_RADIUS}
                fill={color}
              />
              <circle
                cx={cx}
                cy={my}
                r={POINT_RADIUS}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
              />
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map(({ group, oi }) => ({
            label: group.label,
            color: seriesColor(oi, group.color),
          }))}
        />
      ) : null}
    </div>
  );
}
