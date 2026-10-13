/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";
import type { CSSProperties } from "react";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { clamp01, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";
import { type KdePoint, kdeOf, kdePeak } from "./violin-plot";

/** Ancho de la columna de etiquetas, solape y fracción del pico de fila. */
const RIDGE_LABEL_W = 120;
const RIDGE_OVERLAP_DEFAULT = 0.6;
const RIDGE_OVERLAP_MAX = 0.95;
const RIDGE_PEAK_FRAC = 0.95;
/** Relleno opaco de la cresta, marcas del eje X y colchón degenerado. */
const RIDGE_FILL_OPACITY = 0.85;
const TICK_MARK_H = 4;
const AXIS_TICK_OFFSET = 16;
const RIDGE_DEGENERATE_PAD = 1;
/** Mínimo de ticks del grid. */
const TICKS_MIN = 1;

/** Serie de la cresta (etiqueta, muestra y color opcional). */
export type RidgelineSeries = {
  label: string;
  values: number[];
  color?: string;
};

/** Orden de las filas por pico de densidad (none conserva el orden de entrada). */
export type RidgelineSort = "none" | "asc" | "desc";

/** Props de RidgelinePlot. */
export type RidgelinePlotProps = {
  series: RidgelineSeries[];
  ariaLabel: string;
  height?: number;
  overlap?: number;
  formatX?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Ticks del eje X común (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Orden de las filas por su pico de densidad. */
  sortGroups?: RidgelineSort;
  /** Radio del punto del pico (por defecto POINT_RADIUS). */
  pointRadius?: number;
  /** Muestra el tamaño de muestra (n) junto a cada etiqueta. */
  showSampleSize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Crestas SSR (una densidad por fila, misma KDE que el violín).
 * Filas apiladas con solape, eje X común abajo. Filtra no-finitos.
 */
export function RidgelinePlot({
  series,
  ariaLabel,
  height = 260,
  overlap = RIDGE_OVERLAP_DEFAULT,
  formatX,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  pointRadius = POINT_RADIUS,
  showSampleSize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RidgelinePlotProps) {
  const safeH = toNumber(height, 260);
  const base = series
    .slice(0, DEFAULT_MAX_ROWS)
    .map((entry, oi) => ({
      entry,
      oi,
      clean: entry.values
        .map((v) => toNumber(v, Number.NaN))
        .filter((v) => Number.isFinite(v)),
    }))
    .filter((c) => c.clean.length > 0);
  if (base.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const plotX0 = RIDGE_LABEL_W;
  const plotW = W - RIDGE_LABEL_W - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const flat = base.flatMap((c) => c.clean);
  let glo = flat[0] ?? 0;
  let ghi = flat[0] ?? 0;
  for (const v of flat) {
    if (v < glo) glo = v;
    if (v > ghi) ghi = v;
  }
  if (glo === ghi) {
    glo -= RIDGE_DEGENERATE_PAD;
    ghi += RIDGE_DEGENERATE_PAD;
  }
  const fmtX = resolveFormatter(formatX, locale);
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const dotR = Math.max(0, toNumber(pointRadius, POINT_RADIUS));
  const x = scaleLinear().domain([glo, ghi]).nice(safeTicks).range([0, plotW]);
  const ticks = x.ticks(safeTicks);
  const withPeak = base.map((c) => ({
    ...c,
    peak: kdePeak(kdeOf(c.clean, 0, glo, ghi)),
  }));
  const ordered =
    sortGroups === "none"
      ? withPeak
      : [...withPeak].sort((a, b) =>
          sortGroups === "asc" ? a.peak - b.peak : b.peak - a.peak,
        );
  const ov = Math.min(RIDGE_OVERLAP_MAX, clamp01(toNumber(overlap, 0)));
  const n = ordered.length;
  const rowH = innerH / (1 + (n - 1) * (1 - ov));
  const step = rowH * (1 - ov);
  const axisY = MARGIN.top + innerH;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <line
          x1={plotX0}
          x2={W - MARGIN.right}
          y1={axisY}
          y2={axisY}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={plotX0 + x(t)}
              x2={plotX0 + x(t)}
              y1={axisY}
              y2={axisY + TICK_MARK_H}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={plotX0 + x(t)}
              y={axisY + AXIS_TICK_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtX(t)}
            </text>
          </g>
        ))}
        {ordered.map(({ entry, clean, oi, peak }, ri) => {
          const baseY = MARGIN.top + rowH + ri * step;
          const color = seriesColor(oi, entry.color);
          const pts = kdeOf(clean, 0, glo, ghi);
          let dmax = 0;
          for (const p of pts) dmax = Math.max(dmax, p.density);
          const ridge =
            area<KdePoint>()
              .x((p) => plotX0 + x(p.value))
              .y0(baseY)
              .y1(
                (p) =>
                  baseY -
                  (dmax > 0 ? (p.density / dmax) * rowH * RIDGE_PEAK_FRAC : 0),
              )
              .curve(curveCatmullRom)(pts) ?? "";
          const tip = `${entry.label}: n ${clean.length} · pico en ${fmtX(peak)}`;
          return (
            <g key={stableKey([entry.label], ri)}>
              <title>{tip}</title>
              <text
                x={plotX0 - TICK_GAP_PX}
                y={baseY - rowH / 2}
                dy={TICK_GAP_PX / 2}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{entry.label}</title>
                {showSampleSize
                  ? `${truncateLabel(entry.label)} (n ${clean.length})`
                  : truncateLabel(entry.label)}
              </text>
              <path
                d={ridge}
                fill={color}
                fillOpacity={RIDGE_FILL_OPACITY}
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinejoin="round"
                data-chart-tip={tip}
              />
              <circle
                cx={plotX0 + x(peak)}
                cy={baseY - rowH * RIDGE_PEAK_FRAC}
                r={dotR}
                fill={CHART_TOKEN.background}
                stroke={color}
                strokeWidth={POINT_BORDER}
              />
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map(({ entry, oi }) => ({
            label: entry.label,
            color: seriesColor(oi, entry.color),
          }))}
        />
      ) : null}
    </div>
  );
}
