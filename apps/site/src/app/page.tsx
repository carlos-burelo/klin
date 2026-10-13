import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChartLineIcon,
  CheckIcon,
  LayoutGridIcon,
  MousePointerClickIcon,
  PackageIcon,
  PaletteIcon,
  ServerIcon,
  SigmaIcon,
  TerminalIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CodeBlock } from "../components/code-block";
import { CopyButton } from "../components/copy-button";
import { CatalogExplorer } from "../components/docs/catalog-explorer";
import BarChartDemo from "../demos/bar-chart";
import DonutChartDemo from "../demos/donut-chart";
import LineChartDemo from "../demos/line-chart";
import RadialProgressDemo from "../demos/radial-progress";
import { DEMO_COUNT, DEMOS } from "../demos/registry";
import SparklineDemo from "../demos/sparkline";

const STATS = [
  { icon: LayoutGridIcon, value: `${DEMO_COUNT}`, label: "demos vivas" },
  { icon: ServerIcon, value: "100%", label: "HTML estático" },
  { icon: ZapIcon, value: "0 JS", label: "para ver cada gráfica" },
] as const;

const TRUST = [
  "SSR-first real",
  "A11y con role=img",
  "Tema por tokens",
  "Tooltip opcional",
] as const;

const LIVE_WIDE = [
  { slug: "bar-chart", caption: "bar-chart · series agrupadas" },
  { slug: "donut-chart", caption: "donut-chart · total al centro" },
] as const;

const LIVE_SMALL = [
  { slug: "radial-progress", caption: "radial-progress · anillo 0–100" },
  { slug: "sparkline", caption: "sparkline · KPI sin ejes" },
] as const;

const STEPS = [
  {
    icon: PackageIcon,
    title: "Instala",
    body: "Un paquete desde GitHub Packages. Sin plugins, sin CLI.",
  },
  {
    icon: ServerIcon,
    title: "Renderiza",
    body: "El Server Component calcula con d3 y escupe SVG puro.",
  },
  {
    icon: ZapIcon,
    title: "Despliega",
    body: "HTML estático a cualquier hosting. Sin servidor de Node.",
  },
] as const;

const PRINCIPLES = [
  {
    icon: ServerIcon,
    title: "SSR-first",
    body: "props a SVG. Sin JS la gráfica se ve completa.",
  },
  {
    icon: SigmaIcon,
    title: "d3 solo math",
    body: "scales, shapes, layouts. Nada de selección ni medición del DOM.",
  },
  {
    icon: MousePointerClickIcon,
    title: "Tooltip portal",
    body: "Un único cliente: delegación + portal. Sin JS queda <title> nativo.",
  },
  {
    icon: PaletteIcon,
    title: "Tema por tokens",
    body: "var(--chart-1…5). Claro/oscuro automáticos, sin hex.",
  },
] as const;

const COMPARE_ROWS = [
  {
    label: "Render sin JS",
    klin: "SVG completo en HTML",
    otros: "Canvas / hidratación",
  },
  {
    label: "Responsivo",
    klin: "viewBox, 0 listeners",
    otros: "ResizeObserver + estado",
  },
  {
    label: "Tooltip",
    klin: "<title> + portal opcional",
    otros: "Siempre cliente",
  },
  {
    label: "Tema",
    klin: "Tokens CSS, dark gratis",
    otros: "Props de color manual",
  },
  {
    label: "Vacío / error",
    klin: "ChartEmpty homogéneo",
    otros: "Cada quien improvisa",
  },
] as const;

const FAQS = [
  {
    q: "¿Necesito JavaScript para ver las gráficas?",
    a: "No. El HTML llega con el SVG ya renderizado. El único JS opcional es el portal de tooltip rico; sin él queda el <title> nativo.",
  },
  {
    q: "¿Cómo se ve en móvil?",
    a: "Todo es SVG con viewBox: escala sin listeners ni medición del DOM. Los <title> cubren táctil sin JS.",
  },
  {
    q: "¿Pesa la librería?",
    a: "Tu bundler solo incluye lo que importas (source-first con transpilePackages). El site con 74 demos exporta a HTML estático.",
  },
  {
    q: "¿Y la accesibilidad?",
    a: "role=img + ariaLabel obligatoria, <title> por forma, vacíos homogéneos y formato es-MX por defecto.",
  },
  {
    q: "¿Dónde empiezo?",
    a: "Bar Chart cubre el 80% de dashboards. Lee la guía SSR-first una vez y luego copia el ejemplo mínimo de cada doc.",
  },
] as const;

const NPM_INSTALL = `pnpm add @carlos-burelo/klin`;

function LiveCard({
  slug,
  caption,
  children,
}: {
  slug: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="group gap-0 py-0 transition-all hover:-translate-y-0.5 hover:ring-ring hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center gap-1.5 py-3">
        <ChartLineIcon
          aria-hidden="true"
          className="size-3 text-muted-foreground"
        />
        <Button
          nativeButton={false}
          variant="link"
          size="sm"
          render={<Link href={`/docs/${slug}`} />}
          className="h-auto p-0 font-mono text-[11px] text-muted-foreground"
        >
          {caption}
        </Button>
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        />
      </CardHeader>
      <CardContent className="pb-4 sm:pb-5">{children}</CardContent>
    </Card>
  );
}

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "klin",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Gráficas SSR-first: d3 para cálculo, SVG puro para render. 74 demos vivas.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/** Portada del proyecto. */
export default function HomePage() {
  return (
    <div className="relative flex flex-col gap-24 pt-16 sm:pt-24">
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      {/* Fondo: retícula + halos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-x-0 top-0 mx-auto h-140 max-w-4xl opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 right-1/4 h-72 w-72 rounded-full bg-accent blur-3xl" />
      </div>

      {/* Héroe */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex max-w-xl flex-col gap-7">
          <Badge variant="secondary" className="w-fit font-mono shadow-sm">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
            />
            @carlos-burelo/klin · v1 · SSR-first
          </Badge>
          <h1 className="text-5xl font-bold tracking-tighter text-balance sm:text-7xl">
            Gráficas que llegan{" "}
            <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              ya renderizadas
            </span>
            .
          </h1>
          <p className="max-w-lg text-lg leading-8 text-muted-foreground text-balance">
            <strong className="font-semibold text-foreground">
              d3 para cálculo, SVG puro para render.
            </strong>{" "}
            Cada gráfica es un Server Component: función pura de props a SVG.
            Sin JS la gráfica se ve completa.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              nativeButton={false}
              size="lg"
              render={
                <Link href="/docs">
                  Explorar las {DEMO_COUNT} demos
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              }
              className="shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            />
            <Button
              nativeButton={false}
              size="lg"
              variant="outline"
              render={<Link href="https://github.com/carlos-burelo/klin" />}
            >
              Código fuente
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
          </div>
          <Card className="gap-0 bg-card/80 py-0 backdrop-blur">
            <CardContent className="flex flex-wrap items-center gap-2 p-3">
              <code className="flex-1 truncate px-2 font-mono text-xs">
                {NPM_INSTALL}
              </code>
              <CopyButton text={NPM_INSTALL} size="xs" />
              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                render={<Link href="/guias/ssr-first" />}
                className="h-auto"
              >
                Por qué SSR →
              </Button>
            </CardContent>
          </Card>
          <ul aria-label="Garantías" className="flex flex-wrap gap-1.5">
            {TRUST.map((t) => (
              <li key={t}>
                <Badge variant="secondary">
                  <CheckIcon className="text-primary" />
                  {t}
                </Badge>
              </li>
            ))}
          </ul>
          <Card className="gap-0 bg-card/80 py-0 backdrop-blur">
            <CardContent className="grid grid-cols-3 px-0">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col gap-1 px-5 py-4 ${i > 0 ? "border-l border-border" : ""}`}
                >
                  <p className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight">
                    <s.icon
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Demo viva: esto es HTML prerenderizado, no una imagen */}
        <figure className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent blur-2xl"
          />
          <Card className="gap-0 py-0 shadow-2xl shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardDescription className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                <ChartLineIcon aria-hidden="true" className="size-3" />
                line-chart · SSR en vivo
              </CardDescription>
              <Button
                nativeButton={false}
                variant="link"
                size="sm"
                render={<Link href="/docs/line-chart" />}
                className="h-auto p-0 text-[11px]"
              >
                Ver doc
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </CardHeader>
            <CardContent className="pb-4 sm:pb-6">
              <LineChartDemo />
            </CardContent>
          </Card>
        </figure>
      </section>

      {/* En vivo */}
      <section aria-label="Demos en vivo">
        <div className="flex flex-wrap items-end justify-between gap-3 pb-6">
          <div>
            <p className="pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
              En vivo
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Nada de mockups
            </h2>
            <p className="pt-1 text-sm text-muted-foreground">
              Todo lo que ves aquí es el componente real, renderizado en el
              servidor.
            </p>
          </div>
          <Button
            nativeButton={false}
            variant="link"
            render={<Link href="/docs" />}
            className="h-auto p-0"
          >
            Ver las {DEMO_COUNT}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <LiveCard
            slug={LIVE_WIDE[0]?.slug ?? ""}
            caption={LIVE_WIDE[0]?.caption ?? ""}
          >
            <BarChartDemo />
          </LiveCard>
          <LiveCard
            slug={LIVE_WIDE[1]?.slug ?? ""}
            caption={LIVE_WIDE[1]?.caption ?? ""}
          >
            <DonutChartDemo />
          </LiveCard>
          <LiveCard
            slug={LIVE_SMALL[0]?.slug ?? ""}
            caption={LIVE_SMALL[0]?.caption ?? ""}
          >
            <RadialProgressDemo />
          </LiveCard>
          <LiveCard
            slug={LIVE_SMALL[1]?.slug ?? ""}
            caption={LIVE_SMALL[1]?.caption ?? ""}
          >
            <SparklineDemo />
          </LiveCard>
        </div>
      </section>

      {/* Comparativa */}
      <section aria-label="Comparativa">
        <p className="pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
          Comparativa
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Lo que dejas de hacer
        </h2>
        <p className="pt-1 pb-6 text-sm text-muted-foreground">
          klin vs. charting cliente clásico (recharts, nivo, victory).
        </p>
        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead className="bg-accent/60 font-bold text-accent-foreground">
                    klin
                  </TableHead>
                  <TableHead>Cliente clásico</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPARE_ROWS.map((r) => (
                  <TableRow key={r.label}>
                    <TableCell className="font-semibold whitespace-normal">
                      {r.label}
                    </TableCell>
                    <TableCell className="bg-accent/30 whitespace-normal">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckIcon
                          aria-hidden="true"
                          className="size-3.5 shrink-0 text-primary"
                        />
                        {r.klin}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {r.otros}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Cómo funciona */}
      <section aria-label="Cómo funciona">
        <p className="pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
          Cómo funciona
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          De props a píxeles en tres pasos
        </h2>
        <p className="pt-1 pb-6 text-sm text-muted-foreground">
          Sin ResponsiveContainer, sin medición del DOM, sin estado.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Card key={s.title} className="relative overflow-hidden">
              <span
                aria-hidden="true"
                className="absolute -top-1 right-4 font-mono text-6xl font-bold text-border/60"
              >
                {i + 1}
              </span>
              <CardHeader>
                <span className="mb-4 inline-flex w-fit rounded-lg bg-accent p-2 text-accent-foreground">
                  <s.icon aria-hidden="true" className="size-4" />
                </span>
                <CardTitle className="text-sm">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {s.body}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="pt-3">
          <CodeBlock
            title="page.tsx — Server Component"
            lang="tsx"
            code={`import { BarChart } from "@carlos-burelo/klin";

// Esto escupe <svg>, no <canvas>
<BarChart ariaLabel="Ventas por trimestre" data={data} xKey="t" series={series} />`}
          />
        </div>
      </section>

      {/* Principios */}
      <section aria-label="Principios">
        <p className="pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
          Principios
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Diseñada para el servidor
        </h2>
        <p className="pt-1 pb-6 text-sm text-muted-foreground">
          Cuatro decisiones que eliminan toda la complejidad del charting en el
          cliente.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <Card
              key={p.title}
              className="group transition-all hover:-translate-y-0.5 hover:ring-ring hover:shadow-xl hover:shadow-primary/5"
            >
              <CardHeader>
                <span className="mb-4 inline-flex w-fit rounded-lg bg-accent p-2 text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <p.icon aria-hidden="true" className="size-4" />
                </span>
                <CardTitle className="text-sm">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {p.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Instalación */}
      <section aria-label="Instalación">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="inline-flex items-center gap-2 pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
              <TerminalIcon aria-hidden="true" className="size-3.5" />
              Instalación
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Dos pasos y listo
            </h2>
            <p className="pt-1 text-sm leading-6 text-muted-foreground">
              La lib se consume como TypeScript fuente: tu bundler solo incluye
              lo que importas. Nada de apps ni demos en el bundle.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CodeBlock
              title="Terminal"
              lang="bash"
              code={`# .npmrc (GitHub Packages)
@carlos-burelo:registry=https://npm.pkg.github.com/

pnpm add @carlos-burelo/klin`}
            />
            <CodeBlock
              title="next.config.ts"
              lang="tsx"
              code={`// next.config.ts
transpilePackages: ["@carlos-burelo/klin"];`}
            />
          </div>
        </div>
      </section>

      {/* Catálogo filtrable */}
      <section aria-label="Catálogo">
        <p className="pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
          Catálogo
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {DEMO_COUNT} componentes, cero JS para verlos
        </h2>
        <p className="pt-1 pb-6 text-sm text-muted-foreground">
          Filtra y abre la doc viva. Cada una con ejemplo mínimo, variantes,
          props y accesibilidad.
        </p>
        <CatalogExplorer compact />
        <p className="sr-only">{DEMOS.map((d) => d.title).join(", ")}</p>
      </section>

      {/* FAQ */}
      <section aria-label="Preguntas frecuentes">
        <p className="pb-1 font-mono text-[11px] uppercase tracking-widest text-primary">
          FAQ
        </p>
        <h2 className="pb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Preguntas que sí hacen
        </h2>
        <Accordion className="grid items-start gap-3 md:grid-cols-2">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="rounded-2xl border border-border bg-card px-5 not-last:border-b-0"
            >
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Cierre */}
      <section aria-label="Empezar">
        <Card className="relative items-center overflow-hidden border-primary/20 bg-gradient-to-b from-accent to-card p-10 text-center sm:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 max-w-lg bg-primary/20 blur-3xl"
          />
          <p className="relative pb-2 font-mono text-[11px] uppercase tracking-widest text-primary">
            Empieza ahora
          </p>
          <h2 className="relative mx-auto max-w-lg text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Tu primera gráfica en cinco minutos
          </h2>
          <p className="relative mx-auto max-w-md pt-3 text-sm leading-6 text-muted-foreground">
            Copia una demo, cambia los datos, despliega HTML estático. Sin
            cuenta, sin build raro, sin cliente pesado.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-3 pt-8">
            <Button
              nativeButton={false}
              size="lg"
              render={
                <Link href="/docs">
                  Ir a la documentación
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              }
              className="shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02]"
            />
            <Button
              nativeButton={false}
              size="lg"
              variant="outline"
              render={<Link href="/guias/ssr-first" />}
            >
              Leer guía SSR-first
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
