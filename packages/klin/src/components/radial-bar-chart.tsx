/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { arc } from "d3-shape";
import type { CSSProperties } from "react";
import { ChartSvg, CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { clamp01, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  FONT_MONO,
  FONT_SEMIBOLD,
  LABEL_GAP_PX,
  PERCENT_FACTOR,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Ángulo inicial (arriba) y vuelta completa de cada anillo. */
const RADIAL_BAR_START = -Math.PI / 2;
const RADIAL_BAR_FULL = Math.PI * 2;
/** Grosor del anillo, calle entre anillos y radio interior mínimo. */
const RING_THICKNESS = 14;
const RING_GAP = 6;
const RING_MIN_INNER = 12;
const RING_MIN_STEP = 2;
/** Ancho de la columna izquierda de etiquetas y respiro exterior. */
const LABEL_COL_W = 168;
const LABEL_TEXT_DX = 12;
const LABEL_ROW_H = 22;
const OUTER_PAD = 10;
/** Radio de esquina del arco de valor y tamaño del total central. */
const RING_CORNER_DEFAULT = RING_THICKNESS / 2;
const RADIAL_TOTAL_FONT_SIZE = 20;
const RADIAL_TOTAL_LABEL_DY = 16;

/** Serie radial (etiqueta, valor, máximo opcional y color opcional). */
export type RadialBarDatum = {
  label: string;
  value: number;
  max?: number;
  color?: string;
};

/** Props de barras radiales SSR (anillos concéntricos 0–max). */
export type RadialBarChartProps = {
  series: RadialBarDatum[];
  ariaLabel: string;
  height?: number;
  formatValue?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas de serie a la izquierda. */
  showLabels?: boolean;
  /** Muestra los valores tabulares a la izquierda. */
  showValues?: boolean;
  /** Ordena los anillos por fracción descendente (por defecto respeta la entrada). */
  sortSlices?: boolean;
  /** Ángulo inicial de cada arco (radianes). */
  startAngle?: number;
  /** Radio de esquina del arco de valor. */
  cornerRadius?: number;
  /** Muestra la suma de valores al centro de los anillos. */
  showTotal?: boolean;
  /** Etiqueta bajo el total central. */
  totalLabel?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Barras radiales SSR: anillos concéntricos con fracción
 * `value / (max ?? 100)` (clamp 0–1), pista tenue + arco de valor
 * tipo píldora, etiquetas a la izquierda con valor tabular.
 */
export function RadialBarChart({
  series,
  ariaLabel,
  height = 260,
  formatValue,
  locale = "es-MX",
  showLabels = true,
  showValues = true,
  sortSlices = false,
  startAngle = RADIAL_BAR_START,
  cornerRadius = RING_CORNER_DEFAULT,
  showTotal = false,
  totalLabel = "Total",
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: RadialBarChartProps) {
  const base = series.slice(0, DEFAULT_MAX_ROWS);
  if (base.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const fracOf = (s: RadialBarDatum) => {
    const value = Math.max(0, toNumber(s.value));
    const max = toNumber(s.max, 100);
    return { value, max, frac: max > 0 ? clamp01(value / max) : 0 };
  };
  const rows = sortSlices
    ? [...base].sort((a, b) => fracOf(b).frac - fracOf(a).frac)
    : base;

  const fmt = formatValue ?? ((v: number) => formatDefault(v, locale));
  const start = toNumber(startAngle, RADIAL_BAR_START);
  const corner = Math.max(0, toNumber(cornerRadius, RING_CORNER_DEFAULT));
  const plotW = W - MARGIN.left - MARGIN.right - LABEL_COL_W;
  const outer = Math.max(0, Math.min(plotW / 2, height / 2) - OUTER_PAD);
  const cx = MARGIN.left + LABEL_COL_W + plotW / 2;
  const cy = height / 2;
  const step =
    rows.length > 1
      ? Math.max(
          RING_MIN_STEP,
          Math.min(
            RING_THICKNESS + RING_GAP,
            (outer - RING_THICKNESS - RING_MIN_INNER) / (rows.length - 1),
          ),
        )
      : 0;
  const fracs = rows.map(fracOf);
  const total = fracs.reduce((acc, f) => acc + f.value, 0);

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {rows.map((s, i) => {
          const f = fracs[i] ?? { value: 0, max: 100, frac: 0 };
          const color = seriesColor(i, s.color);
          const pct = Math.round(f.frac * PERCENT_FACTOR);
          const tip = `${s.label}: ${fmt(f.value)} de ${fmt(f.max)} (${pct}%)`;
          const ly =
            cy - ((rows.length - 1) * LABEL_ROW_H) / 2 + i * LABEL_ROW_H;
          return (
            <g key={stableKey([s.label], i)}>
              <title>{tip}</title>
              {showLabels ? (
                <circle
                  cx={MARGIN.left}
                  cy={ly - TICK_DY}
                  r={POINT_RADIUS}
                  fill={color}
                />
              ) : null}
              {showLabels ? (
                <text
                  x={MARGIN.left + LABEL_TEXT_DX}
                  y={ly}
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  <title>{tip}</title>
                  {truncateLabel(s.label)}
                </text>
              ) : null}
              {showValues ? (
                <text
                  x={MARGIN.left + LABEL_COL_W - LABEL_GAP_PX}
                  y={ly}
                  textAnchor="end"
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.foreground}
                >
                  {fmt(f.value)}
                </text>
              ) : null}
            </g>
          );
        })}
        <g transform={`translate(${cx},${cy})`}>
          {rows.map((s, i) => {
            const f = fracs[i] ?? { value: 0, max: 100, frac: 0 };
            const rOuter = outer - i * step;
            const rInner = Math.max(0, rOuter - RING_THICKNESS);
            const color = seriesColor(i, s.color);
            const pct = Math.round(f.frac * PERCENT_FACTOR);
            const tip = `${s.label}: ${fmt(f.value)} de ${fmt(f.max)} (${pct}%)`;
            const track =
              arc().innerRadius(rInner).outerRadius(rOuter)({
                innerRadius: rInner,
                outerRadius: rOuter,
                startAngle: 0,
                endAngle: RADIAL_BAR_FULL,
              }) ?? "";
            const value =
              arc()
                .innerRadius(rInner)
                .outerRadius(rOuter)
                .cornerRadius(f.frac >= 1 ? 0 : corner)({
                innerRadius: rInner,
                outerRadius: rOuter,
                startAngle: start,
                endAngle: start + f.frac * RADIAL_BAR_FULL,
              }) ?? "";
            return (
              <g key={stableKey([s.label], i)}>
                <title>{tip}</title>
                <path
                  d={track}
                  fill={CHART_TOKEN.track}
                  data-chart-tip={f.frac > 0 ? undefined : tip}
                />
                {f.frac > 0 ? (
                  <path d={value} fill={color} data-chart-tip={tip} />
                ) : null}
              </g>
            );
          })}
        </g>
        {showTotal ? (
          <g transform={`translate(${cx},${cy})`} textAnchor="middle">
            <title>{`${totalLabel}: ${fmt(total)}`}</title>
            <text
              fontSize={RADIAL_TOTAL_FONT_SIZE}
              fontWeight={FONT_SEMIBOLD}
              fill={CHART_TOKEN.foreground}
            >
              {fmt(total)}
            </text>
            <text
              y={RADIAL_TOTAL_LABEL_DY}
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {totalLabel}
            </text>
          </g>
        ) : null}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={rows.map((s, i) => ({
            label: s.label,
            color: seriesColor(i, s.color),
          }))}
        />
      ) : null}
    </div>
  );
}
