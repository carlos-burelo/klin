# klin (monorepo)

[![ci](https://github.com/carlos-burelo/klin/actions/workflows/ci.yml/badge.svg)](https://github.com/carlos-burelo/klin/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@carlos-burelo/klin)](https://www.npmjs.com/package/@carlos-burelo/klin)
[![license](https://img.shields.io/github/license/carlos-burelo/klin)](LICENSE)

Gráficas SSR-first + página del proyecto.

- [`packages/klin`](packages/klin) — la lib (`@carlos-burelo/klin`): d3 para
  cálculo, SVG puro para render. Ver su README.
- [`apps/site`](apps/site) — demos y página (Next.js estático, `output: "export"`).
  Ver su README.

## Requisitos

- `pnpm@12.0.0` (corepack o standalone).
- Publicar usa npmjs con provenance; el token va por entorno (`NPM_TOKEN`
  como secreto de GitHub), nunca en archivos.

## Comandos (desde la raíz)

- `pnpm install` — instala el workspace.
- `pnpm lint` / `pnpm typecheck` / `pnpm test` — todo el workspace.
- `pnpm site:build` — `apps/site/out/` (80 demos prerenderizadas).
- `pnpm site:dev` — Next en `http://localhost:3100/`.

## Release

Los tags `v*` publican la lib (workflow `publish`): `npm version patch`
(o minor/major) en `packages/klin` y `git push --follow-tags`.
