// oxlint-disable no-console, typescript/no-unsafe-assignment
import { readFile, rm, writeFile } from "node:fs/promises";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

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
const dropNotes = !/^n/i.test((await rl.question("Remove the demo notes feature? [Y/n]: ")).trim());
rl.close();

if (!name) {
  console.error("An app name is required.");
  process.exit(1);
}

const warnings = [];

const HOME_PAGE = `<script setup lang="ts">
useSeoMeta({ title: "__APP_NAME__" });
</script>

<template>
  <div class="page">
    <h1>__APP_NAME__</h1>
    <p>Your app starts here.</p>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

p {
  color: var(--text-muted);
}
</style>
`;

async function edit(path, fn) {
  let before;
  try {
    before = await readFile(path, "utf8");
  } catch {
    warnings.push(`${path} not found — skipped`);
    return;
  }
  const after = fn(before);
  if (after === before) warnings.push(`no change applied to ${path} — check it by hand`);
  await writeFile(path, after);
}

const del = (path) => rm(path, { recursive: true, force: true });

await edit("nuxt.config.ts", (s) =>
  s
    .replace(/service:\s*"template"/, `service: "${name}"`)
    .replace(/fromName:\s*"HumanOnlyWeb"/, `fromName: "${name}"`)
    .replace(
      /fromAddress:\s*"contact@humanonlyweb\.com"/,
      `fromAddress: "contact@${domain || "example.com"}"`,
    ),
);
await edit("server/utils/constant.ts", (s) =>
  s.replace(/APP_NAME = "template"/, `APP_NAME = "${name}"`),
);
await edit("app/layouts/default.vue", (s) => s.replaceAll("humanonlyweb", name));
await edit("app/pages/auth/sign-in.vue", (s) => s.replaceAll("humanonlyweb starter", name));
await edit("wrangler.jsonc", (s) =>
  s
    .replace(/"name":\s*"template"/, `"name": "${name}"`)
    .replace(/"database_name":\s*"template-db"/, `"database_name": "${name}-db"`)
    .replace(/"pattern":\s*"template\.com"/, `"pattern": "${domain || "example.com"}"`),
);
await edit(".github/workflows/ci.yml", (s) => s.replaceAll("template-db", `${name}-db`));

if (dropNotes) {
  await Promise.all(
    [
      "app/components/notes",
      "app/composables/use-notes.ts",
      "server/api/notes",
      "server/features/notes",
      "server/database/schema/notes.ts",
      "shared/utils/schema-validation/notes.schema.ts",
      // The single shipped migration creates the notes table alongside the auth
      // tables, so there is nothing to salvage — `db:generate` rebuilds it from
      // whatever schema is left.
      "server/database/migrations",
    ].map(del),
  );

  await edit("server/database/schema/index.ts", (s) =>
    s.replace(/^export \* from "\.\/notes";\r?\n/m, ""),
  );
  await edit("shared/utils/schema-validation/index.ts", (s) =>
    s.replace(/^export \* from "\.\/notes\.schema";\r?\n/m, 'export * from "./helper";\n'),
  );
  await edit("shared/utils/id-gen.ts", (s) => s.replace(/^ *note: "note",\r?\n/m, ""));
  await edit("server/utils/container.ts", (s) =>
    s
      .replace(
        /^import \{ Notes(Controller|Service) \} from "#server\/features\/notes\/.*\r?\n/gm,
        "",
      )
      .replace(/^([ \t]*)get notesController\(\) \{\r?\n(?:.*\r?\n)*?\1\},\r?\n/m, ""),
  );
  await edit("nuxt.config.ts", (s) =>
    s
      .replace(/^ *experimental: \{ tasks: true \},\r?\n/m, "")
      .replace(/^([ \t]*)tasks: \{\r?\n(?:.*\r?\n)*?\1\},\r?\n/m, "")
      .replace(/^([ \t]*)scheduledTasks: \{\r?\n(?:.*\r?\n)*?\1\},\r?\n/m, ""),
  );
  await edit("server/utils/cache.ts", (s) =>
    s.replaceAll("/api/notes", "/api/things").replaceAll("apinotes", "apithings"),
  );
  await writeFile("app/pages/index.vue", HOME_PAGE.replaceAll("__APP_NAME__", name));
} else {
  await edit("app/pages/index.vue", (s) => s.replaceAll("humanonlyweb starter", name));
}

// Last on purpose: the re-run guard keys off the package name, so renaming only
// once everything else succeeded means a crash halfway leaves setup re-runnable.
await edit("package.json", (s) =>
  s
    .replace(/"name":\s*"template"/, `"name": "${name}"`)
    .replace(/^.*"setup":.*scripts\/setup\.mjs.*\r?\n/m, ""),
);
await Promise.all(["scripts/setup.mjs", "app/pages/components.vue"].map(del));

console.log(`\n✔ Renamed project to "${name}".`);
console.log(
  "  Removed: setup script, /components demo page" + (dropNotes ? ", notes feature" : ""),
);
for (const w of warnings) console.log(`  ! ${w}`);

console.log("\nNext:");
if (!domain) {
  console.log("  • Set a domain in wrangler.jsonc `routes` (or remove it for *.workers.dev)");
}
console.log(`  • bunx wrangler d1 create ${name}-db`);
console.log("  • Paste the returned database_id into wrangler.jsonc (REPLACE_WITH_D1_DATABASE_ID)");
console.log("  • grep -ri humanonlyweb . for any branding this script missed");
if (dropNotes) {
  console.log("  • DOCS/ still uses `notes` as its worked example — read it, then trim");
  console.log("  • bun run db:generate  &&  bun run db:migrate:local  &&  bun run dev");
} else {
  console.log("  • bun run db:migrate:local  &&  bun run dev");
}
