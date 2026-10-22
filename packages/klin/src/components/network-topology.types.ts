/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import type { CSSProperties } from "react";

export type TopoRole =
  | "internet"
  | "cloud"
  | "firewall"
  | "router"
  | "switch"
  | "server"
  | "host";

export type TopoNode = {
  id: string;
  label: string;
  sub?: string;
  role?: TopoRole;
};

export type TopoEdge = {
  from: string;
  to: string;
  label?: string;
  status?: "up" | "degraded" | "down";
};

/** Props de la topología de red. */
export type NetworkTopologyProps = {
  nodes: TopoNode[];
  edges: TopoEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra la leyenda de estado de enlace. */
  linkLegend?: boolean;
  /** Muestra la leyenda de roles (7 roles con `roleColor`). */
  roleLegend?: boolean;
  /** Tamaño del glifo de rol (base `GLYPH_R`). */
  glyphSize?: number;
  /** Sobrescribe el color por estado de enlace. */
  statusColors?: Partial<Record<NonNullable<TopoEdge["status"]>, string>>;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
