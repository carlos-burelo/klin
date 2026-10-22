/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Nodo de Wardley (posición x/y normalizada 0–1). */
export type WardleyNode = {
  id: string;
  label: string;
  /** 0 (génesis) – 1 (commodity). */
  x: number;
  /** 0 (base) – 1 (visible/usuario). */
  y: number;
  color?: string;
};

/** Enlace de Wardley (ids de origen y destino). */
export type WardleyEdge = {
  from: string;
  to: string;
};

/** Props del mapa de Wardley SSR (cadena de valor vs. evolución). */
export type WardleyMapProps = {
  nodes: WardleyNode[];
  edges: WardleyEdge[];
  ariaLabel: string;
  /** Muestra etiquetas de etapas y ejes. */
  showGridLabels?: boolean;
  /** Nombres de las 4 etapas de evolución. */
  stages?: [string, string, string, string];
  /** Radio fijo o proporcional al grado (nº de enlaces). */
  nodeSize?: "fixed" | "edges";
  /** Locale del porcentaje de evolución. */
  locale?: string;
  /** Etiqueta del eje X (por defecto `Evolución →`). */
  xAxisLabel?: string;
  /** Etiqueta del eje Y (por defecto `Cadena de valor →`). */
  yAxisLabel?: string;
  /** Formatea el porcentaje de evolución (por defecto `formatDefault`). */
  format?: ValueFormatter;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
