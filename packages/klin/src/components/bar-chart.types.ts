/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";
import type { ValueScaleKind } from "../core/scale";
import type { ChartSeries } from "../core/series";

/** Props de BarChart. */
export type BarChartProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  /** Formato de las etiquetas de valor (por defecto el del eje). En modo percent las etiquetas muestran %. */
  formatValues?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
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
  /**
   * Modo de barras: agrupadas, apiladas o apiladas al 100 %.
   * `stacked`/`percent` reutilizan la lógica de apilado de VerticalStackedBar
   * (doble base para negativos; en `percent` los negativos se fijan a 0).
   */
  layout?: "grouped" | "stacked" | "percent";
  /** Radio de esquina de barra (`0` para estilo denso). */
  barRadius?: number;
  /** Etiqueta de valor sobre cada barra (o dentro de cada segmento apilado). */
  showValues?: boolean;
  /** Límite inferior fijo del dominio Y (si se omite, domainWithZero). */
  yMin?: number;
  /** Límite superior fijo del dominio Y (si se omite, domainWithZero). */
  yMax?: number;
  /** Ticks del grid horizontal. */
  gridTicks?: number;
  /**
   * Escala del eje Y (`log` para magnitudes; ignora no-positivos en
   * geometría, el tip conserva el valor crudo). Se ignora con `percent`
   * y con `yMin`/`yMax` (dominio log desde los datos).
   */
  yScale?: ValueScaleKind;
  /** Orden de grupos por total (suma de series). */
  sortGroups?: "none" | "asc" | "desc";
  /** Acento (trazo) en el grupo con mayor total. */
  highlightMax?: boolean;
  /** Prefijo de `defs`/`clipPath` en apilado (multi-instancia); por defecto useId. */
  id?: string;
};
