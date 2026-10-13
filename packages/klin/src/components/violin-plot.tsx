/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { quantileSorted } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { area, curveCatmullRom } from "d3-shape";
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../lib/api";
import { domainWithZero } from "../lib/domain";
import {
  ChartSvg,
  CHART_MARGIN as MARGIN,
  CHART_W as W,
  YGrid,
} from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  AREA_FILL_OPACITY,
  BAR_RADIUS,
  CHART_TOKEN,
  GRID_TICKS,
  LINE_WIDTH,
  POINT_BORDER,
  POINT_RADIUS,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Puntos de la rejilla KDE (valor → densidad). */
export type KdePoint = {
  value: number;
  density: number;
};

/** Rejilla fija de la KDE gaussiana propia. */
export const KDE_BINS = 48;
/** Factor de Silverman y exponente del tamaño muestral (h = 1.06·σ·n^-0.2). */
const SILVERMAN_FACTOR = 1.06;
const SILVERMAN_EXPONENT = -0.2;
/** Divisor IQR→σ del fallback robusto (σ ≈ IQR / 1.34). */
const IQR_SIGMA_DIVISOR = 1.34;
/** Últimos recursos si σ e IQR son cero: rango/10, luego 1. */
const KDE_FALLBACK_RANGE_FRAC = 10;
const KDE_FALLBACK_MIN = 1;
/** Normal de la gaussiana (1 / √(2π)). */
const GAUSS_NORM = 0.204_179_955_571_658_05;

/** Padding de banda, etiqueta de eje, fracción del ancho y del tick de mediana. */
const GROUP_BAND_PADDING = 0.45;
const AXIS_LABEL_OFFSET = 10;
const VIOLIN_WIDTH_FRAC = 0.85;
const MEDIAN_TICK_FRAC = 0.6;
const VIOLIN_LINE_WIDTH = 1.5;
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;
/** Mínimo de ticks del grid. */
const TICKS_MIN = 1;

/** Grupo del violín (etiqueta, muestra y color opcional). */
export type ViolinGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Orden de los grupos por mediana (none conserva el orden de entrada). */
export type ViolinSort = "none" | "asc" | "desc";

/** Props de ViolinPlot. */
export type ViolinPlotProps = {
  groups: ViolinGroup[];
  ariaLabel: string;
  height?: number;
  bandwidth?: "auto" | number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Orden de los grupos por su mediana. */
  sortGroups?: ViolinSort;
  /** Muestra el tamaño de muestra (n) junto a cada etiqueta. */
  showSampleSize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Limpia una muestra (no-finitos fuera, como box-plot statsOf). */
function cleanValues(values: number[]): number[] {
  return values
    .map((v) => toNumber(v, Number.NaN))
    .filter((v) => Number.isFinite(v));
}

/**
 * Ancho de banda Silverman (1.06·sd·n^-0.2, fallback IQR; nunca ≤ 0).
 * Puro y determinista (igual en server y cliente).
 */
export function kdeBandwidth(values: number[]): number {
  const n = values.length;
  if (n === 0) return KDE_FALLBACK_MIN;
  const fall = n ** SILVERMAN_EXPONENT;
  const mean = values.reduce((acc, v) => acc + v, 0) / n;
  const sd = Math.sqrt(
    values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / n,
  );
  if (Number.isFinite(sd) && sd > 0) return SILVERMAN_FACTOR * sd * fall;
  const sorted = [...values].sort((a, b) => a - b);
  const first = sorted[0] ?? 0;
  const last = sorted[sorted.length - 1] ?? 0;
  const q1 = quantileSorted(sorted, 0.25) ?? first;
  const q3 = quantileSorted(sorted, 0.75) ?? first;
  const sigma = (q3 - q1) / IQR_SIGMA_DIVISOR;
  if (Number.isFinite(sigma) && sigma > 0)
    return SILVERMAN_FACTOR * sigma * fall;
  const range = last - first;
  if (Number.isFinite(range) && range > 0)
    return range / KDE_FALLBACK_RANGE_FRAC;
  return KDE_FALLBACK_MIN;
}

/**
 * KDE gaussiana propia sobre rejilla fija (`bins` puntos en [lo, hi]).
 * `bandwidth` ≤ 0 o no-finito → Silverman. Nunca devuelve NaN.
 */
export function kdeOf(
  values: number[],
  bandwidth: number,
  lo: number,
  hi: number,
  bins: number = KDE_BINS,
): KdePoint[] {
  const n = values.length;
  if (n === 0) return [];
  const h =
    Number.isFinite(bandwidth) && bandwidth > 0
      ? bandwidth
      : kdeBandwidth(values);
  const safeH = h > 0 && Number.isFinite(h) ? h : KDE_FALLBACK_MIN;
  let a = lo;
  let b = hi;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return [];
  if (a > b) [a, b] = [b, a];
  if (a === b) {
    a -= safeH;
    b += safeH;
  }
  const count = Math.max(2, Math.floor(bins) || 2);
  const step = (b - a) / (count - 1);
  const points: KdePoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const v = a + step * i;
    let s = 0;
    for (const x of values) {
      const u = (v - x) / safeH;
      s += Math.exp(-0.5 * u * u);
    }
    points.push({ value: v, density: (s * GAUSS_NORM) / (n * safeH) });
  }
  return points;
}

/** Valor de la rejilla con densidad máxima (pico de la distribución). */
export function kdePeak(points: KdePoint[]): number {
  let best = points[0];
  for (const p of points) {
    if (best === undefined || p.density > best.density) best = p;
  }
  return best?.value ?? 0;
}

/**
 * Violines SSR (densidad por grupo con KDE gaussiana propia + mediana).
 * Soporta negativos; filtra no-finitos.
 */
export function ViolinPlot({
  groups,
  ariaLabel,
  height = 260,
  bandwidth = "auto",
  formatY,
  locale = "es-MX",
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  annotations,
  yMin,
  yMax,
  gridTicks = GRID_TICKS,
  sortGroups = "none",
  showSampleSize = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: ViolinPlotProps) {
  const safeH = toNumber(height, 260);
  const computed = groups
    .slice(0, DEFAULT_MAX_ROWS)
    .map((group, oi) => {
      const clean = cleanValues(group.values);
      const sorted = [...clean].sort((a, b) => a - b);
      const first = sorted[0] ?? 0;
      return { group, clean, oi, median: quantileSorted(sorted, 0.5) ?? first };
    })
    .filter((c) => c.clean.length > 0);
  if (computed.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const ordered =
    sortGroups === "none"
      ? computed
      : [...computed].sort((a, b) =>
          sortGroups === "asc" ? a.median - b.median : b.median - a.median,
        );

  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = safeH - MARGIN.top - MARGIN.bottom;
  const auto = domainWithZero(ordered.flatMap((c) => c.clean));
  const fixedLo = toNumber(yMin, Number.NaN);
  const fixedHi = toNumber(yMax, Number.NaN);
  const blo = Number.isFinite(fixedLo) ? fixedLo : auto[0];
  const bhi = Number.isFinite(fixedHi) ? fixedHi : auto[1];
  const fmtY = formatY ?? ((v: number) => formatDefault(v, locale));
  const safeTicks = Math.max(
    TICKS_MIN,
    Math.floor(toNumber(gridTicks, GRID_TICKS)),
  );
  const y = scaleLinear().domain([blo, bhi]).nice(safeTicks).range([innerH, 0]);
  const x = scaleBand()
    .domain(ordered.map((c) => c.group.label))
    .range([0, innerW])
    .padding(GROUP_BAND_PADDING);
  const ticks = y.ticks(safeTicks);
  const halfMax = (x.bandwidth() / 2) * VIOLIN_WIDTH_FRAC;
  const given = bandwidth === "auto" ? 0 : toNumber(bandwidth);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={safeH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid ticks={ticks} y={y} margin={MARGIN} width={W} format={fmtY} />
        {(annotations ?? []).map((a, ai) => {
          if (a.value < blo || a.value > bhi) return null;
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
        {ordered.map(({ group, clean, oi, median: sortedMedian }, gi) => {
          const cx = MARGIN.left + (x(group.label) ?? 0) + x.bandwidth() / 2;
          const color = seriesColor(oi, group.color);
          const sorted = [...clean].sort((a, b) => a - b);
          const first = sorted[0] ?? 0;
          const q1 = quantileSorted(sorted, 0.25) ?? first;
          const median = sortedMedian;
          const q3 = quantileSorted(sorted, 0.75) ?? first;
          const gmin = sorted[0] ?? 0;
          const gmax = sorted[sorted.length - 1] ?? 0;
          const pts = kdeOf(clean, given, gmin, gmax);
          let dmax = 0;
          for (const p of pts) dmax = Math.max(dmax, p.density);
          const half = (d: number) => (dmax > 0 ? (d / dmax) * halfMax : 0);
          const silhouette =
            area<KdePoint>()
              .x0((p) => cx - half(p.density))
              .x1((p) => cx + half(p.density))
              .y((p) => MARGIN.top + y(p.value))
              .curve(curveCatmullRom)(pts) ?? "";
          const tickW = halfMax * 2 * MEDIAN_TICK_FRAC;
          const my = MARGIN.top + y(median);
          const tip =
            `${group.label}: n ${clean.length} · mediana ${fmtY(median)} · ` +
            `Q1 ${fmtY(q1)} · Q3 ${fmtY(q3)}`;
          return (
            <g key={stableKey([group.label], gi)}>
              <title>{tip}</title>
              <text
                x={cx}
                y={safeH - AXIS_LABEL_OFFSET}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{group.label}</title>
                {showSampleSize
                  ? `${truncateLabel(group.label)} (n ${clean.length})`
                  : truncateLabel(group.label)}
              </text>
              <path
                d={silhouette}
                fill={color}
                fillOpacity={AREA_FILL_OPACITY}
                stroke={color}
                strokeWidth={VIOLIN_LINE_WIDTH}
                strokeLinejoin="round"
                data-chart-tip={tip}
              />
              <rect
                x={cx - tickW / 2}
                y={my - LINE_WIDTH / 2}
                width={tickW}
                height={LINE_WIDTH}
                rx={BAR_RADIUS}
                fill={color}
              />
              <circle
                cx={cx}
                cy={my}
                r={POINT_RADIUS}
                fill={color}
                stroke={CHART_TOKEN.background}
                strokeWidth={POINT_BORDER}
              />
            </g>
          );
        })}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={ordered.map(({ group, oi }) => ({
            label: group.label,
            color: seriesColor(oi, group.color),
          }))}
        />
      ) : null}
    </div>
  );
}
