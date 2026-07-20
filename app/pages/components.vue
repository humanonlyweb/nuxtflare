<script setup lang="ts">
import type { SelectOption, TableColumn } from "~/types/components.type";

useSeoMeta({
  title: "Components — humanonlyweb starter",
  description: "Styleless base UI components and example usage.",
});

const toast = useToast();

// Inputs
const name = ref("");
const price = ref("");
const withError = ref("");

// Textarea
const bio = ref("");

// Switches
const notifications = ref(true);
const compact = ref(false);

// Selects
const fruit = ref<string>();
const fruitOptions: SelectOption<string>[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Durian (out of stock)", value: "durian", disabled: true },
  { label: "Elderberry", value: "elderberry" },
];

const tags = ref<string[]>(["vue"]);
const tagOptions: SelectOption<string>[] = [
  { label: "Vue", value: "vue" },
  { label: "Nuxt", value: "nuxt" },
  { label: "Cloudflare", value: "cloudflare" },
  { label: "TypeScript", value: "typescript" },
];

// Select with custom slots
const status = ref<string>("active");
const statusOptions: SelectOption<string>[] = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
];

// Dialog
const dialogOpen = ref(false);
const confirmOpen = ref(false);

// Table
interface Person {
  id: number;
  name: string;
  role: string;
  commits: number;
}
const people: Person[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", commits: 128 },
  { id: 2, name: "Alan Turing", role: "Researcher", commits: 342 },
  { id: 3, name: "Grace Hopper", role: "Admiral", commits: 87 },
];
const columns: TableColumn<Person>[] = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
  { key: "commits", header: "Commits", numeric: true },
];
</script>

<template>
  <div class="components">
    <header class="lede">
      <h1>Components</h1>
      <p>
        Styleless base components — behaviour, accessibility and motion built in; every visual is a
        <code>data-part</code> hook you style yourself, with state namespaced per component
        (<code>data-button-loading</code>, <code>data-select-open</code>…). The CSS on this page is
        one example skin.
      </p>
    </header>

    <section class="section">
      <h2>Button</h2>
      <div class="row">
        <UiButton>Primary</UiButton>
        <UiButton variant="secondary">Secondary</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton variant="danger">Danger</UiButton>
        <UiButton variant="link">Link</UiButton>
      </div>
      <div class="row">
        <UiButton size="small">Small</UiButton>
        <UiButton size="medium">Medium</UiButton>
        <UiButton size="large">Large</UiButton>
        <UiButton loading>Loading</UiButton>
        <UiButton disabled>Disabled</UiButton>
      </div>
    </section>

    <section class="section">
      <h2>Input</h2>
      <div class="grid">
        <UiInput
          v-model="name"
          label="Name"
          placeholder="Ada Lovelace"
          hint="As it appears publicly."
        />
        <UiInput
          v-model="price"
          label="Price"
          prefix="$"
          suffix="USD"
          type="number"
          placeholder="0.00"
        />
        <UiInput
          v-model="withError"
          label="Username"
          optional
          :error="withError.includes(' ') ? 'No spaces allowed.' : undefined"
          placeholder="try typing a space"
        />
      </div>
    </section>

    <section class="section">
      <h2>Textarea</h2>
      <UiTextarea
        v-model="bio"
        label="Bio"
        hint="A sentence or two."
        placeholder="Tell us about yourself…"
      />
    </section>

    <section class="section">
      <h2>Switch</h2>
      <div class="col">
        <UiSwitch v-model="notifications" label="Email notifications" />
        <UiSwitch v-model="compact" size="small" label="Compact mode" />
        <UiSwitch :model-value="false" disabled label="Disabled" />
      </div>
    </section>

    <section class="section">
      <h2>Select</h2>
      <div class="grid">
        <UiSelect
          v-model="fruit"
          label="Favourite fruit"
          :options="fruitOptions"
          placeholder="Pick one"
        >
          <template #check="{ selected }">{{ selected ? "✓" : "" }}</template>
        </UiSelect>
        <UiSelect
          v-model="tags"
          label="Tags"
          multiple
          :options="tagOptions"
          placeholder="Pick a few"
        >
          <template #check="{ selected }">{{ selected ? "✓" : "" }}</template>
        </UiSelect>

        <!-- Custom #value and #option slots: fully bespoke rendering. -->
        <UiSelect v-model="status" label="Status (custom slots)" :options="statusOptions">
          <template #value="{ selected }">
            <span v-if="selected.length" class="status-value">
              <span class="status-dot" :data-status="selected[0]!.value" />
              {{ selected[0]!.label }}
            </span>
            <span v-else>Choose status…</span>
          </template>
          <template #option="{ option, selected }">
            <span class="status-dot" :data-status="option.value" />
            <span class="status-option-label">{{ option.label }}</span>
            <span v-if="selected" class="status-check">✓</span>
          </template>
        </UiSelect>
      </div>
    </section>

    <section class="section">
      <h2>Tooltip</h2>
      <div class="row">
        <UiTooltip text="Tooltip on top">
          <UiButton variant="secondary">Hover me (top)</UiButton>
        </UiTooltip>
        <UiTooltip text="Tooltip on bottom" placement="bottom">
          <UiButton variant="secondary">Hover me (bottom)</UiButton>
        </UiTooltip>
      </div>
    </section>

    <section class="section">
      <h2>Toast</h2>
      <div class="row">
        <UiButton variant="secondary" @click="toast.success('Saved successfully.')"
          >Success toast</UiButton
        >
        <UiButton variant="danger" @click="toast.error('Something went wrong.')"
          >Error toast</UiButton
        >
      </div>
    </section>

    <section class="section">
      <h2>Dialog</h2>
      <div class="row">
        <UiButton @click="dialogOpen = true">Open dialog</UiButton>
        <UiButton variant="danger" @click="confirmOpen = true">Delete something…</UiButton>
      </div>

      <UiDialog
        v-model:open="dialogOpen"
        title="Edit profile"
        description="Make changes and save when you're done."
      >
        <div class="col">
          <UiInput v-model="name" label="Name" placeholder="Ada Lovelace" />
          <UiTextarea v-model="bio" label="Bio" :rows="3" />
        </div>
        <template #footer="{ close }">
          <UiButton variant="ghost" @click="close">Cancel</UiButton>
          <UiButton @click="close">Save changes</UiButton>
        </template>
      </UiDialog>

      <UiDialogConfirm
        v-model:open="confirmOpen"
        title="Delete item?"
        description="This action can't be undone."
        confirm-text="Delete"
        danger
        @confirm="toast.error('Item deleted.')"
      />
    </section>

    <section class="section">
      <h2>Table</h2>
      <UiTable :columns="columns" :rows="people" row-key="id" caption="Team activity">
        <template #commits-cell="{ value }">
          <strong>{{ value }}</strong>
        </template>
      </UiTable>
    </section>

    <UiToast />
  </div>
</template>

<style scoped>
.components {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-block: 1rem 4rem;
}

.lede h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lede p {
  margin-top: 0.5rem;
  max-width: 56ch;
  color: var(--text-muted);
}

.lede code {
  padding: 0.1em 0.35em;
  font-size: 0.9em;
  background: color-mix(in oklch, var(--text) 8%, transparent);
  border-radius: 6px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section > h2 {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

/* Custom select-slot content (authored here, so plain scoped classes work). */
.status-value {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.status-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}
.status-dot[data-status="active"] {
  background: oklch(70% 0.17 145);
}
.status-dot[data-status="paused"] {
  background: oklch(76% 0.15 80);
}
.status-option-label {
  flex: 1;
}
.status-check {
  color: var(--accent);
}

/* ── Example skin for the styleless parts ─────────────────────────────────
   Everything below styles the components' data-part hooks. Copy, delete or
   rewrite freely — none of it lives inside the components. */

/* Button */
.components :deep([data-part="button"]) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.55rem 1rem;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  color: var(--accent-contrast);
  background: var(--accent);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
}
.components :deep([data-button-size="small"]) {
  padding: 0.4rem 0.7rem;
  font-size: 0.85rem;
}
.components :deep([data-button-size="large"]) {
  padding: 0.75rem 1.25rem;
  font-size: 1.05rem;
}
.components :deep([data-button-variant="secondary"]) {
  color: var(--text);
  background: var(--surface);
  border-color: var(--border);
}
.components :deep([data-button-variant="ghost"]) {
  color: var(--text);
  background: transparent;
  border-color: var(--border);
}
.components :deep([data-button-variant="danger"]) {
  color: var(--danger);
  background: transparent;
  border-color: color-mix(in oklch, var(--danger) 40%, transparent);
}
.components :deep([data-button-variant="link"]) {
  padding: 0;
  color: var(--accent);
  background: transparent;
}
.components :deep([data-button-disabled]) {
  opacity: 0.55;
  cursor: not-allowed;
}
.components :deep([data-part="button-spinner"]) {
  width: 0.85em;
  height: 0.85em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Fields (input / textarea / select share these) */
.components :deep([data-part="field"]) {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.components :deep([data-part="field-label"]) {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}
.components :deep([data-part="field-optional"]) {
  font-weight: 400;
  opacity: 0.7;
}
.components :deep([data-field-tone="error"]) {
  font-size: 0.8rem;
  color: var(--danger);
}
.components :deep([data-field-tone="hint"]) {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.components :deep([data-part="input-control"]) {
  position: relative;
  display: flex;
  align-items: center;
}
.components :deep([data-part="input"]),
.components :deep([data-part="textarea"]),
.components :deep([data-part="trigger"]) {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font: inherit;
  font-size: max(1rem, 16px);
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.components :deep([data-part="textarea"]) {
  resize: vertical;
  min-height: 5rem;
}
/* Drop the native number spinner so it doesn't collide with the suffix. */
.components :deep([data-part="input"][type="number"]) {
  appearance: textfield;
}
.components :deep([data-part="input"]::-webkit-inner-spin-button),
.components :deep([data-part="input"]::-webkit-outer-spin-button) {
  appearance: none;
  margin: 0;
}
.components :deep([data-part="input"]:focus-visible),
.components :deep([data-part="textarea"]:focus-visible),
.components :deep([data-part="trigger"]:focus-visible),
.components :deep([data-select-open]) {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--ring);
}
.components :deep([data-input-error]),
.components :deep([data-textarea-error]),
.components :deep([data-select-error]) {
  border-color: var(--danger);
}
.components :deep([data-input-has-prefix]) {
  padding-inline-start: 1.75rem;
}
.components :deep([data-input-has-suffix]) {
  padding-inline-end: 3rem;
}
.components :deep([data-part="input-prefix"]),
.components :deep([data-part="input-suffix"]) {
  position: absolute;
  color: var(--text-muted);
  pointer-events: none;
}
.components :deep([data-part="input-prefix"]) {
  inset-inline-start: 0.75rem;
}
.components :deep([data-part="input-suffix"]) {
  inset-inline-end: 0.75rem;
}

/* Switch */
.components :deep([data-part="switch"]) {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}
.components :deep([data-part="switch"][disabled]) {
  opacity: 0.5;
  cursor: not-allowed;
}
.components :deep([data-part="track"]) {
  display: inline-flex;
  align-items: center;
  width: 40px;
  height: 24px;
  padding: 3px;
  background: color-mix(in oklch, var(--text) 25%, transparent);
  border-radius: 999px;
  transition: background-color 0.15s ease;
}
.components :deep([data-switch-size="small"] [data-part="track"]) {
  width: 32px;
  height: 18px;
}
.components :deep([data-part="thumb"]) {
  width: 18px;
  height: 18px;
  background: var(--surface);
  border-radius: 50%;
}
.components :deep([data-switch-size="small"] [data-part="thumb"]) {
  width: 12px;
  height: 12px;
}
.components :deep([data-switch-checked] [data-part="track"]) {
  background: var(--accent);
}
.components :deep([data-switch-checked] [data-part="thumb"]) {
  transform: translateX(16px);
}
.components :deep([data-switch-size="small"][data-switch-checked] [data-part="thumb"]) {
  transform: translateX(14px);
}
.components :deep([data-part="switch-label"]) {
  font-size: 0.9rem;
  color: var(--text);
}

/* Select */
.components :deep([data-part="trigger"]) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  cursor: pointer;
  text-align: start;
}
.components :deep([data-select-placeholder]) {
  color: var(--text-muted);
}
.components :deep([data-part="listbox"]) {
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
}
.components :deep([data-part="option"]) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
}
.components :deep([data-part="option"][data-select-active]) {
  background: color-mix(in oklch, var(--accent) 14%, transparent);
}
.components :deep([data-part="option"][aria-selected="true"]) {
  font-weight: 600;
}
.components :deep([data-part="option"][aria-disabled]) {
  color: var(--text-muted);
  cursor: not-allowed;
}
.components :deep([data-part="option-check"]) {
  width: 1rem;
  color: var(--accent);
}
.components :deep([data-part="option-label"]) {
  flex: 1;
}

/* Tooltip */
.components :deep([data-part="tooltip"]) {
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--bg);
  background: var(--text);
  border-radius: 6px;
  /* Point the arrow at the same colour as the tooltip background. */
  --ui-tooltip-arrow: var(--text);
}

/* Dialog */
.components :deep([data-part="dialog"]) {
  width: min(440px, calc(100vw - 2rem));
  padding: 0;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.components :deep([data-part="dialog"]::backdrop) {
  background: oklch(0% 0 0 / 0.4);
}
.components :deep([data-part="header"]) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.25rem 0.5rem;
}
.components :deep([data-part="title"]) {
  font-size: 1.15rem;
  font-weight: 700;
}
.components :deep([data-part="description"]) {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.components :deep([data-part="close"]) {
  padding: 0.2rem 0.45rem;
  color: var(--text-muted);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.components :deep([data-part="body"]) {
  padding: 1rem 1.25rem;
}
.components :deep([data-part="footer"]) {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 1.25rem;
}

/* Table */
.components :deep([data-part="table"]) {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.components :deep([data-part="caption"]) {
  padding: 0.6rem 0.9rem;
  text-align: start;
  font-size: 0.85rem;
  color: var(--text-muted);
  caption-side: top;
}
.components :deep([data-part="cell"]) {
  padding: 0.6rem 0.9rem;
  text-align: start;
  border-bottom: 1px solid var(--border);
}
.components :deep(th[data-part="cell"]) {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
  background: color-mix(in oklch, var(--text) 3%, transparent);
}
.components :deep([data-table-numeric]) {
  text-align: end;
  font-variant-numeric: tabular-nums;
}
.components :deep([data-part="row"]:last-child [data-part="cell"]) {
  border-bottom: none;
}
</style>

<style>
[data-part="toast"] {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: min(340px, calc(100vw - 2rem));
  padding: 0.75rem 0.85rem;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
}
[data-part="toast"][data-toast-tone="danger"] {
  border-color: color-mix(in oklch, var(--danger) 35%, var(--border));
}
[data-part="toast-message"] {
  flex: 1;
  font-size: 0.9rem;
}
[data-part="toast-close"] {
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
}
</style>
