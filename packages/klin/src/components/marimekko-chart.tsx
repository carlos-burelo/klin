/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { toNumber } from "../core/number";
import { truncateLabel } from "../core/text";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
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
  AXIS_LABEL_OFFSET,
  COLUMN_GAP,
  computeMarimekkoModel,
  MIN_PCT_LABEL,
  MIN_PCT_LABEL_PX,
  SEGMENT_GAP,
} from "./marimekko-chart.compute";
import type { MarimekkoChartProps } from "./marimekko-chart.types";

export type { MarimekkoChartProps } from "./marimekko-chart.types";

/**
 * Marimekko SSR: el ancho de cada columna es ∝ `widthKey` y cada
 * columna apila sus series al 100 % vertical (normalize siempre).
 * Los negativos se clamp a 0; sin anchos positivos → ChartEmpty.
 */
export function MarimekkoChart({
  data,
  xKey,
  widthKey,
  series,
  ariaLabel,
  height = 260,
  formatX,
  format,
  locale = DEFAULT_LOCALE,
  showLabels = true,
  showValues = true,
  showCounts = false,
  sortGroups = false,
  minLabelPct = MIN_PCT_LABEL,
  maxItems = DEFAULT_MAX_ROWS,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: MarimekkoChartProps) {
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const {
    rows,
    widths,
    totalW,
    y,
    ticks,
    colors,
    fmtX,
    fmtV,
    fmtPct,
    minPct,
    colWs,
    colXs,
  } = computeMarimekkoModel({
    data,
    widthKey,
    series,
    sortGroups,
    innerW,
    innerH,
    formatX,
    format,
    locale,
    minLabelPct,
    maxItems,
  });
  if (isBlank(rows) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  if (totalW <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtPct} />
        {rows.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const wVal = widths[di] ?? 0;
          const colW = colWs[di] ?? 0;
          const colX = MARGIN.left + (colXs[di] ?? 0);
          const vals = series.map((s) => Math.max(0, toNumber(d[s.key])));
          const colTotal = vals.reduce((a, b) => a + b, 0);
          const widthPct = Math.round((wVal / totalW) * PERCENT_FACTOR);
          const xTitle = `${group}: ${fmtX(wVal)} (${widthPct}% del ancho)`;
          let base = 0;
          return (
            <g key={stableKey([group], di)}>
              {showLabels ? (
                <text
                  x={colX + colW / 2}
                  y={height - AXIS_LABEL_OFFSET}
                  textAnchor="middle"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                  data-chart-tip={xTitle}
                >
                  {truncateLabel(group)}
                </text>
              ) : null}
              {series.map((s, si) => {
                const raw = vals[si] ?? 0;
                const frac = colTotal > 0 ? raw / colTotal : 0;
                const v0 = base;
                base += frac;
                if (frac <= 0) return <g key={s.key} />;
                const y0pix = y(v0);
                const y1pix = y(v0 + frac);
                const segH = Math.abs(y1pix - y0pix);
                const pct = Math.round(frac * PERCENT_FACTOR);
                const tip = `${group} · ${s.label}: ${fmtV(raw)} (${pct}% de la columna)`;
                const fits =
                  showValues &&
                  pct >= minPct &&
                  segH >= MIN_PCT_LABEL_PX &&
                  colW >= MIN_PCT_LABEL_PX * 2;
                return (
                  <g key={s.key}>
                    <rect
                      x={colX + COLUMN_GAP / 2}
                      y={MARGIN.top + Math.min(y0pix, y1pix) + SEGMENT_GAP / 2}
                      width={Math.max(0, colW - COLUMN_GAP)}
                      height={Math.max(MIN_SHAPE_PX, segH - SEGMENT_GAP)}
                      rx={BAR_RADIUS}
                      fill={colors[si] ?? CHART_TOKEN.chart1}
                      data-chart-tip={tip}
                    />
                    {fits ? (
                      <text
                        x={colX + colW / 2}
                        y={MARGIN.top + (y0pix + y1pix) / 2}
                        dy={TICK_DY}
                        textAnchor="middle"
                        fontSize={TICK_FONT_SIZE}
                        fill={CHART_TOKEN.primaryForeground}
                      >
                        {showCounts ? `${pct}% (${fmtV(raw)})` : `${pct}%`}
                      </text>
                    ) : null}
                  </g>
                );
              })}
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
