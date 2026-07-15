# HumanOnlyWeb — Nuxt 4 + Cloudflare starter

An opinionated, production-shaped template for Nuxt 4 fullstack apps on Cloudflare
Workers + D1. Click **Use this template** on GitHub, then run the setup script.

**Stack:**

- Nuxt 4+
- Vue 3
- Cloudflare Workers (`cloudflare-module`) · D1
- Drizzle
- Zod
- evlog
- oxlint/oxfmt
- bun.

## Getting started

```bash
# 1. Create your repo from this template, then clone it and install
bun install

# (optional) Update dependencies to latest versions
bun upgrade

# 2. Rename the project (package name, wrangler, evlog service, domain).
#    One-time: it guards against re-runs and removes itself when done.
bun run setup

# 3. Create the D1 database and paste its id into wrangler.jsonc
bunx wrangler d1 create <your-app>-db

# 4. Apply migrations to the local D1 and start the dev server
bun run db:migrate:local
bun run dev
```

The app ships with a **notes** demo feature wired end to end (including a scheduled
`notes:prune` task). To remove it cleanly — so the build stays green — delete:

- `server/features/notes/`, `server/api/notes/`, `server/database/schema/notes.ts`
- `shared/utils/notes.schema.ts`
- `app/components/notes/`, `app/composables/use-notes.ts`, and the notes UI in `app/pages/index.vue`

then remove its wiring: the `notesController` getter in `server/utils/container.ts`,
the `notes:prune` `tasks` + `scheduledTasks` entries in `nuxt.config.ts`, and the cron in
`wrangler.jsonc`.

## Scripts

| Script                                 | Purpose                                          |
| -------------------------------------- | ------------------------------------------------ |
| `bun run dev`                          | Dev server (local D1 via wrangler)               |
| `bun run build` / `deploy`             | Build / build + `wrangler deploy`                |
| `bun run typecheck`                    | `nuxt typecheck`                                 |
| `bun run lint` / `lint:fix`            | oxlint (type-aware)                              |
| `bun run format`                       | oxfmt                                            |
| `bun run test`                         | `bun test`                                       |
| `bun run db:generate`                  | Generate a Drizzle migration from schema changes |
| `bun run db:migrate:local` / `:remote` | Apply migrations to D1                           |

> **Type-checking:** `typecheck` runs `nuxt typecheck`, which needs a Vue type checker
> (vue-tsc/golar). vue-tsc can't load the pinned TypeScript 7 preview yet, so the current
> type gate is `bun run lint` (oxlint, type-aware via tsgolint) and CI keeps `typecheck`
> commented out. Re-enable it once vue-tsc supports TS 7.

## Project structure

```
app/                     # Vue frontend (SFC, <script setup lang="ts">)
  components/ui/*        # shared, presentational UI
  components/<feature>/* # feature-specific components
  composables/*          # kebab-case composables (use-*.ts)
  layouts/ · pages/
server/
  api/<resource>/        # thin route handlers (delegate to a controller)
  features/<feature>/    # <feature>.{type,service,controller}.ts (+ optional .task.ts)
  database/schema/       # Drizzle schema (+ generated migrations/)
  database/helpers.ts    # reusable id()/createdAt()/updatedAt() columns
  types/env.d.ts         # Cloudflare binding types (kept in sync with wrangler.jsonc)
  utils/                 # container, drizzle, error, validation, cache
shared/utils/            # Zod schemas + helpers shared by client & server
```

## Architecture

Server code follows a strict **Routes → Controllers → Services** layering.
See [`DOCS/ARCHITECTURE.md`](./DOCS/ARCHITECTURE.md). Component and composable usage
lives in [`DOCS/ui`](./DOCS/ui) and [`DOCS/composables`](./DOCS/composables).

## Forms

A small Zod-native [`useForm`](./DOCS/composables/use-form.md) composable is included
(validation, touched/dirty tracking, submit state). It's optional — bring your own form library (vee-validate, FormKit, …) if you prefer

## Deploy

Two ways to ship, both to Cloudflare Workers:

**Via CI (recommended).** Uncomment the `deploy-production` job in
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml), add a
`CLOUDFLARE_API_TOKEN` repo secret, and push to `main` (or run the workflow
manually). CI applies remote D1 migrations and deploys the Worker for you.

**Via the deploy command (manual).** From your machine:

```bash
bun run db:migrate:remote   # apply migrations to the remote D1
bun run deploy              # nuxt build && wrangler deploy
```
