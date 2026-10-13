/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear } from "d3-scale";
import type { CSSProperties } from "react";
import { domainWithZero } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LABEL_GAP_PX,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type SlopeDatum = {
  label: string;
  from: number;
  to: number;
  color?: string;
};

/** Props de SlopeChart. */
export type SlopeChartProps = {
  data: SlopeDatum[];
  fromLabel: string;
  toLabel: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas de fila a la izquierda. */
  showLabels?: boolean;
  /** Muestra los valores de destino a la derecha. */
  showValues?: boolean;
  /** Ordena las filas por delta descendente (por defecto respeta la entrada). */
  sortGroups?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const SLOPE_MARGIN_TOP = 30;
const SLOPE_MARGIN_RIGHT = 116;
const SLOPE_MARGIN_BOTTOM = 18;
const SLOPE_MARGIN_LEFT = 116;
const SLOPE_HEADER_Y = 18;
const SLOPE_LABEL_MAX = 16;
const SLOPE_UP_SIGN = "+";
const SLOPE_DOWN_SIGN = "−";

/**
 * Pendientes SSR (dos ejes verticales con escala compartida; etiquetas
 * a la izquierda, valores a la derecha). Subida chart1, bajada
 * destructive, salvo color por fila. Filtra no-finitos.
 */
export function SlopeChart({
  data,
  fromLabel,
  toLabel,
  ariaLabel,
  height = 260,
  formatY,
  locale = DEFAULT_LOCALE,
  showLabels = true,
  showValues = true,
  sortGroups = false,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: SlopeChartProps) {
  const rows: Array<{
    label: string;
    from: number;
    to: number;
    color?: string;
  }> = [];
  for (const d of data) {
    const from = toNumber(d.from, Number.NaN);
    const to = toNumber(d.to, Number.NaN);
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    rows.push({ label: d.label, from, to, color: d.color });
  }
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered = sortGroups
    ? [...rows].sort((a, b) => b.to - b.from - (a.to - a.from))
    : rows;

  const fmtY = resolveFormatter(formatY, locale);
  const innerH = height - SLOPE_MARGIN_TOP - SLOPE_MARGIN_BOTTOM;
  const [lo, hi] = domainWithZero([
    ...ordered.map((r) => r.from),
    ...ordered.map((r) => r.to),
  ]);
  const y = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(GRID_TICKS)
    .range([innerH, 0]);
  const lx = SLOPE_MARGIN_LEFT;
  const rx = W - SLOPE_MARGIN_RIGHT;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <text
          x={lx}
          y={SLOPE_HEADER_Y}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {truncateLabel(fromLabel)}
        </text>
        <text
          x={rx}
          y={SLOPE_HEADER_Y}
          textAnchor="middle"
          fontSize={TICK_FONT_SIZE}
          fill={CHART_TOKEN.muted}
        >
          {truncateLabel(toLabel)}
        </text>
        <line
          x1={lx}
          x2={lx}
          y1={SLOPE_MARGIN_TOP}
          y2={SLOPE_MARGIN_TOP + innerH}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        <line
          x1={rx}
          x2={rx}
          y1={SLOPE_MARGIN_TOP}
          y2={SLOPE_MARGIN_TOP + innerH}
          stroke={CHART_TOKEN.border}
          strokeWidth={GRID_WIDTH}
        />
        {ordered.map((row, i) => {
          const delta = row.to - row.from;
          const color =
            row.color ??
            (delta >= 0 ? CHART_TOKEN.chart1 : CHART_TOKEN.destructive);
          const sign = delta < 0 ? SLOPE_DOWN_SIGN : SLOPE_UP_SIGN;
          const tip =
            `${row.label}: ${fmtY(row.from)} → ${fmtY(row.to)} ` +
            `(Δ ${sign}${fmtY(Math.abs(delta))})`;
          const y1 = SLOPE_MARGIN_TOP + y(row.from);
          const y2 = SLOPE_MARGIN_TOP + y(row.to);
          return (
            <g key={stableKey([row.label], i)}>
              <title>{tip}</title>
              <line
                x1={lx}
                x2={rx}
                y1={y1}
                y2={y2}
                stroke={color}
                strokeWidth={LINE_WIDTH}
                strokeLinecap="round"
              />
              <circle
                cx={lx}
                cy={y1}
                r={POINT_RADIUS}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
              <circle
                cx={rx}
                cy={y2}
                r={POINT_RADIUS}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
                data-chart-tip={tip}
              />
              {showLabels ? (
                <text
                  x={lx - LABEL_GAP_PX}
                  y={y1}
                  dy={TICK_DY}
                  textAnchor="end"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  {truncateLabel(row.label, SLOPE_LABEL_MAX)}
                </text>
              ) : null}
              {showValues ? (
                <text
                  x={rx + LABEL_GAP_PX}
                  y={y2}
                  dy={TICK_DY}
                  textAnchor="start"
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.muted}
                >
                  {fmtY(row.to)}
                </text>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
    </div>
  );
}
