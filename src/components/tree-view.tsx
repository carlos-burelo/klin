/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { ChartEmpty } from "./empty";

export type TreeItem = {
  label: string;
  detail?: string;
  badge?: string | number;
  children?: TreeItem[];
};

/**
 * Árbol SSR con `<details>` nativo: expande/colapsa sin JS.
 */
export function TreeView({
  items,
  ariaLabel,
  defaultOpen = true,
  emptyTitle = "Sin datos todavía",
  emptyDescription,
}: {
  items: TreeItem[];
  ariaLabel: string;
  /** Abre el primer nivel al cargar. */
  defaultOpen?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (items.length === 0) {
    return <ChartEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: patrón ARIA tree sobre lista; la interacción de teclado la da <summary> nativo
    <ul role="tree" aria-label={ariaLabel} className="flex flex-col gap-0.5">
      <title>{ariaLabel}</title>
      {items.map((item) => (
        <TreeNode key={item.label} item={item} open={defaultOpen} />
      ))}
    </ul>
  );
}

function Chevron() {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      aria-hidden="true"
      className="shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
    >
      <path
        d="M 4.5 2.5 L 8 6 L 4.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
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
          {kids.map((kid) => (
            <TreeNode key={kid.label} item={kid} open={open} />
          ))}
        </ul>
      </details>
    </li>
  );
}
