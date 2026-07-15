import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";
// Relative, not `#shared`: drizzle-kit loads this file outside Nuxt (esbuild),
// where the `#` aliases aren't resolved.
import { type IDPrefix, randomId } from "../../shared/utils/id-gen";

export const id = (prefix: IDPrefix) =>
  text()
    .primaryKey()
    .$defaultFn(() => randomId(prefix));

export const createdAt = () =>
  integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

export const updatedAt = () =>
  integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`)
    .$onUpdate(() => new Date());
