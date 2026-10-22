/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

/**
 * Key estable y única aunque haya etiquetas duplicadas.
 * El índice va al final: legible en DOM y sin colisiones.
 */
export function stableKey(
  parts: Array<string | number>,
  index: number,
): string {
  return `${parts.map((p) => String(p)).join("__")}__${index}`;
}

/** Slug corto para ids de defs (clipPath, gradientes). */
export function slugify(text: string): string {
  return (
    text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || "chart"
  );
}
