import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createdAt, id, updatedAt } from "../helpers";

import { users } from "./users";

export const notes = sqliteTable(
  "notes",
  {
    id: id("note"),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text().notNull(),
    body: text().notNull().default(""),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("notes_user_id_idx").on(t.userId)],
);
