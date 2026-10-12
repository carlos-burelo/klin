/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { formatDefault, seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_LABEL_FONT_SIZE,
  EMPTY_CELL_OPACITY,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

const CELL = 13;
const GAPC = 3;
const TOP_H = 22;
const LEFT_W = 20;
/** Días por semana, radio de celda y opacidades de intensidad. */
const WEEK_DAYS = 7;
const CELL_RADIUS = 3;
const CELL_BASE_OPACITY = 0.2;
const CELL_RANGE_OPACITY = 0.8;
/** Etiquetas de mes/día y pasos de la leyenda. */
const MONTH_LABEL_Y = 12;
const DOW_LABEL_DY = 3;
const DOW_FONT_SIZE = 9;
const LEGEND_OPACITIES = [0.08, 0.35, 0.6, 0.85, 1];

/** Props del calor de calendario SSR estilo contribuciones. */
export type CalendarHeatmapProps = {
  values: Record<string, number>;
  ariaLabel: string;
  /** Fecha de fin `YYYY-MM-DD` (por defecto hoy; pasar fija para determinismo). */
  end?: string;
  weeks?: number;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Calor de calendario SSR estilo contribuciones (7 filas Lun–Dom × semanas).
 * `values` mapea `YYYY-MM-DD` → intensidad.
 */
export function CalendarHeatmap({
  values,
  ariaLabel,
  end,
  weeks = 26,
  locale = "es-MX",
  format = (v: number) => formatDefault(v, locale),
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: CalendarHeatmapProps) {
  const entries = Object.entries(values);
  if (entries.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const weekCount = Math.max(1, Math.floor(toNumber(weeks)));
  const endDate = end ? new Date(`${end}T12:00:00`) : new Date();
  // Domingo que cierra la última semana (getDay: 0 = domingo).
  const lastSunday = new Date(endDate);
  lastSunday.setDate(
    lastSunday.getDate() + ((WEEK_DAYS - lastSunday.getDay()) % WEEK_DAYS),
  );
  // Lunes que abre la primera semana (las filas son Lun..Dom).
  const start = new Date(lastSunday);
  start.setDate(
    start.getDate() - (weekCount - 1) * WEEK_DAYS - (WEEK_DAYS - 1),
  );

  const top = Math.max(1, ...entries.map(([, v]) => toNumber(v)));
  const fill = seriesColor(0, color);
  /** Formato corto del día de semana para tooltips (locale configurable). */
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const W = LEFT_W + weekCount * (CELL + GAPC);
  const H = TOP_H + WEEK_DAYS * (CELL + GAPC);
  // Lun..Dom en orden de fila (getDay 1..6,0).
  const DOW = ["L", "M", "X", "J", "V", "S", "D"];

  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const monthMarks: { x: number; label: string }[] = [];
  let prevMonth = -1;
  for (let w = 0; w < weekCount; w++) {
    const d = new Date(start);
    d.setDate(d.getDate() + w * WEEK_DAYS);
    if (d.getMonth() !== prevMonth) {
      prevMonth = d.getMonth();
      monthMarks.push({
        x: LEFT_W + w * (CELL + GAPC),
        label: d.toLocaleString(locale, { month: "short" }),
      });
    }
  }

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <title>{ariaLabel}</title>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto"
        style={{ minWidth: Math.min(W, DIAGRAM_MIN_SCROLL) }}
        aria-hidden="true"
      >
        {monthMarks.map((m) => (
          <text
            key={`${m.x}-${m.label}`}
            x={m.x}
            y={MONTH_LABEL_Y}
            fontSize={EDGE_LABEL_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {m.label}
          </text>
        ))}
        {DOW.map((d, i) =>
          i % 2 === 1 ? (
            <text
              key={stableKey([d], i)}
              x={0}
              y={TOP_H + i * (CELL + GAPC) + CELL - DOW_LABEL_DY}
              fontSize={DOW_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {d}
            </text>
          ) : null,
        )}
        {Array.from({ length: weekCount }, (_, w) =>
          Array.from({ length: WEEK_DAYS }, (_, dow) => {
            // dow 0 = lunes … 6 = domingo.
            const d = new Date(start);
            d.setDate(d.getDate() + w * WEEK_DAYS + dow);
            if (d > lastSunday) return null;
            const key = iso(d);
            const v = toNumber(values[key] ?? 0);
            const fecha = new Date(`${key}T00:00:00`);
            const weekday = Number.isNaN(fecha.getTime())
              ? ""
              : weekdayFmt.format(fecha);
            const tip = weekday
              ? `${key} (${weekday}): ${format(v)}`
              : `${key}: ${format(v)}`;
            return (
              <g key={key}>
                <title>{tip}</title>
                <rect
                  x={LEFT_W + w * (CELL + GAPC)}
                  y={TOP_H + dow * (CELL + GAPC)}
                  width={CELL}
                  height={CELL}
                  rx={CELL_RADIUS}
                  fill={fill}
                  fillOpacity={
                    v <= 0
                      ? EMPTY_CELL_OPACITY
                      : CELL_BASE_OPACITY + CELL_RANGE_OPACITY * (v / top)
                  }
                  data-chart-tip={tip}
                />
              </g>
            );
          }),
        )}
      </svg>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Menos</span>
        {LEGEND_OPACITIES.map((o, oi) => (
          <span
            key={stableKey([o], oi)}
            className="inline-block size-[10px] rounded-[3px]"
            style={{ backgroundColor: fill, opacity: o }}
          />
        ))}
        <span>Más</span>
      </p>
    </div>
  );
}
