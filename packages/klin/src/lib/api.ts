/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";

/** Passthrough visual para la raíz de todo chart/diagrama (aditivo). */
export type RootStyleProps = {
  className?: string;
  style?: CSSProperties;
};

/** Ayuda contextual para lectores de pantalla (se refleja en aria-describedby). */
export type DescribedProps = {
  ariaDescribedBy?: string;
};

/** Línea de referencia sobre el eje de valor (SSR pura, sin JS). */
export type ValueAnnotation = {
  /** Posición sobre el eje de valor (dominio del chart). */
  value: number;
  /** Etiqueta corta junto a la línea. */
  label?: string;
  /** Color (token/var). Por defecto acento tenue. */
  color?: string;
};
