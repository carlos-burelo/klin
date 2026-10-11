/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { max } from "d3-array";
import { formatDefault, seriesColor, truncateLabel } from "../lib/palette";
import { ChartEmpty } from "./empty";

const W = 640;
const LABEL_W = 132;
const LABEL_H = 30;
const MAX_CELL = 64;

/**
 * Mapa de calor matricial SSR (filas × columnas, intensidad por opacidad).
 * La parrilla se centra en un lienzo fijo de 640 para no agigantarse.
 */
export function MatrixHeatmap({
  rows,
  cols,
  values,
  ariaLabel,
  formatValue = formatDefault,
  color,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  rows: string[];
  cols: string[];
  /** values[fila][columna]. */
  values: number[][];
  ariaLabel: string;
  formatValue?: (value: number) => string;
  color?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0 || cols.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const top = Math.max(1, max(values, (r) => max(r) ?? 0) ?? 1);
  const cell = Math.min(
    MAX_CELL,
    Math.floor((W - LABEL_W - 16) / cols.length) - 4,
  );
  const step = cell + 4;
  const gridW = cols.length * step - 4;
  const gx = LABEL_W + Math.max(0, (W - LABEL_W - gridW) / 2);
  const H = LABEL_H + rows.length * step - 4 + 8;
  const fill = seriesColor(0, color);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {cols.map((col, ci) => (
          <text
            key={col}
            x={gx + ci * step + cell / 2}
            y={LABEL_H - 8}
            textAnchor="middle"
            fontSize={11}
            fill="var(--color-muted-foreground)"
          >
            <title>{col}</title>
            {truncateLabel(col, 10)}
          </text>
        ))}
        {rows.map((row, ri) => (
          <g key={row}>
            <text
              x={gx - 8}
              y={LABEL_H + ri * step + cell / 2}
              dy={4}
              textAnchor="end"
              fontSize={11}
              fill="var(--color-muted-foreground)"
            >
              <title>{row}</title>
              {truncateLabel(row, 18)}
            </text>
            {cols.map((col, ci) => {
              const v = values[ri]?.[ci] ?? 0;
              const tip = `${row} · ${col}: ${formatValue(v)}`;
              return (
                <g key={col}>
                  <title>{tip}</title>
                  <rect
                    x={gx + ci * step}
                    y={LABEL_H + ri * step}
                    width={cell}
                    height={cell}
                    rx={4}
                    fill={fill}
                    fillOpacity={v <= 0 ? 0.08 : 0.15 + 0.85 * (v / top)}
                    data-chart-tip={tip}
                  />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
