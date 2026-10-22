/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";
import type { ChartSeries } from "../core/series";

/** Props del streamgraph. */
export type StreamgraphProps = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartSeries[];
  height?: number;
  ariaLabel: string;
  formatY?: ValueFormatter;
  locale?: string;
  /** monotone (suave), linear (recta) o step (escalón). */
  curve?: "monotone" | "linear" | "step";
  /** Desplazamiento del apilado: wiggle, silhouette o cero. */
  offset?: "wiggle" | "silhouette" | "zero";
  /** Orden del apilado (d3-stackOrder; por defecto `insideOut`). */
  order?: "insideOut" | "none" | "reverse" | "ascending" | "descending";
  /** Muestra puntos sobre el borde superior de cada capa. */
  showPoints?: boolean;
  showLegend?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
