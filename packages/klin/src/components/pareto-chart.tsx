/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear, scalePoint } from "d3-scale";
import { curveMonotoneX, line } from "d3-shape";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { topPositive } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import type { ChartMargin } from "../lib/frame";
import { ChartSvg, YGrid } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { sumNumbers, toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  GRID_WIDTH,
  LINE_WIDTH,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { pctOf } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

const W = 640;
const MARGIN: ChartMargin = { top: 12, right: 48, bottom: 32, left: 44 };

const GROUP_BAND_PADDING = 0.25;
const CUM_POINT_PADDING = 0.5;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;
/** Etiqueta del resto agregado y umbral 80/20 por defecto. */
const PARETO_OTHERS_LABEL = "Otros";
const PARETO_DEFAULT_THRESHOLD = 80;

/** Props de Pareto SSR (barras ordenadas + % acumulado). */
export type ParetoChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  color?: string;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /**
   * Conserva las N primeras causas y agrega el resto en "Otros".
   * @default undefined
   */
  topN?: number;
  /**
   * Línea de umbral sobre el % acumulado (80/20).
   * @default 80
   */
  threshold?: number;
  /**
   * Muestra el % acumulado sobre cada punto.
   * @default false
   */
  showCumLabels?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Pareto SSR (barras ordenadas + % acumulado en segundo eje).
 */
export function ParetoChart({
  data,
  xKey,
  yKey,
  ariaLabel,
  height = 280,
  formatY,
  color,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  topN,
  threshold = PARETO_DEFAULT_THRESHOLD,
  showCumLabels = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ParetoChartProps) {
  if (isBlank(data)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  // Conteos: negativos se fijan a 0.
  const countOf = (d: Record<string, string | number>) =>
    Math.max(0, toNumber(d[yKey]));
  const ranked = [...data].sort((a, b) => countOf(b) - countOf(a));
  const rawTop = Math.floor(toNumber(topN, Number.NaN));
  const ordered =
    Number.isFinite(rawTop) && rawTop > 0 && ranked.length > rawTop
      ? [
          ...ranked.slice(0, rawTop),
          {
            [xKey]: PARETO_OTHERS_LABEL,
            [yKey]: sumNumbers(ranked.slice(rawTop).map(countOf)),
          },
        ]
      : ranked;
  const total = sumNumbers(ordered.map(countOf));
  const top = topPositive(ordered.map(countOf));

  const y = scaleLinear().domain([0, top]).nice(GRID_TICKS).range([innerH, 0]);
  const yp = scaleLinear().domain([0, PERCENT_FACTOR]).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(GRID_TICKS);
  const fill = seriesColor(0, color);
  const lineColor = seriesColor(1, undefined);
  const fmtY = resolveFormatter(formatY, locale);
  const rawThreshold = toNumber(threshold, Number.NaN);
  const thresholdPct = Number.isFinite(rawThreshold)
    ? Math.min(PERCENT_FACTOR, Math.max(0, rawThreshold))
    : null;

  let acc = 0;
  const cum = ordered.map((d) => {
    acc += total === 0 ? 0 : (countOf(d) / total) * PERCENT_FACTOR;
    return { label: String(d[xKey] ?? ""), pct: acc };
  });
  const xp = scalePoint()
    .domain(cum.map((c) => c.label))
    .range([0, innerW])
    .padding(CUM_POINT_PADDING);
  const path =
    line<{ label: string; pct: number }>()
      .x((p) => (xp(p.label) ?? 0) + x.bandwidth() / 2)
      .y((p) => yp(p.pct))
      .curve(curveMonotoneX)(cum) ?? "";

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
        {(annotations ?? []).map((a, ai) => {
          if (a.value < 0 || a.value > top) return null;
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
        {ticks.map((t) => (
          <text
            key={t}
            x={W - MARGIN.right + TICK_GAP_PX}
            y={MARGIN.top + yp((t / top) * PERCENT_FACTOR)}
            dy={TICK_DY}
            textAnchor="start"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {`${Math.round((t / top) * PERCENT_FACTOR)}%`}
          </text>
        ))}
        {ordered.map((d, di) => {
          const group = String(d[xKey] ?? "");
          const value = countOf(d);
          const pct = pctOf(value, total);
          const cumPct = Math.round(cum[di]?.pct ?? 0);
          const tip = `${group}: ${fmtY(value)} (${pct}% · acumulado ${cumPct}%)`;
          return (
            <g key={stableKey([group], di)}>
              <title>{tip}</title>
              <rect
                x={MARGIN.left + (x(group) ?? 0)}
                y={MARGIN.top + y(value)}
                width={x.bandwidth()}
                height={Math.max(MIN_SHAPE_PX, innerH - y(value))}
                rx={BAR_RADIUS}
                fill={fill}
                data-chart-tip={tip}
              />
              <text
                x={MARGIN.left + (x(group) ?? 0) + x.bandwidth() / 2}
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
        <path
          d={path}
          transform={`translate(${MARGIN.left},${MARGIN.top})`}
          fill="none"
          stroke={lineColor}
          strokeWidth={LINE_WIDTH}
          strokeLinecap="round"
        />
        {cum.map((c, ci) => (
          <g key={stableKey([c.label], ci)}>
            <title>{`${c.label}: ${Math.round(c.pct)}% acumulado`}</title>
            <circle
              cx={MARGIN.left + (xp(c.label) ?? 0) + x.bandwidth() / 2}
              cy={MARGIN.top + yp(c.pct)}
              r={POINT_RADIUS}
              fill={lineColor}
              stroke={CHART_TOKEN.background}
              strokeWidth={POINT_BORDER}
              data-chart-tip={`${c.label}: ${Math.round(c.pct)}% acumulado`}
            />
            {showCumLabels ? (
              <text
                x={MARGIN.left + (xp(c.label) ?? 0) + x.bandwidth() / 2}
                y={MARGIN.top + yp(c.pct) - TICK_GAP_PX}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {`${Math.round(c.pct)}%`}
              </text>
            ) : null}
          </g>
        ))}
        {thresholdPct !== null ? (
          <g>
            <title>{`Umbral ${Math.round(thresholdPct)}%`}</title>
            <line
              x1={MARGIN.left}
              x2={W - MARGIN.right}
              y1={MARGIN.top + yp(thresholdPct)}
              y2={MARGIN.top + yp(thresholdPct)}
              stroke={CHART_TOKEN.muted}
              strokeWidth={GRID_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
            />
            <text
              x={W - MARGIN.right}
              y={MARGIN.top + yp(thresholdPct) - TICK_GAP_PX}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {`${Math.round(thresholdPct)}%`}
            </text>
          </g>
        ) : null}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Valor", color: fill },
            { label: "% acumulado", color: lineColor },
          ]}
        />
      ) : null}
    </div>
  );
}
