/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Serie del horizonte (etiqueta, muestra alineada y color opcional). */
export type HorizonSeries = {
  label: string;
  values: number[];
  color?: string;
};

/** Modo de plegado: espejo (absoluto) o con signo (desplazado). */
export type HorizonMode = "mirror" | "offset";

/** Props de HorizonChart. */
export type HorizonChartProps = {
  series: HorizonSeries[];
  /** Etiquetas del eje X (por defecto el índice 1-based). */
  labels?: string[];
  ariaLabel: string;
  height?: number;
  /** Bandas de plegado por carril (mínimo 1). */
  bands?: number;
  /** `mirror` pliega |v| hacia arriba; `offset` respeta el signo. */
  mode?: HorizonMode;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
