/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { ReactNode } from "react";
import type {
  DescribedProps,
  RootStyleProps,
  ValueAnnotation,
} from "../core/api";
import { stableKey } from "../core/keys";
import { CHART_TOKEN, GRID_WIDTH, TICK_FONT_SIZE } from "../core/theme";
import { AnnotationLayer } from "./annotation-layer";
import { CHART_MARGIN, CHART_W, type ChartMargin, ChartSvg } from "./chart-svg";
import { ChartLegend } from "./legend";
import { fitTextMiddle, measureText } from "./measure";
import { YGrid } from "./y-grid";

/** Desplazamiento vertical de etiquetas del eje X. */
export const CARTESIAN_AXIS_OFFSET = 10;

/**
 * Ancho mínimo de banda para una sola fila de etiquetas. Debajo de esto las
 * etiquetas vecinas se enciman (`DACB|DACEA|…`), así que se escalonan en dos
 * filas. Estimación: ~7px por carácter a 11px de fuente.
 */
export const MIN_BAND_PX = 64;
/** Desnivel de la segunda fila escalonada. */
export const STAGGER_DY = 13;

export type CartesianXLabel = {
  /** Coordenada interna (sin margen izquierdo). */
  x: number;
  /** Texto visible (ya truncado por el componente si aplica). */
  label: string;
  /** Tooltip rico vía data-chart-tip (por defecto sin tooltip). */
  title?: string;
};

export type CartesianLegendItem = { label: string; color: string };

export type XLabelLayout<T extends CartesianXLabel = CartesianXLabel> = {
  shown: T[];
  stagger: boolean;
  /** Rotación 45° cuando ni raleado cabría: conserva todas las etiquetas. */
  rotate: boolean;
  /** Ancho máximo medido de las visibles (para dimensionar). */
  maxW: number;
};

/** Ancho máximo de etiqueta rotada (el resto se trunca) y seno de 45°. */
export const ROTATE_MAX_W = 88;
export const ROTATE_SIN = Math.SQRT1_2;
/** Colchón bajo la etiqueta rotada más larga. */
export const ROTATE_PAD = 12;
/** Paso mínimo entre etiquetas rotadas (huella diagonal de la fuente). */
export const ROTATE_MIN_GAP = 20;
/** Aire al borde del lienzo en el presupuesto diagonal. */
export const ROTATE_EDGE_GAP = 4;

/**
 * Reparte etiquetas del eje X sin choques (medido, no estimado): una fila si
 * caben, dos escalonadas si caben al doble, o rotación 45° con raleo al paso
 * diagonal si ni así. Puro y determinista. Las omitidas siguen en tips.
 */
export function layoutXLabels<T extends CartesianXLabel>(
  labels: T[],
  plotW: number,
  fontSize = TICK_FONT_SIZE,
): XLabelLayout<T> {
  const none = { shown: labels, stagger: false, rotate: false, maxW: 0 };
  const n = labels.length;
  if (n < 2 || !(plotW > 0)) return none;
  const bandW = plotW / n;
  const maxW = Math.max(
    0,
    ...labels.map((l) => measureText(l.label, fontSize)),
  );
  if (maxW <= bandW)
    return { shown: labels, stagger: false, rotate: false, maxW };
  if (maxW <= bandW * 2)
    return { shown: labels, stagger: true, rotate: false, maxW };
  const k = Math.max(1, Math.ceil(ROTATE_MIN_GAP / bandW));
  const shown = labels.filter((_, i) => i % k === 0 || i === n - 1);
  const shownMaxW = Math.max(
    0,
    ...shown.map((l) => measureText(l.label, fontSize)),
  );
  return { shown, stagger: false, rotate: true, maxW: shownMaxW };
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
  // Con muchas categorías por ancho, una sola fila se vuelve ilegible: se
  // alternan dos filas y la base sube para que la segunda quepa en el margen.
  // Si ni dos filas caben, se rota 45° (con raleo al paso diagonal) y el
  // lienzo crece lo medido.
  const plotW = width - margin.left - margin.right;
  const { shown, stagger, rotate, maxW } = layoutXLabels(xLabels, plotW);
  const truncW = Math.min(maxW, ROTATE_MAX_W);
  const rotateExtra = rotate ? Math.ceil(truncW * ROTATE_SIN) + ROTATE_PAD : 0;
  const viewH = height + rotateExtra;
  const baseY = height - axisOffset - (stagger ? STAGGER_DY : 0);
  // Rotadas nacen pegadas al plot con tick de anclaje (si no, flotan).
  const plotBottom = height - margin.bottom;
  const rotateBaseY = plotBottom + 12;

  return (
    <div className={className} style={style}>
      <ChartSvg
        width={width}
        height={viewH}
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
        {shown.map((l, i) => {
          if (!rotate) {
            return (
              <text
                key={stableKey([l.label], i)}
                x={margin.left + l.x}
                y={baseY}
                dy={stagger && i % 2 === 1 ? STAGGER_DY : undefined}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={l.title}
              >
                {l.label}
              </text>
            );
          }
          // Rotada 45°: presupuesto diagonal propio; al borde derecho se
          // voltea el ancla para no recortar. Sin hueco no se pinta.
          const lx = margin.left + l.x;
          const rightRoom = (plotW - l.x) / ROTATE_SIN - ROTATE_EDGE_GAP;
          const flip = rightRoom < ROTATE_MIN_GAP * 2;
          const budget = Math.min(
            ROTATE_MAX_W,
            Math.max(0, flip ? l.x / ROTATE_SIN - ROTATE_EDGE_GAP : rightRoom),
          );
          // Rotada: texto completo del título con truncado medio (los
          // componentes pre-truncan a 14 y los prefijos colisionan).
          const text = fitTextMiddle(l.title ?? l.label, budget);
          if (!text) return null;
          const tx = lx;
          const ty = rotateBaseY;
          return (
            <g key={stableKey([l.label], i)}>
              <line
                x1={tx}
                x2={tx}
                y1={plotBottom}
                y2={ty + 2}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={tx}
                y={ty}
                transform={`rotate(45 ${tx} ${ty})`}
                textAnchor={flip ? "end" : "start"}
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
                data-chart-tip={l.title}
              >
                {text}
              </text>
            </g>
          );
        })}
        {children}
      </ChartSvg>
      {legendItems ? <ChartLegend items={legendItems} /> : null}
    </div>
  );
}
