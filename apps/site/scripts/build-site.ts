/**
 * Generador del sitio (SSG sin framework): prerenderiza las 52 demos a HTML
 * estático en `site/out/`. Se ejecuta con `tsx` (devDep de la lib).
 *
 * Uso: pnpm site:build  (= site:css + tsx site/scripts/build-site.ts)
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/postcss";
import postcss from "postcss";
import type { ReactNode } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DEMOS, loadDemo } from "../src/demos/registry";
import { ChartPage, ChartsIndex, Home, Shell } from "../src/pages";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");

function doc(
  title: string,
  description: string,
  rootPrefix: "" | "..",
  body: ReactNode,
): string {
  return `<!DOCTYPE html>${renderToStaticMarkup(
    createElement(Shell, { title, description, root: rootPrefix }, body),
  )}`;
}

async function main(): Promise<void> {
  await mkdir(path.join(out, "charts"), { recursive: true });

  const cssIn = path.join(root, "src", "site.css");
  const css = await postcss([tailwindcss()]).process(
    await readFile(cssIn, "utf8"),
    {
      from: cssIn,
      to: path.join(out, "styles.css"),
    },
  );
  await writeFile(path.join(out, "styles.css"), css.css);

  await writeFile(
    path.join(out, "index.html"),
    doc(
      "klin — gráficas SSR-first",
      "Gráficas SSR-first: d3 para cálculo, SVG puro para render.",
      "",
      createElement(Home),
    ),
  );

  await writeFile(
    path.join(out, "charts", "index.html"),
    doc(
      "Demos — klin",
      "Las 52 demos de klin, renderizadas en el build.",
      "..",
      createElement(ChartsIndex),
    ),
  );

  for (const [i, demo] of DEMOS.entries()) {
    const prev = DEMOS[(i - 1 + DEMOS.length) % DEMOS.length];
    const next = DEMOS[(i + 1) % DEMOS.length];
    const Demo = (await loadDemo(demo.slug)).default;
    await writeFile(
      path.join(out, "charts", `${demo.slug}.html`),
      doc(
        `${demo.title} — klin`,
        demo.description,
        "..",
        createElement(ChartPage, { demo, prev, next }, createElement(Demo)),
      ),
    );
  }

  await copyFile(
    path.join(root, "src", "client.js"),
    path.join(out, "client.js"),
  );
  await writeFile(path.join(out, ".nojekyll"), "");
  console.log(`site: ${DEMOS.length} demos → ${out}`);
}

await main();
