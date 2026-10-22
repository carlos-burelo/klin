/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { CHART_TOKEN, EDGE_WIDTH } from "../core/theme";

/** Geometría del marcador estándar (flecha rellena, chevron abierto). */
export const MARKER = {
  SIZE: 10,
  REF_X: 8,
  REF_Y: 5,
  WIDTH: 7,
  HEIGHT: 7,
} as const;

/** Geometría grande (triángulo de herencia, rombo de composición). */
export const MARKER_LARGE = {
  SIZE: 12,
  REF_X: 10,
  REF_Y: 6,
  WIDTH: 9,
  HEIGHT: 9,
} as const;

/** Formas de punta de flecha (una sola fuente para todos los diagramas). */
export type MarkerKind = "arrow" | "chevron" | "inherit" | "composite";

/** Sufijo de id por forma (`chevron` reutiliza `arrow`: mismo slot, otra forma). */
const MARKER_SUFFIX: Record<MarkerKind, string> = {
  arrow: "arrow",
  chevron: "arrow",
  inherit: "inherit",
  composite: "composite",
};

/** Id del marcador (`prefix` = namespace del diagrama, p. ej. `charts-flow`). */
export function markerId(prefix: string, kind: MarkerKind): string {
  return `${prefix}-${MARKER_SUFFIX[kind]}`;
}

/** Referencia `url(#…)` lista para `markerEnd`. */
export function markerUrl(prefix: string, kind: MarkerKind): string {
  return `url(#${markerId(prefix, kind)})`;
}

function MarkerShape({ kind }: { kind: MarkerKind }) {
  switch (kind) {
    case "arrow":
      return <path d="M 0 1 L 9 5 L 0 9 z" fill={CHART_TOKEN.muted} />;
    case "chevron":
      return (
        <path
          d="M 0 1 L 9 5 L 0 9"
          fill="none"
          stroke={CHART_TOKEN.muted}
          strokeWidth={EDGE_WIDTH}
        />
      );
    case "inherit":
      return (
        <path
          d="M 1 1 L 11 6 L 1 11 z"
          fill={CHART_TOKEN.background}
          stroke={CHART_TOKEN.muted}
          strokeWidth={EDGE_WIDTH}
        />
      );
    case "composite":
      return <path d="M 1 6 L 6 1 L 11 6 L 6 11 z" fill={CHART_TOKEN.muted} />;
  }
}

export type SvgMarkersProps = {
  /** Namespace de ids (único por diagrama). */
  prefix: string;
  /** Formas a emitir. */
  kinds: readonly MarkerKind[];
};

/** `<defs>` canónico con puntas de flecha (una sola fuente, ids estables). */
export function SvgMarkers({ prefix, kinds }: SvgMarkersProps) {
  return (
    <defs>
      {kinds.map((kind) => {
        const large = kind === "inherit" || kind === "composite";
        const g = large ? MARKER_LARGE : MARKER;
        return (
          <marker
            key={kind}
            id={markerId(prefix, kind)}
            viewBox={`0 0 ${g.SIZE} ${g.SIZE}`}
            refX={g.REF_X}
            refY={g.REF_Y}
            markerWidth={g.WIDTH}
            markerHeight={g.HEIGHT}
            orient="auto-start-reverse"
          >
            <MarkerShape kind={kind} />
          </marker>
        );
      })}
    </defs>
  );
}
