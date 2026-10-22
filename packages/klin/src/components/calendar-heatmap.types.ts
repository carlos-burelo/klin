/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Props del calor de calendario SSR estilo contribuciones. */
export type CalendarHeatmapProps = {
  values: Record<string, number>;
  ariaLabel: string;
  /** Fecha de fin `YYYY-MM-DD` (por defecto hoy; pasar fija para determinismo). */
  end?: string;
  /** Fecha de inicio `YYYY-MM-DD` para ventana explícita (si es válida ignora `weeks`). */
  start?: string;
  weeks?: number;
  /** Día que abre la semana: 1 = lunes (actual), 0 = domingo. */
  weekStart?: 0 | 1;
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
