import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import type { H3Event } from "h3";
import * as schema from "#server/database/schema";

export type Database = DrizzleD1Database<typeof schema>;

export function useDrizzle(event: H3Event): Database {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) throw Errors.internal("Database binding (DB) is not available");
  return drizzle(db, { schema, casing: "snake_case" });
}
