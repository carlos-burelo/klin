/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { max, min } from "d3-array";
import { scaleLinear } from "d3-scale";
import { area, curveMonotoneX, line } from "d3-shape";
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  MIN_SHAPE_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Relleno lateral/vertical, holgura del dominio y estilo de línea/punto. */
const SPARK_PAD = 2;
const SPARK_DOMAIN_PAD_RATIO = 0.1;
const SPARK_AREA_OPACITY = 0.18;
/** Opacidad del área en modo `area` (más presente que en `line`). */
const SPARK_AREA_OPACITY_STRONG = 0.35;
const SPARK_LINE_WIDTH = 1.75;
const SPARK_END_DOT_R = 2.5;
/** Ancho mínimo de barra en modo `bar` (fracción del paso). */
const SPARK_BAR_WIDTH_RATIO = 0.7;

/** Props de la minigráfica SSR para celdas y KPIs. */
export type SparklineProps = {
  values: number[];
  ariaLabel: string;
  /**
   * Tipo de trazo: línea, área o barras (con BAR_RADIUS).
   * @default "line"
   */
  kind?: "line" | "area" | "bar";
  /**
   * Muestra el punto del último valor.
   * @default true
   */
  showLastDot?: boolean;
  /**
   * Marca los puntos mínimo y máximo.
   * @default false
   */
  showMinMax?: boolean;
  /**
   * Línea de meta en unidades de los valores (se omite si no es finita).
   * @default undefined
   */
  reference?: number;
  width?: number;
  height?: number;
  color?: string;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Minigráfica SSR para celdas de tabla y KPIs (sin ejes).
 */
export function Sparkline({
  values,
  ariaLabel,
  kind = "line",
  showLastDot = true,
  showMinMax = false,
  reference,
  width = 120,
  height = 36,
  color,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: SparklineProps) {
  if (values.length < 2) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  // Conteos: negativos se fijan a 0.
  const counts = values.map((v) => Math.max(0, toNumber(v)));
  const lo = min(counts) ?? 0;
  const hi = max(counts) ?? 1;
  const span = hi - lo || 1;
  const x = scaleLinear()
    .domain([0, counts.length - 1])
    .range([SPARK_PAD, width - SPARK_PAD]);
  const y = scaleLinear()
    .domain([
      lo - span * SPARK_DOMAIN_PAD_RATIO,
      hi + span * SPARK_DOMAIN_PAD_RATIO,
    ])
    .range([height - SPARK_PAD, SPARK_PAD]);

  const pts = counts.map((v, i) => ({ i, v }));
  const stroke = seriesColor(0, color);
  const linePath =
    line<{ i: number; v: number }>()
      .x((p) => x(p.i))
      .y((p) => y(p.v))
      .curve(curveMonotoneX)(pts) ?? "";
  const areaPath =
    area<{ i: number; v: number }>()
      .x((p) => x(p.i))
      .y0(height)
      .y1((p) => y(p.v))
      .curve(curveMonotoneX)(pts) ?? "";
  const last = counts[counts.length - 1] ?? 0;
  const tip = `${ariaLabel}: ${formatDefault(last, locale)} (min ${formatDefault(lo, locale)}, max ${formatDefault(hi, locale)})`;
  // Índices de mínimo y máximo (primera aparición; uno solo si la serie es plana).
  const minIdx = counts.indexOf(lo);
  const maxIdx = counts.indexOf(hi);
  const extremeIdx = [...new Set([minIdx, maxIdx])].filter((i) => i >= 0);
  const ref = toNumber(reference, Number.NaN);
  const showRef = Number.isFinite(ref);
  const refY = showRef
    ? Math.min(height - SPARK_PAD, Math.max(SPARK_PAD, y(ref)))
    : 0;
  const refTip = showRef ? `Meta: ${formatDefault(ref, locale)}` : "";
  const barStep = (width - SPARK_PAD * 2) / Math.max(1, counts.length - 1);
  const barW = Math.max(MIN_SHAPE_PX, barStep * SPARK_BAR_WIDTH_RATIO);
  const isBar = kind === "bar";
  const areaOpacity =
    kind === "area" ? SPARK_AREA_OPACITY_STRONG : SPARK_AREA_OPACITY;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className ? `h-auto ${className}` : "h-auto"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{tip}</title>
      {isBar ? (
        <g>
          {counts.map((v, i) => {
            const bx = x(i) - barW / 2;
            const by = y(v);
            const bh = Math.max(MIN_SHAPE_PX, height - by);
            const barTip = formatDefault(v, locale);
            return (
              <g key={stableKey(["barra", v], i)}>
                <title>{barTip}</title>
                <rect
                  x={bx}
                  y={by}
                  width={barW}
                  height={bh}
                  rx={BAR_RADIUS}
                  fill={stroke}
                  data-chart-tip={
                    i === counts.length - 1 && !showLastDot ? tip : barTip
                  }
                />
              </g>
            );
          })}
        </g>
      ) : (
        <>
          <path d={areaPath} fill={stroke} opacity={areaOpacity} />
          <path
            d={linePath}
            fill="none"
            stroke={stroke}
            strokeWidth={SPARK_LINE_WIDTH}
            strokeLinecap="round"
            data-chart-tip={showLastDot ? undefined : tip}
          />
        </>
      )}
      {showRef ? (
        <line
          x1={SPARK_PAD}
          x2={width - SPARK_PAD}
          y1={refY}
          y2={refY}
          stroke={CHART_TOKEN.muted}
          strokeWidth={ANNOTATION_WIDTH}
          strokeDasharray={ANNOTATION_DASH}
          data-chart-tip={refTip}
        >
          <title>{refTip}</title>
        </line>
      ) : null}
      {showMinMax
        ? extremeIdx.map((i) => {
            const v = counts[i] ?? 0;
            const isMax = i === maxIdx;
            const mmTip = `${isMax ? "Máx" : "Mín"}: ${formatDefault(v, locale)}`;
            return (
              <g key={stableKey(["extremo", v], i)}>
                <title>{mmTip}</title>
                <circle
                  cx={x(i)}
                  cy={y(v)}
                  r={SPARK_END_DOT_R}
                  fill={isMax ? stroke : CHART_TOKEN.muted}
                  data-chart-tip={mmTip}
                />
              </g>
            );
          })
        : null}
      {showLastDot ? (
        <circle
          cx={x(counts.length - 1)}
          cy={y(last)}
          r={SPARK_END_DOT_R}
          fill={stroke}
          data-chart-tip={tip}
        />
      ) : null}
    </svg>
  );
}
