/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scalePoint } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_SEMIBOLD,
  GRID_TICKS,
  LINE_WIDTH,
  NODE_BORDER_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Props de LollipopChart. */
export type LollipopChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  color?: string;
  /**
   * Override de color por punto (p. ej. un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  itemColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
  ) => string | undefined;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
  /** Estilo del tallo: continuo o punteado. */
  stemStyle?: "solid" | "dashed";
  /** Orden de grupos por valor. */
  sortGroups?: "none" | "asc" | "desc";
  /** Etiqueta de valor sobre cada punto (hoy siempre visible). */
  showValues?: boolean;
};

const POINT_PADDING = 0.5;
const AXIS_LABEL_OFFSET = 10;
const VALUE_LABEL_DY = 10;
const LOLLIPOP_RADIUS = 5;
const STEM_OPACITY = 0.5;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

/**
 * Paleta SSR (puntos sobre palos): una serie con valores rotulados.
 * Soporta negativos (dominio con cero, tallo desde la línea de cero).
 */
export function LollipopChart({
  data,
  xKey,
  yKey,
  ariaLabel,
  height = 260,
  formatY,
  color,
  itemColor,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  stemStyle = "solid",
  sortGroups = "none",
  showValues = true,
}: LollipopChartProps) {
  if (isBlank(data)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const ordered = [...data];
  if (sortGroups !== "none") {
    ordered.sort((a, b) =>
      sortGroups === "asc"
        ? toNumber(a[yKey]) - toNumber(b[yKey])
        : toNumber(b[yKey]) - toNumber(a[yKey]),
    );
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const [lo, hi] = domainWithZero(ordered.map((d) => toNumber(d[yKey])));

  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([innerH, 0]);
  const y0 = y(0);
  const x = scalePoint()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(POINT_PADDING);
  const ticks = y.ticks(GRID_TICKS);
  const fill = seriesColor(0, color);
  const fmtY = resolveFormatter(formatY, locale);

  return (
    <ChartSvg
      width={W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
    >
      <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
      {(annotations ?? []).map((a, ai) => {
        if (a.value < lo || a.value > hi) return null;
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
      {ordered.map((d, di) => {
        const group = String(d[xKey] ?? "");
        const value = toNumber(d[yKey]);
        const cx = MARGIN.left + (x(group) ?? 0);
        const tip = `${group}: ${fmtY(value)}`;
        const c = itemColor?.(d, di) ?? fill;
        return (
          <g key={stableKey([group], di)}>
            <title>{tip}</title>
            <line
              x1={cx}
              x2={cx}
              y1={MARGIN.top + y0}
              y2={MARGIN.top + y(value)}
              stroke={c}
              strokeWidth={LINE_WIDTH}
              strokeOpacity={STEM_OPACITY}
              strokeDasharray={
                stemStyle === "dashed" ? ANNOTATION_DASH : undefined
              }
            />
            <circle
              cx={cx}
              cy={MARGIN.top + y(value)}
              r={LOLLIPOP_RADIUS}
              fill={c}
              stroke={CHART_TOKEN.background}
              strokeWidth={NODE_BORDER_WIDTH}
              data-chart-tip={tip}
            />
            {showValues ? (
              <text
                x={cx}
                y={MARGIN.top + y(value) - VALUE_LABEL_DY}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {fmtY(value)}
              </text>
            ) : null}
            <text
              x={cx}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              <title>{group}</title>
              {truncateLabel(group)}
            </text>
          </g>
        );
      })}
    </ChartSvg>
  );
}
