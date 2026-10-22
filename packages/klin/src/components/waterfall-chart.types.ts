/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

export type WaterfallStep = {
  label: string;
  /** Delta (positivo suma, negativo resta). */
  value: number;
};

/** Props de WaterfallChart. */
export type WaterfallChartProps = {
  steps: WaterfallStep[];
  ariaLabel: string;
  height?: number;
  totalLabel?: string;
  formatY?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). */
  formatValues?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  annotations?: ValueAnnotation[];
  /** Muestra los conectores punteados entre barras. */
  showConnectors?: boolean;
  /** Etiqueta de valor sobre cada barra. */
  showValues?: boolean;
  /** Ticks del grid Y. */
  gridTicks?: number;
  /** Mínimo fijo del eje Y (si se omite, desde los datos). */
  yMin?: number;
  /** Máximo fijo del eje Y (si se omite, desde los datos). */
  yMax?: number;
  /** Índices de step tras los que se pinta barra de subtotal acumulado. */
  subtotalAt?: number[];
  /** Color de deltas positivos (token). */
  positiveColor?: string;
  /** Color de deltas negativos (token). */
  negativeColor?: string;
  /** Color de la barra total (token). */
  totalColor?: string;
  /** Etiqueta acumulada sobre cada barra (si no, el delta). */
  runningTotal?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
