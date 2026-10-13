import { ArrowUpRightIcon, PenLineIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DocsChrome } from "../../../components/docs/docs-chrome";
import { GuideArticle } from "../../../components/docs/guide-article";
import { loadDoc } from "../../../content/load-doc";
import { DEMOS, getDemo } from "../../../demos/registry";
import { GUIDES, getGuide } from "../../../guias/guides";

const SITE_URL = "https://carlos-burelo.github.io/klin";
const GUIDES_SOURCE =
  "https://github.com/carlos-burelo/klin/blob/main/apps/site/src/guias/guides.ts";

export function generateStaticParams() {
  return [
    ...GUIDES.map((g) => ({ slug: g.slug })),
    ...DEMOS.map((d) => ({ slug: d.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (guide) {
    return {
      title: `${guide.title} — klin`,
      description: guide.description,
      openGraph: {
        title: `${guide.title} — klin`,
        description: guide.description,
        url: `${SITE_URL}/docs/${slug}`,
      },
    };
  }
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

/** Página de documentación: concepto o componente, misma chrome. */
export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const demo = getDemo(slug);
  const doc =
    guide || demo
      ? {
          title: guide?.title ?? demo?.title ?? "",
          description: guide?.description ?? demo?.description ?? "",
          section: guide ? "Concepto" : (demo?.section ?? ""),
          source: demo?.source,
        }
      : notFound();
  const Doc = demo && !guide ? (await loadDoc(slug)).default : null;

  return (
    <DocsChrome
      slug={slug}
      badge={doc.section}
      path={`docs/${slug}`}
      crumb={doc.title}
      title={doc.title}
      description={doc.description}
      actions={
        <>
          {doc.source ? (
            <Button
              nativeButton={false}
              variant="link"
              size="sm"
              render={<Link href={doc.source} />}
              className="h-auto p-0"
            >
              Ver fuente en GitHub
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          ) : null}
          <Button
            nativeButton={false}
            variant="link"
            size="sm"
            render={
              <Link
                href={
                  demo
                    ? `https://github.com/carlos-burelo/klin/blob/main/apps/site/src/content/docs/${slug}.mdx`
                    : GUIDES_SOURCE
                }
              />
            }
            className="h-auto p-0"
          >
            <PenLineIcon data-icon="inline-start" />
            Editar esta página
          </Button>
        </>
      }
    >
      {Doc ? (
        <article className="flex min-w-0 max-w-3xl flex-col gap-4">
          <Doc />
        </article>
      ) : null}
      {guide ? <GuideArticle guide={guide} /> : null}
    </DocsChrome>
  );
}
