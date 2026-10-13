import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { AnchorHTMLAttributes, ComponentProps } from "react";
import {
  Table as ShTable,
  TableBody as ShTableBody,
  TableCell as ShTableCell,
  TableHead as ShTableHead,
  TableHeader as ShTableHeader,
  TableRow as ShTableRow,
} from "./src/components/ui/table";

function H2({ children, id, ...rest }: ComponentProps<"h2">) {
  return (
    <h2
      id={id}
      className="group mt-10 scroll-mt-24 border-b border-border pb-2 text-xl font-semibold tracking-tight"
      {...rest}
    >
      {children}
      {id ? (
        <Link
          href={`#${id}`}
          aria-label="Enlace a esta sección"
          className="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
        >
          #
        </Link>
      ) : null}
    </h2>
  );
}

function H3(props: ComponentProps<"h3">) {
  return (
    <h3
      className="mt-8 scroll-mt-24 text-base font-semibold tracking-tight"
      {...props}
    />
  );
}

function P(props: ComponentProps<"p">) {
  return (
    <p
      className="text-sm leading-7 text-muted-foreground [&>strong]:text-foreground"
      {...props}
    />
  );
}

function A(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href, ...rest } = props;
  return (
    <Link
      href={href ?? "#"}
      className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-ring"
      {...rest}
    />
  );
}

function Ul(props: ComponentProps<"ul">) {
  return (
    <ul
      className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-7 text-muted-foreground"
      {...props}
    />
  );
}

function Ol(props: ComponentProps<"ol">) {
  return (
    <ol
      className="flex list-decimal flex-col gap-1.5 pl-5 text-sm leading-7 text-muted-foreground"
      {...props}
    />
  );
}

function Code(props: ComponentProps<"code">) {
  return (
    <code
      className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground"
      {...props}
    />
  );
}

function Pre({ children, className, ...rest }: ComponentProps<"pre">) {
  return (
    <pre
      className={`overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-foreground ${className ?? ""}`}
      {...rest}
    >
      {children}
    </pre>
  );
}

function Table(props: ComponentProps<"table">) {
  return <ShTable {...props} />;
}

function Thead(props: ComponentProps<"thead">) {
  return <ShTableHeader {...props} />;
}

function Tbody(props: ComponentProps<"tbody">) {
  return <ShTableBody {...props} />;
}

function Tr(props: ComponentProps<"tr">) {
  return <ShTableRow {...props} />;
}

function Th(props: ComponentProps<"th">) {
  return <ShTableHead {...props} />;
}

function Td(props: ComponentProps<"td">) {
  return (
    <ShTableCell className="align-top text-[13px] leading-6 whitespace-normal [&>code]:text-[12px]">
      {props.children}
    </ShTableCell>
  );
}

/** Mapeo MDX → estilos docs minimalistas (server-safe). */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: H2,
    h3: H3,
    p: P,
    a: A,
    ul: Ul,
    ol: Ol,
    code: Code,
    pre: Pre,
    table: Table,
    thead: Thead,
    tbody: Tbody,
    tr: Tr,
    th: Th,
    td: Td,
    ...components,
  };
}
