import { ArrowLeftIcon, ArrowRightIcon, LightbulbIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "../../../components/code-block";
import { DocsToc } from "../../../components/docs/docs-toc";
import { ReadingProgress } from "../../../components/docs/reading-progress";
import { ScrollTop } from "../../../components/docs/scroll-top";
import { GUIDES, getGuide } from "../../../guias/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return { title: `${g.title} — klin`, description: g.description };
}

/** Página de guía conceptual (misma chrome que docs: TOC + progreso). */
export default async function GuiaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const gi = GUIDES.findIndex((g) => g.slug === slug);
  const gprev = GUIDES[(gi - 1 + GUIDES.length) % GUIDES.length];
  const gnext = GUIDES[(gi + 1) % GUIDES.length];

  return (
    <div className="grid gap-10 pt-10 lg:grid-cols-[220px_minmax(0,1fr)_200px]">
      <ScrollTop />
      <ReadingProgress />
      <aside className="hidden lg:block">
        <nav aria-label="Guías" className="sticky top-20 flex flex-col gap-1">
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={
              <Link href="/guias">
                <ArrowLeftIcon data-icon="inline-start" />
                Todas las guías
              </Link>
            }
            className="mb-2 self-start text-muted-foreground"
          />
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guias/${g.slug}`}
              aria-current={g.slug === slug ? "page" : undefined}
              className={
                g.slug === slug
                  ? "block rounded-lg bg-accent px-2.5 py-1.5 text-[13px] font-medium text-accent-foreground"
                  : "block rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            >
              {g.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-col gap-6">
        <nav aria-label="Migas">
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={
              <Link href="/guias">
                <ArrowLeftIcon data-icon="inline-start" />
                Guías
              </Link>
            }
            className="text-muted-foreground"
          />
        </nav>
        <section className="flex max-w-2xl flex-col gap-3">
          <Badge className="w-fit">Guía</Badge>
          <h1 className="text-4xl font-bold tracking-tighter text-balance">
            {guide.title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {guide.description}
          </p>
        </section>
        <article className="flex min-w-0 max-w-3xl flex-col gap-4">
          {guide.sections.map((s) => (
            <section key={s.heading}>
              <h2
                id={s.heading
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9]+/g, "-")}
                className="mt-10 scroll-mt-24 border-b border-border pb-2 text-xl font-semibold tracking-tight"
              >
                {s.heading}
              </h2>
              <div className="flex flex-col gap-3 pt-3">
                {s.body.map((p) => (
                  <p
                    key={p.slice(0, 32)}
                    className="text-sm leading-7 text-muted-foreground"
                  >
                    {p}
                  </p>
                ))}
              </div>
              {s.code ? (
                <div className="pt-4">
                  <CodeBlock
                    title={s.code.title}
                    lang={s.code.lang}
                    code={s.code.code}
                  />
                </div>
              ) : null}
              {s.tip ? (
                <div className="pt-4">
                  <Alert>
                    <LightbulbIcon />
                    <AlertTitle>Consejo</AlertTitle>
                    <AlertDescription>{s.tip}</AlertDescription>
                  </Alert>
                </div>
              ) : null}
            </section>
          ))}
        </article>
        {gprev && gnext ? (
          <nav aria-label="Paginación" className="flex flex-col gap-3">
            <Separator />
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <Link
                href={`/guias/${gprev.slug}`}
                className="group"
                aria-label={`Anterior: ${gprev.title}`}
              >
                <Card className="transition-colors group-hover:ring-ring">
                  <CardHeader>
                    <CardDescription className="inline-flex items-center gap-1.5">
                      <ArrowLeftIcon aria-hidden="true" className="size-3.5" />
                      Anterior
                    </CardDescription>
                    <CardTitle className="text-sm group-hover:underline">
                      {gprev.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
              <Link
                href={`/guias/${gnext.slug}`}
                className="group text-right"
                aria-label={`Siguiente: ${gnext.title}`}
              >
                <Card className="transition-colors group-hover:ring-ring">
                  <CardHeader>
                    <CardDescription className="inline-flex items-center justify-end gap-1.5">
                      Siguiente
                      <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                    </CardDescription>
                    <CardTitle className="text-sm group-hover:underline">
                      {gnext.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </nav>
        ) : null}
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <DocsToc />
        </div>
      </aside>
    </div>
  );
}
