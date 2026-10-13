/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand, scaleLinear } from "d3-scale";
import { type CSSProperties, useId } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColors, truncateLabel } from "../lib/palette";
import type { ChartSeries } from "../lib/series";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

const GROUP_BAND_PADDING = 0.22;
const SERIES_BAND_PADDING = 0.08;
const AXIS_LABEL_OFFSET = 10;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;
/** Desplazamiento vertical de la etiqueta de valor sobre la barra. */
const VALUE_LABEL_DY = 4;
/** Alto mínimo de segmento (px) para rotular su valor dentro. */
const MIN_SEGMENT_LABEL_PX = 16;
/** Grosor del acento del grupo máximo. */
const HIGHLIGHT_WIDTH = 2;

/** Props de BarChart. */
export type BarChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
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
  /**
   * Modo de barras: agrupadas, apiladas o apiladas al 100 %.
   * `stacked`/`percent` reutilizan la lógica de apilado de VerticalStackedBar
   * (doble base para negativos; en `percent` los negativos se fijan a 0).
   */
  layout?: "grouped" | "stacked" | "percent";
  /** Radio de esquina de barra (`0` para estilo denso). */
  barRadius?: number;
  /** Etiqueta de valor sobre cada barra (o dentro de cada segmento apilado). */
  showValues?: boolean;
  /** Límite inferior fijo del dominio Y (si se omite, domainWithZero). */
  yMin?: number;
  /** Límite superior fijo del dominio Y (si se omite, domainWithZero). */
  yMax?: number;
  /** Ticks del grid horizontal. */
  gridTicks?: number;
  /** Orden de grupos por total (suma de series). */
  sortGroups?: "none" | "asc" | "desc";
  /** Acento (trazo) en el grupo con mayor total. */
  highlightMax?: boolean;
  /** Prefijo de `defs`/`clipPath` en apilado (multi-instancia); por defecto useId. */
  id?: string;
};

/**
 * Barras verticales SSR (agrupadas, apiladas o al 100 %). Función pura
 * props → SVG, responsiva por `viewBox`. Ejes y grid calculados con
 * d3-scale/d3-array. Soporta negativos (línea de cero) y filtra
 * no-finitos como 0.
 */
export function BarChart({
  data,
  xKey,
  series,
  height = 260,
  ariaLabel,
  formatY,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  barColor,
  layout = "grouped",
  barRadius = BAR_RADIUS,
  showValues = false,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  highlightMax = false,
  id,
}: BarChartProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const uid = useId();
  if (data.length === 0 || series.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const radius = toNumber(barRadius, BAR_RADIUS);
  const ticksCount = Math.max(1, Math.round(toNumber(gridTicks, GRID_TICKS)));
  const stacked = layout !== "grouped";
  const percent = layout === "percent";
  const prefix =
    id == null || id === ""
      ? uid.replace(/:/g, "")
      : id.replace(/[^a-zA-Z0-9_-]/g, "");

  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));

  const totalOf = (d: Record<string, string | number>) =>
    series.reduce((acc, s) => acc + toNumber(d[s.key]), 0);
  const ordered = [...data];
  if (sortGroups !== "none") {
    ordered.sort((a, b) =>
      sortGroups === "asc" ? totalOf(a) - totalOf(b) : totalOf(b) - totalOf(a),
    );
  }
  const totals = ordered.map(totalOf);
  let maxGroup = 0;
  for (let i = 1; i < totals.length; i++) {
    if ((totals[i] ?? 0) > (totals[maxGroup] ?? 0)) maxGroup = i;
  }

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const raws = ordered.map((d) => series.map((s) => toNumber(d[s.key])));
  const flat = raws.flat();
  const posSums = raws.map((arr) =>
    arr.reduce((acc, v) => acc + Math.max(0, v), 0),
  );
  const negSums = raws.map((arr) =>
    arr.reduce((acc, v) => acc + Math.min(0, v), 0),
  );
  const [dlo, dhi] = percent
    ? ([0, 1] as const)
    : domainWithZero(stacked ? [...posSums, ...negSums] : flat);
  const lo = yMin == null ? dlo : toNumber(yMin, dlo);
  const hiBase = yMax == null ? dhi : toNumber(yMax, dhi);
  const y = scaleLinear()
    .domain([lo, Math.max(hiBase, lo + 1)])
    .nice(ticksCount)
    .range([innerH, 0]);
  const y0 = y(0);
  const x0 = scaleBand()
    .domain(ordered.map((d) => String(d[xKey] ?? "")))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const x1 = scaleBand()
    .domain(series.map((s) => s.key))
    .range([0, x0.bandwidth()])
    .padding(SERIES_BAND_PADDING);

  const ticks = y.ticks(ticksCount);
  const colors = seriesColors(series);
  const annLo = percent ? 0 : lo;
  const annHi = percent ? 1 : hiBase;

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
          if (a.value < annLo || a.value > annHi) return null;
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
          const total = totals[di] ?? 0;
          const isMax = highlightMax && di === maxGroup;
          const hl = isMax
            ? { stroke: CHART_TOKEN.accent, strokeWidth: HIGHLIGHT_WIDTH }
            : {};
          const axisLabel = (
            <text
              x={MARGIN.left + (x0(group) ?? 0) + x0.bandwidth() / 2}
              y={height - AXIS_LABEL_OFFSET}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              <title>{group}</title>
              {truncateLabel(group)}
            </text>
          );
          if (stacked) {
            const vals = raws[di] ?? [];
            const posTotal = posSums[di] ?? 0;
            const topVal = percent ? 1 : posTotal;
            const bottomVal = percent ? 0 : (negSums[di] ?? 0);
            const yTopPix = y(topVal);
            const yBottomPix = y(bottomVal);
            const colX = MARGIN.left + (x0(group) ?? 0);
            const colW = x0.bandwidth();
            const clipId = `${prefix}-bc-${di}`;
            let posBase = 0;
            let negBase = 0;
            return (
              <g key={stableKey([group], di)}>
                {axisLabel}
                <defs>
                  <clipPath id={clipId}>
                    <rect
                      x={colX}
                      y={MARGIN.top + Math.min(yTopPix, yBottomPix)}
                      width={colW}
                      height={Math.max(
                        MIN_SHAPE_PX,
                        Math.abs(yBottomPix - yTopPix),
                      )}
                      rx={radius}
                    />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                  {series.map((s, si) => {
                    const raw = vals[si] ?? toNumber(d[s.key]);
                    // En percent los negativos se fijan a 0 (no se apilan).
                    const frac =
                      percent && posTotal > 0
                        ? Math.max(0, raw) / posTotal
                        : raw;
                    const base = frac < 0 ? negBase : posBase;
                    const v0 = base;
                    const v1 = base + frac;
                    if (frac < 0) negBase = v1;
                    else posBase = v1;
                    const yA = y(v0);
                    const yB = y(v1);
                    const pixH = Math.abs(yB - yA);
                    const baseTip = `${group} · ${s.label}: ${fmtY(raw)}`;
                    const tip = percent
                      ? `${group} · ${s.label}: ${fmtY(raw)} (${Math.round((posTotal > 0 ? Math.max(0, raw) / posTotal : 0) * PERCENT_FACTOR)}%)`
                      : series.length >= 2 && total > 0
                        ? `${baseTip} (${Math.round((raw / total) * PERCENT_FACTOR)}% del grupo)`
                        : baseTip;
                    if (frac === 0) return <g key={s.key} />;
                    const fill = barColor?.(d, di, s, si) ?? colors[si];
                    return (
                      <g key={s.key}>
                        <title>{tip}</title>
                        <rect
                          x={colX}
                          y={MARGIN.top + Math.min(yA, yB)}
                          width={colW}
                          height={Math.max(MIN_SHAPE_PX, pixH)}
                          fill={fill}
                          data-chart-tip={tip}
                          {...hl}
                        />
                        {showValues && pixH >= MIN_SEGMENT_LABEL_PX ? (
                          <text
                            x={colX + colW / 2}
                            y={MARGIN.top + (yA + yB) / 2}
                            dy={TICK_DY}
                            textAnchor="middle"
                            fontSize={TICK_FONT_SIZE}
                            fill={CHART_TOKEN.background}
                          >
                            {percent
                              ? `${Math.round(frac * PERCENT_FACTOR)}%`
                              : fmtY(raw)}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          }
          return (
            <g key={stableKey([group], di)}>
              {axisLabel}
              {series.map((s, si) => {
                const value = toNumber(d[s.key]);
                const bw = x1.bandwidth();
                const bx = MARGIN.left + (x0(group) ?? 0) + (x1(s.key) ?? 0);
                const yV = y(value);
                const rectY =
                  value === 0
                    ? MARGIN.top + y0 - ZERO_MARK_PX / 2
                    : MARGIN.top + Math.min(y0, yV);
                const rectH =
                  value === 0
                    ? ZERO_MARK_PX
                    : Math.max(MIN_SHAPE_PX, Math.abs(y0 - yV));
                const baseTip = `${group} · ${s.label}: ${fmtY(value)}`;
                const tip =
                  series.length >= 2 && total > 0
                    ? `${baseTip} (${Math.round((value / total) * PERCENT_FACTOR)}% del grupo)`
                    : baseTip;
                const fill = barColor?.(d, di, s, si) ?? colors[si];
                return (
                  <g key={s.key}>
                    <title>{tip}</title>
                    <rect
                      x={bx}
                      y={rectY}
                      width={Math.max(MIN_SHAPE_PX, bw)}
                      height={rectH}
                      rx={radius}
                      fill={fill}
                      data-chart-tip={tip}
                      {...hl}
                    />
                    {showValues ? (
                      <text
                        x={bx + Math.max(MIN_SHAPE_PX, bw) / 2}
                        y={rectY - VALUE_LABEL_DY}
                        textAnchor="middle"
                        fontSize={TICK_FONT_SIZE}
                        fill={CHART_TOKEN.muted}
                      >
                        {fmtY(value)}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
