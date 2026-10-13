/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scalePoint } from "d3-scale";
import { area, curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { CartesianFrame } from "../lib/cartesian";
import { domainWithZero } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  AREA_FILL_OPACITY,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
} from "../lib/theme";
import { pctOf, shareTip } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const POINT_PADDING = 0.5;

/** Props de AreaChart. */
export type AreaChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  stacked?: boolean;
  /** Apila a 100 % (implica `stacked`). */
  normalize?: boolean;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Muestra los puntos sobre cada dato (series densas: ocultar). */
  showPoints?: boolean;
  /** Opacidad del relleno del área. */
  fillOpacity?: number;
  /** Mínimo fijo del eje Y (se ignora con `normalize`). */
  yMin?: number;
  /** Máximo fijo del eje Y (se ignora con `normalize`). */
  yMax?: number;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
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
 * Áreas SSR (superpuestas o apiladas). Eje X por categorías.
 * Soporta negativos en modo superpuesto; en apilado/normalizado los
 * negativos se clamp a 0 (no se apilan negativos).
 */
export function AreaChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  stacked = false,
  normalize = false,
  curve = "monotone",
  showPoints = true,
  fillOpacity,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: AreaChartProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));
  // En apilado/normalize los negativos se clamp a 0: no se apilan negativos.
  const stackedTotals = data.map((d) =>
    series.reduce((acc, s) => acc + Math.max(0, toNumber(d[s.key])), 0),
  );
  const flat = data.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [autoLo, autoHi] = domainWithZero(
    stacked || normalize ? stackedTotals : flat,
  );
  const lo = normalize || yMin === undefined ? autoLo : toNumber(yMin, autoLo);
  const hi = normalize
    ? autoHi
    : yMax === undefined
      ? autoHi
      : toNumber(yMax, autoHi);
  const opacity = toNumber(fillOpacity ?? AREA_FILL_OPACITY, AREA_FILL_OPACITY);
  const areaCurve =
    curve === "step"
      ? curveStep
      : curve === "linear"
        ? curveLinear
        : curveMonotoneX;

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = (
    normalize
      ? scaleLinear().domain([0, 1])
      : scaleLinear()
          .domain([lo, Math.max(hi, lo + 1)])
          .nice(gridTicks)
  ).range([innerH, 0]);
  const ticks = y.ticks(gridTicks);
  const colors = seriesColors(series);
  const fmtY = resolveFormatter(formatY, locale);
  const fmt = normalize
    ? (v: number) => `${Math.round(v * PERCENT_FACTOR)}%`
    : fmtY;

  // Base acumulada por etiqueta cuando es apilada.
  const bases = new Map<string, number>(labels.map((l) => [l, 0]));

  return (
    <CartesianFrame
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      style={style}
      ticks={ticks}
      y={y}
      formatY={fmt}
      annotations={annotations}
      annLo={normalize ? 0 : lo}
      annHi={normalize ? 1 : hi}
      xLabels={labels.map((label) => ({ x: x(label) ?? 0, label }))}
      legendItems={
        showLegend
          ? series.map((s, i) => ({
              label: s.label,
              color: colors[i] ?? CHART_TOKEN.chart1,
            }))
          : undefined
      }
    >
      {series.map((s, si) => {
        const color = colors[si] ?? CHART_TOKEN.chart1;
        const pts = data.map((d, di) => {
          const label = String(d[xKey] ?? "");
          const raw = toNumber(d[s.key]);
          // En apilado/normalize los negativos se clamp a 0.
          const clamped = Math.max(0, raw);
          const total = stackedTotals[di] ?? 0;
          const value =
            normalize && total > 0
              ? clamped / total
              : stacked || normalize
                ? clamped
                : raw;
          const base = stacked || normalize ? (bases.get(label) ?? 0) : 0;
          if (stacked || normalize)
            bases.set(label, base + (normalize ? value : clamped));
          return { label, value, raw, base };
        });
        const areaPath =
          area<{ label: string; value: number; raw: number; base: number }>()
            .x((p) => x(p.label) ?? 0)
            .y0((p) => y(p.base))
            .y1((p) => y(p.base + p.value))
            .curve(areaCurve)(pts) ?? "";
        const linePath =
          line<{ label: string; value: number; raw: number; base: number }>()
            .x((p) => x(p.label) ?? 0)
            .y((p) => y(p.base + p.value))
            .curve(areaCurve)(pts) ?? "";
        return (
          <g key={s.key} transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            <title>{`${s.label}: total ${fmtY(pts.reduce((a, p) => a + p.raw, 0))}`}</title>
            <path d={areaPath} fill={color} opacity={opacity} />
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeWidth={LINE_WIDTH}
              strokeLinecap="round"
            />
            {showPoints
              ? pts.map((p, pi) => {
                  const total = stackedTotals[pi] ?? 0;
                  const tip = normalize
                    ? `${p.label} · ${s.label}: ${fmtY(p.raw)} (${pctOf(Math.max(0, p.raw), total)}%)`
                    : stacked
                      ? shareTip({
                          label: p.label,
                          series: s.label,
                          formatted: fmtY(p.raw),
                          value: Math.max(0, p.raw),
                          total,
                          multi: series.length >= 2,
                          of: "grupo",
                        })
                      : `${p.label} · ${s.label}: ${fmtY(p.raw)}`;
                  return (
                    <g key={stableKey([s.key, p.label], pi)}>
                      <title>{tip}</title>
                      <circle
                        cx={x(p.label) ?? 0}
                        cy={y(p.base + p.value)}
                        r={POINT_RADIUS}
                        fill={color}
                        stroke={CHART_TOKEN.background}
                        strokeWidth={POINT_BORDER}
                        data-chart-tip={tip}
                      />
                    </g>
                  );
                })
              : null}
          </g>
        );
      })}
    </CartesianFrame>
  );
}
