/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { truncateLabel } from "../core/text";
import {
  CHART_TOKEN,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_REGULAR,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../core/theme";
import { EdgeLabel } from "../render/edge-label";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import { ChartLegend } from "../render/legend";
import {
  ATTR_DY,
  ATTR_X,
  computeErLayout,
  ER_CROWFOOT_GAP,
  ER_CROWFOOT_LEN,
  ER_CROWFOOT_SPREAD,
  ER_LABEL_MAX,
  ER_WEAK_INSET,
  erAttributeView,
  HEADER,
  isManySide,
  MIN_NODE_H,
  NODE_FONT_SIZE,
  NODE_RX_PROCESS,
  ROW,
  TITLE_DY,
} from "./er-diagram.compute";
import type { ErDiagramProps } from "./er-diagram.types";

export type {
  ErAttribute,
  ErDiagramProps,
  ErEntity,
  ErRelation,
} from "./er-diagram.types";
export { computeErLayout, erAttributeView };

/**
 * Entidad-relación SSR (entidades con atributos + cardinalidades).
 */
export function ErDiagram({
  entities,
  relations,
  ariaLabel,
  direction = "LR",
  showKeys = true,
  crowFoot = true,
  showWeak = true,
  attributeLimit,
  showLegend = false,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ErDiagramProps) {
  if (isBlank(entities)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const { layout, byId, heights, width, height } = computeErLayout(
    entities,
    relations,
    direction,
    attributeLimit,
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const relByKey = new Map(
    relations.map((r) => [`${r.from}→${r.to}`, r] as const),
  );

  return (
    <div
      className={className ? `overflow-x-auto ${className}` : "overflow-x-auto"}
      style={style}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        style={{ minWidth: width }}
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {layout.edges.map((e, i) => (
          <path
            key={stableKey([e.from, e.to], i)}
            d={e.d}
            fill="none"
            stroke={CHART_TOKEN.muted}
            strokeWidth={EDGE_WIDTH}
          />
        ))}
        {crowFoot
          ? layout.edges.map((e, i) => {
              const rel = relByKey.get(`${e.from}→${e.to}`);
              if (!rel || !isManySide(rel.label) || e.from === e.to) {
                return null;
              }
              const a = layout.nodes.get(e.from);
              const b = layout.nodes.get(e.to);
              if (!a || !b) return null;
              const dx = b.cx - a.cx;
              const dy = b.cy - a.cy;
              let px: number;
              let py: number;
              let ux: number;
              let uy: number;
              let qx: number;
              let qy: number;
              if (Math.abs(dx) >= Math.abs(dy)) {
                const s = dx >= 0 ? 1 : -1;
                px =
                  s > 0 ? b.x - ER_CROWFOOT_GAP : b.x + b.w + ER_CROWFOOT_GAP;
                py = b.cy;
                ux = s;
                uy = 0;
                qx = 0;
                qy = 1;
              } else {
                const s = dy >= 0 ? 1 : -1;
                px = b.cx;
                py =
                  s > 0 ? b.y - ER_CROWFOOT_GAP : b.y + b.h + ER_CROWFOOT_GAP;
                ux = 0;
                uy = s;
                qx = 1;
                qy = 0;
              }
              const toes = [-ER_CROWFOOT_SPREAD, 0, ER_CROWFOOT_SPREAD].map(
                (o) => ({
                  x: px - ux * ER_CROWFOOT_LEN + qx * o,
                  y: py - uy * ER_CROWFOOT_LEN + qy * o,
                }),
              );
              return (
                <g
                  key={stableKey([e.from, e.to, "pata"], i)}
                  stroke={CHART_TOKEN.muted}
                  strokeWidth={EDGE_WIDTH}
                >
                  {toes.map((t, ti) => (
                    <line
                      key={stableKey([t.x, t.y], ti)}
                      x1={px}
                      y1={py}
                      x2={t.x}
                      y2={t.y}
                    />
                  ))}
                </g>
              );
            })
          : null}
        {[...layout.nodes.values()].map((p, pi) => {
          const entity = byId.get(p.id);
          if (!entity) return null;
          const h = heights.get(p.id) ?? H;
          const y0 = p.cy - h / 2;
          const tip = `${entity.name} (${entity.attributes.length} atributos)`;
          return (
            <g key={stableKey([p.id], pi)}>
              <rect
                x={p.x}
                y={y0}
                width={p.w}
                height={h}
                rx={NODE_RX_PROCESS}
                fill={CHART_TOKEN.card}
                stroke={CHART_TOKEN.border}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={tip}
              />
              {showWeak && entity.weak ? (
                <rect
                  x={p.x + ER_WEAK_INSET}
                  y={y0 + ER_WEAK_INSET}
                  width={p.w - ER_WEAK_INSET * 2}
                  height={h - ER_WEAK_INSET * 2}
                  rx={NODE_RX_PROCESS}
                  fill="none"
                  stroke={CHART_TOKEN.border}
                  strokeWidth={EDGE_WIDTH}
                />
              ) : null}
              <line
                x1={p.x}
                y1={y0 + HEADER}
                x2={p.x + p.w}
                y2={y0 + HEADER}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              <text
                x={p.cx}
                y={y0 + TITLE_DY}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(entity.name, ER_LABEL_MAX)}
              </text>
              {(() => {
                const view = erAttributeView(entity.attributes, attributeLimit);
                return (
                  <>
                    {view.shown.map((a, i) => (
                      <text
                        key={stableKey([a.name, a.key ?? ""], i)}
                        x={p.x + ATTR_X}
                        y={y0 + HEADER + ATTR_DY + i * ROW}
                        fontSize={TICK_FONT_SIZE}
                        fontFamily={FONT_MONO}
                        fontWeight={
                          showKeys && a.key === "PK"
                            ? FONT_SEMIBOLD
                            : FONT_REGULAR
                        }
                        textDecoration={
                          showKeys && a.key === "PK" ? "underline" : "none"
                        }
                        fill={CHART_TOKEN.muted}
                      >
                        {showKeys && a.key
                          ? `${a.key} ${truncateLabel(a.name, 24)}`
                          : truncateLabel(a.name, 24)}
                      </text>
                    ))}
                    {view.hidden > 0 ? (
                      <text
                        x={p.x + ATTR_X}
                        y={y0 + HEADER + ATTR_DY + view.shown.length * ROW}
                        fontSize={TICK_FONT_SIZE}
                        fontFamily={FONT_MONO}
                        fill={CHART_TOKEN.muted}
                      >
                        {`+${view.hidden} más`}
                      </text>
                    ) : null}
                  </>
                );
              })()}
            </g>
          );
        })}
        {layout.edges.map((e, i) => {
          const rel = relByKey.get(`${e.from}→${e.to}`);
          return rel?.label ? (
            <EdgeLabel
              key={stableKey([e.from, e.to, rel.label], i)}
              mx={e.mx}
              my={e.my}
              text={rel.label}
            />
          ) : null;
        })}
      </svg>
      {showLegend ? (
        <ChartLegend
          items={[
            { label: "PK", color: CHART_TOKEN.foreground },
            { label: "FK", color: CHART_TOKEN.muted },
            { label: "Débil", color: CHART_TOKEN.border },
          ]}
        />
      ) : null}
    </div>
  );
}
