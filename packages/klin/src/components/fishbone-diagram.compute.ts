/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */

import { toNumber } from "../core/number";
import { DEFAULT_LOCALE } from "../core/theme";
import { CHART_W } from "../render/chart-svg";
import type {
  FishboneCause,
  FishboneLayout,
  FishboneLayoutOptions,
  FishboneSide,
} from "./fishbone-diagram.types";

/** Caps SSR (causas y subcausas por causa). */
export const MAX_FISHBONE_CAUSES = 8;
export const MAX_FISHBONE_SUBCAUSES = 6;

export const FISH_DEFAULT_H = 300;
export const FISH_SLOT_W = 140;
export const FISH_PAD_X = 16;
export const FISH_HEAD_W = 150;
export const FISH_HEAD_H = 36;
export const FISH_RISE = 70;
export const FISH_MIN_RISE = 24;
export const FISH_LABEL_CLEAR = 40;
export const FISH_TICK_HALF = 13;
export const FISH_CAUSE_FONT_SIZE = 12;
export const FISH_MAX_SHOWN_SUBS = 4;
export const FISH_CAUSE_LABEL_MAX = 18;
export const FISH_SUB_LABEL_MAX = 16;
export const FISH_EFFECT_LABEL_MAX = 20;
export const FISH_BONE_ANCHOR = 0.72;
export const FISH_BONE_TIP = 0.18;
export const FISH_ARROW = {
  SIZE: 10,
  REF_X: 8,
  REF_Y: 5,
  WIDTH: 7,
  HEIGHT: 7,
} as const;

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

  const base: FishboneLayout = {
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
  if (opts?.direction === "RL") {
    const mirrorX = (x: number) => width - x;
    return {
      ...base,
      spineX1: mirrorX(base.spineX2),
      spineX2: mirrorX(base.spineX1),
      head: { ...base.head, x: mirrorX(base.head.x + base.head.w) },
      causes: base.causes.map((c) => ({
        ...c,
        attachX: mirrorX(c.attachX),
        outerX: mirrorX(c.outerX),
        subs: c.subs.map((s) => ({ ...s, x: mirrorX(s.x) })),
      })),
    };
  }
  return base;
}
