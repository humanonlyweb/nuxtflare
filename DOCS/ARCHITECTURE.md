# Architecture

Server code is layered **Routes → Controllers → Services**, each with one job.

## Project structure

```sh
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
  utils/id-gen.ts          # prefixed-id generator (single source for randomId/idSchema)
  types/                   # ambient types shared across app + server (e.g. session User)
```

## Layers

- **Routes** (`server/api/**`) — build the container, call a controller, return the
  result. No auth, no validation, no logic.
- **Controllers** (`<feature>.controller.ts`) — HTTP only: authorize, validate (Zod),
  orchestrate, set status codes. In that order — `arch/authorize-before-validate`.
- **Services** (`<feature>.service.ts`) — business logic and all database access. No
  `H3Event`, no request parsing, no auth checks.

## Wiring

- **DI container** (`server/utils/container.ts`) — the one place services get built.
  Routes call `createContainer(event)` and take the controller they need; the db is built
  lazily and memoized per request.
- **Validation** — Zod schemas live in `shared/utils/schema-validation/`, one
  `<feature>.schema.ts` per feature, re-exported from `index.ts` (the
  `#shared/utils/schema-validation` barrel). Shared bits like `idSchema()` are in
  `helper.ts`. Client and server use the same schema, so a field is described once —
  `arch/zod-schemas-in-shared` keeps it that way. Controllers validate with the helpers in
  `server/utils/validation.ts`.
- **Errors & logging** — throw via `Errors` (`server/utils/error.ts`), log with evlog's
  `log`. No `console.*`, no raw `throw new Error()`.
  - Every factory returns an `EvlogError` with a stable `code`, and that's load-bearing:
    evlog's Nitro handler serializes `data` **only** for `EvlogError`. Anything else —
    h3's own `createError` included — gets rebuilt into a plain body with `data` dropped.
  - `validation` / `conflict` / `tooLarge` also take a `fields` map and return a
    `FieldError`, an `EvlogError` subclass widening the `data` getter to carry it. Evlog's
    own getter is fixed to `{ code, why, fix, link }`, so subclassing is the way through.
  - On the client: `parseError()` (evlog) for message/status/code, `fieldErrorsFrom()`
    (`shared/utils/api-error.ts`) for the field map. `useForm` applies it by input `name`,
    so `<input name="email">` gets the `email` message. See `DOCS/composables/use-form.md`.
  - The browser already ran the same schema, so `fields` mostly earns its keep for what
    the client can't know — uniqueness clashes and other server-state conflicts.
- **Rate limiting** — `checkRateLimit(event, { key })` / `assertWithinRateLimit(...)`
  (`server/utils/rate-limit.ts`) wrap the Cloudflare `RATE_LIMIT` binding;
  `clientIp(event)` gives the per-IP key. It counts per-colo on a sliding period — abuse
  dampening, not a quota. No binding (e.g. `nuxt dev`) means a warning and a pass. The
  OAuth callback is the worked example: it redirects instead of throwing, since a 429
  mid-redirect lands in the browser as raw JSON.
- **IDs & timestamps** — column builders in `server/database/helpers.ts`. `id("<prefix>")`
  defaults a prefixed nanoid at the schema level (register new prefixes in `prefixes`,
  `shared/utils/id-gen.ts`); `createdAt()` / `updatedAt()` do the timestamps. Services
  never set ids by hand.
- **Database** — Drizzle on D1, schema in `server/database/schema/`, `snake_case` column
  mapping. `useDrizzle(event)` returns the request-scoped client.
- **Background tasks** — slow or scheduled work belongs in a Nitro task, not a request.
  `notes:prune` (`server/features/notes/notes.task.ts`) is the example: it builds its own
  db from the `cloudflare:workers` `env` and calls the service. Register tasks in
  `nuxt.config.ts` (`nitro.tasks` + `scheduledTasks`) with a matching cron in
  `wrangler.jsonc`.
- **Authorization** — controllers gate with `requireUserSession(event)` and pass `user.id`
  down; services scope every query by `userId`, so a foreign id 404s instead of leaking
  existence. Page middleware (`auth`/`guest`) is a UI gate only — the server check is the
  real one.
- **Caching** — nothing is cached out of the box. When you add it
  (`defineCachedEventHandler` or a `cache` route rule), bust it after a related write with
  `invalidateCachedRoutes({ keys: ["apiresource"] })` in the controller (`name` targets a
  storage other than `"cache"`). Don't cache per-user responses — the cache is shared.

## Adding a feature

1. Zod schemas → `shared/utils/schema-validation/<feature>.schema.ts` (re-export from `index.ts`)
2. Types → `server/features/<feature>/<feature>.type.ts`
3. Business logic → `<feature>.service.ts`
4. HTTP logic → `<feature>.controller.ts`
5. Routes → `server/api/<feature>/`
6. Register the controller in `server/utils/container.ts`
7. _(optional)_ Background work → `<feature>.task.ts`, registered in `nuxt.config.ts`
   with a matching cron in `wrangler.jsonc`

`notes` is a complete worked example of all seven.

## Enforcement (lint)

A custom oxlint plugin (`tools/oxlint/architecture.mjs`, wired via `jsPlugins`) fails the
lint on the usual violations. Rules self-scope by filename, so they're no-ops elsewhere.

- **`arch/no-db-access-in-controllers`** — no `drizzle-orm`/schema imports or `useDrizzle()`
  in a controller. DB access is the service's job.
- **`arch/no-http-in-services`** — no `h3` import, `validate*` or response helpers in a
  service. HTTP is the controller's job.
- **`arch/no-unvalidated-request-reads`** — no raw h3 readers (`readBody`, `getQuery`, …)
  anywhere in `server/`; use the wrappers in `server/utils/validation.ts` (which is exempt).
- **`arch/no-service-instantiation-outside-container`** — `new *Service()` / `new *Controller()`
  only in `server/utils/container.ts` and `*.task.ts` (tasks build their own deps).
- **`arch/authorize-before-validate`** — don't `Promise.all` a session check against a
  `validate*` call. Racing them parses attacker-controlled input before you know who's
  asking, so a bad body answers 400 (leaking the schema) where it should answer 401 — and
  `Promise.all` doesn't cancel the loser, so it buys nothing back.
- **`arch/no-raw-error-throw`** — `throw new Error()` (or any built-in) in `server/` is an
  opaque 500. Use `Errors.*`, or a domain error the controller maps.
- **`arch/zod-schemas-in-shared`** — only `shared/utils/schema-validation/**` imports `zod`
  as a value. A schema defined inline in a page or controller is one the other side can't
  reach, so the two drift. `import type { ZodType }` is fine — that's plumbing.
- **`arch/domain-types-in-type-file`** — no `interface`/`type` declarations in a
  `*.service.ts` or `*.controller.ts`. Domain shapes (including
  `typeof table.$inferSelect` row types) belong in `<feature>.type.ts`, so consumers import
  the shape without reaching into the implementation module.
- **`arch/no-process-env`** — `process.env` is inlined at build time on Workers and empty
  for anything per-request. Use `useRuntimeConfig(event)` for config and
  `event.context.cloudflare.env` for bindings.

Add more as you see fit.
