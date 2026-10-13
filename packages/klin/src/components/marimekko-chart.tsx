/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColors, truncateLabel } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Desplazamiento de la etiqueta x bajo el eje. */
const AXIS_LABEL_OFFSET = 10;
/** % mínimo de columna para rotular el % dentro del segmento. */
const MIN_PCT_LABEL = 8;
/** Alto (y doble de ancho) mínimo en px para que el % quepa dentro. */
const MIN_PCT_LABEL_PX = 14;

/** Props del marimekko SSR (ancho ∝ widthKey, apilado 100 %). */
export type MarimekkoChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  widthKey: string;
  series: ChartSeries[];
  ariaLabel: string;
  height?: number;
  formatX?: ValueFormatter;
  /** Formato de los valores de segmento (por defecto igual que el eje). */
  format?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas de grupo bajo cada columna. */
  showLabels?: boolean;
  /** Muestra el % dentro de cada segmento que quepa. */
  showValues?: boolean;
  /** Agrega el valor crudo junto al % dentro del segmento. */
  showCounts?: boolean;
  /** Ordena las columnas por ancho descendente (por defecto respeta la entrada). */
  sortGroups?: boolean;
  /** % mínimo de columna para rotular dentro del segmento. */
  minLabelPct?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

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
  locale = "es-MX",
  showLabels = true,
  showValues = true,
  showCounts = false,
  sortGroups = false,
  minLabelPct = MIN_PCT_LABEL,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: MarimekkoChartProps) {
  const input = data.slice(0, DEFAULT_MAX_ROWS);
  const rows = sortGroups
    ? [...input].sort((a, b) => toNumber(b[widthKey]) - toNumber(a[widthKey]))
    : input;
  if (rows.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const widths = rows.map((d) => Math.max(0, toNumber(d[widthKey])));
  const totalW = widths.reduce((acc, w) => acc + w, 0);
  if (totalW <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const y = scaleLinear().domain([0, 1]).nice(GRID_TICKS).range([innerH, 0]);
  const ticks = y.ticks(GRID_TICKS);
  const colors = seriesColors(series);
  const fmtX = formatX ?? ((v: number) => formatDefault(v, locale));
  const fmtV = format ?? ((v: number) => formatDefault(v, locale));
  const fmtPct = (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`;
  const minPct = Math.max(0, toNumber(minLabelPct, MIN_PCT_LABEL));

  const colWs = widths.map((w) => (w / totalW) * innerW);
  const colXs: number[] = [];
  let acc = 0;
  for (const w of colWs) {
    colXs.push(acc);
    acc += w;
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
                >
                  <title>{xTitle}</title>
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
                    <title>{tip}</title>
                    <rect
                      x={colX}
                      y={MARGIN.top + Math.min(y0pix, y1pix)}
                      width={Math.max(0, colW)}
                      height={Math.max(MIN_SHAPE_PX, segH)}
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
