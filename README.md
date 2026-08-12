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
