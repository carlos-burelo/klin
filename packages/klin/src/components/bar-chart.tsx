/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleBand } from "d3-scale";
import { type CSSProperties, useId } from "react";
import type { ValueAnnotation } from "../lib/api";
import { CartesianFrame } from "../lib/cartesian";
import { domainWithZero, logDomain, logFloor } from "../lib/domain";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors, truncateLabel } from "../lib/palette";
import { type ValueScaleKind, valueScale } from "../lib/scale";
import type { ChartSeries } from "../lib/series";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_TICKS,
  MIN_SHAPE_PX,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  ZERO_MARK_PX,
} from "../lib/theme";
import { pctOf, shareTip } from "../lib/tips";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const GROUP_BAND_PADDING = 0.22;
const SERIES_BAND_PADDING = 0.08;
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
  /**
   * Escala del eje Y (`log` para magnitudes; ignora no-positivos en
   * geometría, el tip conserva el valor crudo). Se ignora con `percent`
   * y con `yMin`/`yMax` (dominio log desde los datos).
   */
  yScale?: ValueScaleKind;
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
  locale = DEFAULT_LOCALE,
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
  yScale = "linear",
  id,
}: BarChartProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const uid = useId();
  if (isBlank(data) || isBlank(series)) {
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

  const fmtY = resolveFormatter(formatY, locale);

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
  const log = yScale === "log" && !percent;
  const [llo, lhi] = log
    ? logDomain(stacked ? [...posSums, ...negSums] : flat)
    : ([dlo, dhi] as const);
  const lo = log ? llo : yMin == null ? dlo : toNumber(yMin, dlo);
  const hiBase = log ? lhi : yMax == null ? dhi : toNumber(yMax, dhi);
  const y = valueScale(
    log ? "log" : "linear",
    [lo, Math.max(hiBase, lo + 1)],
    [innerH, 0],
  ).nice(ticksCount);
  const y0 = y(log ? lo : 0);
  const lv = (v: number) => (log ? logFloor(v, lo) : v);
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
  const legendItems = showLegend
    ? series.map((s, i) => ({
        label: s.label,
        color: colors[i] ?? CHART_TOKEN.chart1,
      }))
    : undefined;

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
      annLo={annLo}
      annHi={annHi}
      xLabels={ordered.map((d) => {
        const group = String(d[xKey] ?? "");
        return {
          x: (x0(group) ?? 0) + x0.bandwidth() / 2,
          label: truncateLabel(group),
          title: group,
        };
      })}
      legendItems={legendItems}
    >
      {ordered.map((d, di) => {
        const group = String(d[xKey] ?? "");
        const total = totals[di] ?? 0;
        const isMax = highlightMax && di === maxGroup;
        const hl = isMax
          ? { stroke: CHART_TOKEN.accent, strokeWidth: HIGHLIGHT_WIDTH }
          : {};
        if (stacked) {
          const vals = raws[di] ?? [];
          const posTotal = posSums[di] ?? 0;
          const topVal = percent ? 1 : posTotal;
          const bottomVal = percent ? 0 : (negSums[di] ?? 0);
          const yTopPix = y(lv(topVal));
          const yBottomPix = y(lv(bottomVal));
          const colX = MARGIN.left + (x0(group) ?? 0);
          const colW = x0.bandwidth();
          const clipId = `${prefix}-bc-${di}`;
          let posBase = 0;
          let negBase = 0;
          return (
            <g key={stableKey([group], di)}>
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
                    percent && posTotal > 0 ? Math.max(0, raw) / posTotal : raw;
                  const base = frac < 0 ? negBase : posBase;
                  const v0 = base;
                  const v1 = base + frac;
                  if (frac < 0) negBase = v1;
                  else posBase = v1;
                  const yA = y(lv(v0));
                  const yB = y(lv(v1));
                  const pixH = Math.abs(yB - yA);
                  const multi = series.length >= 2;
                  const baseTip = `${group} · ${s.label}: ${fmtY(raw)}`;
                  const tip = percent
                    ? `${baseTip} (${pctOf(Math.max(0, raw), posTotal)}%)`
                    : shareTip({
                        label: group,
                        series: s.label,
                        formatted: fmtY(raw),
                        value: raw,
                        total,
                        multi,
                        of: "grupo",
                      });
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
            {series.map((s, si) => {
              const value = toNumber(d[s.key]);
              const bw = x1.bandwidth();
              const bx = MARGIN.left + (x0(group) ?? 0) + (x1(s.key) ?? 0);
              const yV = y(lv(value));
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
                total,
                multi: series.length >= 2,
                of: "grupo",
              });
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
    </CartesianFrame>
  );
}
