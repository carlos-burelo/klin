/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { truncateLabel } from "../core/text";
import {
  ELLIPSIS,
  TEXT_MONO_RATIO,
  TEXT_SANS_RATIO,
  TICK_FONT_SIZE,
} from "../core/theme";

/**
 * Ancho estimado de un texto SVG (sin medir el DOM): `0.6em` por carácter
 * en monoespaciada, `0.58em` en sans. Suficiente para dimensionar nodos.
 */
export function measureText(
  text: string,
  fontSize = TICK_FONT_SIZE,
  mono = false,
): number {
  return (
    Array.from(text).length *
    fontSize *
    (mono ? TEXT_MONO_RATIO : TEXT_SANS_RATIO)
  );
}

/**
 * Recorta un texto al ancho disponible estimado (etiquetas dentro de formas).
 * Vacío si ni dos caracteres caben: el llamador omite el <text>.
 */
export function fitText(
  text: string,
  availW: number,
  fontSize = TICK_FONT_SIZE,
): string {
  if (availW <= 0) return "";
  const full = measureText(text, fontSize);
  if (full <= availW) return text;
  const n = Math.floor((Array.from(text).length * availW) / full);
  if (n < 2) return "";
  return truncateLabel(text, n);
}

/**
 * Recorta por el medio (`Ingeniería…mas`): conserva inicio y final cuando los
 * textos comparten prefijo. Vacío si ni dos caracteres caben.
 */
export function fitTextMiddle(
  text: string,
  availW: number,
  fontSize = TICK_FONT_SIZE,
): string {
  if (availW <= 0) return "";
  const chars = Array.from(text);
  const full = measureText(text, fontSize);
  if (full <= availW) return text;
  const n = Math.floor((chars.length * availW) / full);
  if (n < 2) return "";
  const head = Math.ceil((n - 1) / 2);
  const tail = Math.floor((n - 1) / 2);
  return `${chars.slice(0, head).join("")}${ELLIPSIS}${chars.slice(chars.length - tail).join("")}`;
}

/**
 * Ancho uniforme de nodo a partir del contenido (etiquetas + sub).
 * Lo calculan flow/state/ER/clase/usecase/architecture antes del layout
 * para que el diagrama se dimensione solo.
 */
export function fitNodeWidth(
  labels: string[],
  opts?: { min?: number; max?: number; size?: number; pad?: number },
): number {
  const size = opts?.size ?? 12;
  const pad = opts?.pad ?? 32;
  const widest = Math.max(0, ...labels.map((l) => measureText(l, size)));
  return Math.min(
    opts?.max ?? 240,
    Math.max(opts?.min ?? 150, Math.ceil(widest + pad)),
  );
}
