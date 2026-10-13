/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { CSSProperties } from "react";
import { isBlank } from "../lib/empty";
import { stableKey } from "../lib/keys";
import { ChartEmpty, EMPTY_TITLE } from "./empty";

export type TreeItem = {
  label: string;
  detail?: string;
  badge?: string | number;
  children?: TreeItem[];
};

/** Props del árbol. */
export type TreeViewProps = {
  items: TreeItem[];
  ariaLabel: string;
  /** Abre el primer nivel al cargar. */
  defaultOpen?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  style?: CSSProperties;
  ariaDescribedBy?: string;
};

const CHEVRON_SIZE = 12;
const CHEVRON_STROKE = 1.75;

export const MAX_TREE_DEPTH = 6;
export const MAX_TREE_NODES = 300;

/**
 * Trunca determinista del árbol (profundidad + total de nodos).
 * Pura y testable; el componente la llama antes de renderizar.
 */
export function capTreeItems(items: TreeItem[]): TreeItem[] {
  let count = 0;
  const clone = (node: TreeItem, depth: number): TreeItem | null => {
    if (count >= MAX_TREE_NODES) return null;
    count += 1;
    if (depth >= MAX_TREE_DEPTH || !node.children?.length) {
      return { ...node, children: undefined };
    }
    const kids: TreeItem[] = [];
    for (const k of node.children) {
      if (count >= MAX_TREE_NODES) break;
      const c = clone(k, depth + 1);
      if (c) kids.push(c);
    }
    return kids.length > 0
      ? { ...node, children: kids }
      : { ...node, children: undefined };
  };
  const out: TreeItem[] = [];
  for (const item of items) {
    if (count >= MAX_TREE_NODES) break;
    const c = clone(item, 0);
    if (c) out.push(c);
  }
  return out;
}

/**
 * Árbol SSR con `<details>` nativo: expande/colapsa sin JS.
 */
export function TreeView({
  items,
  ariaLabel,
  defaultOpen = true,
  emptyTitle = EMPTY_TITLE,
  emptyDescription,
  className,
  style,
  ariaDescribedBy,
}: TreeViewProps) {
  if (isBlank(items)) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  const capped = capTreeItems(items);

  return (
    <ul
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: patrón ARIA tree sobre lista; la interacción de teclado la da <summary> nativo
      role="tree"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={
        className
          ? `flex flex-col gap-0.5 ${className}`
          : "flex flex-col gap-0.5"
      }
      style={style}
    >
      <title>{ariaLabel}</title>
      {capped.map((item, i) => (
        <TreeNode
          key={stableKey([item.label], i)}
          item={item}
          open={defaultOpen}
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

function TreeNode({ item, open }: { item: TreeItem; open: boolean }) {
  const kids = item.children ?? [];
  const row = (
    <>
      <span className="truncate text-sm">{item.label}</span>
      {item.detail ? (
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {item.detail}
        </span>
      ) : null}
      {item.badge !== undefined ? (
        <span className="shrink-0 rounded-full bg-muted px-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  if (kids.length === 0) {
    return (
      // biome-ignore lint/a11y/useFocusableInteractive: hoja informativa; las ramas se operan por <summary> enfocable
      <li role="treeitem" aria-label={item.label} title={item.label}>
        <div className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted">
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
          title={item.label}
          className="flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden"
        >
          <Chevron />
          {row}
        </summary>
        {/* biome-ignore lint/a11y/useSemanticElements: rol group anidado del patrón tree */}
        <ul
          role="group"
          className="ml-[13px] flex flex-col gap-0.5 border-l pl-2"
        >
          {kids.map((kid, ki) => (
            <TreeNode key={stableKey([kid.label], ki)} item={kid} open={open} />
          ))}
        </ul>
      </details>
    </li>
  );
}
