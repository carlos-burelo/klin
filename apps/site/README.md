# Site de klin (página del proyecto)

App Next.js estática con las 52 demos, en el mismo repo que la lib,
**sin salir en su bundle**:

- El tarball solo incluye `src + LICENSE + EXCEPTION + README.md` (`files` en
  `packages/klin/package.json`). Verifica con
  `pnpm --filter @carlos-burelo/klin pack --dry-run`: `apps/` no aparece.
- El bundler del consumidor solo incluye lo que importa de `@carlos-burelo/klin`;
  `apps/site` nunca se importa desde `src/index.ts`.

## Comandos

Desde la raíz (`C:\Users\x\dev\klin`):

- `pnpm site:dev` — Next en `http://localhost:3100/`.
- `pnpm site:build` — export estático a `apps/site/out/` (despliegue directo).

En local (`apps/site`): `pnpm dev|build|start|lint|typecheck`.

## Estructura

- `src/demos/<slug>.tsx` — una demo por componente (default export, SSR pura).
- `src/demos/registry.ts` — slugs, títulos, descripciones y fuente GitHub.
- `src/app/` — portada, índice y `charts/[slug]` (estático vía
  `generateStaticParams`; `output: "export"`).
- `src/app/globals.css` — Tailwind + registro de la lib + tokens (copia local,
  el site no importa fuera del repo).
- `src/components/theme-toggle.tsx` — único extra de cliente propio
  (la lib aporta el otro: `ChartTooltipPortal`).

## Agregar una demo

1. `src/demos/<slug>.tsx` (default export, datos realistas, `ariaLabel`).
2. Entrada en `registry.ts` (título, sección, descripción, fuente).
3. `pnpm site:dev` y abre `/charts/<slug>`.

## Despliegue

`apps/site/out/` es estático (lleva `.nojekyll`): GitHub Pages, Netlify, Vercel
estático o cualquier hosting.
