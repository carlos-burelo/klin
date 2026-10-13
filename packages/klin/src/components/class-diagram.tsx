/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

import type { CSSProperties } from "react";
import type { DagLayout } from "../lib/graph";
import { EdgeLabel, fitNodeWidth, layoutDag } from "../lib/graph";
import { stableKey } from "../lib/keys";
import { truncateLabel } from "../lib/palette";
import {
  CHART_TOKEN,
  DIAGRAM_MIN_SCROLL,
  EDGE_WIDTH,
  FONT_MONO,
  FONT_SEMIBOLD,
  GRID_WIDTH,
  TICK_FONT_SIZE,
} from "../lib/theme";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type ClassNode = {
  id: string;
  name: string;
  attributes?: string[];
  methods?: string[];
};

export type ClassEdge = {
  from: string;
  to: string;
  kind?: "inheritance" | "association" | "composition" | "dependency";
  label?: string;
};

const NODE_FONT_SIZE = 12;
const NODE_RX_PROCESS = 8;
const TITLE_H = 30;
const ROW = 20;
const BODY_PAD = 10;
const MIN_NODE_H = 64;
const NODE_FIT = { min: 180, max: 280, size: 11, pad: 40 } as const;
const LAYOUT = {
  GAP_X: 64,
  GAP_Y: 72,
  MIN_W: DIAGRAM_MIN_SCROLL,
  MAX_NODES: 300,
} as const;
const MARKER = { SIZE: 10, REF_X: 8, REF_Y: 5, WIDTH: 7, HEIGHT: 7 } as const;
const MARKER_LARGE = {
  SIZE: 12,
  REF_X: 10,
  REF_Y: 6,
  WIDTH: 9,
  HEIGHT: 9,
} as const;
const TITLE_DY = 20;
const ATTR_X = 10;
const ATTR_DY = 15;
const METHOD_DY = 19;
const DIVIDER_PAD = 4;
const DASH_DEPENDENCY = "5 4";
/** Máximo de miembros visibles por clase antes de colapsar en `+N más`. */
const CLASS_MEMBER_LIMIT = 12;

/** Vista filtrada de los miembros de una clase (atributos + métodos). */
type ClassMemberView = {
  attributes: string[];
  methods: string[];
  /** Miembros ocultos por el límite (0 = sin colapso). */
  hidden: number;
};

/** Opciones de filtrado de miembros (las mismas props del componente). */
type ClassMemberOptions = {
  showMethods: boolean;
  showAttributes: boolean;
  visibility: "all" | "public";
  memberLimit: number;
};

/** Indica si un miembro cuenta como público (`+` o sin prefijo de visibilidad). */
function isPublicMember(member: string): boolean {
  const first = Array.from(member.trimStart())[0];
  return first !== "#" && first !== "-" && first !== "~";
}

/** Aplica visibilidad, secciones y límite a los miembros de una clase. */
function classMemberView(
  n: ClassNode,
  opts: ClassMemberOptions,
): ClassMemberView {
  const attrs = opts.showAttributes ? (n.attributes ?? []) : [];
  const methods = opts.showMethods ? (n.methods ?? []) : [];
  const visibleAttrs =
    opts.visibility === "public" ? attrs.filter(isPublicMember) : attrs;
  const visibleMethods =
    opts.visibility === "public" ? methods.filter(isPublicMember) : methods;
  const total = visibleAttrs.length + visibleMethods.length;
  const limit = Math.max(0, opts.memberLimit);
  if (total <= limit) {
    return { attributes: visibleAttrs, methods: visibleMethods, hidden: 0 };
  }
  const keptAttrs = visibleAttrs.slice(0, limit);
  const keptMethods = visibleMethods.slice(
    0,
    Math.max(0, limit - keptAttrs.length),
  );
  return {
    attributes: keptAttrs,
    methods: keptMethods,
    hidden: total - keptAttrs.length - keptMethods.length,
  };
}

/** Props del diagrama de clases UML. */
export type ClassDiagramProps = {
  nodes: ClassNode[];
  edges: ClassEdge[];
  ariaLabel: string;
  direction?: "TB" | "LR";
  /** Muestra la sección de métodos de cada clase. */
  showMethods?: boolean;
  /** Muestra la sección de atributos de cada clase. */
  showAttributes?: boolean;
  /** Filtra miembros por visibilidad (`public` conserva `+` y sin prefijo). */
  visibility?: "all" | "public";
  /** Máximo de miembros visibles por clase; el resto se colapsa en `+N más`. */
  memberLimit?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

/**
 * Cómputo puro del layout de clases (alturas por miembro + DAG con cap SSR).
 */
export function computeClassLayout(
  nodes: ClassNode[],
  edges: ClassEdge[],
  direction: "TB" | "LR" = "TB",
  options?: Partial<ClassMemberOptions>,
): {
  layout: DagLayout;
  byId: Map<string, ClassNode>;
  heights: Map<string, number>;
  width: number;
  height: number;
} {
  const opts: ClassMemberOptions = {
    showMethods: options?.showMethods ?? true,
    showAttributes: options?.showAttributes ?? true,
    visibility: options?.visibility ?? "all",
    memberLimit: options?.memberLimit ?? CLASS_MEMBER_LIMIT,
  };
  const views = new Map(nodes.map((n) => [n.id, classMemberView(n, opts)]));
  const heights = new Map(
    nodes.map((n) => {
      const view = views.get(n.id) ?? {
        attributes: [],
        methods: [],
        hidden: 0,
      };
      return [
        n.id,
        TITLE_H +
          view.attributes.length * ROW +
          view.methods.length * ROW +
          (view.hidden > 0 ? ROW : 0) +
          BODY_PAD,
      ];
    }),
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const W = fitNodeWidth(
    nodes.flatMap((n) => [
      n.name,
      ...(n.attributes ?? []),
      ...(n.methods ?? []),
    ]),
    {
      min: NODE_FIT.min,
      max: NODE_FIT.max,
      size: NODE_FIT.size,
      pad: NODE_FIT.pad,
    },
  );
  const layout = layoutDag(
    nodes.map((n) => n.id),
    edges,
    {
      direction,
      nodeW: W,
      nodeH: H,
      gapX: LAYOUT.GAP_X,
      gapY: LAYOUT.GAP_Y,
      minW: LAYOUT.MIN_W,
      maxNodes: LAYOUT.MAX_NODES,
    },
  );
  return {
    layout,
    byId: new Map(nodes.map((n) => [n.id, n])),
    heights,
    width: Math.max(1, layout.width),
    height: Math.max(1, layout.height),
  };
}

/**
 * Diagrama de clases UML SSR (herencia, asociación, composición, dependencia).
 */
export function ClassDiagram({
  nodes,
  edges,
  ariaLabel,
  direction = "TB",
  showMethods = true,
  showAttributes = true,
  visibility = "all",
  memberLimit = CLASS_MEMBER_LIMIT,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: ClassDiagramProps) {
  if (nodes.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const opts: ClassMemberOptions = {
    showMethods,
    showAttributes,
    visibility,
    memberLimit,
  };
  const { layout, byId, heights, width, height } = computeClassLayout(
    nodes,
    edges,
    direction,
    opts,
  );
  const H = Math.max(MIN_NODE_H, ...heights.values());
  const edgeByKey = new Map(
    edges.map((e) => [`${e.from}→${e.to}`, e] as const),
  );

  const markerFor = (kind: ClassEdge["kind"]) =>
    kind === "inheritance"
      ? "url(#charts-class-inherit)"
      : kind === "composition"
        ? "url(#charts-class-composite)"
        : "url(#charts-class-arrow)";

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
        <title>{ariaLabel}</title>
        <defs>
          <marker
            id="charts-class-arrow"
            viewBox={`0 0 ${MARKER.SIZE} ${MARKER.SIZE}`}
            refX={MARKER.REF_X}
            refY={MARKER.REF_Y}
            markerWidth={MARKER.WIDTH}
            markerHeight={MARKER.HEIGHT}
            orient="auto-start-reverse"
          >
            <path
              d="M 0 1 L 9 5 L 0 9"
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
            />
          </marker>
          <marker
            id="charts-class-inherit"
            viewBox={`0 0 ${MARKER_LARGE.SIZE} ${MARKER_LARGE.SIZE}`}
            refX={MARKER_LARGE.REF_X}
            refY={MARKER_LARGE.REF_Y}
            markerWidth={MARKER_LARGE.WIDTH}
            markerHeight={MARKER_LARGE.HEIGHT}
            orient="auto-start-reverse"
          >
            <path
              d="M 1 1 L 11 6 L 1 11 z"
              fill={CHART_TOKEN.background}
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
            />
          </marker>
          <marker
            id="charts-class-composite"
            viewBox={`0 0 ${MARKER_LARGE.SIZE} ${MARKER_LARGE.SIZE}`}
            refX={MARKER_LARGE.REF_X}
            refY={MARKER_LARGE.REF_Y}
            markerWidth={MARKER_LARGE.WIDTH}
            markerHeight={MARKER_LARGE.HEIGHT}
            orient="auto-start-reverse"
          >
            <path d="M 1 6 L 6 1 L 11 6 L 6 11 z" fill={CHART_TOKEN.muted} />
          </marker>
        </defs>
        {layout.edges.map((e, i) => {
          const edge = edgeByKey.get(`${e.from}→${e.to}`);
          const kind = edge?.kind ?? "association";
          return (
            <path
              key={stableKey([e.from, e.to], i)}
              d={e.d}
              fill="none"
              stroke={CHART_TOKEN.muted}
              strokeWidth={EDGE_WIDTH}
              strokeDasharray={
                kind === "dependency" ? DASH_DEPENDENCY : undefined
              }
              markerEnd={markerFor(kind)}
            />
          );
        })}
        {[...layout.nodes.values()].map((p, pi) => {
          const n = byId.get(p.id);
          if (!n) return null;
          const h = heights.get(p.id) ?? H;
          const y0 = p.cy - h / 2;
          const view = classMemberView(n, opts);
          const attrs = view.attributes;
          const methods = view.methods;
          return (
            <g key={stableKey([p.id], pi)}>
              <title>{n.name}</title>
              <rect
                x={p.x}
                y={y0}
                width={p.w}
                height={h}
                rx={NODE_RX_PROCESS}
                fill={CHART_TOKEN.card}
                stroke={CHART_TOKEN.border}
                strokeWidth={EDGE_WIDTH}
                data-chart-tip={n.name}
              />
              <line
                x1={p.x}
                y1={y0 + TITLE_H}
                x2={p.x + p.w}
                y2={y0 + TITLE_H}
                stroke={CHART_TOKEN.border}
                strokeWidth={GRID_WIDTH}
              />
              {methods.length > 0 ? (
                <line
                  x1={p.x}
                  y1={y0 + TITLE_H + attrs.length * ROW + DIVIDER_PAD}
                  x2={p.x + p.w}
                  y2={y0 + TITLE_H + attrs.length * ROW + DIVIDER_PAD}
                  stroke={CHART_TOKEN.border}
                  strokeWidth={GRID_WIDTH}
                />
              ) : null}
              <text
                x={p.cx}
                y={y0 + TITLE_DY}
                textAnchor="middle"
                fontSize={NODE_FONT_SIZE}
                fontWeight={FONT_SEMIBOLD}
                fill={CHART_TOKEN.foreground}
              >
                {truncateLabel(n.name, 22)}
              </text>
              {attrs.map((a, ai) => (
                <text
                  key={stableKey([`a-${a}`], ai)}
                  x={p.x + ATTR_X}
                  y={y0 + TITLE_H + ATTR_DY + ai * ROW}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(a, 24)}
                </text>
              ))}
              {methods.map((m, mi) => (
                <text
                  key={stableKey([`m-${m}`], mi)}
                  x={p.x + ATTR_X}
                  y={y0 + TITLE_H + attrs.length * ROW + METHOD_DY + mi * ROW}
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {truncateLabel(m, 24)}
                </text>
              ))}
              {view.hidden > 0 ? (
                <text
                  x={p.x + ATTR_X}
                  y={
                    y0 +
                    TITLE_H +
                    (attrs.length + methods.length) * ROW +
                    METHOD_DY
                  }
                  fontSize={TICK_FONT_SIZE}
                  fontFamily={FONT_MONO}
                  fill={CHART_TOKEN.muted}
                >
                  {`+${view.hidden} más`}
                </text>
              ) : null}
            </g>
          );
        })}
        {layout.edges.map((e, i) => {
          const edge = edgeByKey.get(`${e.from}→${e.to}`);
          return edge?.label ? (
            <EdgeLabel
              key={stableKey([e.from, e.to, edge.label], i)}
              mx={e.mx}
              my={e.my}
              text={edge.label}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
