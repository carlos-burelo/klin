/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { max, min } from "d3-array";
import { type ScaleTime, scaleTime } from "d3-scale";
import { formatDefault } from "../core/format";
import { toNumber } from "../core/number";
import { CHART_TOKEN, PERCENT_FACTOR } from "../core/theme";
import type { GanttTask } from "./gantt-chart.types";

export const W = 640;
export const MARGIN = { top: 8, right: 12, bottom: 28, left: 148 };
export const ROW_H = 30;
/** Ancho por defecto de la columna de etiquetas (paridad con `MARGIN.left`). */
export const DEFAULT_LABEL_WIDTH = 148;
/** Alto mínimo, día en ms, nº de marcas y geometría de barra/etiqueta. */
export const GANTT_MIN_H = 120;
export const DAY_MS = 86_400_000;
export const GANTT_TICKS = 5;
export const MIN_BAR_W = 3;
export const BAR_Y_OFFSET = 6;
export const AXIS_LABEL_BOTTOM_PAD = 10;
/** Máximo de truncado de tarea. */
export const LABEL_MAX_TASK = 20;

/** Parsea fecha `YYYY-MM-DD` (mediodía) o `Date` (verbatim de la vista). */
export function toGanttDate(v: string | Date): Date {
  return v instanceof Date ? v : new Date(`${v}T12:00:00`);
}

/** Alto de fila y ancho de etiqueta efectivos (verbatim de la vista). */
export function resolveGanttRows(
  rowHeight: unknown,
  labelWidth: unknown,
): { effectiveRowH: number; effectiveLabelW: number } {
  const effectiveRowH = Math.max(1, Math.floor(toNumber(rowHeight)));
  const effectiveLabelW = Math.max(0, Math.floor(toNumber(labelWidth)));
  return { effectiveRowH, effectiveLabelW };
}

/** Margen con izquierda según el ancho de etiqueta (verbatim de la vista). */
export function resolveGanttMargin(effectiveLabelW: number): typeof MARGIN {
  return { ...MARGIN, left: effectiveLabelW };
}

/** Alto del lienzo: automático según tareas salvo override (verbatim). */
export function resolveGanttHeight(
  taskCount: number,
  effectiveRowH: number,
  margin: { top: number; bottom: number },
  heightProp: number | undefined,
): number {
  const computedH = Math.max(
    GANTT_MIN_H,
    margin.top + margin.bottom + taskCount * effectiveRowH,
  );
  return heightProp === undefined
    ? computedH
    : Math.max(GANTT_MIN_H, Math.floor(toNumber(heightProp)));
}

/** Escala temporal con día de colchón y sus marcas (verbatim de la vista). */
export function buildGanttScale(
  tasks: GanttTask[],
  innerW: number,
): { x: ScaleTime<number, number>; lo: number; hi: number; ticks: Date[] } {
  const starts = tasks
    .map((t) => toGanttDate(t.start).getTime())
    .filter(Number.isFinite);
  const ends = tasks
    .map((t) => toGanttDate(t.end).getTime())
    .filter(Number.isFinite);
  const lo = min(starts) ?? Date.now();
  const hi = Math.max(max(ends) ?? Date.now(), lo + DAY_MS);
  const x = scaleTime()
    .domain([new Date(lo - DAY_MS), new Date(hi + DAY_MS)])
    .range([0, innerW]);
  const ticks = x.ticks(GANTT_TICKS);
  return { x, lo, hi, ticks };
}

/** Línea de hoy (posición y visibilidad, verbatim de la vista). */
export function resolveGanttToday(
  today: string | Date | undefined,
  x: ScaleTime<number, number>,
  marginLeft: number,
  innerW: number,
): { todayDate: Date | null; todayX: number | null; showToday: boolean } {
  const todayDate = today === undefined ? null : toGanttDate(today);
  const todayX =
    todayDate && Number.isFinite(todayDate.getTime())
      ? marginLeft + x(todayDate)
      : null;
  const showToday =
    todayX !== null && todayX >= marginLeft && todayX <= marginLeft + innerW;
  return { todayDate, todayX, showToday };
}

/** Geometría de la barra de tarea (posición, avance y duración, verbatim). */
export function ganttTaskGeometry(
  task: GanttTask,
  x: ScaleTime<number, number>,
  marginLeft: number,
  marginTop: number,
  effectiveRowH: number,
  index: number,
): {
  s: Date;
  e: Date;
  bx: number;
  bw: number;
  by: number;
  bh: number;
  color: string;
  pct: number | null;
  days: number | null;
} {
  const s = toGanttDate(task.start);
  const e = toGanttDate(task.end);
  const bx = marginLeft + x(s);
  const bw = Math.max(MIN_BAR_W, x(e) - x(s));
  const by = marginTop + index * effectiveRowH + BAR_Y_OFFSET;
  const bh = effectiveRowH - BAR_Y_OFFSET * 2;
  const color = task.color ?? CHART_TOKEN.chart1;
  const pct =
    task.progress === undefined
      ? null
      : Math.min(PERCENT_FACTOR, Math.max(0, toNumber(task.progress)));
  const durMs = e.getTime() - s.getTime();
  const days = Number.isFinite(durMs)
    ? Math.max(1, Math.round(durMs / DAY_MS) + 1)
    : null;
  return { s, e, bx, bw, by, bh, color, pct, days };
}

/** Ancho de la barra de avance sobre la pista (verbatim de la vista). */
export function ganttProgressWidth(
  bw: number,
  bh: number,
  pct: number | null,
): number {
  return Math.max(bh, (bw * (pct ?? PERCENT_FACTOR)) / PERCENT_FACTOR);
}

/** Tip de tarea (rango, avance y duración, verbatim de la vista). */
export function buildGanttTip(
  label: string,
  s: Date,
  e: Date,
  pct: number | null,
  days: number | null,
  fmt: (d: Date) => string,
  locale: string,
): string {
  return (
    `${label}: ${fmt(s)} → ${fmt(e)}` +
    (pct === null ? "" : ` · ${formatDefault(pct, locale)}%`) +
    (days === null ? "" : ` · ${days} d`)
  );
}

/** Ordena tareas (`start` cronológico, `label` alfabético, entrada). */
export function sortGanttTasks(
  tasks: GanttTask[],
  sortBy?: "start" | "label",
  locale?: string,
): GanttTask[] {
  if (sortBy === "start") {
    return [...tasks].sort(
      (a, b) => toGanttDate(a.start).getTime() - toGanttDate(b.start).getTime(),
    );
  }
  if (sortBy === "label") {
    return [...tasks].sort((a, b) => a.label.localeCompare(b.label, locale));
  }
  return tasks;
}
