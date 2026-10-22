/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type TreeItem = {
  label: string;
  detail?: string;
  badge?: string | number;
  children?: TreeItem[];
};

/** Props del árbol. */
export type TreeViewProps = {
  items: TreeItem[];
  ariaLabel: string;
  /** Abre el primer nivel al cargar. */
  defaultOpen?: boolean;
  /** Profundidad máxima visible (por defecto `MAX_TREE_DEPTH`). */
  depth?: number;
  /** Tope de nodos (por defecto `MAX_TREE_NODES`). */
  maxItems?: number;
  /** Muestra el detalle de cada fila. */
  showDetail?: boolean;
  /** Muestra la insignia de cada fila. */
  showBadge?: boolean;
  /** Orden de filas (`label` alfabético, entrada por defecto). */
  sortBy?: "label" | "order";
  /** Densidad de filas. */
  density?: "comfortable" | "compact";
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
