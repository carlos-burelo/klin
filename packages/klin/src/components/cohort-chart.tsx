/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  MISSING_VALUE,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  cohortBase,
  cohortCellOpacity,
  cohortRate,
  computeCohortGrid,
  computeCohortPeriods,
  LABEL_H,
  LABEL_MAX_COL,
  LABEL_MAX_ROW,
  MISSING_RATE,
  resolveCohortFill,
  resolveCohortFormat,
  resolveCohortLabels,
  resolveCohortRows,
  shouldShowCohortValue,
  W,
} from "./cohort-chart.compute";
import type { CohortChartProps } from "./cohort-chart.types";

export type { Cohort, CohortChartProps } from "./cohort-chart.types";

/**
 * Retención por cohortes SSR (cada fila pinta sus `values` tal cual;
 * el triángulo `n − i` lo aporta quien llama con filas de largo decreciente).
 * Cada fila se normaliza por su primer valor; sin base positiva, vacía.
 */
export function CohortChart({
  cohorts,
  periodLabels,
  ariaLabel,
  format,
  locale = DEFAULT_LOCALE,
  color,
  missingLabel = MISSING_VALUE,
  showValues = "auto",
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: CohortChartProps) {
  const rows = resolveCohortRows(cohorts);
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmtRate = resolveCohortFormat(format, locale);
  const periods = computeCohortPeriods(rows);
  const labels = resolveCohortLabels(periodLabels, periods);

  const { cell, step, gx, H } = computeCohortGrid(periods, rows.length);
  const fill = resolveCohortFill(color);

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
        {labels.slice(0, periods).map((period, ci) => (
          <text
            key={stableKey([period], ci)}
            x={gx + ci * step + cell / 2}
            y={LABEL_H - TICK_GAP_PX}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
            data-chart-tip={period}
          >
            {truncateLabel(period, LABEL_MAX_COL)}
          </text>
        ))}
        {rows.map((cohort, ri) => {
          const base = cohortBase(cohort);
          return (
            <g key={stableKey([cohort.label], ri)}>
              <text
                x={gx - TICK_GAP_PX}
                y={LABEL_H + ri * step + cell / 2}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={cohort.label}
              >
                {truncateLabel(cohort.label, LABEL_MAX_ROW)}
              </text>
              {cohort.values.map((raw, ci) => {
                const rate = cohortRate(base, raw);
                const missing = rate === MISSING_RATE;
                const period = labels[ci] ?? `P${ci + 1}`;
                const tip = missing
                  ? `${cohort.label} · ${period}: ${missingLabel}`
                  : `${cohort.label} · ${period}: ${fmtRate(rate)} retención`;
                const showText = shouldShowCohortValue(showValues, cell);
                return (
                  <g key={stableKey([period], ci)}>
                    <rect
                      x={gx + ci * step}
                      y={LABEL_H + ri * step}
                      width={cell}
                      height={cell}
                      rx={BAR_RADIUS}
                      fill={fill}
                      fillOpacity={cohortCellOpacity(missing, rate)}
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
                        {missing ? missingLabel : fmtRate(rate)}
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
