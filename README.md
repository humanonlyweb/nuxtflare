# HumanOnlyWeb — Nuxt 4 + Cloudflare starter

An opinionated (PERSONAL), production-shaped template for Nuxt 4+ fullstack apps on
Cloudflare Workers. Click **Use this template** on GitHub, run the setup script, delete
what you don't need (notes demo, email, OAuth…) and start building.

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

# 2. Rename the project (package name, wrangler, evlog service, domain) and
#    optionally strip the demo code. Runs once, then deletes itself.
bun run setup

# 3. Create the D1 database and paste its id into wrangler.jsonc
bunx wrangler d1 create <your-app>-db

# 4. Apply migrations to the local D1 and start the dev server
#    (run `bun run db:generate` first if setup removed the notes feature)
bun run db:migrate:local
bun run dev
```

Setup asks three questions:

```
$ bun run setup
App name (kebab-case): my-app
Production domain (blank to skip): myapp.com
Remove the demo notes feature? [Y/n]: y
```

Two demos ship, and they cover different halves:

- **`/components`** — the UI kit, `useForm`, and the server-error → field-error round trip
  against a real endpoint (`server/api/demo/profile.post.ts`). Setup always removes it.
- **notes** — the server architecture end to end: route → controller → service, DI
  container, Drizzle/D1, cache invalidation, a cron prune task, auth-gated CRUD. This is
  the worked example the docs point back at. Sign in (OAuth, below) to use it. Answer `y`
  and it's deleted whole; `n` keeps it as a reference you can remove later.

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

## Architecture

Server code follows a strict **Routes → Controllers → Services** layering, enforced by a
custom oxlint plugin. Structure, wiring (DI container, validation, errors, tasks,
authorization, caching) and how to add a feature are in
[`DOCS/ARCHITECTURE.md`](./DOCS/ARCHITECTURE.md). Components and composables live in
[`DOCS/ui`](./DOCS/ui) and [`DOCS/composables`](./DOCS/composables).

## UI

Styleless base components in `app/components/ui/` (auto-imported: `<UiButton>`,
`<UiInput>`, `<UiSelect>`, `<UiAccordion>`, `<UiDialog>`, `<UiToast>`, `<UiTable>`, …).
Behaviour, a11y and motion are built in; visuals are `data-part` / `data-<component>-*`
hooks you style. See [`DOCS/ui`](./DOCS/ui/README.md) and the live `/components` page.

Bringing your own kit (Tailwind, UnoCSS, DaisyUI, Vuetify…)? Delete them — the app is
agnostic.

## Forms

A small Zod-native [`useForm`](./DOCS/composables/use-form.md) — validation, touched/dirty
tracking, submit state. Optional; swap in vee-validate or FormKit if you prefer.

## Auth

OAuth sign-in (GitHub + Google) via
[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils), with a `findOrCreateByOAuth`
account flow. Copy `.env.example` → `.env` and set the session password + provider
credentials. See [`DOCS/AUTH.md`](./DOCS/AUTH.md).

## Email

Transactional email via the Cloudflare Email Sending binding — welcome email on first
sign-up, HTML templates in `server/assets/emails/`. See [`DOCS/EMAIL.md`](./DOCS/EMAIL.md).

## Deploy

**Via CI (recommended).** Uncomment the `deploy-production` job in
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml), add a `CLOUDFLARE_API_TOKEN` repo
secret, and push to `main` (or dispatch the workflow). CI applies remote D1 migrations and
deploys the Worker.

**Manual.**

```bash
bun run db:migrate:remote   # apply migrations to the remote D1
bun run deploy              # nuxt build && wrangler deploy
```
