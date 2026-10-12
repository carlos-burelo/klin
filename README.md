# klin (monorepo)

Gráficas SSR-first + página del proyecto.

- [`packages/klin`](packages/klin) — la lib (`@carlos-burelo/klin`): d3 para
  cálculo, SVG puro para render. Ver su README.
- [`apps/site`](apps/site) — demos y página estática (SSG sin framework).
  Ver su README.

## Requisitos

- `pnpm@12.0.0` (corepack o standalone).
- Publicar usa GitHub Packages; el token va por entorno (`NODE_AUTH_TOKEN`),
  nunca en archivos.

## Comandos (desde la raíz)

- `pnpm install` — instala el workspace.
- `pnpm lint` / `pnpm typecheck` / `pnpm test` — todo el workspace.
- `pnpm site:build` — `apps/site/out/` (52 demos prerenderizadas).
- `pnpm site:dev` — build + `http://localhost:3100/`.

## Release

Los tags `v*` publican la lib (workflow `publish`): `npm version patch`
(o minor/major) en `packages/klin` y `git push --follow-tags`.
