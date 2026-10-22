/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Props de LollipopChart. */
export type LollipopChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  color?: string;
  /**
   * Override de color por punto (p. ej. un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  itemColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
  ) => string | undefined;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
  /** Estilo del tallo: continuo o punteado. */
  stemStyle?: "solid" | "dashed";
  /** Orden de grupos por valor. */
  sortGroups?: "none" | "asc" | "desc";
  /** Etiqueta de valor sobre cada punto (hoy siempre visible). */
  showValues?: boolean;
  /** Radio de los puntos (por defecto LOLLIPOP_RADIUS). */
  pointRadius?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
};
