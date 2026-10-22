/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueAnnotation } from "../core/api";
import type { ValueFormatter } from "../core/format";

/** Grupo del strip (etiqueta, muestra y color opcional). */
export type StripGroup = {
  label: string;
  values: number[];
  color?: string;
};

/** Props de StripPlot. */
export type StripPlotProps = {
  groups: StripGroup[];
  ariaLabel: string;
  height?: number;
  formatY?: ValueFormatter;
  locale?: string;
  /** Dispersión horizontal 0–1 (0 = columna recta). */
  jitter?: number;
  /** Semilla del jitter (mismo seed, mismo dibujo). */
  seed?: number;
  /** Ticks del grid Y (por defecto GRID_TICKS). */
  gridTicks?: number;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  showLegend?: boolean;
  annotations?: ValueAnnotation[];
  emptyTitle?: string;
  emptyDescription?: string;
};
