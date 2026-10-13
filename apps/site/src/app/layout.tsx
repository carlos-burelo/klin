import { ArrowUpRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DocsSearch } from "../components/docs/docs-search";
import { ThemeToggle } from "../components/theme-toggle";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = "https://carlos-burelo.github.io/klin";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "klin — gráficas SSR-first",
    template: "%s — klin",
  },
  description:
    "Gráficas SSR-first: d3 para cálculo, SVG puro para render. 80 demos vivas, 0 JS para ver cada gráfica, accesibles y temáticas por tokens.",
  keywords: [
    "charts",
    "svg",
    "ssr",
    "react",
    "server components",
    "d3",
    "diagramas",
    "graficas",
    "data-viz",
  ],
  authors: [{ name: "Carlos Burelo" }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
    siteName: "klin",
    title: "klin — gráficas SSR-first",
    description:
      "d3 para cálculo, SVG puro para render. 80 demos vivas renderizadas en el servidor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "klin — gráficas SSR-first",
    description:
      "Cada gráfica es un Server Component: función pura de props a SVG.",
  },
  robots: { index: true, follow: true },
};

const THEME_INIT = `try{var t=localStorage.getItem("klin-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

const FOOT_COLS: Array<{
  title: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
}> = [
  {
    title: "Docs",
    links: [
      { href: "/docs/overview", label: "Índice" },
      { href: "/docs/bar-chart", label: "Bar Chart" },
      { href: "/docs/line-chart", label: "Line Chart" },
      { href: "/docs/sankey-diagram", label: "Sankey" },
    ],
  },
  {
    title: "Conceptos",
    links: [
      { href: "/docs/ssr-first", label: "SSR-first" },
      { href: "/docs/tema", label: "Tema por tokens" },
      { href: "/docs/tooltip", label: "Tooltip portal" },
      { href: "/docs/accesibilidad", label: "Accesibilidad" },
    ],
  },
  {
    title: "Proyecto",
    links: [
      {
        href: "https://github.com/carlos-burelo/klin",
        label: "GitHub",
        external: true,
      },
      {
        href: "https://github.com/carlos-burelo/klin/issues",
        label: "Issues",
        external: true,
      },
      {
        href: "https://github.com/carlos-burelo/klin/blob/main/packages/klin/README.md",
        label: "README lib",
        external: true,
      },
    ],
  },
];

/** Layout del sitio (cabecera, contenido, pie). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: constante local de tema, sin input de usuario */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Link
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Saltar al contenido
        </Link>
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <nav
              className="flex items-center gap-5 text-sm"
              aria-label="Principal"
            >
              <Link href="/" className="text-base font-bold tracking-tight">
                klin
              </Link>
              <Link
                href="/docs/overview"
                className="text-muted-foreground hover:text-foreground"
              >
                Docs
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <DocsSearch />
              <Button
                nativeButton={false}
                variant="ghost"
                size="sm"
                render={<Link href="https://github.com/carlos-burelo/klin" />}
                className="hidden text-muted-foreground sm:inline-flex"
              >
                GitHub
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main id="contenido" className="mx-auto w-full max-w-6xl px-4 pb-24">
          {children}
        </main>
        <Separator />
        <footer>
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1.2fr_repeat(3,1fr)]">
            <div className="flex max-w-xs flex-col gap-2">
              <p className="text-base font-bold tracking-tight">klin</p>
              <p className="text-xs leading-6 text-muted-foreground">
                Gráficas SSR-first: d3 para cálculo, SVG puro para render. Sin
                ResponsiveContainer, sin medición del DOM.
              </p>
              <p className="pt-1 font-mono text-[11px] text-muted-foreground">
                © 2026 Carlos Burelo · AGPL-3.0-or-later
              </p>
            </div>
            {FOOT_COLS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {col.links.map((l) =>
                    l.external ? (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className={cn(
                            buttonVariants({ variant: "link", size: "sm" }),
                            "h-auto p-0 text-[13px] text-muted-foreground",
                          )}
                        >
                          {l.label}
                          <ArrowUpRightIcon data-icon="inline-end" />
                        </Link>
                      </li>
                    ) : (
                      <li key={l.label}>
                        <Button
                          nativeButton={false}
                          variant="link"
                          size="sm"
                          render={<Link href={l.href} />}
                          className="h-auto p-0 text-[13px] text-muted-foreground"
                        >
                          {l.label}
                        </Button>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </footer>
      </body>
    </html>
  );
}
