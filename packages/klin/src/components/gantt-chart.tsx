/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { max, min } from "d3-array";
import { scaleTime } from "d3-scale";
import type { CSSProperties } from "react";
import type { ChartMargin } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import { formatDefault, truncateLabel } from "../lib/palette";
import {
  ANNOTATION_DASH,
  CHART_TOKEN,
  GRID_WIDTH,
  PERCENT_FACTOR,
  TICK_DY,
  TICK_FONT_SIZE,
  TICK_GAP_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";
import { ChartLegend } from "./legend";

/** Tarea del Gantt (etiqueta, rango temporal y avance opcional). */
export type GanttTask = {
  label: string;
  start: string | Date;
  end: string | Date;
  /** 0–100. */
  progress?: number;
  color?: string;
};

/** Props del Gantt SSR (tareas en el tiempo con avance opcional). */
export type GanttChartProps = {
  tasks: GanttTask[];
  ariaLabel: string;
  /** Muestra la barra de avance sobre la pista programada. */
  showProgress?: boolean;
  /** Fecha `YYYY-MM-DD` o `Date` para dibujar la línea de hoy. */
  today?: string | Date;
  /** Alto de fila en px. */
  rowHeight?: number;
  /** Ancho de la columna de etiquetas en px. */
  labelWidth?: number;
  /** Alto total del SVG (por defecto según nº de tareas). */
  height?: number;
  formatDate?: (d: Date) => string;
  locale?: string;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const W = 640;
const MARGIN: ChartMargin = { top: 8, right: 12, bottom: 28, left: 148 };
const ROW_H = 30;
/** Ancho por defecto de la columna de etiquetas (paridad con `MARGIN.left`). */
const DEFAULT_LABEL_WIDTH = 148;
/** Alto mínimo, día en ms, nº de marcas y geometría de barra/etiqueta. */
const GANTT_MIN_H = 120;
const DAY_MS = 86_400_000;
const GANTT_TICKS = 5;
const MIN_BAR_W = 3;
const BAR_Y_OFFSET = 6;
const AXIS_LABEL_BOTTOM_PAD = 10;
/** Máximo de truncado de tarea. */
const LABEL_MAX_TASK = 20;

/**
 * Gantt SSR (tareas en el tiempo, con % de avance opcional).
 * Fechas `YYYY-MM-DD` o `Date`.
 */
export function GanttChart({
  tasks,
  ariaLabel,
  showProgress = true,
  today,
  rowHeight = ROW_H,
  labelWidth = DEFAULT_LABEL_WIDTH,
  height: heightProp,
  formatDate,
  locale = "es-MX",
  showLegend = true,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: GanttChartProps) {
  if (tasks.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const effectiveRowH = Math.max(1, Math.floor(toNumber(rowHeight)));
  const effectiveLabelW = Math.max(0, Math.floor(toNumber(labelWidth)));
  const margin: ChartMargin = { ...MARGIN, left: effectiveLabelW };
  const computedH = Math.max(
    GANTT_MIN_H,
    margin.top + margin.bottom + tasks.length * effectiveRowH,
  );
  const height =
    heightProp === undefined
      ? computedH
      : Math.max(GANTT_MIN_H, Math.floor(toNumber(heightProp)));
  const innerW = W - margin.left - margin.right;

  const toDate = (v: string | Date) =>
    v instanceof Date ? v : new Date(`${v}T12:00:00`);
  const starts = tasks
    .map((t) => toDate(t.start).getTime())
    .filter(Number.isFinite);
  const ends = tasks
    .map((t) => toDate(t.end).getTime())
    .filter(Number.isFinite);
  const lo = min(starts) ?? Date.now();
  const hi = Math.max(max(ends) ?? Date.now(), lo + DAY_MS);

  const x = scaleTime()
    .domain([new Date(lo - DAY_MS), new Date(hi + DAY_MS)])
    .range([0, innerW]);
  const fmt =
    formatDate ??
    ((d: Date) =>
      d.toLocaleDateString(locale, { day: "numeric", month: "short" }));
  const ticks = x.ticks(GANTT_TICKS);
  const todayDate = today === undefined ? null : toDate(today);
  const todayX =
    todayDate && Number.isFinite(todayDate.getTime())
      ? margin.left + x(todayDate)
      : null;
  const showToday =
    todayX !== null && todayX >= margin.left && todayX <= margin.left + innerW;

  return (
    <div className={className} style={style}>
      <svg
        viewBox={`0 0 ${W} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <title>{ariaLabel}</title>
        {ticks.map((t) => (
          <g key={t.getTime()}>
            <line
              x1={margin.left + x(t)}
              x2={margin.left + x(t)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={CHART_TOKEN.border}
              strokeWidth={GRID_WIDTH}
            />
            <text
              x={margin.left + x(t)}
              y={height - AXIS_LABEL_BOTTOM_PAD}
              textAnchor="middle"
              fontSize={TICK_FONT_SIZE}
              fill={CHART_TOKEN.muted}
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {showToday && todayDate ? (
          <g>
            <title>{`Hoy: ${fmt(todayDate)}`}</title>
            <line
              x1={todayX ?? margin.left}
              x2={todayX ?? margin.left}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke={CHART_TOKEN.destructive}
              strokeWidth={GRID_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
              data-chart-tip={`Hoy: ${fmt(todayDate)}`}
            />
          </g>
        ) : null}
        {tasks.map((task, i) => {
          const s = toDate(task.start);
          const e = toDate(task.end);
          const bx = margin.left + x(s);
          const bw = Math.max(MIN_BAR_W, x(e) - x(s));
          const by = margin.top + i * effectiveRowH + BAR_Y_OFFSET;
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
          const tip =
            `${task.label}: ${fmt(s)} → ${fmt(e)}` +
            (pct === null ? "" : ` · ${formatDefault(pct)}%`) +
            (days === null ? "" : ` · ${days} d`);
          return (
            <g key={stableKey([task.label], i)}>
              <text
                x={margin.left - TICK_GAP_PX}
                y={by + bh / 2}
                dy={TICK_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                <title>{task.label}</title>
                {truncateLabel(task.label, LABEL_MAX_TASK)}
              </text>
              <g>
                <title>{tip}</title>
                {showProgress ? (
                  <>
                    <rect
                      x={bx}
                      y={by}
                      width={bw}
                      height={bh}
                      rx={bh / 2}
                      fill={CHART_TOKEN.track}
                    />
                    <rect
                      x={bx}
                      y={by}
                      width={Math.max(
                        bh,
                        (bw * (pct ?? PERCENT_FACTOR)) / PERCENT_FACTOR,
                      )}
                      height={bh}
                      rx={bh / 2}
                      fill={color}
                      data-chart-tip={tip}
                    />
                  </>
                ) : (
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={bh}
                    rx={bh / 2}
                    fill={color}
                    data-chart-tip={tip}
                  />
                )}
              </g>
            </g>
          );
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "Programado", color: CHART_TOKEN.track },
            { label: "Avance", color: CHART_TOKEN.chart1 },
          ]}
        />
      ) : null}
      <p className="sr-only">{`Del ${fmt(new Date(lo))} al ${fmt(new Date(hi))}`}</p>
    </div>
  );
}
