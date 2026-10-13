/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EMPTY_CELL_OPACITY,
  MISSING_VALUE,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const W = 640;
const LABEL_W = 132;
const LABEL_H = 30;
const MAX_CELL = 64;
/** Celda mínima (px) para pintar valor en modo `auto`. */
const COHORT_VALUE_MIN_CELL = 28;
/** Separación entre celdas, aire lateral y relleno inferior. */
const CELL_GAP = 4;
const GRID_SIDE_PAD = 16;
const GRID_BOTTOM_PAD = 8;
/** Máximos de truncado de periodo y cohorte. */
const LABEL_MAX_COL = 10;
const LABEL_MAX_ROW = 18;
/** Opacidades de celda con retención (base + rango). */
const CELL_BASE_OPACITY = 0.15;
const CELL_RANGE_OPACITY = 0.85;
/** Centena para el % por defecto. */
const PERCENT_OF_ONE = 100;
/** Marca de celda sin dato (fuera del rango válido 0–1). */
const MISSING_RATE = -1;

/** Cohorte con retención por periodo (fracciones 0–1, `values[0]` = 100 %). */
export type Cohort = {
  label: string;
  values: number[];
};

/** Props de CohortChart. */
export type CohortChartProps = {
  cohorts: Cohort[];
  /** Etiquetas de periodo (`P1`, `P2`… por defecto). */
  periodLabels?: string[];
  ariaLabel: string;
  /** Recibe la retención 0–1 (por defecto % entero con locale). */
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  /** Control del texto de valor en celda (`auto` según tamaño). */
  showValues?: "auto" | "always" | "never";
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Retención por cohortes SSR (triángulo: la fila i vive `n − i` periodos).
 * Cada fila se normaliza por su primer valor; sin base positiva, vacía.
 */
export function CohortChart({
  cohorts,
  periodLabels,
  ariaLabel,
  format,
  locale = DEFAULT_LOCALE,
  color,
  showValues = "auto",
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: CohortChartProps) {
  const rows = cohorts.filter((c) => !isBlank(c.values));
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtRate =
    format ??
    ((v: number) =>
      `${formatDefault(v * PERCENT_OF_ONE, locale, { maximumFractionDigits: 0 })}%`);
  const periods = Math.max(1, ...rows.map((c) => c.values.length));
  const labels =
    periodLabels && periodLabels.length > 0
      ? periodLabels
      : Array.from({ length: periods }, (_, i) => `P${i + 1}`);

  const cell = Math.min(
    MAX_CELL,
    Math.floor((W - LABEL_W - GRID_SIDE_PAD) / periods) - CELL_GAP,
  );
  const step = cell + CELL_GAP;
  const gridW = periods * step - CELL_GAP;
  const gx = LABEL_W + Math.max(0, (W - LABEL_W - gridW) / 2);
  const H = LABEL_H + rows.length * step - CELL_GAP + GRID_BOTTOM_PAD;
  const fill = seriesColor(0, color);

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
        {labels.slice(0, periods).map((period, ci) => (
          <text
            key={stableKey([period], ci)}
            x={gx + ci * step + cell / 2}
            y={LABEL_H - TICK_GAP_PX}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            <title>{period}</title>
            {truncateLabel(period, LABEL_MAX_COL)}
          </text>
        ))}
        {rows.map((cohort, ri) => {
          const first = toNumber(cohort.values[0], Number.NaN);
          const base = Number.isFinite(first) && first > 0 ? first : 0;
          return (
            <g key={stableKey([cohort.label], ri)}>
              <text
                x={gx - TICK_GAP_PX}
                y={LABEL_H + ri * step + cell / 2}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{cohort.label}</title>
                {truncateLabel(cohort.label, LABEL_MAX_ROW)}
              </text>
              {cohort.values.map((raw, ci) => {
                const v = toNumber(raw, Number.NaN);
                const rate =
                  base > 0 && Number.isFinite(v) && v >= 0
                    ? v / base
                    : MISSING_RATE;
                const missing = rate === MISSING_RATE;
                const period = labels[ci] ?? `P${ci + 1}`;
                const tip = missing
                  ? `${cohort.label} · ${period}: ${MISSING_VALUE}`
                  : `${cohort.label} · ${period}: ${fmtRate(rate)} retención`;
                const showText =
                  showValues === "always" ||
                  (showValues === "auto" && cell >= COHORT_VALUE_MIN_CELL);
                return (
                  <g key={stableKey([period], ci)}>
                    <title>{tip}</title>
                    <rect
                      x={gx + ci * step}
                      y={LABEL_H + ri * step}
                      width={cell}
                      height={cell}
                      rx={BAR_RADIUS}
                      fill={fill}
                      fillOpacity={
                        missing || rate <= 0
                          ? EMPTY_CELL_OPACITY
                          : CELL_BASE_OPACITY +
                            CELL_RANGE_OPACITY * Math.min(1, rate)
                      }
                      data-chart-tip={tip}
                    />
                    {showText ? (
                      <text
                        x={gx + ci * step + cell / 2}
                        y={LABEL_H + ri * step + cell / 2}
                        dy={TICK_DY}
                        textAnchor="middle"
                        fontSize={TICK_FONT_SIZE}
                        fill={CHART_TOKEN.foreground}
                      >
                        {missing ? MISSING_VALUE : fmtRate(rate)}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
