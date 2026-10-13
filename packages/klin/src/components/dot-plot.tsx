/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import type { ChartMargin } from "../lib/frame";
import { ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  FONT_SEMIBOLD,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS_SCATTER,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Props de DotPlot. */
export type DotPlotProps = {
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  valueKey: string;
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  /**
   * Override de color por punto. Si retorna `undefined` se usa el color base (`color`).
   */
  itemColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
  ) => string | undefined;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  /** Muestra etiquetas de categoría (eje Y). */
  showLabels?: boolean;
  /** Muestra el valor junto a cada punto. */
  showValues?: boolean;
  /** Ticks del grid del eje X. */
  gridTicks?: number;
  /** Orden por valor (`none` respeta el orden de entrada). */
  sortBy?: "none" | "asc" | "desc";
  /** Tope de filas (SSR acotado). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

const DOT_SORT_NONE = "none";

const DOT_W = 640;
const DOT_MARGIN: ChartMargin = { top: 12, right: 48, bottom: 32, left: 132 };
const DOT_BAND_PADDING = 0.35;
const DOT_LABEL_MAX = 20;
const DOT_STEM_OPACITY = 0.5;
const DOT_VALUE_GAP = 6;
const DOT_AXIS_LABEL_OFFSET = 10;

type DotRow = {
  label: string;
  value: number;
  datum: Record<string, string | number>;
};

/**
 * Puntos SSR horizontales estilo Cleveland (un punto por categoría sobre
 * eje X lineal honesto con cero + tallo tenue desde la línea de cero).
 * Soporta negativos; filtra no-finitos; tope DEFAULT_MAX_ROWS.
 */
export function DotPlot({
  data,
  categoryKey,
  valueKey,
  ariaLabel,
  height = 260,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  color,
  itemColor,
  className,
  style,
  ariaDescribedBy,
  annotations,
  showLabels = true,
  showValues = true,
  gridTicks = GRID_TICKS,
  sortBy = DOT_SORT_NONE,
  maxItems = DEFAULT_MAX_ROWS,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DotPlotProps) {
  const rawTicks = Math.floor(toNumber(gridTicks, GRID_TICKS));
  const safeTicks =
    Number.isFinite(rawTicks) && rawTicks > 0 ? rawTicks : GRID_TICKS;
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const sortMode =
    sortBy === "asc" || sortBy === "desc" ? sortBy : DOT_SORT_NONE;
  const computed: DotRow[] = [];
  for (const d of data.slice(0, safeMax)) {
    const value = toNumber(d[valueKey], Number.NaN);
    if (!Number.isFinite(value)) continue;
    computed.push({ label: String(d[categoryKey] ?? ""), value, datum: d });
  }
  if (sortMode !== DOT_SORT_NONE) {
    computed.sort((a, b) =>
      sortMode === "asc" ? a.value - b.value : b.value - a.value,
    );
  }
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = DOT_W - DOT_MARGIN.left - DOT_MARGIN.right;
  const innerH = height - DOT_MARGIN.top - DOT_MARGIN.bottom;
  const [lo, hi] = domainWithZero(computed.map((r) => r.value));
  const x = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(safeTicks)
    .range([0, innerW]);
  const y0 = scaleBand()
    .domain(computed.map((r) => r.label))
    .range([0, innerH])
    .padding(DOT_BAND_PADDING);
  const ticks = x.ticks(safeTicks);
  const fill = seriesColor(0, color);
  const x0 = DOT_MARGIN.left + x(0);

  return (
    <ChartSvg
      width={DOT_W}
      height={height}
      ariaLabel={ariaLabel}
      className={className ? `h-auto w-full ${className}` : undefined}
      style={style}
      ariaDescribedBy={ariaDescribedBy}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={DOT_MARGIN.left + x(t)}
            x2={DOT_MARGIN.left + x(t)}
            y1={DOT_MARGIN.top}
            y2={height - DOT_MARGIN.bottom}
            stroke={CHART_TOKEN.border}
            strokeWidth={GRID_WIDTH}
          />
          <text
            x={DOT_MARGIN.left + x(t)}
            y={height - DOT_AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {format(t)}
          </text>
        </g>
      ))}
      {(annotations ?? []).map((a, ai) => {
        const clamped = Math.min(hi, Math.max(lo, toNumber(a.value)));
        const ax = DOT_MARGIN.left + x(clamped);
        const stroke = a.color ?? CHART_TOKEN.accent;
        return (
          <g key={stableKey([a.label ?? `${a.value}`], ai)}>
            <title>{a.label ?? format(a.value)}</title>
            <line
              x1={ax}
              x2={ax}
              y1={DOT_MARGIN.top}
              y2={height - DOT_MARGIN.bottom}
              stroke={stroke}
              strokeWidth={ANNOTATION_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
            />
            {a.label ? (
              <text
                x={ax + TICK_GAP_PX}
                y={DOT_MARGIN.top + TICK_GAP_PX}
                fontSize={TICK_FONT_SIZE}
                fill={stroke}
              >
                {a.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {computed.map((r, ri) => {
        const cy = DOT_MARGIN.top + (y0(r.label) ?? 0) + y0.bandwidth() / 2;
        const cx = DOT_MARGIN.left + x(r.value);
        const tip = `${r.label}: ${format(r.value)}`;
        const c = itemColor?.(r.datum, ri) ?? fill;
        const right = r.value >= 0;
        return (
          <g key={stableKey([r.label], ri)}>
            <title>{tip}</title>
            {showLabels ? (
              <text
                x={DOT_MARGIN.left - TICK_GAP_PX}
                y={cy}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{r.label}</title>
                {truncateLabel(r.label, DOT_LABEL_MAX)}
              </text>
            ) : null}
            <line
              x1={x0}
              x2={cx}
              y1={cy}
              y2={cy}
              stroke={c}
              strokeWidth={LINE_WIDTH}
              strokeOpacity={DOT_STEM_OPACITY}
            />
            <circle
              cx={cx}
              cy={cy}
              r={POINT_RADIUS_SCATTER}
              fill={c}
              stroke={CHART_TOKEN.background}
              strokeWidth={POINT_BORDER}
              data-chart-tip={tip}
            />
            {showValues ? (
              <text
                x={cx + (right ? DOT_VALUE_GAP : -DOT_VALUE_GAP)}
                y={cy}
                dy={TICK_DY}
                textAnchor={right ? "start" : "end"}
                fontSize={TICK_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {format(r.value)}
              </text>
            ) : null}
          </g>
        );
      })}
    </ChartSvg>
  );
}
