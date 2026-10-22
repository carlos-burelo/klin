/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Etapa del embudo (etiqueta, valor y color opcional). */
export type FunnelStage = {
  label: string;
  value: number;
  color?: string;
};

/** Props del embudo SSR (conversión por etapas). */
export type FunnelChartProps = {
  stages: FunnelStage[];
  ariaLabel: string;
  height?: number;
  /** Incluye la pérdida `% previo` en el tooltip de cada etapa. */
  showDropOff?: boolean;
  /** Base del % de la etiqueta (`first` del inicio, `previous` de la etapa previa). */
  baseline?: "first" | "previous";
  format?: ValueFormatter;
  locale?: string;
  /**
   * Color por etapa. Si retorna `undefined` se usa el color de serie.
   * Se respeta `stage.color` primero.
   */
  itemColor?: (stage: FunnelStage, index: number) => string | undefined;
  /**
   * Muestra la leyenda bajo el gráfico (etapa→color).
   * @default false
   */
  showLegend?: boolean;
  /**
   * Separación vertical entre etapas en px.
   * @default GAP
   */
  gap?: number;
  /**
   * Ancho mínimo visible del trapecio en px.
   * @default FUNNEL_MIN_W
   */
  minWidth?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
