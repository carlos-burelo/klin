import { ArrowRightIcon, BookOpenIcon, PackageIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "../../../components/code-block";
import { DocsChrome } from "../../../components/docs/docs-chrome";
import BarChartDemo from "../../../demos/bar-chart";
import DonutChartDemo from "../../../demos/donut-chart";
import { DEMO_COUNT, FEATURED_SLUGS, getDemo } from "../../../demos/registry";
import SankeyDiagramDemo from "../../../demos/sankey-diagram";
import { GUIDES } from "../../../guias/guides";

export const metadata: Metadata = {
  title: "Documentación — klin",
  description:
    "Demos renderizadas en el servidor con guía de uso, props y accesibilidad.",
};

/** Destacados del overview (copys del registry, demos vivas aparte). */
const FEATURED = FEATURED_SLUGS.map((slug) => {
  const demo = getDemo(slug);
  if (!demo) throw new Error(`overview: slug destacado sin demo: ${slug}`);
  return demo;
});

/** Resumen de documentación con ejemplos rápidos, en chrome docs. */
export default function OverviewPage() {
  return (
    <DocsChrome
      slug="overview"
      badge={
        <span className="inline-flex items-center gap-1.5">
          <BookOpenIcon aria-hidden="true" className="size-3.5" />
          Documentación · {DEMO_COUNT} páginas + {GUIDES.length} conceptos
        </span>
      }
      path="docs/overview"
      crumb="Resumen"
      title="Aprende klin con ejemplos reales y vivos."
      description="Cada página trae demo renderizada en el servidor, guía de uso, tabla de props y notas de accesibilidad. Busca con ⌘K desde cualquier página."
    >
      <article className="flex min-w-0 max-w-3xl flex-col gap-10">
        <div>
          <h2 id="arranque-rapido" className="sr-only scroll-mt-24">
            Arranque rápido
          </h2>
          <div className="grid gap-3 lg:grid-cols-2">
            <CodeBlock
              title="1 · Instala — Terminal"
              lang="bash"
              code={`pnpm add @carlos-burelo/klin`}
            />
            <div className="flex flex-col gap-3">
              <CodeBlock
                title="2 · Renderiza — page.tsx"
                lang="tsx"
                code={`<BarChart ariaLabel="Ventas"
  data={data} xKey="t" series={series} />`}
              />
              <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <PackageIcon
                  aria-hidden="true"
                  className="size-3.5 text-primary"
                />
                Detalle completo en
                <Button
                  nativeButton={false}
                  variant="link"
                  size="sm"
                  render={<Link href="/docs/bar-chart" />}
                  className="h-auto p-0"
                >
                  la doc de Barras
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </p>
            </div>
          </div>
        </div>

        <section aria-label="Conceptos">
          <h2
            id="conceptos"
            className="scroll-mt-24 pb-1 text-xl font-bold tracking-tight"
          >
            Lee los conceptos una vez
          </h2>
          <p className="pb-6 text-sm text-muted-foreground">
            Todo lo que las 74 páginas asumen: SSR, tema, tooltip y
            accesibilidad.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <Link key={g.slug} href={`/docs/${g.slug}`} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:ring-ring group-hover:shadow-xl group-hover:shadow-primary/5">
                  <CardHeader>
                    <CardDescription className="font-mono text-[11px]">
                      /docs/{g.slug}
                    </CardDescription>
                    <CardTitle className="text-sm group-hover:underline">
                      {g.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <p className="line-clamp-2 text-[13px] leading-6 text-muted-foreground">
                      {g.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                      Leer
                      <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section aria-label="Destacados">
          <h2
            id="destacados"
            className="scroll-mt-24 pb-1 text-xl font-bold tracking-tight"
          >
            Tres para empezar
          </h2>
          <p className="pb-6 text-sm text-muted-foreground">
            Los componentes que cubren el 80% de los dashboards. Vivos, como
            todo lo demás.
          </p>
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="grid items-center gap-6 sm:p-7 md:grid-cols-2">
                <BarChartDemo />
                <div className="flex flex-col items-start gap-2">
                  <CardDescription className="font-mono text-[11px]">
                    /docs/bar-chart
                  </CardDescription>
                  <h3 className="text-lg font-bold tracking-tight">
                    {FEATURED[0]?.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {FEATURED[0]?.description}
                  </p>
                  <Button
                    nativeButton={false}
                    render={<Link href={`/docs/${FEATURED[0]?.slug}`} />}
                    className="transition-transform hover:scale-[1.02]"
                  >
                    Ver doc completa
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="transition-colors hover:ring-ring">
                <CardContent className="sm:p-6">
                  <DonutChartDemo />
                  <CardDescription className="pt-4 font-mono text-[11px]">
                    /docs/donut-chart
                  </CardDescription>
                  <h3 className="pt-1 text-base font-bold tracking-tight">
                    {FEATURED[1]?.title}
                  </h3>
                  <p className="pt-1 text-sm leading-6 text-muted-foreground">
                    {FEATURED[1]?.description}
                  </p>
                  <Button
                    nativeButton={false}
                    variant="link"
                    render={<Link href={`/docs/${FEATURED[1]?.slug}`} />}
                    className="h-auto p-0 pt-2"
                  >
                    Ver doc
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="transition-colors hover:ring-ring">
                <CardContent className="sm:p-6">
                  <SankeyDiagramDemo />
                  <CardDescription className="pt-4 font-mono text-[11px]">
                    /docs/sankey-diagram
                  </CardDescription>
                  <h3 className="pt-1 text-base font-bold tracking-tight">
                    {FEATURED[2]?.title}
                  </h3>
                  <p className="pt-1 text-sm leading-6 text-muted-foreground">
                    {FEATURED[2]?.description}
                  </p>
                  <Button
                    nativeButton={false}
                    variant="link"
                    render={<Link href={`/docs/${FEATURED[2]?.slug}`} />}
                    className="h-auto p-0 pt-2"
                  >
                    Ver doc
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Card className="items-center p-8 text-center sm:p-10">
          <h2
            id="empezar"
            className="mx-auto max-w-md scroll-mt-24 text-2xl font-bold tracking-tight text-balance"
          >
            Elige un chart y copia el ejemplo mínimo
          </h2>
          <p className="mx-auto max-w-md pt-2 text-sm text-muted-foreground">
            Todas las páginas traen ejemplo mínimo, variantes de tamaño, props y
            accesibilidad.
          </p>
        </Card>
      </article>
    </DocsChrome>
  );
}
