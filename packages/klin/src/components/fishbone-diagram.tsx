/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { useId } from "react";
import { isBlank } from "../lib/empty";
import { CHART_W, ChartSvg } from "../lib/frame";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  EDGE_WIDTH,
  FONT_SEMIBOLD,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

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

/** Caps SSR (causas y subcausas por causa). */
export const MAX_FISHBONE_CAUSES = 8;
export const MAX_FISHBONE_SUBCAUSES = 6;

const FISH_DEFAULT_H = 300;
const FISH_SLOT_W = 140;
const FISH_PAD_X = 16;
const FISH_HEAD_W = 150;
const FISH_HEAD_H = 36;
const FISH_RISE = 70;
const FISH_MIN_RISE = 24;
const FISH_LABEL_CLEAR = 40;
const FISH_TICK_HALF = 13;
const FISH_CAUSE_FONT_SIZE = 12;
const FISH_MAX_SHOWN_SUBS = 4;
const FISH_CAUSE_LABEL_MAX = 18;
const FISH_SUB_LABEL_MAX = 16;
const FISH_EFFECT_LABEL_MAX = 20;
const FISH_BONE_ANCHOR = 0.72;
const FISH_BONE_TIP = 0.18;
const FISH_ARROW = {
  SIZE: 10,
  REF_X: 8,
  REF_Y: 5,
  WIDTH: 7,
  HEIGHT: 7,
} as const;

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
};

/**
 * Cómputo puro del layout Ishikawa (espina central + diagonales
 * alternadas + sub-espinas; trunca determinista con caps SSR).
 */
export function computeFishboneLayout(
  effect: string,
  causes: FishboneCause[],
  height = FISH_DEFAULT_H,
  locale = DEFAULT_LOCALE,
  opts?: FishboneLayoutOptions,
): FishboneLayout {
  const h = Number.isFinite(height) && height > 0 ? height : FISH_DEFAULT_H;
  const spineY = h / 2;
  const rawMax = Math.floor(
    toNumber(opts?.maxItems ?? MAX_FISHBONE_CAUSES, MAX_FISHBONE_CAUSES),
  );
  const safeMax =
    Number.isFinite(rawMax) && rawMax > 0 ? rawMax : MAX_FISHBONE_CAUSES;
  const ordered = causes.slice(0, safeMax);
  if (opts?.sortGroups) {
    ordered.sort((a, b) => a.label.localeCompare(b.label, locale));
  }
  const capped = ordered.slice(0, MAX_FISHBONE_CAUSES);
  const width = Math.max(
    CHART_W,
    FISH_PAD_X * 2 + FISH_SLOT_W * capped.length + FISH_HEAD_W,
  );
  const spineX1 = FISH_PAD_X;
  const spineX2 = width - FISH_PAD_X - FISH_HEAD_W;
  const rise = Math.min(
    FISH_RISE,
    Math.max(FISH_MIN_RISE, spineY - FISH_LABEL_CLEAR),
  );
  const fmtCount =
    opts?.format ??
    ((v: number) => Math.max(0, toNumber(v)).toLocaleString(locale));

  return {
    effect,
    causes: capped.map((cause, i) => {
      const slotX = FISH_PAD_X + FISH_SLOT_W * i;
      const attachX = slotX + FISH_SLOT_W * FISH_BONE_ANCHOR;
      const outerX = slotX + FISH_SLOT_W * FISH_BONE_TIP;
      const side: FishboneSide = i % 2 === 0 ? "top" : "bottom";
      const outerY = spineY + (side === "top" ? -rise : rise);
      const subs = (cause.subcauses ?? []).slice(0, MAX_FISHBONE_SUBCAUSES);
      const count = Math.max(0, toNumber(subs.length));
      const shown = subs.slice(0, FISH_MAX_SHOWN_SUBS);
      return {
        label: cause.label,
        side,
        subcauses: subs,
        shown,
        hidden: Math.max(0, toNumber(count - shown.length)),
        tip: `${cause.label}: ${fmtCount(count)} subcausas`,
        attachX,
        outerX,
        outerY,
        subs: shown.map((label, k) => {
          const t = (k + 1) / (shown.length + 1);
          return {
            label,
            x: attachX + (outerX - attachX) * t,
            y: spineY + (outerY - spineY) * t,
          };
        }),
      };
    }),
    width,
    height: h,
    spineY,
    spineX1,
    spineX2,
    head: {
      x: spineX2,
      y: spineY - FISH_HEAD_H / 2,
      w: FISH_HEAD_W,
      h: FISH_HEAD_H,
    },
  };
}

/**
 * Ishikawa SSR (espina central + diagonales por causa + cabeza efecto).
 */
export function FishboneDiagram({
  effect,
  causes,
  ariaLabel,
  height = FISH_DEFAULT_H,
  locale = DEFAULT_LOCALE,
  format,
  className,
  style,
  ariaDescribedBy,
  showLabels = true,
  showCounts = true,
  sortGroups = false,
  maxItems = MAX_FISHBONE_CAUSES,
  id,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: FishboneDiagramProps) {
  const autoId = useId().replace(/:/g, "");
  if (isBlank(causes) || isBlank(effect)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const markerId = `${(id ?? autoId).replace(/:/g, "")}-fishbone-arrow`;
  const layout = computeFishboneLayout(effect, causes, height, locale, {
    sortGroups,
    maxItems,
    format,
  });
  const { width, height: h, spineY } = layout;

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <ChartSvg
        width={width}
        height={h}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
        style={{ minWidth: width }}
      >
        <defs>
          <marker
            id={markerId}
            viewBox={`0 0 ${FISH_ARROW.SIZE} ${FISH_ARROW.SIZE}`}
            refX={FISH_ARROW.REF_X}
            refY={FISH_ARROW.REF_Y}
            markerWidth={FISH_ARROW.WIDTH}
            markerHeight={FISH_ARROW.HEIGHT}
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill={CHART_TOKEN.muted} />
          </marker>
        </defs>
        <line
          x1={layout.spineX1}
          x2={layout.spineX2}
          y1={spineY}
          y2={spineY}
          stroke={CHART_TOKEN.muted}
          strokeWidth={EDGE_WIDTH}
          markerEnd={`url(#${markerId})`}
        />
        {layout.causes.map((cause, i) => (
          <g key={stableKey([cause.label], i)}>
            <title>{cause.tip}</title>
            <line
              x1={cause.attachX}
              y1={spineY}
              x2={cause.outerX}
              y2={cause.outerY}
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              data-chart-tip={cause.tip}
            />
            {cause.subs.map((sub, k) => (
              <g key={stableKey([cause.label, sub.label], k)}>
                <line
                  x1={sub.x - FISH_TICK_HALF}
                  x2={sub.x + FISH_TICK_HALF}
                  y1={sub.y}
                  y2={sub.y}
                  stroke={CHART_TOKEN.muted}
                  strokeWidth={EDGE_WIDTH}
                />
                {showLabels ? (
                  <text
                    x={sub.x}
                    y={sub.y + (cause.side === "top" ? -6 : 14)}
                    textAnchor="middle"
                    fontSize={TICK_FONT_SIZE}
                    fill={CHART_TOKEN.muted}
                  >
                    {truncateLabel(sub.label, FISH_SUB_LABEL_MAX)}
                  </text>
                ) : null}
              </g>
            ))}
            {showLabels ? (
              <text
                x={cause.outerX}
                y={cause.outerY + (cause.side === "top" ? -8 : 18)}
                textAnchor="middle"
                fontSize={FISH_CAUSE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(cause.label, FISH_CAUSE_LABEL_MAX)}
              </text>
            ) : null}
            {showCounts && cause.hidden > 0 ? (
              <text
                x={cause.outerX}
                y={cause.outerY + (cause.side === "top" ? -22 : 32)}
                textAnchor="middle"
                fontSize={TICK_FONT_SIZE}
                fill={CHART_TOKEN.muted}
              >
                {`+${cause.hidden.toLocaleString(locale)} más`}
              </text>
            ) : null}
          </g>
        ))}
        <g>
          <title>{layout.effect}</title>
          <rect
            x={layout.head.x}
            y={layout.head.y}
            width={layout.head.w}
            height={layout.head.h}
            rx={layout.head.h / 2}
            fill={CHART_TOKEN.card}
            stroke={CHART_TOKEN.border}
            strokeWidth={EDGE_WIDTH}
            data-chart-tip={layout.effect}
          />
          <text
            x={layout.head.x + layout.head.w / 2}
            y={spineY}
            dy={4}
            textAnchor="middle"
            fontSize={FISH_CAUSE_FONT_SIZE}
            fontWeight={FONT_SEMIBOLD}
            fill={CHART_TOKEN.foreground}
          >
            {truncateLabel(layout.effect, FISH_EFFECT_LABEL_MAX)}
          </text>
        </g>
      </ChartSvg>
    </div>
  );
}
