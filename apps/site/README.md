# Site de klin (documentación del proyecto)

App Next.js estática con las 74 demos documentadas en MDX, en el mismo repo
que la lib, **sin salir en su bundle**:

- El tarball solo incluye `dist + LICENSE + EXCEPTION + README.md` (`files` en
  `packages/klin/package.json`). Verifica con
  `pnpm --filter @carlos-burelo/klin pack --dry-run`: `apps/` no aparece.
- El bundler del consumidor solo incluye lo que importa de `@carlos-burelo/klin`;
  `apps/site` nunca se importa desde `src/index.ts`.

## Comandos

Desde la raíz (`C:\Users\x\dev\klin`):

- `pnpm site:dev` — Next en `http://localhost:3100/`.
- `pnpm site:build` — export estático a `apps/site/out/` (despliegue directo).

En local (`apps/site`): `pnpm dev|build|start|lint|typecheck|docs:gen`.

## Estructura

- `src/demos/<slug>.tsx` — una demo por componente (default export, SSR pura).
- `src/demos/registry.ts` — slugs, títulos, descripciones y fuente GitHub.
- `src/content/docs/<slug>.mdx` — doc de cada demo: vista previa viva, uso,
  código, tabla de props y accesibilidad. Se regeneran con `pnpm docs:gen`
  (solo faltantes) o `docs:gen:force` (todo, con `PROP_DOCS` canónico para
  descripciones universales en `scripts/gen-docs.mjs`).
- `src/content/load-doc.ts` — importa cada MDX por slug (cada página solo
  empaqueta su doc).
- `src/app/` — portada, índice `/docs` y `docs/[slug]` (estático vía
  `generateStaticParams`; `output: "export"`). Guías en `/guias` y
  `/guias/[slug]` desde `src/guias/guides.ts`. `sitemap.ts` + `robots.ts`
  incluidos.
- `mdx-components.tsx` — mapeo MDX a estilos docs (h2 con ancla `#`,
  tablas, código…).
  Resaltado con `rehype-pretty-code` (shiki, temas github-light/dark) en
  build: cero JS cliente.
- `src/components/ui/` — shadcn canónico (`components.json`, base-ui, lucide).
  Agregar: `pnpm dlx shadcn@latest add <comp>`. Tema klin (verdes + charts)
  vive en `globals.css` sobre estructura shadcn: no duplicar tokens.
- `src/components/docs/` — `DemoBlock`, `DemoExample` + `DemoWrapper`
  (Tabs Preview/Code + copiar), `PropsTable` (Tabla + Badge req/opc),
  `DocsSidebar` (filtro + conteos), `DocsToc` (En esta página),
  `DocsSearch` (CommandDialog Cmd+K global), `CatalogExplorer`
  (InputGroup + ToggleGroup + Badge), `DocsPager` (Card + Separator),
  `ReadingProgress`, `DocFeedback` (Card + voto local). Avisos MDX con
  `Alert` directo (no hay `Callout`: se borró).
  `src/components/copy-button.tsx` + `code-block.tsx` (Card + copiar;
  shiki en build, cero JS).
- Alias `@/*` → `src/*`. Solo `Link` de Next (`<a>` prohibido en `src`,
  incluso externo). Iconos en componentes shadcn con `data-icon`, sin
  tamaños manuales.
- `src/app/globals.css` — Tailwind + registro de la lib + tokens (copia local,
  el site no importa fuera del repo).
- Clientes propios: `theme-toggle.tsx`, `docs-search.tsx`,
  `catalog-explorer.tsx`, `docs-sidebar.tsx`, `docs-toc.tsx`,
  `reading-progress.tsx`, `doc-feedback.tsx`, `demo-wrapper.tsx`,
  `copy-button.tsx`
  (la lib aporta el otro: `ChartTooltipPortal`).

## Agregar una demo

1. `src/demos/<slug>.tsx` (default export, datos realistas, `ariaLabel`).
2. Entrada en `registry.ts` (título, sección, descripción, fuente).
3. `pnpm docs:gen` — genera `src/content/docs/<slug>.mdx` base (vista
   previa, ejemplos, ejemplo mínimo con props requeridas extraídas del
   tipo de la lib, código, props, accesibilidad). Solo crea faltantes:
   nunca toca MDX existentes. `pnpm docs:gen:force` regenera todo (borra
   ediciones manuales).
4. Ejemplos de configuraciones viven en `src/demos/examples/<slug>.tsx`
   (default export, 2-4 variantes con datos propios, Server Components
   sin portal). Cada variante va en `<DemoExample caption code>`
   (server: resalta con shiki en build) que renderiza `<DemoWrapper>`
   (cliente: tabs Preview/Code + copiar). El MDX los importa como
   `<Examples />`.
5. Si agregas un slug nuevo, añade su `case` en `src/content/load-doc.ts`.
6. `pnpm site:dev` y abre `/docs/<slug>`.

Los títulos de charts van en inglés (`Bar Chart`, `Sankey Diagram`); el
resto del copy del sitio sigue en español.

## Despliegue

`apps/site/out/` es estático (lleva `.nojekyll`): GitHub Pages, Netlify, Vercel
estático o cualquier hosting. Sin lógica de servidor: todo es HTML
prerenderizado.
