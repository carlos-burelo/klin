/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

export type SlopeDatum = {
  label: string;
  from: number;
  to: number;
  color?: string;
};

/** Props de SlopeChart. */
export type SlopeChartProps = {
  data: SlopeDatum[];
  fromLabel: string;
  toLabel: string;
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas de fila a la izquierda. */
  showLabels?: boolean;
  /** Muestra los valores de destino a la derecha. */
  showValues?: boolean;
  /** Muestra el delta en el tip (por defecto `true`). */
  showDelta?: boolean;
  /** Color de subidas (override; por defecto token chart1). */
  colorUp?: string;
  /** Color de bajadas (override; por defecto token destructive). */
  colorDown?: string;
  /** Ordena las filas por delta descendente (por defecto respeta la entrada). */
  sortGroups?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
