/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Props de pirámide poblacional SSR (dos series espejadas). */
export type PyramidChartProps = {
  groups: string[];
  left: { label: string; values: number[]; color?: string };
  right: { label: string; values: number[]; color?: string };
  ariaLabel: string;
  formatX?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). */
  formatValues?: ValueFormatter;
  /** Etiquetas de grupo a la izquierda (clásica) o en la banda central. */
  labels?: "left" | "center";
  locale?: string;
  /**
   * Color por grupo y lado. Si retorna `undefined` se usan los colores
   * de cada lado (`left.color` / `right.color` primero).
   */
  itemColor?: (
    group: string,
    side: "left" | "right",
    index: number,
  ) => string | undefined;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Alto fijo del lienzo (por defecto, automático según filas). */
  height?: number;
  /** Etiqueta con el % de cada lado (el tooltip ya lo trae). */
  showShare?: boolean;
  /** Ancho de la banda central (por defecto, según `labels`). */
  centerGap?: number;
  /** Orden de grupos por total (suma de ambos lados). */
  sortGroups?: "none" | "asc" | "desc";
  /**
   * Radio de esquina de las barras (por defecto BAR_RADIUS).
   * @default BAR_RADIUS
   */
  barRadius?: number;
  /**
   * Muestra el valor dentro de cada barra (como bar-chart).
   * @default false
   */
  showValues?: boolean;
};
