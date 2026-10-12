import { DEMOS, type DemoSection } from "../../demos/registry";

const ORDER: DemoSection[] = ["Gráficas", "Diagramas", "Utilidades"];

/** Índice de demos agrupadas por sección. */
export default function ChartsPage() {
  return (
    <div className="flex flex-col gap-10 pt-10">
      <section className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Demos</h1>
        <p className="text-sm text-muted-foreground">
          Renderizadas en el servidor. Pasa el cursor (o el foco) sobre las
          formas para ver el tooltip.
        </p>
      </section>
      {ORDER.map((section) => (
        <section key={section} aria-label={section}>
          <h2 className="pb-3 text-lg font-semibold">{section}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMOS.filter((d) => d.section === section).map((d) => (
              <a
                key={d.slug}
                href={`/charts/${d.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-ring"
              >
                <h3 className="pb-1 text-sm font-semibold group-hover:underline">
                  {d.title}
                </h3>
                <p className="text-sm text-muted-foreground">{d.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
