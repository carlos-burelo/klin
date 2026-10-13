/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scalePoint } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import type { CSSProperties } from "react";
import { ChartSvg, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  GRID_TICKS,
  GRID_WIDTH,
  LABEL_GAP_PX,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

export type BumpSeries = {
  label: string;
  ranks: number[];
  color?: string;
};

/** Props de BumpChart. */
export type BumpChartProps = {
  periods: string[];
  series: BumpSeries[];
  ariaLabel: string;
  height?: number;
  locale?: string;
  /** Formato de los puestos (por defecto locale). */
  formatRank?: ValueFormatter;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /** Muestra la leyenda de series (por defecto oculta: ya hay etiquetas laterales). */
  showLegend?: boolean;
  /** Ticks del grid de puestos (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra los puntos de cada periodo. */
  showPoints?: boolean;
  /** Muestra el puesto sobre cada punto. */
  showValues?: boolean;
  /** Radio de los puntos (por defecto POINT_RADIUS). */
  pointRadius?: number;
  /** Conserva las N series con mejor puesto final (resto fuera). */
  topN?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

type BumpPoint = {
  period: string;
  rank: number;
};

const BUMP_MARGIN_TOP = 12;
const BUMP_MARGIN_RIGHT = 72;
const BUMP_MARGIN_BOTTOM = 32;
const BUMP_MARGIN_LEFT = 72;
const BUMP_POINT_PADDING = 0.5;
const BUMP_AXIS_LABEL_OFFSET = 10;
const BUMP_LABEL_MAX = 10;
const BUMP_MIN_RANK = 1;
/** Mínimo de ticks y separación de la etiqueta de valor. */
const TICKS_MIN = 1;
const VALUE_LABEL_GAP = 4;

/**
 * Carreras de puestos SSR (eje Y = rank invertido 1..N, líneas suaves).
 * Los ranks se normalizan a enteros ≥ 1; filtra no-finitos.
 */
export function BumpChart({
  periods,
  series,
  ariaLabel,
  height = 260,
  locale = "es-MX",
  formatRank,
  className,
  style,
  ariaDescribedBy,
  showLegend = false,
  gridTicks = GRID_TICKS,
  showPoints = true,
  showValues = false,
  pointRadius = POINT_RADIUS,
  topN,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BumpChartProps) {
  const rows = series.map((s, si) => {
    const pts: BumpPoint[] = [];
    const count = Math.min(s.ranks.length, periods.length);
    for (let i = 0; i < count; i++) {
      const rank = toNumber(s.ranks[i], Number.NaN);
      if (!Number.isFinite(rank)) continue;
      pts.push({
        period: periods[i] ?? "",
        rank: Math.max(BUMP_MIN_RANK, Math.round(rank)),
      });
    }
    return { label: s.label, color: s.color, points: pts, si };
  });
  const wanted =
    topN === undefined ? Number.NaN : Math.floor(toNumber(topN, Number.NaN));
  const visible =
    Number.isFinite(wanted) && wanted >= 0
      ? rows
          .filter((r) => r.points.length > 0)
          .sort(
            (a, b) =>
              (a.points[a.points.length - 1]?.rank ?? BUMP_MIN_RANK) -
              (b.points[b.points.length - 1]?.rank ?? BUMP_MIN_RANK),
          )
          .slice(0, wanted)
      : rows;
  const total = visible.length;
  if (periods.length === 0 || !visible.some((r) => r.points.length > 0)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtRank = formatRank ?? ((v: number) => formatDefault(v, locale));
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const dotR = Math.max(0, toNumber(pointRadius, POINT_RADIUS));
  const innerW = W - BUMP_MARGIN_LEFT - BUMP_MARGIN_RIGHT;
  const innerH = height - BUMP_MARGIN_TOP - BUMP_MARGIN_BOTTOM;
  let top = BUMP_MIN_RANK;
  for (const row of visible) {
    for (const p of row.points) top = Math.max(top, p.rank);
  }
  const y = scaleLinear()
    .domain([BUMP_MIN_RANK, Math.max(top, BUMP_MIN_RANK + 1)])
    .range([innerH, 0]);
  const ticks = y.ticks(safeTicks).filter((t) => Number.isInteger(t));
  const x = scalePoint()
    .domain(periods)
    .range([0, innerW])
    .padding(BUMP_POINT_PADDING);
  const firstX = x(periods[0] ?? "") ?? 0;
  const lastX = x(periods[periods.length - 1] ?? "") ?? 0;

  const pathFor = (pts: BumpPoint[]) =>
    line<BumpPoint>()
      .x((p) => BUMP_MARGIN_LEFT + (x(p.period) ?? 0))
      .y((p) => BUMP_MARGIN_TOP + y(p.rank))
      .curve(curveMonotoneX)(pts);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={BUMP_MARGIN_LEFT + firstX}
              x2={BUMP_MARGIN_LEFT + lastX}
              y1={BUMP_MARGIN_TOP + y(t)}
              y2={BUMP_MARGIN_TOP + y(t)}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={BUMP_MARGIN_LEFT - TICK_GAP_PX}
              y={BUMP_MARGIN_TOP + y(t)}
              dy={TICK_DY}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmtRank(t)}
            </text>
          </g>
        ))}
        {periods.map((p, i) => (
          <text
            key={stableKey([p], i)}
            x={BUMP_MARGIN_LEFT + (x(p) ?? 0)}
            y={height - BUMP_AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {truncateLabel(p)}
          </text>
        ))}
        {visible.map((row, si) => {
          const first = row.points[0];
          const last = row.points[row.points.length - 1];
          if (!first || !last) return null;
          const color = seriesColor(row.si, row.color);
          const d = row.points.length >= 2 ? pathFor(row.points) : null;
          const firstX0 = BUMP_MARGIN_LEFT + (x(first.period) ?? 0);
          const lastX0 = BUMP_MARGIN_LEFT + (x(last.period) ?? 0);
          return (
            <g key={stableKey([row.label], si)}>
              {d ? (
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={LINE_WIDTH}
                  strokeLinecap="round"
                />
              ) : null}
              <text
                x={firstX0 - LABEL_GAP_PX}
                y={BUMP_MARGIN_TOP + y(first.rank)}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={color}
              >
                {truncateLabel(row.label, BUMP_LABEL_MAX)}
              </text>
              <text
                x={lastX0 + LABEL_GAP_PX}
                y={BUMP_MARGIN_TOP + y(last.rank)}
                dy={TICK_DY}
                textAnchor="start"
                fontSize={TICK_FONT_SIZE}
                fill={color}
              >
                {truncateLabel(row.label, BUMP_LABEL_MAX)}
              </text>
              {showPoints
                ? row.points.map((p, pi) => {
                    const tip = `${row.label} · ${p.period}: puesto ${fmtRank(p.rank)} de ${fmtRank(total)}`;
                    return (
                      <g key={stableKey([row.label, p.period], pi)}>
                        <title>{tip}</title>
                        <circle
                          cx={BUMP_MARGIN_LEFT + (x(p.period) ?? 0)}
                          cy={BUMP_MARGIN_TOP + y(p.rank)}
                          r={dotR}
                          fill={color}
                          stroke={CHART_TOKEN.background}
                          strokeWidth={POINT_BORDER}
                          data-chart-tip={tip}
                        />
                        {showValues ? (
                          <text
                            x={BUMP_MARGIN_LEFT + (x(p.period) ?? 0)}
                            y={
                              BUMP_MARGIN_TOP +
                              y(p.rank) -
                              dotR -
                              VALUE_LABEL_GAP
                            }
                            textAnchor="middle"
                            fontSize={TICK_FONT_SIZE}
                            fill={CHART_TOKEN.foreground}
                          >
                            {fmtRank(p.rank)}
                          </text>
                        ) : null}
                      </g>
                    );
                  })
                : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={visible
            .filter((row) => row.points.length > 0)
            .map((row) => ({
              label: row.label,
              color: seriesColor(row.si, row.color),
            }))}
        />
      ) : null}
    </div>
  );
}
