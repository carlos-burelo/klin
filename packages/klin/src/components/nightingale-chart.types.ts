/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Dato del coxcomb (etiqueta, valor y color opcional). */
export type NightingaleDatum = {
  label: string;
  value: number;
  color?: string;
};

/** Props del coxcomb SSR (ángulos iguales, radio ∝ sqrt del valor). */
export type NightingaleChartProps = {
  data: NightingaleDatum[];
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /** Muestra las etiquetas externas de cada pétalo. */
  showLabels?: boolean;
  /** Agrega el valor a la etiqueta externa (por defecto solo etiqueta). */
  showValues?: boolean;
  /** Ordena los pétalos por valor descendente (por defecto respeta la entrada). */
  sortSlices?: boolean;
  /** Separación angular entre pétalos. */
  padAngle?: number;
  /** Radio de esquina de cada pétalo. */
  cornerRadius?: number;
  /** Ángulo inicial del coxcomb (radianes). */
  startAngle?: number;
  /** Muestra el total al centro del coxcomb. */
  showTotal?: boolean;
  /** Etiqueta bajo el total central. */
  totalLabel?: string;
  /**
   * Color por pétalo. Si retorna `undefined` se usa el color de serie.
   * Se respeta `datum.color` primero.
   */
  itemColor?: (datum: NightingaleDatum, index: number) => string | undefined;
  /**
   * Radio interior del coxcomb (0 = pétalos actuales hasta el centro).
   * @default 0
   */
  innerRadius?: number;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
