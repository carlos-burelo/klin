/**
 * Páginas del sitio (componentes puros → HTML estático en el build).
 */
import type { ReactNode } from "react";
import { DEMO_COUNT, DEMOS, type DemoEntry } from "./demos/registry";

const THEME_INIT = `try{var t=localStorage.getItem("klin-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

/** Cascarón HTML compartido (`root` = prefijo relativo a la raíz del sitio). */
export function Shell({
  title,
  description,
  root,
  children,
}: {
  title: string;
  description: string;
  root: "" | "..";
  children?: ReactNode;
}) {
  const home = root === "" ? "index.html" : "../index.html";
  const charts = root === "" ? "charts/index.html" : "index.html";
  return (
    <html lang="es" suppressHydrationWarning>
      {/* biome-ignore lint/style/noHeadElement: SSG estático sin Next; <head> manual es correcto aquí */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <title>{title}</title>
        <link rel="stylesheet" href={`${root === "" ? "" : "../"}styles.css`} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: constante local de tema, sin input de usuario */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <nav
              className="flex items-center gap-5 text-sm"
              aria-label="Principal"
            >
              <a href={home} className="text-base font-bold tracking-tight">
                klin
              </a>
              <a
                href={home}
                className="text-muted-foreground hover:text-foreground"
              >
                Inicio
              </a>
              <a
                href={charts}
                className="text-muted-foreground hover:text-foreground"
              >
                Gráficas
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/carlos-burelo/klin"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
              <button
                id="theme-toggle"
                type="button"
                aria-label="Cambiar tema claro/oscuro"
                aria-pressed="false"
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span data-theme-label>Oscuro</span>
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 pb-24">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground">
            <p>klin — © 2026 Carlos Burelo — AGPL-3.0-or-later</p>
            <p>d3 para cálculo · SVG puro para render</p>
          </div>
        </footer>
        <script src={`${root === "" ? "" : "../"}client.js`} defer />
      </body>
    </html>
  );
}

/** Portada. */
export function Home() {
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
            href="charts/index.html"
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

const SECTIONS = ["Gráficas", "Diagramas", "Utilidades"] as const;

/** Índice de demos agrupadas por sección. */
export function ChartsIndex() {
  return (
    <div className="flex flex-col gap-10 pt-10">
      <section className="flex max-w-2xl flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Demos</h1>
        <p className="text-sm text-muted-foreground">
          Renderizadas en el build. Pasa el cursor sobre las formas para ver el
          tooltip nativo.
        </p>
      </section>
      {SECTIONS.map((section) => (
        <section key={section} aria-label={section}>
          <h2 className="pb-3 text-lg font-semibold">{section}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMOS.filter((d) => d.section === section).map((d) => (
              <a
                key={d.slug}
                href={`${d.slug}.html`}
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

/** Página de demo: gráfica viva + fuente y navegación. */
export function ChartPage({
  demo,
  prev,
  next,
  children,
}: {
  demo: DemoEntry;
  prev: DemoEntry | undefined;
  next: DemoEntry | undefined;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 pt-10">
      <nav aria-label="Migas">
        <a
          href="index.html"
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
        {children}
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
              href={`${prev.slug}.html`}
              className="text-muted-foreground hover:text-foreground"
            >
              ← {prev.title}
            </a>
          ) : null}
          {next ? (
            <a
              href={`${next.slug}.html`}
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
