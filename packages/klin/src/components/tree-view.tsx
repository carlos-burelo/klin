/** klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE). */
import { isBlank } from "../core/guards";
import { stableKey } from "../core/keys";
import { ChartEmpty, EMPTY_TITLE } from "../render/empty";
import {
  CHEVRON_SIZE,
  CHEVRON_STROKE,
  capTreeItems,
  sortTreeItems,
} from "./tree-view.compute";
import type { TreeItem, TreeViewProps } from "./tree-view.types";

export {
  CHEVRON_SIZE,
  CHEVRON_STROKE,
  capTreeItems,
  MAX_TREE_DEPTH,
  MAX_TREE_NODES,
  sortTreeItems,
} from "./tree-view.compute";
export type { TreeItem, TreeViewProps } from "./tree-view.types";

/**
 * Árbol SSR con `<details>` nativo: expande/colapsa sin JS.
 */
export function TreeView({
  items,
  ariaLabel,
  defaultOpen = true,
  depth,
  maxItems,
  showDetail = true,
  showBadge = true,
  sortBy,
  density = "comfortable",
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TreeViewProps) {
  if (isBlank(items)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const sorted = sortTreeItems(items, sortBy);
  const capped = capTreeItems(sorted, { depth, maxItems });
  const compact = density === "compact";

  return (
    <ul
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: patrón ARIA tree sobre lista; la interacción de teclado la da <summary> nativo
      role="tree"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={
        className
          ? compact
            ? `flex flex-col gap-0 ${className}`
            : `flex flex-col gap-0.5 ${className}`
          : compact
            ? "flex flex-col gap-0"
            : "flex flex-col gap-0.5"
      }
      style={style}
    >
      {capped.map((item, i) => (
        <TreeNode
          key={stableKey([item.label], i)}
          item={item}
          open={defaultOpen}
          showDetail={showDetail}
          showBadge={showBadge}
          compact={compact}
        />
      ))}
    </ul>
  );
}

function Chevron() {
  return (
    <svg
      width={CHEVRON_SIZE}
      height={CHEVRON_SIZE}
      viewBox={`0 0 ${CHEVRON_SIZE} ${CHEVRON_SIZE}`}
      aria-hidden="true"
      className="shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
    >
      <path
        d="M 4.5 2.5 L 8 6 L 4.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={CHEVRON_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TreeNode({
  item,
  open,
  showDetail,
  showBadge,
  compact,
}: {
  item: TreeItem;
  open: boolean;
  showDetail: boolean;
  showBadge: boolean;
  compact: boolean;
}) {
  const kids = item.children ?? [];
  const row = (
    <>
      <span className="truncate text-sm">{item.label}</span>
      {showDetail && item.detail ? (
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {item.detail}
        </span>
      ) : null}
      {showBadge && item.badge !== undefined ? (
        <span className="shrink-0 rounded-full bg-muted px-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
          {item.badge}
        </span>
      ) : null}
    </>
  );
  const rowCls = compact
    ? "flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted"
    : "flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted";

  if (kids.length === 0) {
    return (
      // biome-ignore lint/a11y/useFocusableInteractive: hoja informativa; las ramas se operan por <summary> enfocable
      <li role="treeitem" aria-label={item.label} data-chart-tip={item.label}>
        <div className={rowCls}>
          <span className="w-3 shrink-0" aria-hidden="true" />
          {row}
        </div>
      </li>
    );
  }

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: el <summary> interno es el control enfocable nativo
    <li role="treeitem" aria-label={item.label} aria-expanded={open}>
      <details open={open} className="group">
        <summary
          data-chart-tip={item.label}
          className={
            compact
              ? "flex cursor-pointer list-none items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden"
              : "flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden"
          }
        >
          <Chevron />
          {row}
        </summary>
        {/* biome-ignore lint/a11y/useSemanticElements: rol group anidado del patrón tree */}
        <ul
          role="group"
          className={
            compact
              ? "ml-[13px] flex flex-col gap-0 border-l pl-1.5"
              : "ml-[13px] flex flex-col gap-0.5 border-l pl-2"
          }
        >
          {kids.map((kid, ki) => (
            <TreeNode
              key={stableKey([kid.label], ki)}
              item={kid}
              open={open}
              showDetail={showDetail}
              showBadge={showBadge}
              compact={compact}
            />
          ))}
        </ul>
      </details>
    </li>
  );
}
