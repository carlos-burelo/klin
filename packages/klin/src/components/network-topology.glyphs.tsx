/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { EDGE_WIDTH } from "../core/theme";
import { roleColor } from "./network-topology.compute";
import type { TopoRole } from "./network-topology.types";

export const GLYPH_R = 7;
export const GLYPH_THIN = 1.25;
export const GLYPH_RX_SMALL = 2;
export const GLYPH_RX_TINY = 1.5;
export const GLYPH_DOT_R = 1;
/** Marcos de glifo por rol (x, y, w, h relativos al centro). */
export const GLYPH_FRAME = {
  firewall: { dx: -7, dy: -6, w: 14, h: 12, lineDy: 2 },
  switch: { dx: -8, dy: -5, w: 16, h: 10 },
  server: {
    dx: -6,
    dy: -8,
    w: 12,
    h: 16,
    dotDx: -2.5,
    dotDy: 4,
    slotX1: 1,
    slotX2: 4,
    slotDy: 4,
  },
  host: { w: 14, h: 9, dy: -6, standTop: 3, standFoot: 4 },
} as const;
/** Trazo de nube (curvas fijas del glifo). */
export const CLOUD_PATH_OFFSETS = {
  x0: -8,
  dy: 3,
  tailDx: -15,
  tailDy: 4.6,
} as const;
/** Flecha de router y switch (desplazamientos fijos del glifo). */
export const ROUTER_ARROW = {
  tail: -3.5,
  len: 7,
  headX: 1.5,
  headDy: 2,
  dash: "2 1.5",
} as const;
export const SWITCH_ZIGZAG = {
  x0: -4,
  dy: 1,
  step: 2.5,
  rise: 3,
  x1: 1,
  dy2: -1,
} as const;

export type RoleGlyphProps = {
  role: TopoRole;
  x: number;
  y: number;
};

/** Glifo del rol (16px) dibujado en (x, y). */
export function RoleGlyph({ role, x, y }: RoleGlyphProps) {
  const c = roleColor(role);
  switch (role) {
    case "internet":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <circle cx={x} cy={y} r={GLYPH_R} />
          <ellipse cx={x} cy={y} rx={GLYPH_R / 2} ry={GLYPH_R} />
          <line x1={x - GLYPH_R} y1={y} x2={x + GLYPH_R} y2={y} />
        </g>
      );
    case "cloud":
      return (
        <g fill="none" stroke={c} strokeWidth={EDGE_WIDTH}>
          <path
            d={`M ${x + CLOUD_PATH_OFFSETS.x0} ${y + CLOUD_PATH_OFFSETS.dy} a 4 4 0 0 1 1 -7.8 a 5 5 0 0 1 9.4 -2 a 3.6 3.6 0 0 1 4.6 5.2 l ${CLOUD_PATH_OFFSETS.tailDx} ${CLOUD_PATH_OFFSETS.tailDy} z`}
          />
        </g>
      );
    case "firewall":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH}>
          <rect
            x={x + GLYPH_FRAME.firewall.dx}
            y={y + GLYPH_FRAME.firewall.dy}
            width={GLYPH_FRAME.firewall.w}
            height={GLYPH_FRAME.firewall.h}
            rx={GLYPH_RX_SMALL}
            fill="none"
          />
          <line
            x1={x - GLYPH_R}
            y1={y - GLYPH_FRAME.firewall.lineDy}
            x2={x + GLYPH_R}
            y2={y - GLYPH_FRAME.firewall.lineDy}
          />
          <line
            x1={x - GLYPH_R}
            y1={y + GLYPH_FRAME.firewall.lineDy}
            x2={x + GLYPH_R}
            y2={y + GLYPH_FRAME.firewall.lineDy}
          />
        </g>
      );
    case "router":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <circle cx={x} cy={y} r={GLYPH_R} />
          <path
            d={`M ${x + ROUTER_ARROW.tail} ${y} h ${ROUTER_ARROW.len} M ${x + ROUTER_ARROW.headX} ${y - ROUTER_ARROW.headDy} L ${x - ROUTER_ARROW.tail} ${y} L ${x + ROUTER_ARROW.headX} ${y + ROUTER_ARROW.headDy}`}
          />
          <path
            d={`M ${x - ROUTER_ARROW.tail} ${y} h -${ROUTER_ARROW.len}`}
            strokeDasharray={ROUTER_ARROW.dash}
          />
        </g>
      );
    case "switch":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <rect
            x={x + GLYPH_FRAME.switch.dx}
            y={y + GLYPH_FRAME.switch.dy}
            width={GLYPH_FRAME.switch.w}
            height={GLYPH_FRAME.switch.h}
            rx={GLYPH_RX_SMALL}
          />
          <path
            d={`M ${x + SWITCH_ZIGZAG.x0} ${y + SWITCH_ZIGZAG.dy} l ${SWITCH_ZIGZAG.step} -${SWITCH_ZIGZAG.rise} l ${SWITCH_ZIGZAG.step} ${SWITCH_ZIGZAG.rise} M ${x + SWITCH_ZIGZAG.x1} ${y + SWITCH_ZIGZAG.dy2} l ${SWITCH_ZIGZAG.step} ${SWITCH_ZIGZAG.rise}`}
            strokeWidth={GLYPH_THIN}
          />
        </g>
      );
    case "server":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <rect
            x={x + GLYPH_FRAME.server.dx}
            y={y + GLYPH_FRAME.server.dy}
            width={GLYPH_FRAME.server.w}
            height={GLYPH_FRAME.server.h}
            rx={GLYPH_RX_SMALL}
          />
          <circle
            cx={x + GLYPH_FRAME.server.dotDx}
            cy={y - GLYPH_FRAME.server.dotDy}
            r={GLYPH_DOT_R}
            fill={c}
            stroke="none"
          />
          <circle
            cx={x + GLYPH_FRAME.server.dotDx}
            cy={y + GLYPH_FRAME.server.dotDy}
            r={GLYPH_DOT_R}
            fill={c}
            stroke="none"
          />
          <line
            x1={x + GLYPH_FRAME.server.slotX1}
            y1={y - GLYPH_FRAME.server.slotDy}
            x2={x + GLYPH_FRAME.server.slotX2}
            y2={y - GLYPH_FRAME.server.slotDy}
          />
          <line
            x1={x + GLYPH_FRAME.server.slotX1}
            y1={y + GLYPH_FRAME.server.slotDy}
            x2={x + GLYPH_FRAME.server.slotX2}
            y2={y + GLYPH_FRAME.server.slotDy}
          />
        </g>
      );
    case "host":
      return (
        <g stroke={c} strokeWidth={EDGE_WIDTH} fill="none">
          <rect
            x={x - GLYPH_R}
            y={y + GLYPH_FRAME.host.dy}
            width={GLYPH_FRAME.host.w}
            height={GLYPH_FRAME.host.h}
            rx={GLYPH_RX_TINY}
          />
          <line
            x1={x}
            y1={y + GLYPH_FRAME.host.standTop}
            x2={x}
            y2={y + GLYPH_R}
          />
          <line
            x1={x - GLYPH_FRAME.host.standFoot}
            y1={y + GLYPH_R}
            x2={x + GLYPH_FRAME.host.standFoot}
            y2={y + GLYPH_R}
          />
        </g>
      );
  }
}
