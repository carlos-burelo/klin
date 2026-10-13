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
import { formatDefault, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
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
import { ChartLegend } from "./legend";

/** Orden de las filas por diferencia b−a (none conserva el orden de entrada). */
export type DumbbellSort = "none" | "asc" | "desc";

/** Props de DumbbellChart. */
export type DumbbellChartProps = {
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  aKey: string;
  bKey: string;
  aLabel: string;
  bLabel: string;
  ariaLabel: string;
  height?: number;
  formatX?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Recorte fijo del dominio X [min, max] (indefinido = automático con cero). */
  domain?: [number, number];
  /** Ticks del grid vertical (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra los valores junto a cada punto. */
  showValues?: boolean;
  /** Orden de las filas por diferencia entre b y a. */
  sortGroups?: DumbbellSort;
  /** Radio de los puntos (por defecto POINT_RADIUS_SCATTER). */
  pointRadius?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

const W = 640;
const MARGIN: ChartMargin = { top: 8, right: 48, bottom: 28, left: 132 };

const GROUP_BAND_PADDING = 0.25;
const LABEL_MAX_X = 18;
const AXIS_LABEL_OFFSET = 10;
const ROW_H = 34;
const MIN_HEIGHT = 140;
/** Mínimo de ticks del grid. */
const TICKS_MIN = 1;

type DumbbellRow = { label: string; a: number; b: number };

/**
 * Mancuernas SSR horizontales (dos puntos por categoría unidos por
 * conector chart1→chart2). Altura automática según filas salvo
 * override por `height`. Filtra no-finitos; tope DEFAULT_MAX_ROWS.
 */
export function DumbbellChart({
  data,
  categoryKey,
  aKey,
  bKey,
  aLabel,
  bLabel,
  ariaLabel,
  height,
  locale = "es-MX",
  formatX = (v: number) => formatDefault(v, locale),
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  domain,
  gridTicks = GRID_TICKS,
  showValues = false,
  sortGroups = "none",
  pointRadius = POINT_RADIUS_SCATTER,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: DumbbellChartProps) {
  const computed: DumbbellRow[] = [];
  for (const d of data.slice(0, DEFAULT_MAX_ROWS)) {
    const a = toNumber(d[aKey], Number.NaN);
    const b = toNumber(d[bKey], Number.NaN);
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    computed.push({ label: String(d[categoryKey] ?? ""), a, b });
  }
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered =
    sortGroups === "none"
      ? computed
      : [...computed].sort((m, n) =>
          sortGroups === "asc"
            ? m.b - m.a - (n.b - n.a)
            : n.b - n.a - (m.b - m.a),
        );

  const chartH =
    height ??
    Math.max(MIN_HEIGHT, MARGIN.top + MARGIN.bottom + ordered.length * ROW_H);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = chartH - MARGIN.top - MARGIN.bottom;

  const flat = ordered.flatMap((r) => [r.a, r.b]);
  const auto = domainWithZero(flat);
  const fixedLo =
    domain === undefined ? Number.NaN : toNumber(domain[0], Number.NaN);
  const fixedHi =
    domain === undefined ? Number.NaN : toNumber(domain[1], Number.NaN);
  const lo = Number.isFinite(fixedLo) ? fixedLo : auto[0];
  const hi = Number.isFinite(fixedHi) ? fixedHi : auto[1];
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const dotR = Math.max(0, toNumber(pointRadius, POINT_RADIUS_SCATTER));
  const x = scaleLinear()
    .domain([lo, Math.max(hi, lo + 1)])
    .nice(safeTicks)
    .range([0, innerW]);
  const y0 = scaleBand()
    .domain(ordered.map((r) => r.label))
    .range([0, innerH])
    .padding(GROUP_BAND_PADDING);
  const ticks = x.ticks(safeTicks);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={chartH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={MARGIN.left + x(t)}
              x2={MARGIN.left + x(t)}
              y1={MARGIN.top}
              y2={chartH - MARGIN.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={MARGIN.left + x(t)}
              y={chartH - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {formatX(t)}
            </text>
          </g>
        ))}
        {(annotations ?? []).map((a, ai) => {
          const clamped = Math.min(hi, Math.max(lo, toNumber(a.value)));
          const ax = MARGIN.left + x(clamped);
          const stroke = a.color ?? CHART_TOKEN.accent;
          return (
            <g key={stableKey([a.label ?? `${a.value}`], ai)}>
              <title>{a.label ?? formatX(a.value)}</title>
              <line
                x1={ax}
                x2={ax}
                y1={MARGIN.top}
                y2={chartH - MARGIN.bottom}
                stroke={stroke}
                strokeWidth={ANNOTATION_WIDTH}
                strokeDasharray={ANNOTATION_DASH}
              />
              {a.label ? (
                <text
                  x={ax + TICK_GAP_PX}
                  y={MARGIN.top + TICK_GAP_PX}
                  fontSize={TICK_FONT_SIZE}
                  fill={stroke}
                >
                  {a.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {ordered.map((r, ri) => {
          const cy = MARGIN.top + (y0(r.label) ?? 0) + y0.bandwidth() / 2;
          const xa = MARGIN.left + x(r.a);
          const xb = MARGIN.left + x(r.b);
          const mid = (xa + xb) / 2;
          const tipA = `${r.label} · ${aLabel}: ${formatX(r.a)}`;
          const tipB = `${r.label} · ${bLabel}: ${formatX(r.b)}`;
          return (
            <g key={stableKey([r.label], ri)}>
              <text
                x={MARGIN.left - TICK_GAP_PX}
                y={cy}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{r.label}</title>
                {truncateLabel(r.label, LABEL_MAX_X)}
              </text>
              <line
                x1={xa}
                x2={mid}
                y1={cy}
                y2={cy}
                stroke={CHART_TOKEN.chart1}
                strokeWidth={LINE_WIDTH}
              />
              <line
                x1={mid}
                x2={xb}
                y1={cy}
                y2={cy}
                stroke={CHART_TOKEN.chart2}
                strokeWidth={LINE_WIDTH}
              />
              <g>
                <title>{tipA}</title>
                <circle
                  cx={xa}
                  cy={cy}
                  r={dotR}
                  fill={CHART_TOKEN.chart1}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={tipA}
                />
              </g>
              <g>
                <title>{tipB}</title>
                <circle
                  cx={xb}
                  cy={cy}
                  r={dotR}
                  fill={CHART_TOKEN.chart2}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={POINT_BORDER}
                  data-chart-tip={tipB}
                />
              </g>
              {showValues ? (
                <>
                  <text
                    x={xa - TICK_GAP_PX}
                    y={cy}
                    dy={TICK_DY}
                    textAnchor="end"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.foreground}
                  >
                    {formatX(r.a)}
                  </text>
                  <text
                    x={xb + TICK_GAP_PX}
                    y={cy}
                    dy={TICK_DY}
                    textAnchor="start"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.foreground}
                  >
                    {formatX(r.b)}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: aLabel, color: CHART_TOKEN.chart1 },
            { label: bLabel, color: CHART_TOKEN.chart2 },
          ]}
        />
      ) : null}
    </div>
  );
}
