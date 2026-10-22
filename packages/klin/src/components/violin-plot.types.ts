/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Puntos de la rejilla KDE (valor → densidad). */
export type { KdePoint } from "../core/kde";

/** Grupo del violín (etiqueta, muestra y color opcional). */
export type ViolinGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Orden de los grupos por mediana (none conserva el orden de entrada). */
export type ViolinSort = "none" | "asc" | "desc";

/** Props de ViolinPlot. */
export type ViolinPlotProps = {
  groups: ViolinGroup[];
  ariaLabel: string;
  height?: number;
  bandwidth?: "auto" | number;
  formatY?: ValueFormatter;
  locale?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  /** Mínimo fijo del dominio Y (indefinido = automático con cero). */
  yMin?: number;
  /** Máximo fijo del dominio Y (indefinido = automático). */
  yMax?: number;
  /** Ticks del grid horizontal (por defecto GRID_TICKS). */
  gridTicks?: number;
  /** Orden de los grupos por su mediana. */
  sortGroups?: ViolinSort;
  /** Muestra el tamaño de muestra (n) junto a cada etiqueta. */
  showSampleSize?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};
