/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { DEFAULT_MAX_ROWS } from "../core/limits";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  FONT_MONO,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../core/theme";
import { ChartSvg } from "../render/chart-svg";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  computeIsotypeOffsets,
  computeIsotypeRows,
  ISOTYPE_CELL,
  ISOTYPE_COUNT_DY,
  ISOTYPE_LABEL_DY,
  ISOTYPE_LABEL_MAX,
  ISOTYPE_LABEL_W,
  ISOTYPE_MARGIN,
  ISOTYPE_MAX_PER_ROW,
  ISOTYPE_R,
  ISOTYPE_SORT_NONE,
  ISOTYPE_W,
  isotypeLinesOf,
} from "./isotype-chart.compute";
import type { IsotypeChartProps } from "./isotype-chart.types";

export type { IsotypeChartProps, IsotypeDatum } from "./isotype-chart.types";

/**
 * Isotipo SSR (conteos como filas de pictogramas circulares:
 * cada círculo vale `unit`, envueltos en filas de `maxPerRow`).
 * Etiqueta + conteo tabular a la izquierda; tope MAX_ISOTYPE.
 */
export function IsotypeChart({
  series,
  unit,
  ariaLabel,
  height = 260,
  locale = DEFAULT_LOCALE,
  format,
  maxPerRow = ISOTYPE_MAX_PER_ROW,
  showLabels = true,
  showCounts = true,
  sortBy = ISOTYPE_SORT_NONE,
  maxItems = DEFAULT_MAX_ROWS,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: IsotypeChartProps) {
  const { rows, perRow } = computeIsotypeRows(
    series,
    unit,
    maxPerRow,
    sortBy,
    maxItems,
  );
  if (rows.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const { offsets, chartH } = computeIsotypeOffsets(rows, perRow, height);
  const iconsX = ISOTYPE_MARGIN.left + ISOTYPE_LABEL_W;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={ISOTYPE_W}
        height={chartH}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        {rows.map((r, ri) => {
          const top = offsets[ri] ?? ISOTYPE_MARGIN.top;
          const midY =
            top + (isotypeLinesOf(r.count, perRow) * ISOTYPE_CELL) / 2;
          const tip = `${r.label}: ${fmt(r.value)} (${r.count} pictogramas)`;
          return (
            <g key={stableKey([r.label], ri)}>
              {showLabels ? (
                <text
                  x={ISOTYPE_MARGIN.left}
                  y={midY}
                  dy={-ISOTYPE_LABEL_DY}
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                  data-chart-tip={r.label}
                >
                  {truncateLabel(r.label, ISOTYPE_LABEL_MAX)}
                </text>
              ) : null}
              {showCounts ? (
                <text
                  x={ISOTYPE_MARGIN.left}
                  y={midY}
                  dy={ISOTYPE_COUNT_DY}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {fmt(r.value)}
                </text>
              ) : null}
              {Array.from({ length: r.count }, (_, k) => {
                const line = Math.floor(k / perRow);
                const col = k % perRow;
                return (
                  <g key={`${col}-${line}`}>
                    <circle
                      cx={iconsX + col * ISOTYPE_CELL + ISOTYPE_R}
                      cy={top + line * ISOTYPE_CELL + ISOTYPE_R}
                      r={ISOTYPE_R}
                      fill={r.color}
                      stroke={CHART_TOKEN.background}
                      strokeWidth={POINT_BORDER}
                      data-chart-tip={tip}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </ChartSvg>
    </div>
  );
}
