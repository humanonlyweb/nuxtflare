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

// Checkbox
const terms = ref(false);
const newsletter = ref(true);
const fruitsChecked = ref<string[]>(["apple"]);
const allFruitValues = ["apple", "banana", "cherry"];
const allFruitsChecked = computed({
  get: () => fruitsChecked.value.length === allFruitValues.length,
  set: (v) => (fruitsChecked.value = v ? [...allFruitValues] : []),
});
const someFruitsChecked = computed(
  () => fruitsChecked.value.length > 0 && fruitsChecked.value.length < allFruitValues.length,
);

// Spin button
const quantity = ref(1);
const temperature = ref(20.5);
const seats = ref(3);

// Accordion
const faq = ref<string>("shipping");
const sections = ref<string[]>(["general"]);
const emailAlerts = ref(true);
const compactLayout = ref(false);

// Radio
const plan = ref<string>("free");
const planOptions: SelectOption<string>[] = [
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
  { label: "Enterprise (contact us)", value: "enterprise", disabled: true },
];

const billing = ref<string>("monthly");
const billingOptions: SelectOption<string>[] = [
  { label: "Monthly · $12/mo", value: "monthly" },
  { label: "Yearly · $9/mo", value: "yearly" },
];

// Menu
const menuItems: SelectOption<string>[] = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Archive", value: "archive" },
  { label: "Delete", value: "delete" },
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
      <h2>Checkbox</h2>
      <div class="col">
        <UiCheckbox v-model="terms">I accept the terms</UiCheckbox>
        <UiCheckbox v-model="newsletter" label="Send me product updates" />
        <UiCheckbox :model-value="true" disabled label="Required (disabled)" />
      </div>

      <div class="col" style="margin-top: 0.5rem">
        <UiCheckbox
          v-model="allFruitsChecked"
          :indeterminate="someFruitsChecked"
          label="Select all"
        />
        <div class="col" style="padding-inline-start: 1.5rem; gap: 0.5rem">
          <UiCheckbox
            v-for="f in allFruitValues"
            :key="f"
            v-model="fruitsChecked"
            :value="f"
            :label="f"
          />
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Spin button</h2>
      <div class="grid">
        <UiSpinButton
          v-model="quantity"
          label="Quantity"
          :min="1"
          :max="99"
          hint="Hold to repeat."
        />
        <UiSpinButton
          v-model="temperature"
          label="Temperature"
          :min="-10"
          :max="40"
          :step="0.5"
          :format="(v) => `${v.toFixed(1)} °C`"
        />
        <UiSpinButton
          v-model="seats"
          label="Seats"
          :min="1"
          :max="4"
          error="Only 4 seats left on this table."
        />
      </div>
    </section>

    <section class="section">
      <h2>Radio group</h2>
      <UiRadioGroup v-model="plan" label="Plan" :options="planOptions" hint="Change anytime." />

      <!-- Custom #option slot: card-style radios, no default circle. -->
      <div class="card-radios">
        <UiRadioGroup
          v-model="billing"
          label="Billing"
          :options="billingOptions"
          orientation="horizontal"
        >
          <template #option="{ option }">
            <span class="card-radio-label">{{ option.label }}</span>
          </template>
        </UiRadioGroup>
      </div>
    </section>

    <section class="section">
      <h2>Menu</h2>
      <UiMenu
        label="Actions ▾"
        :items="menuItems"
        @select="(v) => toast.success(`Selected: ${v}`)"
      />
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

    <section class="section">
      <h2>Accordion</h2>
      <UiAccordion v-model="faq">
        <UiAccordionItem value="shipping" title="How fast is shipping?">
          <template #indicator="{ open }">
            <span class="chevron" :data-open="open || undefined">▾</span>
          </template>
          <p>Orders placed before 2pm ship the same day, anywhere in the country.</p>
        </UiAccordionItem>
        <UiAccordionItem value="returns" title="Can I return an item?">
          <template #indicator="{ open }">
            <span class="chevron" :data-open="open || undefined">▾</span>
          </template>
          <p>Thirty days, no questions asked — as long as the tags are still on.</p>
        </UiAccordionItem>
        <UiAccordionItem value="support" title="How do I reach support?">
          <template #indicator="{ open }">
            <span class="chevron" :data-open="open || undefined">▾</span>
          </template>
          <p>Email us, or open a chat from the dashboard. We answer within a day.</p>
          <UiButton size="small" variant="secondary" @click="toast.success('Chat opened.')">
            Start a chat
          </UiButton>
        </UiAccordionItem>
      </UiAccordion>

      <!-- multiple: several panels open at once. -->
      <UiAccordion v-model="sections" multiple>
        <UiAccordionItem value="general" title="General">
          <template #indicator="{ open }">
            <span class="chevron" :data-open="open || undefined">▾</span>
          </template>
          <UiSwitch v-model="emailAlerts" label="Email notifications" />
        </UiAccordionItem>
        <UiAccordionItem value="appearance" title="Appearance">
          <template #indicator="{ open }">
            <span class="chevron" :data-open="open || undefined">▾</span>
          </template>
          <UiSwitch v-model="compactLayout" label="Compact layout" />
        </UiAccordionItem>
      </UiAccordion>
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

/* Spin button */
.components :deep([data-part="spinbutton"]) {
  display: flex;
  align-items: stretch;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.components :deep([data-part="spinbutton"]:focus-within) {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--ring);
}
.components :deep([data-spinbutton-error]) {
  border-color: var(--danger);
}
.components :deep([data-spinbutton-disabled]) {
  opacity: 0.5;
}
.components :deep([data-part="spinbutton-input"]) {
  flex: 1;
  min-width: 0;
  padding: 0.6rem 0.25rem;
  font: inherit;
  font-size: max(1rem, 16px);
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: var(--text);
  background: none;
  border: none;
  outline: none;
}
.components :deep([data-part="spinbutton-decrement"]),
.components :deep([data-part="spinbutton-increment"]) {
  width: 2.5rem;
  font-size: 1.1rem;
  line-height: 1;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
}
.components :deep([data-part="spinbutton-decrement"]:hover:not(:disabled)),
.components :deep([data-part="spinbutton-increment"]:hover:not(:disabled)) {
  color: var(--text);
}
.components :deep([data-part="spinbutton-decrement"]:disabled),
.components :deep([data-part="spinbutton-increment"]:disabled) {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Accordion */
.components :deep([data-part="accordion"]) {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.components :deep([data-part="accordion-item"] + [data-part="accordion-item"]) {
  border-top: 1px solid var(--border);
}
.components :deep([data-part="accordion-trigger"]) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 0.85rem 1rem;
  font: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  text-align: start;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
}
.components :deep([data-part="accordion-trigger"]:hover) {
  background: color-mix(in oklch, var(--text) 4%, transparent);
}
.components :deep([data-part="accordion-trigger"]:focus-visible) {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--accent);
}
.components :deep([data-part="accordion-content"]) {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.75rem;
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.chevron {
  display: inline-block;
  color: var(--text-muted);
  transition: transform 200ms var(--ease-out);
}
.chevron[data-open] {
  transform: rotate(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .chevron {
    transition: none;
  }
}

/* Checkbox — hide the native input, style the control box via its pseudo-classes. */
.components :deep([data-part="checkbox"]) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.components :deep([data-part="checkbox"][data-checkbox-disabled]) {
  opacity: 0.5;
  cursor: not-allowed;
}
.components :deep([data-part="checkbox-input"]) {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}
.components :deep([data-part="checkbox-control"]) {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--accent-contrast);
  border: 1px solid var(--border);
  border-radius: 5px;
}
.components :deep([data-part="checkbox-input"]:checked + [data-part="checkbox-control"]),
.components :deep([data-part="checkbox-input"]:indeterminate + [data-part="checkbox-control"]) {
  background: var(--accent);
  border-color: var(--accent);
}
.components :deep([data-part="checkbox-input"]:checked + [data-part="checkbox-control"])::after {
  content: "✓";
  font-size: 0.75rem;
  line-height: 1;
}
.components
  :deep([data-part="checkbox-input"]:indeterminate + [data-part="checkbox-control"])::after {
  content: "–";
  font-weight: 700;
  line-height: 1;
}
.components :deep([data-part="checkbox-input"]:focus-visible + [data-part="checkbox-control"]) {
  outline: none;
  box-shadow: 0 0 0 3px var(--ring);
}
.components :deep([data-part="checkbox-label"]) {
  font-size: 0.9rem;
}

/* Radio group */
.components :deep([data-part="radio-group"]) {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.components :deep([data-part="radio-group"][data-orientation="horizontal"]) {
  flex-direction: row;
  gap: 1rem;
}
.components :deep([data-part="radio"]) {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0;
  font: inherit;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer;
  text-align: start;
}
.components :deep([data-part="radio"]:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
.components :deep([data-part="radio-control"]) {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1px solid var(--border);
  border-radius: 50%;
}
.components :deep([data-radio-checked] [data-part="radio-control"]) {
  border-color: var(--accent);
}
.components :deep([data-radio-checked] [data-part="radio-control"])::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}
.components :deep([data-part="radio"]:focus-visible [data-part="radio-control"]) {
  outline: none;
  box-shadow: 0 0 0 3px var(--ring);
}

/* Custom card radios — the #option slot drops the circle, so the whole button
   is the target. These rules come after the base radio skin, so they win. */
.card-radios :deep([data-part="radio"]) {
  padding: 0.7rem 1.1rem;
  font-weight: 600;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}
.card-radios :deep([data-part="radio"][data-radio-checked]) {
  border-color: var(--accent);
  background: color-mix(in oklch, var(--accent) 10%, transparent);
}
.card-radios :deep([data-part="radio"]:focus-visible) {
  outline: none;
  box-shadow: 0 0 0 3px var(--ring);
}

/* Menu */
.components :deep([data-part="menu-trigger"]) {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  font: inherit;
  font-weight: 600;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.components :deep([data-part="menu-trigger"]:focus-visible) {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--ring);
}
.components :deep([data-part="menu-list"]) {
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
}
.components :deep([data-part="menu-item"]) {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  font: inherit;
  color: var(--text);
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: start;
}
.components :deep([data-part="menu-item"][data-menu-active]) {
  background: color-mix(in oklch, var(--accent) 14%, transparent);
}
.components :deep([data-part="menu-item"]:disabled) {
  color: var(--text-muted);
  cursor: not-allowed;
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
