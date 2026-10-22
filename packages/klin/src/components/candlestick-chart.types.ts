/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Orden de las velas por cierre (none conserva el orden de entrada). */
export type CandleSort = "none" | "asc" | "desc";

/** Props de CandlestickChart. */
export type CandlestickChartProps = {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  openKey: string;
  highKey: string;
  lowKey: string;
  closeKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Muestra el valor de cierre sobre cada vela. */
  showValues?: boolean;
  /** Orden de las velas por precio de cierre. */
  sortGroups?: CandleSort;
  /** Radio del cuerpo de la vela (por defecto BAR_RADIUS). */
  barRadius?: number;
  /** Color de vela alcista (por defecto chart1). */
  bullColor?: string;
  /** Color de vela bajista (por defecto destructive). */
  bearColor?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
