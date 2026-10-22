/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type NetworkNode = {
  id: string;
  label?: string;
  color?: string;
};

export type NetworkEdge = {
  from: string;
  to: string;
};

/** Props del grafo de red. */
export type NetworkGraphProps = {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  ariaLabel: string;
  seed?: number;
  /** Ajustes de la simulación de fuerzas (por defecto, constantes `NETWORK_*`). */
  forces?: {
    distance?: number;
    charge?: number;
    collide?: number;
  };
  /** Tamaño del nodo: por grado de conexión (`degree`) o fijo (`fixed`). */
  nodeSize?: "degree" | "fixed";
  /** Muestra atenuados los nodos sin conexiones. */
  showIsolated?: boolean;
  /** Muestra las etiquetas de nodo. */
  showLabels?: boolean;
  /** Tope de nodos/enlaces (por defecto `MAX_NETWORK_NODES/LINKS`). */
  maxItems?: number;
  /** Iteraciones de la simulación (calidad frente a costo SSR). */
  ticks?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

export type PositionedNetworkNode = NetworkNode & { x?: number; y?: number };
