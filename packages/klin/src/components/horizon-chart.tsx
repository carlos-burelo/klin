/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scalePoint } from "d3-scale";
import { area, curveMonotoneX } from "d3-shape";
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { ChartSvg, CHART_MARGIN as MARGIN, CHART_W as W } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColors, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Serie del horizonte (etiqueta, muestra alineada y color opcional). */
export type HorizonSeries = {
  label: string;
  values: number[];
  color?: string;
};

/** Modo de plegado: espejo (absoluto) o con signo (desplazado). */
export type HorizonMode = "mirror" | "offset";

/** Props de HorizonChart. */
export type HorizonChartProps = {
  series: HorizonSeries[];
  /** Etiquetas del eje X (por defecto el índice 1-based). */
  labels?: string[];
  ariaLabel: string;
  height?: number;
  /** Bandas de plegado por carril (mínimo 1). */
  bands?: number;
  /** `mirror` pliega |v| hacia arriba; `offset` respeta el signo. */
  mode?: HorizonMode;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const POINT_PADDING = 0.5;
/** Opacidad base de banda + incremento por nivel. */
const BAND_BASE_OPACITY = 0.25;
const BAND_OPACITY_STEP = 0.75;
/** Etiquetas de carril y de eje. */
const LANE_LABEL_X = 4;
const LANE_LABEL_DY = 12;
const AXIS_LABEL_OFFSET = 10;
/** Radio de captura táctil/mouse por punto (invisible). */
const HIT_RADIUS = 8;

/**
 * Gráfico de horizonte SSR (series densas plegadas en bandas).
 * La altura de banda sale del máximo absoluto global (comparable entre
 * carriles); todo-ceros → vacío. Determinista.
 */
export function HorizonChart({
  series,
  labels,
  ariaLabel,
  height = 260,
  bands = 4,
  mode = "mirror",
  formatY,
  locale = DEFAULT_LOCALE,
  className,
  style,
  ariaDescribedBy,
  showLegend = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: HorizonChartProps) {
  const clean = series
    .map((s) => ({
      serie: s,
      values: s.values.map((v) => toNumber(v, Number.NaN)),
    }))
    .filter((c) => c.values.some((v) => Number.isFinite(v)));
  if (isBlank(clean)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const n = Math.max(...clean.map((c) => c.values.length));
  if (n === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }
  const bandCount = Math.max(1, Math.floor(toNumber(bands, 4)));
  let maxAbs = 0;
  for (const c of clean)
    for (const v of c.values)
      if (Number.isFinite(v)) maxAbs = Math.max(maxAbs, Math.abs(v));
  if (!(maxAbs > 0)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtY = resolveFormatter(formatY, locale);
  const innerW = W - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;
  const laneH = innerH / clean.length;
  const bandH = maxAbs / bandCount;
  const xs = Array.from({ length: n }, (_, i) => labels?.[i] ?? String(i + 1));
  const x = scalePoint()
    .domain(xs.map((_, i) => String(i)))
    .range([0, innerW])
    .padding(POINT_PADDING);
  const colors = seriesColors(clean.map((c) => ({ color: c.serie.color })));

  const atX = (i: number) => MARGIN.left + (x(String(i)) ?? 0);

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={W}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {clean.map((c, si) => {
          const color = colors[si] ?? CHART_TOKEN.chart1;
          const laneTop = MARGIN.top + si * laneH;
          const laneBottom = laneTop + laneH;
          const laneMid = laneTop + laneH / 2;
          // Alturas plegadas por banda en cada índice.
          const folded = Array.from({ length: n }, (_, i) => {
            const v = c.values[i];
            const finite = Number.isFinite(v) ? (v as number) : 0;
            const mag = mode === "mirror" ? Math.abs(finite) : finite;
            return { v: finite, mag };
          });
          const bandPaths = Array.from({ length: bandCount }, (_, k) => {
            const pts = folded.map(({ v, mag }, i) => {
              const h = Math.min(Math.max(mag - k * bandH, 0), bandH);
              if (mode === "mirror") {
                return {
                  i,
                  y0: laneBottom - k * bandH,
                  y1: laneBottom - k * bandH - h,
                };
              }
              const neg = v < 0;
              return neg
                ? {
                    i,
                    y0: laneMid + k * bandH,
                    y1: laneMid + k * bandH + h,
                  }
                : {
                    i,
                    y0: laneMid - k * bandH,
                    y1: laneMid - k * bandH - h,
                  };
            });
            const d =
              area<{ i: number; y0: number; y1: number }>()
                .x((p) => atX(p.i))
                .y0((p) => p.y0)
                .y1((p) => p.y1)
                .curve(curveMonotoneX)(pts) ?? "";
            return {
              d,
              opacity:
                BAND_BASE_OPACITY + BAND_OPACITY_STEP * ((k + 1) / bandCount),
            };
          });
          return (
            <g key={stableKey([c.serie.label], si)}>
              <line
                x1={MARGIN.left}
                x2={W - MARGIN.right}
                y1={laneBottom}
                y2={laneBottom}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={MARGIN.left + LANE_LABEL_X}
                y={laneTop + LANE_LABEL_DY}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{c.serie.label}</title>
                {truncateLabel(c.serie.label)}
              </text>
              {bandPaths.map((b, bi) => (
                <path
                  key={stableKey(["band"], bi)}
                  d={b.d}
                  fill={color}
                  opacity={b.opacity}
                />
              ))}
              {folded.map((p, i) => {
                const tip = `${c.serie.label} · ${xs[i] ?? i}: ${fmtY(p.v)}`;
                return (
                  <g key={stableKey([String(i)], i)}>
                    <title>{tip}</title>
                    <circle
                      cx={atX(i)}
                      cy={laneMid}
                      r={HIT_RADIUS}
                      fill="transparent"
                      pointerEvents="all"
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
        {xs.map((label, i) => (
          <text
            key={stableKey([label], i)}
            x={atX(i)}
            y={height - AXIS_LABEL_OFFSET}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {truncateLabel(label)}
          </text>
        ))}
      </ChartSvg>
      {showLegend ? (
        <ChartLegend
          items={clean.map((c, i) => ({
            label: c.serie.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
