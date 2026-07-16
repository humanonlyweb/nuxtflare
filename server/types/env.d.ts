import type { D1Database, Fetcher, SendEmail } from "@cloudflare/workers-types";

declare global {
  namespace Cloudflare {
    interface Env {
      DB: D1Database;
      ASSETS: Fetcher;
      EMAIL: SendEmail;
    }
  }
}

// On this stack (Nitro v2 / h3 v1) bindings live on `event.context.cloudflare.env`;
// we type it here so `useDrizzle(event)` + the DI container stay checked and in sync
// with wrangler.jsonc.
// Nitro v3 / h3 v2 moves this to `event.req.runtime.cloudflare.env`
// (https://nitro.build/deploy/providers/cloudflare#direct-access-to-cloudflare-bindings);
// Will switch to that once Nuxt 5 (powered by Nitro 3) lands.
declare module "h3" {
  interface H3EventContext {
    cloudflare: { env: Cloudflare.Env };
  }
}
