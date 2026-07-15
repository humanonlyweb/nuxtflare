import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  casing: "snake_case",
  schema: "./server/database/schema/index.ts",
  out: "./server/database/migrations",
});
