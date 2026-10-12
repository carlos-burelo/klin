# Site de klin (página del proyecto)

Demos y página del proyecto, en el mismo repo que la lib, **sin salir en su bundle**:

- El tarball solo incluye `src + LICENSE + EXCEPTION + README.md` (`files` en
  `package.json`). Verifica con `pnpm pack --dry-run`: `site/` no aparece.
- El bundler del consumidor solo incluye lo que importa de `@carlos-burelo/klin`;
  `site/` nunca se importa desde `src/index.ts`.
- Cero dependencias nuevas en runtime: el SSG usa `tsx` + `tailwindcss`
  (devDeps de la lib) y el HTML sale prerenderizado.

## Comandos (desde `packages/klin`)

- `pnpm site:build` — CSS (`tailwindcss`) + HTML (`tsx site/scripts/build-site.ts`) → `site/out/`.
- `pnpm site:dev` — build + servidor estático en `http://localhost:3100/`.
- `pnpm site:css` / `pnpm site:html` — pasos sueltos.

## Estructura

- `site/src/demos/<slug>.tsx` — una demo por componente (default export, SSR pura).
- `site/src/demos/registry.ts` — slugs, títulos, descripciones y fuente GitHub.
- `site/src/pages.tsx` — portada, índice y página de demo (sin framework).
- `site/src/site.css` — Tailwind + registro de la lib + tokens (copia local,
  el site no importa fuera del repo).
- `site/src/client.js` — único JS: tema claro/oscuro. Sin él todo se ve igual.
- `site/scripts/build-site.ts` — prerenderiza 52 páginas a `site/out/`.
- `site/scripts/serve.ts` — servidor estático mínimo (solo dev).

## Agregar una demo

1. `site/src/demos/<slug>.tsx` (default export, datos realistas, `ariaLabel`).
2. Entrada en `registry.ts` (título, sección, descripción, fuente).
3. `pnpm site:build` y abre `site/out/charts/<slug>.html`.

## Despliegue

`site/out/` es estático (lleva `.nojekyll`): GitHub Pages, Netlify, Vercel
estático o cualquier hosting. Ejemplo Pages: publica `packages/klin/site/out`.
