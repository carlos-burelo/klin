export { cn } from "cn";

/** Normaliza para búsquedas (minúsculas, sin diacríticos). Única fuente. */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
