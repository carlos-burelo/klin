/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type TimelineEvent = {
  date: string;
  label: string;
  detail?: string;
  done?: boolean;
};

/** Props de la línea de tiempo. */
export type TimelineChartProps = {
  events: TimelineEvent[];
  ariaLabel: string;
  /** Lado de las tarjetas (`left` todas arriba, `right` todas abajo). */
  side?: "alternate" | "left" | "right";
  /** Muestra la fecha sobre cada hito. */
  showDates?: boolean;
  /** Densidad vertical de carriles. */
  density?: "comfortable" | "compact";
  /** Locale para formatear fechas (con `formatDate` o locale no defecto). */
  locale?: string;
  /** Formatea la fecha del evento (por defecto cruda para preservar). */
  formatDate?: (d: Date) => string;
  /** Orden de eventos (`date` cronológico, `order` entrada). */
  sortBy?: "date" | "order";
  /** Muestra la leyenda (completado/pendiente). */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
