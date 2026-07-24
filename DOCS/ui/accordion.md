# UiAccordion

Stacked disclosure sections
([accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) pattern). Two components
because panel content is arbitrary — items are markup, not data.

## UiAccordion

| Prop          | Type      | Default | Notes                                           |
| ------------- | --------- | ------- | ----------------------------------------------- |
| `multiple`    | `boolean` | `false` | Several panels open at once                     |
| `collapsible` | `boolean` | `true`  | Single mode only — `false` keeps one panel open |

`v-model` binds the open item's `value` (a `string`, `undefined` when all closed), or a
`string[]` with `multiple`.

## UiAccordionItem

| Prop       | Type                    | Default | Notes                                      |
| ---------- | ----------------------- | ------- | ------------------------------------------ |
| `value`    | `string`                | —       | Required; identifies the item in `v-model` |
| `title`    | `string`                | —       | Or use the `title` slot                    |
| `disabled` | `boolean`               | `false` |                                            |
| `level`    | `2 \| 3 \| 4 \| 5 \| 6` | `3`     | Heading level around the trigger           |

| Slot        | Props      | Purpose                                                     |
| ----------- | ---------- | ----------------------------------------------------------- |
| `default`   | —          | Panel content                                               |
| `title`     | `{ open }` | Replaces the header text                                    |
| `indicator` | `{ open }` | Header indicator (default `<UiIcon name="chevron-down" />`) |

## Styling hooks

`data-part="accordion" | "accordion-item" | "accordion-heading" | "accordion-trigger" |
"accordion-title" | "accordion-indicator" | "accordion-panel" | "accordion-content"`.
State: `data-accordion-open` (item, trigger, panel), plus `aria-expanded` /
`aria-disabled` on the trigger.

Put panel padding on `[data-part="accordion-content"]` — **not** on `accordion-panel`. The
panel is the grid container that animates, and padding on its grid item counts toward the
track's base size, so a padded item never collapses fully. `accordion-clip` sits between
the two to keep the grid item padding-free; it's mechanism, not a styling hook.

## Usage

```vue
<UiAccordion v-model="openSection">
  <UiAccordionItem value="shipping" title="How fast is shipping?">
    <p>Orders placed before 2pm ship the same day.</p>
  </UiAccordionItem>
</UiAccordion>

<UiAccordion v-model="openSections" multiple> … </UiAccordion>
```

## Notes

- Keyboard: Enter/Space toggles, ↑/↓ move between headers (wrapping), Home/End jump to
  first/last. Each header is its own tab stop, per the pattern.
- Panels animate `grid-template-rows: 0fr → 1fr`, so height is never measured in JS and
  dynamic content just works. Collapsing runs faster than expanding.
- A closed panel is `inert` — out of the tab order and the a11y tree, but still in the DOM
  for the transition.
- With `collapsible: false` the open header gets `aria-disabled`, not `disabled`, so it
  stays focusable as the pattern requires.
