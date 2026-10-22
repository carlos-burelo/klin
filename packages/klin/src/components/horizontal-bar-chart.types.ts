/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";
import type { ChartSeries } from "../core/series";

/** Props de barras horizontales agrupadas SSR. */
export type HorizontalBarChartProps = {
  data: Array<Record<string, string | number>>;
  yKey: string;
  series: ChartSeries[];
  ariaLabel: string;
  formatX?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). En modo percent las etiquetas muestran %. */
  formatValues?: ValueFormatter;
  locale?: string;
  annotations?: ValueAnnotation[];
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Alto fijo del lienzo (por defecto, automático según filas). */
  height?: number;
  /** Radio de esquina de barra (`0` para estilo denso). */
  barRadius?: number;
  /** Etiqueta de valor al final de cada barra. */
  showValues?: boolean;
  /** Orden de grupos por total (suma de series). */
  sortGroups?: "none" | "asc" | "desc";
  /** Ticks del grid vertical. */
  gridTicks?: number;
  /** Ancho reservado a etiquetas de fila (hoy margen izquierdo fijo). */
  labelWidth?: number;
  /** Límite inferior fijo del dominio X (si se omite, desde los datos). */
  xMin?: number;
  /** Límite superior fijo del dominio X (si se omite, desde los datos). */
  xMax?: number;
  /** Escala del eje X (`log` para magnitudes; ignora no-positivos en geometría). */
  xScale?: "linear" | "log";
  /** Acento (trazo) en el grupo con mayor total. */
  highlightMax?: boolean;
  /**
   * Override de color por barra (p. ej. una serie con un color por categoría).
   * Devuelve un color (token/var) o undefined para usar el de la serie.
   */
  barColor?: (
    datum: Record<string, string | number>,
    datumIndex: number,
    serie: ChartSeries,
    serieIndex: number,
  ) => string | undefined;
  /** Id del contenedor (multi-instancia); por defecto sin atributo. */
  id?: string;
};
