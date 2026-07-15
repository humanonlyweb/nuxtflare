# Architecture

Server code is layered **Routes → Controllers → Services**, each with one job.

## Layers

- **Routes** (`server/api/**`) — thin HTTP wrappers, ≤5 lines. Build the container,
  call a controller, return the result. No auth, validation, or logic.
- **Controllers** (`server/features/<feature>/<feature>.controller.ts`) — HTTP concerns
  only: validate input (Zod), authorize, orchestrate, set status codes.
- **Services** (`server/features/<feature>/<feature>.service.ts`) — business logic and
  all database access. No `H3Event`, no request parsing, no auth checks.

## Wiring

- **DI container** (`server/utils/container.ts`) is the single place services are
  constructed. Routes call `createContainer(event)` and destructure the controller
  they need. The db is built lazily and memoized per request.
- **Validation** — all Zod schemas live in `shared/utils/*` and are shared by client
  and server. Types are inferred (`z.infer`). Controllers validate with the helpers in
  `server/utils/validation.ts`.
- **Errors & logging** — throw via the evlog-backed `Errors` (`server/utils/error.ts`);
  log with evlog's `log`. No `console.*`, no raw `throw new Error()`.
- **IDs & timestamps** — reusable column builders in `server/database/helpers.ts`.
  `id("<prefix>")` defaults a prefixed nanoid at the schema level (via `randomId` in
  `shared/utils/id-gen.ts` — register new prefixes in `prefixes`); `createdAt()` /
  `updatedAt()` supply the timestamp columns. So services never set ids by hand.
- **Database** — Drizzle on D1. Schema in `server/database/schema/`, `snake_case`
  column mapping. `useDrizzle(event)` returns the request-scoped client.
- **Background tasks** — slow or scheduled work runs in a Nitro task, not inline in a
  request. `notes:prune` (`server/features/notes/notes.task.ts`) is the worked example:
  it builds its own db from the `cloudflare:workers` `env` and delegates to the service.
  Feature-colocated tasks are registered in `nuxt.config.ts` (`nitro.tasks` +
  `scheduledTasks`) and need a matching cron in `wrangler.jsonc`.
- **Caching** — a cached GET must be busted after a related write with
  `invalidateCachedRoutes({ keys: ["apiresource"] })` in the controller (pass
  `name` to target a storage other than the default `"cache"`).

## Adding a feature

1. Zod schemas → `shared/utils/<feature>.schema.ts`
2. Types → `server/features/<feature>/<feature>.type.ts`
3. Business logic → `<feature>.service.ts`
4. HTTP logic → `<feature>.controller.ts`
5. Routes → `server/api/<feature>/`
6. Register the controller in `server/utils/container.ts`
7. _(optional)_ Background work → `<feature>.task.ts`, registered in `nuxt.config.ts`
   (`nitro.tasks` + `scheduledTasks`) with a matching cron in `wrangler.jsonc`

The `notes` feature is a complete worked example of every step.
