import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

import { randomId } from "#shared/utils/id-gen";
import type { IDPrefix } from "#shared/utils/id-gen";

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
