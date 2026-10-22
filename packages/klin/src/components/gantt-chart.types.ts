/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

/** Tarea del Gantt (etiqueta, rango temporal y avance opcional). */
export type GanttTask = {
  label: string;
  start: string | Date;
  end: string | Date;
  /** 0–100. */
  progress?: number;
  color?: string;
  /** Etiquetas de tareas predecesoras (flechas de dependencia). */
  dependsOn?: string[];
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
  /** Muestra flechas de dependencia (`dependsOn`); por defecto true si hay. */
  showDependencies?: boolean;
  /** Orden de filas (`start` cronológico, `label` alfabético, entrada). */
  sortBy?: "start" | "label";
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
