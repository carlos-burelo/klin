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
  POINT_BORDER,
  POINT_RADIUS,
} from "../lib/theme";
import { shareTip } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const POINT_PADDING = 0.5;

/** Props de LineChart. */
export type LineChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Muestra los puntos sobre cada dato (series densas: ocultar). */
  showPoints?: boolean;
  /** Rellena el área bajo cada línea. */
  showArea?: boolean;
  /** Mínimo fijo del eje Y (por defecto se deriva de los datos). */
  yMin?: number;
  /** Máximo fijo del eje Y (por defecto se deriva de los datos). */
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
 * Líneas SSR con puntos. Eje X por categorías (orden de `data`).
 * Soporta negativos y filtra no-finitos como 0.
 */
export function LineChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  curve = "monotone",
  showPoints = true,
  showArea = false,
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
}: LineChartProps) {
  if (isBlank(data) || isBlank(series)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = resolveFormatter(formatY, locale);

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));

  const flat = data.flatMap((d) => series.map((s) => toNumber(d[s.key])));
  const [autoLo, autoHi] = domainWithZero(flat);
  const lo = yMin === undefined ? autoLo : toNumber(yMin, autoLo);
  const hi = Math.max(
    yMax === undefined ? autoHi : toNumber(yMax, autoHi),
    lo + 1,
  );

  const x = scalePoint()
    .domain(labels)
    .range([0, innerW])
    .padding(POINT_PADDING);
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(gridTicks)
    .range([innerH, 0]);
  const ticks = y.ticks(gridTicks);
  const colors = seriesColors(series);
  const totals = data.map((d) =>
    series.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );
  const legendItems = showLegend
    ? series.map((s, i) => ({
        label: s.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

  const lineCurve =
    curve === "step"
      ? curveStep
      : curve === "linear"
        ? curveLinear
        : curveMonotoneX;

  const pathFor = (key: string) =>
    line<{ label: string; value: number }>()
      .x((p) => x(p.label) ?? 0)
      .y((p) => y(p.value))
      .curve(lineCurve)(
      data.map((d) => ({
        label: String(d[xKey] ?? ""),
        value: toNumber(d[key]),
      })),
    );

  const areaFor = (key: string) =>
    area<{ label: string; value: number }>()
      .x((p) => x(p.label) ?? 0)
      .y0(() => y(lo))
      .y1((p) => y(p.value))
      .curve(lineCurve)(
      data.map((d) => ({
        label: String(d[xKey] ?? ""),
        value: toNumber(d[key]),
      })),
    );

  return (
    <CartesianFrame
      height={height}
      ariaLabel={ariaLabel}
      ariaDescribedBy={ariaDescribedBy}
      className={className}
      style={style}
      ticks={ticks}
      y={y}
      formatY={fmtY}
      annotations={annotations}
      annLo={lo}
      annHi={hi}
      xLabels={labels.map((label) => ({ x: x(label) ?? 0, label }))}
      legendItems={legendItems}
    >
      {series.map((s, si) => (
        <g key={s.key}>
          {showArea ? (
            <path
              d={areaFor(s.key) ?? ""}
              transform={`translate(${MARGIN.left},${MARGIN.top})`}
              fill={colors[si] ?? CHART_TOKEN.chart1}
              opacity={AREA_FILL_OPACITY}
            />
          ) : null}
          <path
            d={pathFor(s.key) ?? ""}
            transform={`translate(${MARGIN.left},${MARGIN.top})`}
            fill="none"
            stroke={colors[si] ?? CHART_TOKEN.chart1}
            strokeWidth={LINE_WIDTH}
            strokeLinecap="round"
          />
          {showPoints
            ? data.map((d, di2) => {
                const label = String(d[xKey] ?? "");
                const value = toNumber(d[s.key]);
                const total = totals[di2] ?? 0;
                const tip = shareTip({
                  label,
                  series: s.label,
                  formatted: fmtY(value),
                  value,
                  total,
                  multi: series.length >= 2,
                  of: "grupo",
                });
                return (
                  <g key={stableKey([s.key, label], di2)}>
                    <title>{tip}</title>
                    <circle
                      cx={MARGIN.left + (x(label) ?? 0)}
                      cy={MARGIN.top + y(value)}
                      r={POINT_RADIUS}
                      fill={colors[si] ?? CHART_TOKEN.chart1}
                      stroke={CHART_TOKEN.background}
                      strokeWidth={POINT_BORDER}
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })
            : null}
        </g>
      ))}
    </CartesianFrame>
  );
}
