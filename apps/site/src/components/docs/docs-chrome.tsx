import { ArrowLeftIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DocFeedback } from "./doc-feedback";
import { DocsPager } from "./docs-pager";
import { DocsSidebar } from "./docs-sidebar";
import { DocsToc } from "./docs-toc";
import { ReadingProgress } from "./reading-progress";
import { ScrollTop } from "./scroll-top";
import { SidebarScroll } from "./sidebar-scroll";

/** Chrome única de docs: migas + sidebar + TOC + feedback + paginación. */
export function DocsChrome({
  slug,
  badge,
  path,
  crumb,
  title,
  description,
  actions,
  children,
}: {
  slug: string;
  badge: ReactNode;
  path: string;
  crumb: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-10 pt-10 lg:grid-cols-[230px_minmax(0,1fr)_190px]">
      <ScrollTop />
      <ReadingProgress />
      <aside className="hidden lg:block">
        <SidebarScroll>
          <DocsSidebar active={slug} />
        </SidebarScroll>
      </aside>
      <div className="flex min-w-0 flex-col gap-6 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/docs/overview" />}>
                Docs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{crumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <details className="lg:hidden">
          <summary className="inline-flex items-center gap-1.5">
            <ListIcon aria-hidden="true" />
            Índice de docs
          </summary>
          <div className="pt-4">
            <DocsSidebar active={slug} />
          </div>
        </details>
        <section className="flex max-w-2xl flex-col gap-3">
          <p className="flex flex-wrap items-center gap-2">
            <Badge>{badge}</Badge>
            <Badge variant="outline" className="font-mono">
              {path}
            </Badge>
          </p>
          <h1 className="text-4xl font-bold tracking-tighter text-balance">
            {title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {description}
          </p>
          {actions ? (
            <p className="flex flex-wrap items-center gap-2">{actions}</p>
          ) : null}
        </section>
        {children}
        <div className="max-w-3xl">
          <DocFeedback slug={slug} />
        </div>
        <nav aria-label="Volver" className="max-w-3xl">
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={
              <Link href="/docs/overview">
                <ArrowLeftIcon data-icon="inline-start" />
                Todas las docs
              </Link>
            }
            className="text-muted-foreground"
          />
        </nav>
        <div className="max-w-3xl">
          <DocsPager slug={slug} />
        </div>
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <DocsToc />
        </div>
      </aside>
    </div>
  );
}
