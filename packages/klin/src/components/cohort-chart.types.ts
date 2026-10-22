/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Cohorte con retención por periodo (fracciones 0–1, `values[0]` = 100 %). */
export type Cohort = {
  label: string;
  values: number[];
};

/** Props de CohortChart. */
export type CohortChartProps = {
  cohorts: Cohort[];
  /** Etiquetas de periodo (`P1`, `P2`… por defecto). */
  periodLabels?: string[];
  ariaLabel: string;
  /** Recibe la retención 0–1 (por defecto % entero con locale). */
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  /** Etiqueta de celdas sin dato (por defecto `MISSING_VALUE`). */
  missingLabel?: string;
  /** Control del texto de valor en celda (`auto` según tamaño). */
  showValues?: "auto" | "always" | "never";
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};
