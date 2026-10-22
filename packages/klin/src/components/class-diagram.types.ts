/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import type { CSSProperties } from "react";

export type ClassNode = {
  id: string;
  name: string;
  attributes?: string[];
  methods?: string[];
};

export type ClassEdge = {
  from: string;
  to: string;
  kind?: "inheritance" | "association" | "composition" | "dependency";
  label?: string;
};

/** Vista filtrada de los miembros de una clase (atributos + métodos). */
export type ClassMemberView = {
  attributes: string[];
  methods: string[];
  /** Miembros ocultos por el límite (0 = sin colapso). */
  hidden: number;
};

/** Opciones de filtrado de miembros (las mismas props del componente). */
export type ClassMemberOptions = {
  showMethods: boolean;
  showAttributes: boolean;
  visibility: "all" | "public";
  memberLimit: number;
};

/** Props del diagrama de clases UML. */
export type ClassDiagramProps = {
  nodes: ClassNode[];
  edges: ClassEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra la sección de métodos de cada clase. */
  showMethods?: boolean;
  /** Muestra la sección de atributos de cada clase. */
  showAttributes?: boolean;
  /** Filtra miembros por visibilidad (`public` conserva `+` y sin prefijo). */
  visibility?: "all" | "public";
  /** Máximo de miembros visibles por clase; el resto se colapsa en `+N más`. */
  memberLimit?: number;
  /** Muestra la leyenda de kinds de relación. */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
