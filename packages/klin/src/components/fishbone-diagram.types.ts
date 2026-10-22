/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import type { CSSProperties } from "react";
import type { ValueFormatter } from "../core/format";

/** Causa del diagrama Ishikawa (etiqueta + subcausas). */
export type FishboneCause = {
  label: string;
  subcauses: string[];
};

/** Props del diagrama de espina de pescado. */
export type FishboneDiagramProps = {
  effect: string;
  causes: FishboneCause[];
  ariaLabel: string;
  height?: number;
  locale?: string;
  /** Formatea el conteo de subcausas del tip (por defecto entero con locale). */
  format?: ValueFormatter;
  /** Dirección de la espina (`LR` actual, `RL` espejo). */
  direction?: "LR" | "RL";
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  /** Muestra etiquetas de causas y subcausas. */
  showLabels?: boolean;
  /** Muestra el texto de subcausas ocultas (`+N más`). */
  showCounts?: boolean;
  /** Ordena causas alfabéticamente (estable, con locale). */
  sortGroups?: boolean;
  /** Tope de causas (SSR acotado). */
  maxItems?: number;
  /** Prefijo de ids internos del marcador (por defecto único vía useId). */
  id?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export type FishboneSide = "top" | "bottom";

export type FishboneSubLayout = {
  label: string;
  x: number;
  y: number;
};

export type FishboneCauseLayout = {
  label: string;
  side: FishboneSide;
  subcauses: string[];
  shown: string[];
  hidden: number;
  tip: string;
  attachX: number;
  outerX: number;
  outerY: number;
  subs: FishboneSubLayout[];
};

export type FishboneLayout = {
  effect: string;
  causes: FishboneCauseLayout[];
  width: number;
  height: number;
  spineY: number;
  spineX1: number;
  spineX2: number;
  head: { x: number; y: number; w: number; h: number };
};

/** Opciones puras del layout Ishikawa (paridad S del componente). */
export type FishboneLayoutOptions = {
  /** Ordena causas alfabéticamente (estable, con locale). */
  sortGroups?: boolean;
  /** Tope de causas (SSR acotado). */
  maxItems?: number;
  /** Formatea el conteo de subcausas del tip. */
  format?: ValueFormatter;
  /** Dirección de la espina (`LR` actual, `RL` espejo). */
  direction?: "LR" | "RL";
};
