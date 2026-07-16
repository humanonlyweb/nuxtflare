import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { OAUTH_PROVIDERS } from "#server/utils/constant";

import { createdAt, id, updatedAt } from "../helpers";

export const users = sqliteTable("users", {
  id: id("user"),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerifiedAt: integer({ mode: "timestamp_ms" }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const userOauth = sqliteTable(
  "user_oauth",
  {
    id: id("oauth"),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text({ enum: OAUTH_PROVIDERS }).notNull(),
    providerUserId: text().notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("user_oauth_provider_account_uq").on(t.provider, t.providerUserId)],
);
