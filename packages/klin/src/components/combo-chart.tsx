/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import { curveLinear, curveMonotoneX, curveStep, line } from "d3-shape";
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
import { seriesColors, truncateLabel } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  LINE_WIDTH,
  MIN_SHAPE_PX,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
  ZERO_MARK_PX,
} from "../lib/theme";
import { shareTip } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const GROUP_BAND_PADDING = 0.22;
const SERIES_BAND_PADDING = 0.08;
/** Margen derecho ampliado para los ticks del eje Y derecho. */
const RIGHT_MARGIN_WIDE = 44;

/** Props de ComboChart. */
export type ComboChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  /** Series de barras (agrupadas, eje Y izquierdo). */
  bars: ChartSeries[];
  /** Series de línea (puntos en el centro de cada grupo). */
  lines: ChartSeries[];
  /** Las líneas usan escala propia con ticks a la derecha. */
  yAxisRight?: boolean;
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Muestra los puntos sobre cada dato de línea. */
  showPoints?: boolean;
  /** Mínimo fijo del eje Y izquierdo (barras). */
  yMin?: number;
  /** Máximo fijo del eje Y izquierdo (barras). */
  yMax?: number;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /**
   * Override de color por barra (p. ej. una serie con un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  barColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
    serie: ChartSeries,
    serieIndex: number,
  ) => string | undefined;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Barras + líneas SSR sobre el mismo eje X (el compuesto clásico de
 * dashboards). Las barras mandan en el eje Y izquierdo; con `yAxisRight`
 * las líneas llevan escala propia con ticks a la derecha.
 */
export function ComboChart({
  data,
  xKey,
  bars,
  lines,
  yAxisRight = false,
  height = 260,
  ariaLabel,
  formatY,
  curve = "monotone",
  showPoints = true,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  barColor,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ComboChartProps) {
  if (isBlank(data) || (isBlank(bars) && isBlank(lines))) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = resolveFormatter(formatY, locale);
  const margin = yAxisRight ? { ...MARGIN, right: RIGHT_MARGIN_WIDE } : MARGIN;
  const innerW = W - margin.left - margin.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const labels = data.map((d) => String(d[xKey] ?? ""));

  const barFlat = data.flatMap((d) => bars.map((s) => toNumber(d[s.key])));
  const [autoLo, autoHi] = domainWithZero(barFlat);
  const lo = yMin === undefined ? autoLo : toNumber(yMin, autoLo);
  const hi = Math.max(
    yMax === undefined ? autoHi : toNumber(yMax, autoHi),
    lo + 1,
  );
  const lineFlat = data.flatMap((d) => lines.map((s) => toNumber(d[s.key])));
  const [rightAutoLo, rightAutoHi] = domainWithZero(lineFlat);
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(gridTicks)
    .range([innerH, 0]);
  const yR = scaleLinear()
    .domain([rightAutoLo, Math.max(rightAutoHi, rightAutoLo + 1)])
    .nice(gridTicks)
    .range([innerH, 0]);
  const yLine = yAxisRight ? yR : y;
  const x0 = scaleBand()
    .domain(labels)
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const x1 = scaleBand()
    .domain(bars.map((s) => s.key))
    .range([0, x0.bandwidth()])
    .padding(SERIES_BAND_PADDING);

  const ticks = y.ticks(gridTicks);
  const rightTicks = yAxisRight ? yR.ticks(gridTicks) : [];
  const barColors = seriesColors(bars);
  const lineColors = seriesColors(lines);
  const y0 = y(0);
  const totals = data.map((d) =>
    bars.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );
  const lineTotals = data.map((d) =>
    lines.reduce((acc, s) => acc + toNumber(d[s.key]), 0),
  );
  const multi = bars.length + lines.length >= 2;
  const legendItems = showLegend
    ? [
        ...bars.map((s, i) => ({
          label: s.label,
          color: barColors[i] ?? CHART_TOKEN.chart1,
        })),
        ...lines.map((s, i) => ({
          label: s.label,
          color: lineColors[i] ?? CHART_TOKEN.chart1,
        })),
      ]
    : undefined;

  const lineCurve =
    curve === "step"
      ? curveStep
      : curve === "linear"
        ? curveLinear
        : curveMonotoneX;
  const pathFor = (key: string) =>
    line<{ label: string; value: number }>()
      .x((p) => (x0(p.label) ?? 0) + x0.bandwidth() / 2)
      .y((p) => yLine(p.value))
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
      margin={margin}
      ticks={ticks}
      y={y}
      formatY={fmtY}
      annotations={annotations}
      annLo={lo}
      annHi={hi}
      xLabels={labels.map((label) => ({
        x: (x0(label) ?? 0) + x0.bandwidth() / 2,
        label: truncateLabel(label),
        title: label,
      }))}
      legendItems={legendItems}
    >
      {data.map((d, di) => {
        const group = String(d[xKey] ?? "");
        const barTotal = totals[di] ?? 0;
        const combined = barTotal + (lineTotals[di] ?? 0);
        return (
          <g key={stableKey([group], di)}>
            {bars.map((s, si) => {
              const value = toNumber(d[s.key]);
              const bw = bars.length > 1 ? x1.bandwidth() : x0.bandwidth();
              const bx =
                MARGIN.left +
                (x0(group) ?? 0) +
                (bars.length > 1 ? (x1(s.key) ?? 0) : 0);
              const yV = y(value);
              const rectY =
                value === 0
                  ? MARGIN.top + y0 - ZERO_MARK_PX / 2
                  : MARGIN.top + Math.min(y0, yV);
              const rectH =
                value === 0
                  ? ZERO_MARK_PX
                  : Math.max(MIN_SHAPE_PX, Math.abs(y0 - yV));
              const tip = shareTip({
                label: group,
                series: s.label,
                formatted: fmtY(value),
                value,
                total: barTotal,
                multi,
                of: "grupo",
              });
              const fill = barColor?.(d, di, s, si) ?? barColors[si];
              return (
                <g key={s.key}>
                  <title>{tip}</title>
                  <rect
                    x={bx}
                    y={rectY}
                    width={Math.max(MIN_SHAPE_PX, bw)}
                    height={rectH}
                    rx={BAR_RADIUS}
                    fill={fill}
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
            {lines.map((s, si) => {
              const color = lineColors[si] ?? CHART_TOKEN.chart1;
              const cx = MARGIN.left + (x0(group) ?? 0) + x0.bandwidth() / 2;
              const value = toNumber(d[s.key]);
              const tip = shareTip({
                label: group,
                series: s.label,
                formatted: fmtY(value),
                value,
                total: combined,
                multi,
                of: "grupo",
              });
              return (
                <g key={s.key}>
                  {showPoints ? (
                    <g key={`${s.key}-pt`}>
                      <title>{tip}</title>
                      <circle
                        cx={cx}
                        cy={MARGIN.top + yLine(value)}
                        r={POINT_RADIUS}
                        fill={color}
                        stroke={CHART_TOKEN.background}
                        strokeWidth={POINT_BORDER}
                        data-chart-tip={tip}
                      />
                    </g>
                  ) : (
                    <title>{tip}</title>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
      {lines.map((s, si) => (
        <path
          key={`combo-line-${s.key}`}
          d={pathFor(s.key) ?? ""}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
          fill="none"
          stroke={lineColors[si] ?? CHART_TOKEN.chart1}
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
      ))}
      {yAxisRight
        ? rightTicks.map((t) => (
            <g key={`yr-${t}`}>
              <text
                x={W - margin.right + TICK_GAP_PX}
                y={MARGIN.top + yR(t)}
                dy={TICK_DY}
                textAnchor="start"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {fmtY(t)}
              </text>
            </g>
          ))
        : null}
    </CartesianFrame>
  );
}
