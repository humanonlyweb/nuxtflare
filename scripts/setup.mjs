// oxlint-disable no-console, typescript/no-unsafe-assignment
import { readFile, unlink, writeFile } from "node:fs/promises";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

// Guard: only run against the untouched template. Once the package name has been
// changed, this refuses to run — so a second run (or running it inside a real
// project) can't rewrite anything.
const pkg = await readFile("package.json", "utf8");
if (!/"name":\s*"template"/.test(pkg)) {
  console.error(
    'Setup has already run (package name is not "template") — aborting so your project is not rewritten.',
  );
  process.exit(1);
}

const rl = createInterface({ input: stdin, output: stdout });

const toSlug = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const name = toSlug(await rl.question("App name (kebab-case): "));
const domain = (await rl.question("Production domain (blank to skip): ")).trim();
rl.close();

if (!name) {
  console.error("An app name is required.");
  process.exit(1);
}

async function edit(path, fn) {
  await writeFile(path, fn(await readFile(path, "utf8")));
}

await edit("package.json", (s) => s.replace(/"name":\s*"template"/, `"name": "${name}"`));
await edit("nuxt.config.ts", (s) => s.replace(/service:\s*"template"/, `service: "${name}"`));
await edit("wrangler.jsonc", (s) =>
  s
    .replace(/"name":\s*"template"/, `"name": "${name}"`)
    .replace(/"database_name":\s*"template-db"/, `"database_name": "${name}-db"`)
    .replace(/"pattern":\s*"template\.com"/, `"pattern": "${domain || "example.com"}"`),
);
await edit(".github/workflows/ci.yml", (s) => s.replaceAll("template-db", `${name}-db`));

// One-shot: drop the npm script and delete this file so it can't run again.
await edit("package.json", (s) => s.replace(/^.*"setup":.*scripts\/setup\.mjs.*\r?\n/m, ""));
await unlink("scripts/setup.mjs");

console.log(`\n✔ Renamed project to "${name}". (setup script removed)\n`);
console.log("Next:");
if (!domain) {
  console.log("  • Set a domain in wrangler.jsonc `routes` (or remove it for *.workers.dev)");
}
console.log(`  • bunx wrangler d1 create ${name}-db`);
console.log("  • Paste the returned database_id into wrangler.jsonc (REPLACE_WITH_D1_DATABASE_ID)");
console.log("  • bun run db:migrate:local  &&  bun run dev");
