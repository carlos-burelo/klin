/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { scaleLinear, scaleLog } from "d3-scale";

/** Escala del eje de valor (lineal o logarítmica). */
export type ValueScaleKind = "linear" | "log";

/**
 * Escala de valor continua. En `log` el dominio debe ser positivo
 * (ver `logDomain`); los ticks salen de la propia escala.
 */
export function valueScale(
  kind: ValueScaleKind,
  domain: [number, number],
  range: [number, number],
) {
  return kind === "log"
    ? scaleLog().domain(domain).range(range)
    : scaleLinear().domain(domain).range(range);
}
