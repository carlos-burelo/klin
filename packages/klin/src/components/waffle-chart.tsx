/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { resolveFormatter } from "../core/format";
import { isBlank } from "../core/guards";
import { CHART_TOKEN, DEFAULT_LOCALE, PERCENT_FACTOR } from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  cleanWaffleParts,
  computeWaffleCells,
  computeWaffleEmptyCells,
  computeWaffleGrid,
  totalWaffleValue,
  WAFFLE_COLS,
  WAFFLE_GAP,
} from "./waffle-chart.compute";
import type { WaffleChartProps } from "./waffle-chart.types";

export type {
  WaffleCell,
  WaffleCleanPart,
  WaffleGrid,
} from "./waffle-chart.compute";
export {
  cleanWaffleParts,
  computeWaffleCells,
  computeWaffleEmptyCells,
  computeWaffleGrid,
  totalWaffleValue,
  WAFFLE_COLS,
  WAFFLE_GAP,
} from "./waffle-chart.compute";
export type { WaffleChartProps, WafflePart } from "./waffle-chart.types";

/**
 * Waffle SSR (100 cuadros 10×10 para porcentajes y partes).
 */
export function WaffleChart({
  parts,
  ariaLabel,
  size = 220,
  columns = WAFFLE_COLS,
  gap = WAFFLE_GAP,
  cellRadius,
  locale = DEFAULT_LOCALE,
  format,
  itemColor,
  showLegend = true,
  showLegendValues = true,
  emptyColor,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: WaffleChartProps) {
  const clean = cleanWaffleParts(parts);
  const total = totalWaffleValue(clean);
  if (isBlank(parts) || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const { cols, rows, sep, radius, cell } = computeWaffleGrid(
    size,
    columns,
    gap,
    cellRadius,
  );
  const cells = computeWaffleCells(clean, total);
  const emptyCells =
    emptyColor === undefined
      ? []
      : computeWaffleEmptyCells(cols, rows, cells.length);
  const colors = clean.map(
    (p, i) => p.color ?? itemColor?.(p, i) ?? seriesColor(i),
  );

  return (
    <div
      className={
        className
          ? `flex flex-col items-center ${className}`
          : "flex flex-col items-center"
      }
      style={style}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="h-auto max-w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {cells.map((c, i) => {
          const col = i % cols;
          const row = rows - 1 - Math.floor(i / cols);
          const part = clean[c.part];
          if (!part) return null;
          const tip = `${part.label}: ${fmt((part.value / total) * PERCENT_FACTOR)}%`;
          return (
            <g key={`${col}-${row}`}>
              <rect
                x={col * (cell + sep)}
                y={row * (cell + sep)}
                width={cell}
                height={cell}
                rx={radius}
                fill={colors[c.part] ?? CHART_TOKEN.chart1}
                data-chart-tip={tip}
              />
            </g>
          );
        })}
        {emptyCells.map((i) => {
          const col = i % cols;
          const row = rows - 1 - Math.floor(i / cols);
          return (
            <g key={`empty-${col}-${row}`}>
              <rect
                x={col * (cell + sep)}
                y={row * (cell + sep)}
                width={cell}
                height={cell}
                rx={radius}
                fill={emptyColor ?? CHART_TOKEN.track}
              />
            </g>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={clean.map((p, i) => ({
            label: showLegendValues
              ? `${p.label} · ${fmt((p.value / total) * PERCENT_FACTOR)}%`
              : p.label,
            color: colors[i] ?? CHART_TOKEN.chart1,
          }))}
        />
      ) : null}
    </div>
  );
}
