import { DEMO_COUNT } from "../demos/registry";

/** Portada del proyecto. */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pt-14">
      <section className="flex max-w-2xl flex-col gap-5">
        <p className="w-fit rounded-full border border-border bg-muted px-3 py-1 font-mono text-[11px] text-muted-foreground">
          @carlos-burelo/klin · v1
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-balance">
          Gráficas SSR-first
        </h1>
        <p className="text-base text-muted-foreground text-balance">
          <strong className="font-semibold text-foreground">
            d3 para cálculo, SVG puro para render.
          </strong>{" "}
          Cada gráfica es un Server Component: función pura de props a SVG. El
          HTML llega renderizado; sin JS la gráfica se ve completa.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/charts"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Ver las {DEMO_COUNT} demos
          </a>
          <a
            href="https://github.com/carlos-burelo/klin"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Código fuente
          </a>
        </div>
      </section>

      <section aria-label="Instalación">
        <h2 className="pb-3 text-lg font-semibold">Instalación</h2>
        <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed">
          {`# .npmrc (GitHub Packages)
@carlos-burelo:registry=https://npm.pkg.github.com/

pnpm add @carlos-burelo/klin`}
        </pre>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed">
          {`// next.config.ts
transpilePackages: ["@carlos-burelo/klin"];`}
        </pre>
      </section>

      <section aria-label="Principios">
        <h2 className="pb-3 text-lg font-semibold">Principios</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["SSR-first", "props → SVG. Sin JS la gráfica se ve completa."],
            [
              "d3 solo math",
              "scales, shapes, layouts. Nada de selección ni medición del DOM.",
            ],
            [
              "Tooltip portal",
              "Un único cliente: delegación + portal. Sin JS queda <title> nativo.",
            ],
            [
              "Tema por tokens",
              "var(--chart-1…5). Claro/oscuro automáticos, sin hex.",
            ],
          ].map(([title, body]) => (
            <article
              key={title}
              className="rounded-xl border border-border bg-card p-4"
            >
              <h3 className="pb-1 text-sm font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
