import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  ListIcon,
  PenLineIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { DocFeedback } from "../../../components/docs/doc-feedback";
import { DocsPager } from "../../../components/docs/docs-pager";
import { DocsSidebar } from "../../../components/docs/docs-sidebar";
import { DocsToc } from "../../../components/docs/docs-toc";
import { ReadingProgress } from "../../../components/docs/reading-progress";
import { ScrollTop } from "../../../components/docs/scroll-top";
import { SidebarScroll } from "../../../components/docs/sidebar-scroll";
import { loadDoc } from "../../../content/load-doc";
import { DEMOS, getDemo } from "../../../demos/registry";

const SITE_URL = "https://carlos-burelo.github.io/klin";

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) return {};
  return {
    title: `${demo.title} — klin`,
    description: demo.description,
    openGraph: {
      title: `${demo.title} — klin`,
      description: demo.description,
      url: `${SITE_URL}/docs/${slug}`,
    },
  };
}

/** Página de documentación: sidebar + MDX + TOC, con migas y feedback. */
export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();
  const Doc = (await loadDoc(slug)).default;

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
              <BreadcrumbLink render={<Link href="/" />}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/docs" />}>
                Docs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{demo.title}</BreadcrumbPage>
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
            <Badge>{demo.section}</Badge>
            <Badge variant="outline" className="font-mono">
              docs/{slug}
            </Badge>
          </p>
          <h1 className="text-4xl font-bold tracking-tighter text-balance">
            {demo.title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {demo.description}
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <Button
              nativeButton={false}
              variant="link"
              size="sm"
              render={<Link href={demo.source} />}
              className="h-auto p-0"
            >
              Ver fuente en GitHub
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
            <Button
              nativeButton={false}
              variant="link"
              size="sm"
              render={
                <Link
                  href={`https://github.com/carlos-burelo/klin/blob/main/apps/site/src/content/docs/${slug}.mdx`}
                />
              }
              className="h-auto p-0"
            >
              <PenLineIcon data-icon="inline-start" />
              Editar esta página
            </Button>
          </p>
        </section>
        <article className="flex min-w-0 max-w-3xl flex-col gap-4">
          <Doc />
        </article>
        <div className="max-w-3xl">
          <DocFeedback slug={slug} />
        </div>
        <nav aria-label="Volver" className="max-w-3xl">
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={
              <Link href="/docs">
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
