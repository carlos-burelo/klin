/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type OrgNode = {
  name: string;
  role?: string;
  color?: string;
  children?: OrgNode[];
};

/** Props del organigrama. */
export type OrgChartProps = {
  root: OrgNode;
  ariaLabel: string;
  /** Muestra el cargo bajo el nombre. */
  showRole?: boolean;
  /** Muestra un avatar con las iniciales del nombre. */
  showAvatar?: boolean;
  /** Profundidad máxima visible (los niveles más profundos se podan). */
  collapseDepth?: number;
  /** Orden de hijos (`label` alfabético, `order` entrada). */
  sortBy?: "label" | "order";
  /** Ancho de cada caja de nodo (por defecto `BOX_W`). */
  nodeWidth?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
