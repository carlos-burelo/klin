import { notFound } from "next/navigation";
import { DEMOS, getDemo, loadDemo } from "../../../demos/registry";

export function generateStaticParams() {
  return DEMOS.map((d) => ({ slug: d.slug }));
}

/** Página de demo: gráfica viva + fuente y navegación. */
export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const demo = getDemo(slug);
  if (!demo) notFound();
  const index = DEMOS.findIndex((d) => d.slug === slug);
  const prev = DEMOS[(index - 1 + DEMOS.length) % DEMOS.length];
  const next = DEMOS[(index + 1) % DEMOS.length];
  const Demo = (await loadDemo(slug)).default;

  return (
    <div className="flex flex-col gap-6 pt-10">
      <nav aria-label="Migas">
        <a
          href="/charts"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          ← Todas las demos
        </a>
      </nav>
      <section className="flex max-w-2xl flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{demo.title}</h1>
        <p className="text-sm text-muted-foreground">{demo.description}</p>
      </section>
      <section
        aria-label={`Demo de ${demo.title}`}
        className="rounded-xl border border-border bg-card p-4 sm:p-6"
      >
        <Demo />
      </section>
      <section
        aria-label="Fuente y navegación"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <a
          href={demo.source}
          className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Ver fuente en GitHub
        </a>
        <div className="flex items-center gap-4 text-sm">
          {prev ? (
            <a
              href={`/charts/${prev.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              ← {prev.title}
            </a>
          ) : null}
          {next ? (
            <a
              href={`/charts/${next.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {next.title} →
            </a>
          ) : null}
        </div>
      </section>
    </div>
  );
}
