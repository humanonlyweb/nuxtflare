import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { createdAt, id, updatedAt } from "../helpers";

export const notes = sqliteTable("notes", {
  id: id("note"),
  title: text().notNull(),
  body: text().notNull().default(""),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
