import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeToggle } from "../components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "klin — gráficas SSR-first",
  description:
    "Gráficas SSR-first: d3 para cálculo, SVG puro para render. Sin ResponsiveContainer, sin medición del DOM.",
};

const THEME_INIT = `try{var t=localStorage.getItem("klin-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

/** Layout del sitio (cabecera, contenido, pie). */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
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
              <a href="/" className="text-base font-bold tracking-tight">
                klin
              </a>
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground"
              >
                Inicio
              </a>
              <a
                href="/charts"
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
              <ThemeToggle />
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
      </body>
    </html>
  );
}
