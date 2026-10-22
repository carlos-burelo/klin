/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type {
  DescribedProps,
  RootStyleProps,
  ValueAnnotation,
} from "../core/api";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  AREA_FILL_OPACITY,
  CHART_TOKEN,
  TICK_FONT_SIZE,
} from "../core/theme";
import { CHART_MARGIN, CHART_W, type ChartMargin } from "./chart-svg";

/** Desplazamiento de la etiqueta de anotación. */
const ANNOTATION_LABEL_DX = 4;
const ANNOTATION_LABEL_DY = -4;

export type AnnotationLayerProps = {
  annotations?: ValueAnnotation[];
  lo: number;
  hi: number;
  y: (value: number) => number;
  width?: number;
  margin?: ChartMargin;
};

/** Líneas y bandas de referencia sobre el eje de valor (fuera de rango se omiten). */
export function AnnotationLayer({
  annotations,
  lo,
  hi,
  y,
  width = CHART_W,
  margin = CHART_MARGIN,
}: AnnotationLayerProps) {
  return (
    <>
      {(annotations ?? []).map((a, ai) => {
        const end = a.to === undefined ? a.value : a.to;
        const bLo = Math.min(a.value, end);
        const bHi = Math.max(a.value, end);
        const cLo = Math.max(bLo, lo);
        const cHi = Math.min(bHi, hi);
        // Banda sombreada cuando el intervalo recorta algo visible.
        if (end !== a.value && cHi > cLo) {
          const yTop = margin.top + y(cHi);
          const yBottom = margin.top + y(cLo);
          if (!Number.isFinite(yTop) || !Number.isFinite(yBottom)) return null;
          return (
            <g
              key={`ann-${a.value}-${end}-${ai}`}
              data-chart-tip={a.label ?? `${a.value} – ${end}`}
            >
              <rect
                x={margin.left}
                y={yTop}
                width={width - margin.left - margin.right}
                height={Math.max(0, yBottom - yTop)}
                fill={a.color ?? CHART_TOKEN.accent}
                opacity={AREA_FILL_OPACITY}
              />
              <text
                x={width - margin.right - ANNOTATION_LABEL_DX}
                y={yTop}
                dy={ANNOTATION_LABEL_DY}
                textAnchor="end"
                fontSize={TICK_FONT_SIZE}
                fill={a.color ?? CHART_TOKEN.muted}
              >
                {a.label ?? `${a.value} – ${end}`}
              </text>
            </g>
          );
        }
        if (a.value < lo || a.value > hi) return null;
        const ay = margin.top + y(a.value);
        if (!Number.isFinite(ay)) return null;
        return (
          <g
            key={`ann-${a.value}-${ai}`}
            data-chart-tip={a.label ?? String(a.value)}
          >
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={ay}
              y2={ay}
              stroke={a.color ?? CHART_TOKEN.accent}
              strokeWidth={ANNOTATION_WIDTH}
              strokeDasharray={ANNOTATION_DASH}
            />
            <text
              x={width - margin.right - ANNOTATION_LABEL_DX}
              y={ay}
              dy={ANNOTATION_LABEL_DY}
              textAnchor="end"
              fontSize={TICK_FONT_SIZE}
              fill={a.color ?? CHART_TOKEN.muted}
            >
              {a.label ?? String(a.value)}
            </text>
          </g>
        );
      })}
    </>
  );
}

export type { DescribedProps, RootStyleProps, ValueAnnotation };
