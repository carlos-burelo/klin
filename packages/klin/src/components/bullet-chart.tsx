/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { type CSSProperties, useId } from "react";
import { isBlank } from "../lib/empty";
import { resolveFormatter } from "../lib/format";
import { stableKey } from "../lib/keys";
import { toNumber } from "../lib/number";
import type { ValueFormatter } from "../lib/palette";
import { seriesColor } from "../lib/palette";
import {
  CHART_TOKEN,
  DEFAULT_LOCALE,
  GRID_WIDTH,
  ZERO_MARK_PX,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

/** Fila de bala (valor, meta y bandas cualitativas). */
export type BulletRow = {
  label: string;
  /** Valor alcanzado. */
  value: number;
  /** Meta. */
  target: number;
  /** Cortes de las bandas cualitativas [bajo, medio, alto]. */
  ranges: [number, number, number];
  detail?: string;
};

/** Props de bala SSR (valor vs. meta sobre bandas). */
export type BulletChartProps = {
  rows: BulletRow[];
  ariaLabel: string;
  /**
   * Colores de las bandas cualitativas [baja, media, alta].
   * @default tonos de track
   */
  bands?: [string, string, string];
  /**
   * Muestra el valor de la meta junto al valor alcanzado.
   * @default true
   */
  showTargetLabel?: boolean;
  /**
   * Tope fijo de la escala para comparar varias balas ("auto" = máximo de los datos).
   * @default "auto"
   */
  scaleMax?: "auto" | number;
  /**
   * Alto en px de cada pista (por defecto, el de la hoja de estilo).
   * @default undefined
   */
  height?: number;
  /**
   * Prefijo de los `clipPath` (por defecto, `useId`; útil en multi-instancia).
   * @default undefined
   */
  id?: string;
  format?: ValueFormatter;
  locale?: string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const TRACK_W = 600;
const TRACK_H = 22;
/** Radio de la pista y opacidades de las bandas cualitativas. */
const TRACK_RADIUS = 6;
const BAND_OPACITY_LOW = 0.45;
const BAND_OPACITY_MID = 0.7;
const BAND_OPACITY_HIGH = 1;
/** Barra de valor centrada en la pista. */
const VALUE_BAR_H = 7;
/** Grosor de la marca de meta. */
const TARGET_WIDTH = 3;

/**
 * Bala SSR (valor vs. meta sobre bandas cualitativas).
 * No-finitos cuentan como 0; anchos siempre dentro del riel.
 */
export function BulletChart({
  rows,
  ariaLabel,
  bands,
  showTargetLabel = true,
  scaleMax = "auto",
  height,
  id,
  locale = DEFAULT_LOCALE,
  format,
  color,
  className,
  style,
  ariaDescribedBy,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
}: BulletChartProps) {
  // useId arriba: hooks siempre en mismo orden (antes del early return).
  const autoUid = useId().replace(/:/g, "");
  const uid = id ?? autoUid;
  if (isBlank(rows)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const fmt = resolveFormatter(format, locale);

  const fill = seriesColor(0, color);
  const trackStyle =
    height == null ? undefined : { height: toNumber(height, TRACK_H) };
  const clean = rows.map((r) => ({
    label: r.label,
    detail: r.detail,
    value: toNumber(r.value),
    target: toNumber(r.target),
    ranges: [
      toNumber(r.ranges[0]),
      toNumber(r.ranges[1]),
      toNumber(r.ranges[2]),
    ] as [number, number, number],
  }));
  const maxTotal =
    scaleMax === "auto"
      ? Math.max(
          1,
          ...clean.map((r) => Math.max(r.value, r.target, r.ranges[2])),
        )
      : Math.max(1, toNumber(scaleMax, 1));
  const bandFills = [
    bands?.[0] ?? CHART_TOKEN.track,
    bands?.[1] ?? CHART_TOKEN.track,
    bands?.[2] ?? CHART_TOKEN.track,
  ];
  const bandOpacity = [BAND_OPACITY_LOW, BAND_OPACITY_MID, BAND_OPACITY_HIGH];

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={className}
      style={style}
    >
      <title>{ariaLabel}</title>
      <div className="flex flex-col gap-3">
        {clean.map((row, ri) => {
          const [lo, mid, hi] = row.ranges;
          const clipId = `${uid}-bullet-${ri}`;
          const tip =
            `${row.label}: ${fmt(row.value)} (meta ${fmt(row.target)})` +
            (row.detail ? ` · ${row.detail}` : "");
          const segs = [
            {
              from: 0,
              to: Math.max(0, lo),
              o: bandOpacity[0] ?? BAND_OPACITY_LOW,
            },
            {
              from: Math.max(0, lo),
              to: Math.max(0, mid),
              o: bandOpacity[1] ?? BAND_OPACITY_MID,
            },
            {
              from: Math.max(0, mid),
              to: Math.max(0, hi),
              o: bandOpacity[2] ?? BAND_OPACITY_HIGH,
            },
          ];
          const valueW = Math.min(
            TRACK_W,
            Math.max(0, (row.value / maxTotal) * TRACK_W),
          );
          const targetX = Math.min(
            TRACK_W,
            Math.max(0, (row.target / maxTotal) * TRACK_W),
          );
          return (
            <div key={stableKey([row.label], ri)}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span
                  className="truncate text-xs text-muted-foreground"
                  title={row.label}
                >
                  {row.label}
                </span>
                <span className="shrink-0 font-mono text-[11px] font-medium tabular-nums">
                  {showTargetLabel
                    ? `${fmt(row.value)} / ${fmt(row.target)}`
                    : fmt(row.value)}
                </span>
              </div>
              <svg
                viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
                className="h-6 min-w-0 flex-1"
                style={trackStyle}
                aria-hidden="true"
              >
                <title>{tip}</title>
                <defs>
                  <clipPath id={clipId}>
                    <rect width={TRACK_W} height={TRACK_H} rx={TRACK_RADIUS} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                  {segs.map((s, si) => {
                    const sx = Math.min(
                      TRACK_W,
                      Math.max(0, (s.from / maxTotal) * TRACK_W),
                    );
                    const sw = Math.max(
                      0,
                      Math.min(
                        TRACK_W - sx,
                        ((s.to - s.from) / maxTotal) * TRACK_W,
                      ),
                    );
                    return (
                      <rect
                        key={`${s.from}-${s.to}__${si}`}
                        x={sx}
                        y={0}
                        width={sw}
                        height={TRACK_H}
                        fill={bandFills[si] ?? CHART_TOKEN.track}
                        opacity={s.o}
                      />
                    );
                  })}
                </g>
                <rect
                  x={0}
                  y={TRACK_H / 2 - VALUE_BAR_H / 2}
                  width={Math.max(ZERO_MARK_PX, valueW)}
                  height={VALUE_BAR_H}
                  rx={VALUE_BAR_H / 2}
                  fill={fill}
                  stroke={CHART_TOKEN.background}
                  strokeWidth={GRID_WIDTH}
                  data-chart-tip={tip}
                />
                <line
                  x1={targetX}
                  x2={targetX}
                  y1={0}
                  y2={TRACK_H}
                  stroke={CHART_TOKEN.foreground}
                  strokeWidth={TARGET_WIDTH}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
