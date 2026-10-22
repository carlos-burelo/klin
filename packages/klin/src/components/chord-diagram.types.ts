/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Props de ChordDiagram. */
export type ChordDiagramProps = {
  labels: string[];
  matrix: number[][];
  ariaLabel: string;
  height?: number;
  format?: ValueFormatter;
  locale?: string;
  /** Separación entre grupos vecinos en radianes (por defecto `CHORD_PAD_ANGLE`). */
  padAngle?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  /** Muestra las etiquetas de cada grupo del anillo. */
  showLabels?: boolean;
  /** Ordena grupos por flujo total descendente (reordena la matriz). */
  sortGroups?: boolean;
  /** Tope de grupos (1–MAX_CHORD). */
  maxItems?: number;
  emptyTitle?: string;
  emptyDescription?: string;
};

/** Opciones puras del layout chord (paridad S del componente). */
export type ChordLayoutOptions = {
  /** Ordena grupos por flujo total descendente (reordena la matriz). */
  sortGroups?: boolean;
  /** Tope de grupos (1–MAX_CHORD). */
  maxItems?: number;
  /** Separación entre grupos vecinos en radianes (por defecto `CHORD_PAD_ANGLE`). */
  padAngle?: number;
};
