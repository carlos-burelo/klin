/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";

export type ErAttribute = {
  name: string;
  key?: "PK" | "FK";
};

export type ErEntity = {
  id: string;
  name: string;
  attributes: ErAttribute[];
  /** Entidad débil (doble borde cuando `showWeak` está activo). */
  weak?: boolean;
};

export type ErRelation = {
  from: string;
  to: string;
  /** Cardinalidad (`1:N`, `N:M`, `1:1`). */
  label?: string;
};

/** Props del diagrama entidad-relación. */
export type ErDiagramProps = {
  entities: ErEntity[];
  relations: ErRelation[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra las insignias de clave (`PK`/`FK`) en los atributos. */
  showKeys?: boolean;
  /** Dibuja pata de gallo en el extremo múltiple (`N`/`M`) de cada relación. */
  crowFoot?: boolean;
  /** Resalta con doble borde las entidades débiles (`weak`). */
  showWeak?: boolean;
  /** Máximo de atributos visibles por entidad; el resto se colapsa en `+N`. */
  attributeLimit?: number;
  /** Muestra la leyenda (PK/FK/débil). */
  showLegend?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};
