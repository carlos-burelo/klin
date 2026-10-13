/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { toNumber } from "../lib/number";

export type LegendItem = {
  label: string;
  color: string;
};

export type ChartLegendProps = {
  items: LegendItem[];
  /** Dirección de la leyenda. */
  layout?: "row" | "column";
  /** Alineación dentro del contenedor. */
  align?: "center" | "start";
  /** Glifo del marcador (`line` para series de línea). */
  shape?: "square" | "line" | "dot";
  /** Máximo de ítems visibles (el resto colapsa en `+N`). */
  maxItems?: number;
};

/** Clases del glifo según forma. */
const LEGEND_SHAPE_CLS: Record<
  NonNullable<ChartLegendProps["shape"]>,
  string
> = {
  square: "size-2 shrink-0 rounded-[2px]",
  line: "h-0.5 w-4 shrink-0 rounded-full",
  dot: "size-2 shrink-0 rounded-full",
};

/** Leyenda HTML SSR (sin JS). */
export function ChartLegend({
  items,
  layout = "row",
  align = "center",
  shape = "square",
  maxItems,
}: ChartLegendProps) {
  if (items.length === 0) return null;
  const limit =
    maxItems === undefined
      ? items.length
      : Math.max(0, Math.floor(toNumber(maxItems)));
  const visible = items.slice(0, limit);
  const rest = items.length - visible.length;
  const directionCls =
    layout === "column"
      ? "flex-col flex-nowrap"
      : "flex-row flex-wrap items-center";
  const alignCls =
    layout === "column"
      ? align === "center"
        ? "items-center"
        : "items-start"
      : align === "center"
        ? "justify-center"
        : "justify-start";
  return (
    <div
      className={`flex ${directionCls} ${alignCls} gap-4 pt-3 text-xs text-muted-foreground`}
    >
      {visible.map((item, i) => (
        <span key={`${item.label}__${i}`} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={LEGEND_SHAPE_CLS[shape]}
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
      {rest > 0 ? (
        <span className="font-mono tabular-nums">+{rest}</span>
      ) : null}
    </div>
  );
}
