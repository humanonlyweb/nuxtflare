# UiAccordion

Stacked disclosure sections (WAI-ARIA
[accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) pattern). Auto-imported
as `<UiAccordion>` (`accordion/index.vue`) and `<UiAccordionItem>` (`accordion/item.vue`).
Two components because panel content is arbitrary — items are written as markup, not data.

## UiAccordion

| Prop          | Type      | Default | Notes                                           |
| ------------- | --------- | ------- | ----------------------------------------------- |
| `multiple`    | `boolean` | `false` | Allow several panels open at once               |
| `collapsible` | `boolean` | `true`  | Single mode only — `false` keeps one panel open |

`v-model` binds the open item's `value` (a `string`, or `undefined` when all are closed);
with `multiple`, a `string[]`.

## UiAccordionItem

| Prop       | Type                    | Default | Notes                                      |
| ---------- | ----------------------- | ------- | ------------------------------------------ |
| `value`    | `string`                | —       | Required; identifies the item in `v-model` |
| `title`    | `string`                | —       | Header text (or use the `title` slot)      |
| `disabled` | `boolean`               | `false` |                                            |
| `level`    | `2 \| 3 \| 4 \| 5 \| 6` | `3`     | Heading level wrapping the trigger         |

| Slot        | Props      | Purpose                           |
| ----------- | ---------- | --------------------------------- |
| `default`   | —          | Panel content                     |
| `title`     | `{ open }` | Replaces the header text          |
| `indicator` | `{ open }` | Chevron / icon slot in the header |

## Styling hooks

`data-part="accordion" | "accordion-item" | "accordion-heading" | "accordion-trigger" |
"accordion-title" | "accordion-indicator" | "accordion-panel" | "accordion-content"`.
State: `data-accordion-open` (item, trigger and panel). `aria-expanded` and
`aria-disabled` are on the trigger.

The open/close height animation ships inside the component. Put panel padding on
`[data-part="accordion-content"]` — **not** on `accordion-panel`. The panel is the grid
container that animates, and padding on its grid item counts toward the track's base
size, so a padded item never collapses fully. `accordion-clip` sits between the two to
keep the grid item padding-free; it's mechanism, not a styling hook.

## Usage

```vue
<UiAccordion v-model="openSection">
  <UiAccordionItem value="shipping" title="How fast is shipping?">
    <template #indicator="{ open }">
      <span class="chevron" :data-open="open || undefined">▾</span>
    </template>
    <p>Orders placed before 2pm ship the same day.</p>
  </UiAccordionItem>
</UiAccordion>

<!-- Several panels open at once -->
<UiAccordion v-model="openSections" multiple> … </UiAccordion>
```

## Notes

- Keyboard: Enter/Space toggles, ↑/↓ move between headers (wrapping), Home/End jump to
  the first/last. Each header is its own tab stop, per the pattern.
- Panels animate `grid-template-rows: 0fr → 1fr`, so content height is never measured in
  JS and dynamic content just works. Collapsing runs faster than expanding.
- A closed panel is `inert`, keeping its content out of the tab order and the a11y tree
  while it stays in the DOM for the transition.
- With `collapsible: false`, the open header gets `aria-disabled` rather than `disabled` —
  it stays focusable, as the pattern requires.
