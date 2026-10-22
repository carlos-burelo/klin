/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { seriesColor } from "../core/color";
import { toNumber } from "../core/number";
import { EMPTY_CELL_OPACITY } from "../core/theme";

export const CELL = 13;
export const GAPC = 3;
export const TOP_H = 22;
export const LEFT_W = 20;
/** Días por semana, radio de celda y opacidades de intensidad. */
export const WEEK_DAYS = 7;
export const CELL_RADIUS = 3;
export const CELL_BASE_OPACITY = 0.2;
export const CELL_RANGE_OPACITY = 0.8;
/** Ms por día para ventanas explícitas. */
export const CAL_DAY_MS = 86_400_000;
/** Etiquetas de mes/día y pasos de la leyenda. */
export const MONTH_LABEL_Y = 12;
export const DOW_LABEL_DY = 3;
export const DOW_FONT_SIZE = 9;
export const LEGEND_OPACITIES = [0.08, 0.35, 0.6, 0.85, 1];
/** Lun..Dom en orden de fila (getDay 1..6,0). */
export const DOW = ["L", "M", "X", "J", "V", "S", "D"];

/** Etiquetas de día según apertura de semana (1 = Lun..Dom, 0 = Dom..Sáb). */
export function resolveCalendarDow(weekStart: 0 | 1): string[] {
  if (weekStart === 0) return [DOW[6] ?? "D", ...(DOW.slice(0, 6) as string[])];
  return [...DOW];
}

/** Normaliza la apertura de semana (solo 0 o 1; resto → 1). */
export function safeWeekStart(weekStart: unknown): 0 | 1 {
  return weekStart === 0 ? 0 : 1;
}

/** Ventana efectiva de semanas del calendario. */
export type CalendarWindow = {
  effectiveStart: Date;
  effectiveWeeks: number;
  lastSunday: Date;
};

/** Resuelve la ventana de semanas (verbatim de la vista). */
export function resolveCalendarWindow(
  end: string | undefined,
  start: string | undefined,
  weeks: number,
  weekStart: 0 | 1 = 1,
): CalendarWindow {
  const ws = safeWeekStart(weekStart);
  const weekCount = Math.max(1, Math.floor(toNumber(weeks)));
  const endDate = end ? new Date(`${end}T12:00:00`) : new Date();
  // Día que cierra la última semana (domingo si abre lunes, sábado si abre domingo).
  const lastSunday = new Date(endDate);
  if (ws === 0) {
    lastSunday.setDate(
      lastSunday.getDate() +
        ((6 - lastSunday.getDay() + WEEK_DAYS) % WEEK_DAYS),
    );
  } else {
    lastSunday.setDate(
      lastSunday.getDate() + ((WEEK_DAYS - lastSunday.getDay()) % WEEK_DAYS),
    );
  }
  // Día que abre la primera semana (lunes o domingo según `weekStart`).
  const computedStart = new Date(lastSunday);
  computedStart.setDate(
    computedStart.getDate() - (weekCount - 1) * WEEK_DAYS - (WEEK_DAYS - 1),
  );
  // Ventana explícita: ancla al inicio de semana de `start` y deriva semanas hasta el cierre.
  let effectiveStart = computedStart;
  let effectiveWeeks = weekCount;
  if (start) {
    const parsed = new Date(`${start}T12:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      const anchored = new Date(parsed);
      if (ws === 0) {
        anchored.setDate(anchored.getDate() - (anchored.getDay() % WEEK_DAYS));
      } else {
        anchored.setDate(
          anchored.getDate() - ((anchored.getDay() + 6) % WEEK_DAYS),
        );
      }
      effectiveStart = anchored;
      const spanDays =
        Math.round((lastSunday.getTime() - anchored.getTime()) / CAL_DAY_MS) +
        1;
      effectiveWeeks = Math.max(1, Math.ceil(spanDays / WEEK_DAYS));
    }
  }
  return { effectiveStart, effectiveWeeks, lastSunday };
}

/** Intensidad máxima (verbatim de la vista). */
export function calendarTop(values: Record<string, number>): number {
  return Math.max(1, ...Object.entries(values).map(([, v]) => toNumber(v)));
}

/** Color de relleno de las celdas (verbatim de la vista). */
export function resolveCalendarFill(color: string | undefined): string {
  return seriesColor(0, color);
}

/** Dimensiones del lienzo según semanas efectivas (verbatim de la vista). */
export function calendarDims(effectiveWeeks: number): { W: number; H: number } {
  const W = LEFT_W + effectiveWeeks * (CELL + GAPC);
  const H = TOP_H + WEEK_DAYS * (CELL + GAPC);
  return { W, H };
}

/** Clave `YYYY-MM-DD` de una fecha (verbatim de la vista). */
export function calendarIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Marcas de mes sobre la parrilla (verbatim de la vista). */
export function buildCalendarMonthMarks(
  effectiveStart: Date,
  effectiveWeeks: number,
  locale: string,
): { x: number; label: string }[] {
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
  return monthMarks;
}

/** Opacidad de celda según intensidad (verbatim de la vista). */
export function calendarCellOpacity(v: number, top: number): number {
  return v <= 0
    ? EMPTY_CELL_OPACITY
    : CELL_BASE_OPACITY + CELL_RANGE_OPACITY * (v / top);
}
