# Site de klin (página del proyecto)

Demos y página del proyecto, en el mismo repo que la lib, **sin salir en su bundle**.
Paquete privado del workspace (`@carlos-burelo/klin-site`): el SSG ya funciona; este
paquete solo lo cablea (scripts + configs).

## Comandos

Desde la raíz del repo:

- `pnpm --filter @carlos-burelo/klin-site build` — CSS (`tailwindcss`) + HTML
  (`tsx scripts/build-site.ts`) → `apps/site/out/`.
- `pnpm --filter @carlos-burelo/klin-site dev` — sirve `out/` ya construido en
  `http://localhost:3100/` (no construye; el build previo lo hace el root con `build`).
- Atajos del root: `pnpm site:build` / `pnpm site:dev`.

En local (dentro de `apps/site`):

- `pnpm build` — prerenderiza el SSG a `out/`.
- `pnpm dev` — sirve `out/` ya construido (requiere `pnpm build` antes).

## Rutas (`apps/site`)

- `apps/site/src/demos/<slug>.tsx` — una demo por componente (default export, SSR pura).
- `apps/site/src/demos/registry.ts` — slugs, títulos, descripciones y fuente GitHub.
- `apps/site/src/pages.tsx` — portada, índice y página de demo (sin framework).
- `apps/site/src/site.css` — Tailwind + registro de la lib + tokens (copia local,
  el site no importa fuera del repo).
- `apps/site/src/client.js` — único JS: tema claro/oscuro. Sin él todo se ve igual.
- `apps/site/scripts/build-site.ts` — prerenderiza las páginas a `apps/site/out/`.
- `apps/site/scripts/serve.ts` — servidor estático mínimo (solo dev, sirve `out/`).

## Agregar una demo

1. `apps/site/src/demos/<slug>.tsx` (default export, datos realistas, `ariaLabel`).
2. Entrada en `registry.ts` (título, sección, descripción, fuente).
3. `pnpm build` y abre `apps/site/out/charts/<slug>.html`.

## Salida y despliegue

`apps/site/out/` es estático (lleva `.nojekyll`): GitHub Pages, Netlify, Vercel
estático o cualquier hosting. Ejemplo Pages: publica `apps/site/out`.

## Garantías (tarball de la lib sin site)

- El tarball de `@carlos-burelo/klin` solo incluye `src + LICENSE + EXCEPTION +
  README.md` (`files` en `packages/klin/package.json`). Verifica con
  `pnpm pack --dry-run` desde `packages/klin`: `apps/site/` no aparece.
- Este paquete es `private: true` (no se publica).
- El bundler del consumidor solo incluye lo que importa de `@carlos-burelo/klin`;
  `apps/site/` nunca se importa desde `packages/klin/src/index.ts`.
- Cero dependencias nuevas en runtime: el SSG usa `tsx` + `tailwindcss`
  (devDeps de este paquete) y el HTML sale prerenderizado.
