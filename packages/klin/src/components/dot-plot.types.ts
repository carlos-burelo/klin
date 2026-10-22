/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Props de DotPlot. */
export type DotPlotProps = {
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  valueKey: string;
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  /**
   * Override de color por punto. Si retorna `undefined` se usa el color base (`color`).
   */
  itemColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
  ) => string | undefined;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  /** Muestra etiquetas de categoría (eje Y). */
  showLabels?: boolean;
  /** Muestra el valor junto a cada punto. */
  showValues?: boolean;
  /** Ticks del grid del eje X. */
  gridTicks?: number;
  /** Orden por valor (`none` respeta el orden de entrada). */
  sortBy?: "none" | "asc" | "desc";
  /** Tope de filas (SSR acotado). */
  maxItems?: number;
  /** Radio de los puntos (por defecto POINT_RADIUS_SCATTER). */
  pointRadius?: number;
  /** Mínimo fijo del dominio X (indefinido = automático con cero). */
  xMin?: number;
  /** Máximo fijo del dominio X (indefinido = automático). */
  xMax?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};
