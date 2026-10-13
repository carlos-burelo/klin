/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import {
  BAR_RADIUS,
  CHART_TOKEN,
  DEFAULT_LOCALE,
  PERCENT_FACTOR,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Parte del waffle (etiqueta, valor 0–100 y color opcional). */
export type WafflePart = {
  label: string;
  /** 0–100 (se normaliza si la suma difiere). */
  value: number;
  color?: string;
};

/** Props del waffle SSR (100 cuadros 10×10). */
export type WaffleChartProps = {
  parts: WafflePart[];
  ariaLabel: string;
  size?: number;
  /**
   * Columnas de la retícula (las 100 celdas se reparten en filas).
   * @default 10
   */
  columns?: number;
  /**
   * Separación entre celdas en px.
   * @default 3
   */
  gap?: number;
  /**
   * Radio de esquina de la celda (por defecto BAR_RADIUS).
   * @default BAR_RADIUS
   */
  cellRadius?: number;
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por parte. Si retorna `undefined` se usa el color de serie.
   * Se respeta `part.color` primero.
   */
  itemColor?: (part: WafflePart, index: number) => string | undefined;
  showLegend?: boolean;
  /**
   * Muestra el valor de cada parte en la leyenda.
   * @default true
   */
  showLegendValues?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Columnas de la retícula 10×10 (100 celdas = 100 %). */
const WAFFLE_COLS = 10;
/** Separación entre celdas en px. */
const WAFFLE_GAP = 3;

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
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: WaffleChartProps) {
  const clean = parts.map((p) => ({
    ...p,
    value: Math.max(0, toNumber(p.value)),
  }));
  const total = clean.reduce((a, p) => a + p.value, 0);
  if (isBlank(parts) || total <= 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const cols = Math.max(1, Math.floor(toNumber(columns, WAFFLE_COLS)));
  const rows = Math.max(1, Math.ceil(PERCENT_FACTOR / cols));
  const sep = Math.max(0, toNumber(gap, WAFFLE_GAP));
  const radius = Math.max(0, toNumber(cellRadius ?? BAR_RADIUS, BAR_RADIUS));
  const cell = Math.min(
    (size - sep * (cols - 1)) / cols,
    (size - sep * (rows - 1)) / rows,
  );
  // Celdas por parte (redondeo con resto mayor).
  const raw = clean.map((p) => (p.value / total) * PERCENT_FACTOR);
  const base = raw.map(Math.floor);
  let rest = PERCENT_FACTOR - base.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const o of order) {
    if (rest <= 0) break;
    base[o.i] = (base[o.i] ?? 0) + 1;
    rest--;
  }

  const cells: { part: number }[] = [];
  base.forEach((n, pi) => {
    for (let k = 0; k < (n ?? 0); k++) cells.push({ part: pi });
  });
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
        <title>{`${ariaLabel}: ${clean.map((p) => `${p.label} ${fmt((p.value / total) * PERCENT_FACTOR)}%`).join(" · ")}`}</title>
        {cells.map((c, i) => {
          const col = i % cols;
          const row = rows - 1 - Math.floor(i / cols);
          const part = clean[c.part];
          if (!part) return null;
          const tip = `${part.label}: ${fmt((part.value / total) * PERCENT_FACTOR)}%`;
          return (
            <g key={`${col}-${row}`}>
              <title>{tip}</title>
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
