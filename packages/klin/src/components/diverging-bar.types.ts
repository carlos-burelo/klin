/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Props de barras divergentes SSR (encuesta izquierda/derecha). */
export type DivergingBarProps = {
  data: Array<Record<string, string | number>>;
  yKey: string;
  left: { key: string; label: string; color?: string };
  right: { key: string; label: string; color?: string };
  ariaLabel: string;
  formatX?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). */
  formatValues?: ValueFormatter;
  locale?: string;
  annotations?: ValueAnnotation[];
  /**
   * Color por grupo (aplica a ambos lados de la fila).
   * Si retorna `undefined` se usan los colores de cada lado.
   */
  itemColor?: (
    datum: Record<string, string | number>,
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
  /** Posición de la etiqueta de grupo: sobre la fila o al centro. */
  midLabels?: "outside" | "center";
  /** Etiqueta con el % de la fila en cada lado (el tooltip ya lo trae). */
  showShare?: boolean;
  /**
   * Muestra el valor absoluto dentro de cada barra.
   * @default false
   */
  showValues?: boolean;
  /** Orden de filas: por total o por diferencia entre lados. */
  sortBy?: "total" | "diff" | "none";
};
