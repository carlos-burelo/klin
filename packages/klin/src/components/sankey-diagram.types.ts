/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

export type SankeyNode = {
  id: string;
  label: string;
  color?: string;
};

export type SankeyFlow = {
  from: string;
  to: string;
  value: number;
};

/** Alineación de nodos sankey (d3-sankey). */
export type SankeyNodeAlign = "justify" | "left" | "right" | "center";

/** Opciones puras del layout sankey (paridad S del componente). */
export type SankeyLayoutOptions = {
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  nodeAlign?: SankeyNodeAlign;
  maxItems?: number;
};

/** Props del diagrama sankey. */
export type SankeyDiagramProps = {
  nodes: SankeyNode[];
  flows: SankeyFlow[];
  ariaLabel: string;
  format?: ValueFormatter;
  locale?: string;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  nodeAlign?: SankeyNodeAlign;
  showLabels?: boolean;
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
};
