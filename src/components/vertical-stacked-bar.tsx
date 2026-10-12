/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import { useId } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColors, truncateLabel } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

const GROUP_BAND_PADDING = 0.3;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/** Props de VerticalStackedBar. */
export type VerticalStackedBarProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  normalize?: boolean;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Barras verticales apiladas SSR, con modo `normalize` (100 %).
 * Soporta negativos con doble base (positivos arriba, negativos abajo);
 * en `normalize` los negativos se clamp a 0 (no se apilan negativos).
 */
export function VerticalStackedBar({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  normalize = false,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: VerticalStackedBarProps) {
  const uid = useId();
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const raws = data.map((d) => series.map((s) => toNumber(d[s.key])));
  // En normalize los negativos se clamp a 0.
  const posSums = raws.map((arr) =>
    arr.reduce((acc, v) => acc + Math.max(0, v), 0),
  );
  const negSums = raws.map((arr) =>
    arr.reduce((acc, v) => acc + Math.min(0, v), 0),
  );
  const [lo, hi] = domainWithZero([...posSums, ...negSums]);

  const y = (
    normalize
      ? scaleLinear().domain([0, 1])
      : scaleLinear().domain([lo, Math.max(hi, lo + 1)])
  )
    .nice(GRID_TICKS)
    .range([innerH, 0]);
  const x = scaleBand()
    .domain(data.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);

  const ticks = y.ticks(GRID_TICKS);
  const colors = seriesColors(series);
  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));
  const fmt = normalize
    ? (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`
    : fmtY;
  const prefix = uid.replace(/:/g, "");

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmt} />
        {(annotations ?? []).map((a, ai) => {
          const annLo = normalize ? 0 : lo;
          const annHi = normalize ? 1 : hi;
          if (a.value < annLo || a.value > annHi) return null;
          const ay = MARGIN.top + y(a.value);
          return (
            <g key={`ann-${a.value}-${ai}`}>
              <title>{a.label ?? String(a.value)}</title>
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
        {data.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const vals = raws[di] ?? [];
          const posTotal = posSums[di] ?? 0;
          const negTotal = negSums[di] ?? 0;
          const topVal = normalize ? 1 : posTotal;
          const bottomVal = normalize ? 0 : negTotal;
          const yTopPix = y(topVal);
          const yBottomPix = y(bottomVal);
          const colX = MARGIN.left + (x(group) ?? 0);
          const clipId = `${prefix}-vs-${di}`;
          let posBase = 0;
          let negBase = 0;
          return (
            <g key={stableKey([group], di)}>
              <text
                x={colX + x.bandwidth() / 2}
                y={height - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group}</title>
                {truncateLabel(group)}
              </text>
              <defs>
                <clipPath id={clipId}>
                  <rect
                    x={colX}
                    y={MARGIN.top + Math.min(yTopPix, yBottomPix)}
                    width={x.bandwidth()}
                    height={Math.max(
                      MIN_SHAPE_PX,
                      Math.abs(yBottomPix - yTopPix),
                    )}
                    rx={BAR_RADIUS}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#${clipId})`}>
                {series.map((s, si) => {
                  const raw = vals[si] ?? toNumber(d[s.key]);
                  // En normalize los negativos se clamp a 0 (no se apilan).
                  const frac =
                    normalize && posTotal > 0
                      ? Math.max(0, raw) / posTotal
                      : raw;
                  const base = frac < 0 ? negBase : posBase;
                  const v0 = base;
                  const v1 = base + frac;
                  if (frac < 0) negBase = v1;
                  else posBase = v1;
                  const y0pix = y(v0);
                  const y1pix = y(v1);
                  const baseTip = `${group} · ${s.label}: ${fmtY(raw)}`;
                  const total = posTotal + negTotal;
                  const tip = normalize
                    ? `${group} · ${s.label}: ${fmtY(raw)} (${Math.round((posTotal > 0 ? Math.max(0, raw) / posTotal : 0) * PERCENT_FACTOR)}%)`
                    : series.length >= 2 && total > 0
                      ? `${baseTip} (${Math.round((raw / total) * PERCENT_FACTOR)}% del grupo)`
                      : baseTip;
                  if (frac === 0) return <g key={s.key} />;
                  return (
                    <g key={s.key}>
                      <title>{tip}</title>
                      <rect
                        x={colX}
                        y={MARGIN.top + Math.min(y0pix, y1pix)}
                        width={x.bandwidth()}
                        height={Math.max(MIN_SHAPE_PX, Math.abs(y1pix - y0pix))}
                        fill={colors[si] ?? CHART_TOKEN.chart1}
                        data-chart-tip={tip}
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
