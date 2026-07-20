# HumanOnlyWeb — Nuxt 4 + Cloudflare starter

An opinionated (personal!), production-shaped template for Nuxt 4 fullstack apps on Cloudflare
Workers. Click **Use this template** on GitHub, then run the setup script.

**Stack:**

- Nuxt 4+
- Cloudflare Workers (`cloudflare-module`)
  - Email Sending binding
  - D1 database
  - (R2 / KV / Queues are one `wrangler.jsonc` binding + `server/types/env.d.ts` entry away)
- DrizzleORM
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
`notes:prune` task). Notes are user-scoped: the page sits behind the `auth`
middleware and the API enforces `requireUserSession` + ownership in the
controller/service, so the demo doubles as the authorization worked example —
sign in (OAuth, below) to use it. To remove it cleanly — so the build stays green — delete:

- `server/features/notes/`, `server/api/notes/`, `server/database/schema/notes.ts`
- `shared/utils/schema-validation/notes.schema.ts` (and its re-export in `schema-validation/index.ts`)
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

> [!NOTE]
> **Type-checking:** `nuxt typecheck` needs vue-tsc, which can't load the pinned
> TypeScript 7 preview yet ([#6121](https://github.com/vuejs/language-tools/discussions/6121),
> [#5381](https://github.com/vuejs/language-tools/issues/5381)), so the type gate is
> `bun run lint` (oxlint, type-aware via tsgolint) and CI keeps `typecheck` commented out.
> **Tests:** none included yet — add a `/tests` folder and run `bun test`.

## Project structure

```
app/                     # Vue frontend (SFC, <script setup lang="ts">)
  components/ui/*        # styleless base UI kit (see DOCS/ui)
  components/<feature>/* # feature-specific components
  composables/*          # kebab-case composables (use-*.ts)
  layouts/
  pages/
server/
  api/<resource>/        # thin route handlers (delegate to a controller)
  routes/<name>/         # Nitro routes — e.g. OAuth callbacks (auth/github.get.ts)
  features/<feature>/    # <feature>.{type,service,controller}.ts (+ optional .task.ts)
  database/schema/       # Drizzle schema (+ generated migrations/)
  database/helpers.ts    # reusable id()/createdAt()/updatedAt() columns
  types/env.d.ts         # Cloudflare binding types (kept in sync with wrangler.jsonc)
  utils/                 # container, drizzle, error, validation, cache
shared/
  utils/schema-validation/ # Zod schemas (<feature>.schema.ts) + barrel, shared client & server
  utils/id-gen.ts          # prefixed-id generator + shape (single source for randomId/idSchema)
  types/                   # ambient types shared across app + server (e.g. session User)
```

## Architecture

Server code follows a strict **Routes → Controllers → Services** layering.
See [`DOCS/ARCHITECTURE.md`](./DOCS/ARCHITECTURE.md). Component and composable usage
lives in [`DOCS/ui`](./DOCS/ui) and [`DOCS/composables`](./DOCS/composables).

## UI

Styleless base components in `app/components/ui/` (auto-imported: `<UiButton>`,
`<UiInput>`, `<UiSelect>`, `<UiDialog>`, `<UiToast>`, `<UiTable>`, …). Behaviour, a11y
and motion are built in; visuals are `data-part` / `data-<component>-*` hooks you style.
See [`DOCS/ui`](./DOCS/ui/README.md) and the live `/components` page.
Delete if you want to bring your own UI kit (Tailwind, UnoCSS, DaisyUI, Vuetify, etc.) — the
app is agnostic, but the base components are a good starting point.

## Forms

A small Zod-native [`useForm`](./DOCS/composables/use-form.md) composable is included
(validation, touched/dirty tracking, submit state). Optional — bring your own (vee-validate, FormKit, …) if you prefer.

## Auth

OAuth sign-in (GitHub + Google) via [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils),
with a `findOrCreateByOAuth` account flow. Copy `.env.example` → `.env` and set the
session password + provider credentials. See [`DOCS/AUTH.md`](./DOCS/AUTH.md).

## Email

Transactional email via the Cloudflare Email Sending binding, with a welcome email
on first sign-up and HTML templates in `server/assets/emails/`. See
[`DOCS/EMAIL.md`](./DOCS/EMAIL.md).

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
