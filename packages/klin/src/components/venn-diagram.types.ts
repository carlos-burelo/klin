/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type VennSet = {
  label: string;
  value: number;
  color?: string;
};

export type VennDiagramProps = {
  sets: [VennSet, VennSet] | [VennSet, VennSet, VennSet];
  /** Valores de intersecciones por índices (`[0,1]`, `[0,1,2]`…). */
  intersections?: { sets: number[]; value: number }[];
  ariaLabel: string;
  size?: number;
  format?: (value: number) => string;
  locale?: string;
  /** Añade el % del universo junto a cada valor. */
  showPercent?: boolean;
  /** Total de referencia para `showPercent` (obligatorio si se activa). */
  universe?: number;
  /** Muestra la leyenda bajo el gráfico. */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
