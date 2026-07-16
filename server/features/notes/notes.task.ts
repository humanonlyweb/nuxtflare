import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import { log } from "evlog";

import * as schema from "#server/database/schema";

import { NotesService } from "./notes.service";

const RETENTION_DAYS = 30;

// Runs outside a request, so there's no H3Event — build the db from the global
// Cloudflare env and delegate to the service (drain logic never lives here).
export default defineTask({
  meta: {
    name: "notes:prune",
    description: "Delete notes older than the retention window",
  },
  async run() {
    const db = drizzle(env.DB, { schema, casing: "snake_case" });
    const pruned = await new NotesService(db).pruneOlderThan(RETENTION_DAYS);
    log.info("notes:prune", `pruned ${pruned} note(s) older than ${RETENTION_DAYS}d`);
    return { result: { pruned } };
  },
});
