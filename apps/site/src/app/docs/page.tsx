import {
  ArrowRightIcon,
  BookOpenIcon,
  PackageIcon,
  TerminalIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { CodeBlock } from "../../components/code-block";
import { CatalogExplorer } from "../../components/docs/catalog-explorer";
import BarChartDemo from "../../demos/bar-chart";
import DonutChartDemo from "../../demos/donut-chart";
import { DEMOS } from "../../demos/registry";
import SankeyDiagramDemo from "../../demos/sankey-diagram";
import { GUIDES } from "../../guias/guides";

export const metadata: Metadata = {
  title: "Documentación — klin",
  description:
    "Demos renderizadas en el servidor con guía de uso, props y accesibilidad.",
};

const FEATURED = [
  {
    slug: "bar-chart",
    title: "Bar Chart",
    body: "Una o varias series agrupadas, con negativos y línea de cero. El punto de partida de casi todo dashboard.",
  },
  {
    slug: "donut-chart",
    title: "Donut Chart",
    body: "Partes con total al centro y porcentaje del total. Leyenda SSR incluida.",
  },
  {
    slug: "sankey-diagram",
    title: "Sankey Diagram",
    body: "Flujos ponderados entre etapas, calculados en el servidor sin una gota de JS.",
  },
] as const;

/** Overview de documentación: arranque, destacados, guías y catálogo filtrable. */
export default function DocsPage() {
  return (
    <div className="relative flex flex-col gap-16 pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-3xl bg-primary/10 blur-3xl"
      />

      {/* Cabecera */}
      <section className="flex max-w-2xl flex-col gap-4">
        <Badge variant="secondary" className="w-fit font-mono">
          <BookOpenIcon />
          Documentación · {DEMOS.length} páginas + {GUIDES.length} guías
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
          Aprende klin con ejemplos{" "}
          <span className="text-primary">reales y vivos</span>.
        </h1>
        <p className="text-base leading-7 text-muted-foreground text-balance">
          Cada página trae demo renderizada en el servidor, guía de uso, tabla
          de props y notas de accesibilidad. Busca con <Kbd>⌘K</Kbd> desde
          cualquier página.
        </p>
        <nav aria-label="Secciones" className="flex flex-wrap gap-2 pt-1">
          <Button
            nativeButton={false}
            size="sm"
            render={<Link href="#catalogo" />}
          >
            Buscar en catálogo ↓
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={<Link href="/guias" />}
          >
            Leer guías
          </Button>
        </nav>
      </section>

      {/* Arranque rápido */}
      <section
        aria-label="Arranque rápido"
        className="grid gap-3 lg:grid-cols-2"
      >
        <CodeBlock
          title="1 · Instala — Terminal"
          lang="bash"
          code={`# .npmrc (GitHub Packages)
@carlos-burelo:registry=https://npm.pkg.github.com/

pnpm add @carlos-burelo/klin`}
        />
        <div className="flex flex-col gap-3">
          <CodeBlock
            title="2 · Renderiza — page.tsx"
            lang="tsx"
            code={`<BarChart ariaLabel="Ventas"
  data={data} xKey="t" series={series} />`}
          />
          <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <PackageIcon aria-hidden="true" className="size-3.5 text-primary" />
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
      </section>

      {/* Guías */}
      <section aria-label="Guías">
        <h2 className="pb-1 text-xl font-bold tracking-tight">
          Lee los conceptos una vez
        </h2>
        <p className="pb-6 text-sm text-muted-foreground">
          Todo lo que las 74 páginas asumen: SSR, tema, tooltip y accesibilidad.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:ring-ring group-hover:shadow-xl group-hover:shadow-primary/5">
                <CardHeader>
                  <CardDescription className="font-mono text-[11px]">
                    /guias/{g.slug}
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

      {/* Destacados */}
      <section aria-label="Destacados">
        <h2 className="pb-1 text-xl font-bold tracking-tight">
          Tres para empezar
        </h2>
        <p className="pb-6 text-sm text-muted-foreground">
          Los componentes que cubren el 80% de los dashboards. Vivos, como todo
          lo demás.
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
                  {FEATURED[0]?.body}
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
                  {FEATURED[1]?.body}
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
                  {FEATURED[2]?.body}
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

      {/* Catálogo filtrable */}
      <section id="catalogo" aria-label="Catálogo" className="scroll-mt-24">
        <h2 className="pb-1 text-xl font-bold tracking-tight">
          Catálogo completo
        </h2>
        <p className="flex items-center gap-1.5 pb-6 text-sm text-muted-foreground">
          <TerminalIcon aria-hidden="true" className="size-3.5" />
          Filtra por nombre, descripción o sección. Todo lleva a su doc viva.
        </p>
        <CatalogExplorer />
      </section>

      {/* Cierre */}
      <Card className="items-center p-8 text-center sm:p-10">
        <h2 className="mx-auto max-w-md text-2xl font-bold tracking-tight text-balance">
          Elige un chart y copia el ejemplo mínimo
        </h2>
        <p className="mx-auto max-w-md pt-2 text-sm text-muted-foreground">
          Todas las páginas traen ejemplo mínimo, variantes de tamaño, props y
          accesibilidad.
        </p>
      </Card>
    </div>
  );
}
