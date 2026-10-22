/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { resolveFormatter } from "../core/format";
import { stableKey } from "../core/keys";
import { toNumber } from "../core/number";

import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  DIAGRAM_MIN_SCROLL,
  EDGE_LABEL_FONT_SIZE,
} from "../core/theme";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  buildCalendarMonthMarks,
  CELL,
  CELL_RADIUS,
  calendarCellOpacity,
  calendarDims,
  calendarIso,
  calendarTop,
  DOW_FONT_SIZE,
  DOW_LABEL_DY,
  GAPC,
  LEFT_W,
  LEGEND_OPACITIES,
  MONTH_LABEL_Y,
  resolveCalendarDow,
  resolveCalendarFill,
  resolveCalendarWindow,
  safeWeekStart,
  TOP_H,
  WEEK_DAYS,
} from "./calendar-heatmap.compute";
import type { CalendarHeatmapProps } from "./calendar-heatmap.types";

export type { CalendarHeatmapProps } from "./calendar-heatmap.types";

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
  weekStart = 1,
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
  const ws = safeWeekStart(weekStart);
  const dowLabels = resolveCalendarDow(ws);

  const { effectiveStart, effectiveWeeks, lastSunday } = resolveCalendarWindow(
    end,
    start,
    weeks,
    ws,
  );

  const top = calendarTop(values);
  const fill = resolveCalendarFill(color);
  /** Formato corto del día de semana para tooltips (locale configurable). */
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const { W, H } = calendarDims(effectiveWeeks);

  const monthMarks = buildCalendarMonthMarks(
    effectiveStart,
    effectiveWeeks,
    locale,
  );

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        style={{ minWidth: Math.min(W, DIAGRAM_MIN_SCROLL), maxWidth: W }}
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
          ? dowLabels.map((d, i) =>
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
            // dow 0 = primer día de la semana (lunes si weekStart=1, domingo si 0).
            const d = new Date(effectiveStart);
            d.setDate(d.getDate() + w * WEEK_DAYS + dow);
            if (d > lastSunday) return null;
            const key = calendarIso(d);
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
                <rect
                  x={LEFT_W + w * (CELL + GAPC)}
                  y={TOP_H + dow * (CELL + GAPC)}
                  width={CELL}
                  height={CELL}
                  rx={CELL_RADIUS}
                  fill={fill}
                  fillOpacity={calendarCellOpacity(v, top)}
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
