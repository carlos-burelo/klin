/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { ReactNode } from "react";
import { ChartLegend } from "../components/legend";
import type { DescribedProps, RootStyleProps, ValueAnnotation } from "./api";
import {
  CHART_MARGIN,
  CHART_W,
  type ChartMargin,
  ChartSvg,
  YGrid,
} from "./frame";
import { stableKey } from "./keys";
import {
  ANNOTATION_DASH,
  ANNOTATION_WIDTH,
  CHART_TOKEN,
  TICK_FONT_SIZE,
} from "./theme";

/** Desplazamiento vertical de etiquetas del eje X. */
export const CARTESIAN_AXIS_OFFSET = 10;

export type CartesianXLabel = {
  /** Coordenada interna (sin margen izquierdo). */
  x: number;
  /** Texto visible (ya truncado por el componente si aplica). */
  label: string;
  /** Tooltip nativo (por defecto sin <title>). */
  title?: string;
};

export type CartesianLegendItem = { label: string; color: string };

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

/** Líneas de referencia sobre el eje de valor (fuera de rango se omiten). */
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
        if (a.value < lo || a.value > hi) return null;
        const ay = margin.top + y(a.value);
        return (
          <g key={`ann-${a.value}-${ai}`}>
            <title>{a.label ?? String(a.value)}</title>
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

export type CartesianFrameProps = DescribedProps &
  RootStyleProps & {
    height: number;
    ariaLabel: string;
    width?: number;
    margin?: ChartMargin;
    ticks: number[];
    y: (value: number) => number;
    formatY: (value: number) => string;
    annotations?: ValueAnnotation[];
    /** Dominio visible para recortar anotaciones. */
    annLo: number;
    annHi: number;
    xLabels: CartesianXLabel[];
    axisOffset?: number;
    /** Leyenda al pie (se omite si es undefined). */
    legendItems?: CartesianLegendItem[];
    children: ReactNode;
  };

/** Chrome cartesiana homogénea: grid + anotaciones + etiquetas X + leyenda. */
export function CartesianFrame({
  height,
  ariaLabel,
  ariaDescribedBy,
  className,
  style,
  width = CHART_W,
  margin = CHART_MARGIN,
  ticks,
  y,
  formatY,
  annotations,
  annLo,
  annHi,
  xLabels,
  axisOffset = CARTESIAN_AXIS_OFFSET,
  legendItems,
  children,
}: CartesianFrameProps) {
  return (
    <div className={className} style={style}>
      <ChartSvg
        width={width}
        height={height}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
      >
        <YGrid
          ticks={ticks}
          y={y}
          margin={margin}
          width={width}
          format={formatY}
        />
        <AnnotationLayer
          annotations={annotations}
          lo={annLo}
          hi={annHi}
          y={y}
          width={width}
          margin={margin}
        />
        {xLabels.map((l, i) => (
          <text
            key={stableKey([l.label], i)}
            x={margin.left + l.x}
            y={height - axisOffset}
            textAnchor="middle"
            fontSize={TICK_FONT_SIZE}
            fill={CHART_TOKEN.muted}
          >
            {l.title ? <title>{l.title}</title> : null}
            {l.label}
          </text>
        ))}
        {children}
      </ChartSvg>
      {legendItems ? <ChartLegend items={legendItems} /> : null}
    </div>
  );
}
