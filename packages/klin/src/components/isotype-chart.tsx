/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import type { ChartMargin } from "../lib/frame";
import { ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { DEFAULT_MAX_ROWS } from "../lib/limits";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  FONT_MONO,
  POINT_BORDER,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Serie del isotipo (valor absoluto; `icon` se acepta pero el pictograma es círculo). */
export type IsotypeDatum = {
  label: string;
  value: number;
  icon?: string;
  color?: string;
};

/** Props de IsotypeChart. */
export type IsotypeChartProps = {
  series: IsotypeDatum[];
  /** Valor que representa cada pictograma. */
  unit: number;
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /** Pictogramas por fila (se ajusta al ancho disponible). */
  maxPerRow?: number;
  /** Muestra la etiqueta de cada fila. */
  showLabels?: boolean;
  /** Muestra el conteo formateado de cada fila. */
  showCounts?: boolean;
  /** Orden por valor (`none` respeta el orden de entrada). */
  sortBy?: "none" | "asc" | "desc";
  /** Tope de filas (SSR acotado). */
  maxItems?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const ISOTYPE_SORT_NONE = "none";

const ISOTYPE_W = 640;
const ISOTYPE_MARGIN: ChartMargin = {
  top: 12,
  right: 16,
  bottom: 16,
  left: 16,
};
/** Radio fijo del pictograma + paso de retícula + tope por fila. */
const ISOTYPE_R = 7;
const ISOTYPE_GAP = 4;
const ISOTYPE_MAX_PER_ROW = 10;
/** Tope total de pictogramas (SSR acotado). */
const MAX_ISOTYPE = 200;
/** Columna izquierda (etiqueta + conteo) y ritmo vertical. */
const ISOTYPE_LABEL_W = 180;
const ISOTYPE_LABEL_MAX = 22;
const ISOTYPE_LABEL_DY = 2;
const ISOTYPE_COUNT_DY = 15;
const ISOTYPE_ROW_GAP = 12;
const ISOTYPE_CELL = ISOTYPE_R * 2 + ISOTYPE_GAP;

type IsotypeRow = {
  label: string;
  value: number;
  count: number;
  color: string;
};

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
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
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
  const sortMode =
    sortBy === "asc" || sortBy === "desc" ? sortBy : ISOTYPE_SORT_NONE;
  const rawMax = Math.floor(toNumber(maxItems, DEFAULT_MAX_ROWS));
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX_ROWS;
  const ordered = series.slice(0, safeMax);
  if (sortMode !== ISOTYPE_SORT_NONE) {
    ordered.sort((a, b) =>
      sortMode === "asc"
        ? toNumber(a.value) - toNumber(b.value)
        : toNumber(b.value) - toNumber(a.value),
    );
  }
  const perUnit = toNumber(unit, Number.NaN);
  const wanted = Math.floor(toNumber(maxPerRow, ISOTYPE_MAX_PER_ROW));
  const perRowWanted =
    Number.isFinite(wanted) && wanted > 0 ? wanted : ISOTYPE_MAX_PER_ROW;
  const fit = Math.max(
    1,
    Math.floor(
      (ISOTYPE_W -
        ISOTYPE_MARGIN.left -
        ISOTYPE_MARGIN.right -
        ISOTYPE_LABEL_W) /
        ISOTYPE_CELL,
    ),
  );
  const perRow = Math.min(perRowWanted, fit);

  const rows: IsotypeRow[] = [];
  if (perUnit > 0) {
    let budget = MAX_ISOTYPE;
    for (const s of ordered) {
      if (budget <= 0) break;
      const value = toNumber(s.value, Number.NaN);
      if (!Number.isFinite(value) || value <= 0) continue;
      const take = Math.min(Math.max(1, Math.round(value / perUnit)), budget);
      budget -= take;
      rows.push({
        label: s.label,
        value,
        count: take,
        color: seriesColor(rows.length, s.color),
      });
    }
  }
  if (rows.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const linesOf = (count: number) => Math.max(1, Math.ceil(count / perRow));
  const offsets: number[] = [];
  let cursor = ISOTYPE_MARGIN.top;
  for (const r of rows) {
    offsets.push(cursor);
    cursor += linesOf(r.count) * ISOTYPE_CELL + ISOTYPE_ROW_GAP;
  }
  const chartH = Math.max(
    height,
    cursor - ISOTYPE_ROW_GAP + ISOTYPE_MARGIN.bottom,
  );
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
          const midY = top + (linesOf(r.count) * ISOTYPE_CELL) / 2;
          const tip = `${r.label}: ${format(r.value)} (${r.count} pictogramas)`;
          return (
            <g key={stableKey([r.label], ri)}>
              {showLabels ? (
                <text
                  x={ISOTYPE_MARGIN.left}
                  y={midY}
                  dy={-ISOTYPE_LABEL_DY}
                  fontSize={TICK_FONT_SIZE}
                  fill={CHART_TOKEN.foreground}
                >
                  <title>{r.label}</title>
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
                  {format(r.value)}
                </text>
              ) : null}
              {Array.from({ length: r.count }, (_, k) => {
                const line = Math.floor(k / perRow);
                const col = k % perRow;
                return (
                  <g key={`${col}-${line}`}>
                    <title>{tip}</title>
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
