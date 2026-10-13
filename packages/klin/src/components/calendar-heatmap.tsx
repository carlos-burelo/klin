/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { resolveFormatter } from "../lib/format";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
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
/** Ms por día para ventanas explícitas. */
const CAL_DAY_MS = 86_400_000;
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
  /** Fecha de inicio `YYYY-MM-DD` para ventana explícita (si es válida ignora `weeks`). */
  start?: string;
  weeks?: number;
  /** Muestra etiquetas de mes sobre la parrilla. */
  showMonthLabels?: boolean;
  /** Muestra etiquetas de días (L/M/X…) a la izquierda. */
  showWeekdayLabels?: boolean;
  /** Muestra la leyenda Menos/Más. */
  showLegend?: boolean;
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
  start,
  weeks = 26,
  showMonthLabels = true,
  showWeekdayLabels = true,
  showLegend = true,
  locale = DEFAULT_LOCALE,
  format,
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

  const fmt = resolveFormatter(format, locale);

  const weekCount = Math.max(1, Math.floor(toNumber(weeks)));
  const endDate = end ? new Date(`${end}T12:00:00`) : new Date();
  // Domingo que cierra la última semana (getDay: 0 = domingo).
  const lastSunday = new Date(endDate);
  lastSunday.setDate(
    lastSunday.getDate() + ((WEEK_DAYS - lastSunday.getDay()) % WEEK_DAYS),
  );
  // Lunes que abre la primera semana (las filas son Lun..Dom).
  const computedStart = new Date(lastSunday);
  computedStart.setDate(
    computedStart.getDate() - (weekCount - 1) * WEEK_DAYS - (WEEK_DAYS - 1),
  );
  // Ventana explícita: ancla al lunes de `start` y deriva semanas hasta el cierre.
  let effectiveStart = computedStart;
  let effectiveWeeks = weekCount;
  if (start) {
    const parsed = new Date(`${start}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      const monday = new Date(parsed);
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % WEEK_DAYS));
      effectiveStart = monday;
      const spanDays =
        Math.round((lastSunday.getTime() - monday.getTime()) / CAL_DAY_MS) + 1;
      effectiveWeeks = Math.max(1, Math.ceil(spanDays / WEEK_DAYS));
    }
  }

  const top = Math.max(1, ...entries.map(([, v]) => toNumber(v)));
  const fill = seriesColor(0, color);
  /** Formato corto del día de semana para tooltips (locale configurable). */
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const W = LEFT_W + effectiveWeeks * (CELL + GAPC);
  const H = TOP_H + WEEK_DAYS * (CELL + GAPC);
  // Lun..Dom en orden de fila (getDay 1..6,0).
  const DOW = ["L", "M", "X", "J", "V", "S", "D"];

  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const monthMarks: { x: number; label: string }[] = [];
  let prevMonth = -1;
  for (let w = 0; w < effectiveWeeks; w++) {
    const d = new Date(effectiveStart);
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
        {showMonthLabels
          ? monthMarks.map((m) => (
              <text
                key={`${m.x}-${m.label}`}
                x={m.x}
                y={MONTH_LABEL_Y}
                fontSize={EDGE_LABEL_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {m.label}
              </text>
            ))
          : null}
        {showWeekdayLabels
          ? DOW.map((d, i) =>
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
            )
          : null}
        {Array.from({ length: effectiveWeeks }, (_, w) =>
          Array.from({ length: WEEK_DAYS }, (_, dow) => {
            // dow 0 = lunes … 6 = domingo.
            const d = new Date(effectiveStart);
            d.setDate(d.getDate() + w * WEEK_DAYS + dow);
            if (d > lastSunday) return null;
            const key = iso(d);
            const v = toNumber(values[key] ?? 0);
            const fecha = new Date(`${key}T00:00:00`);
            const weekday = Number.isNaN(fecha.getTime())
              ? ""
              : weekdayFmt.format(fecha);
            const tip = weekday
              ? `${key} (${weekday}): ${fmt(v)}`
              : `${key}: ${fmt(v)}`;
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
      {showLegend ? (
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
      ) : null}
    </div>
  );
}
