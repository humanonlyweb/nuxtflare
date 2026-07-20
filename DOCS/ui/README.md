# UI kit

Styleless base components in `app/components/ui/`, auto-imported with the `Ui` prefix
(`button.vue` → `<UiButton>`, `dialog/index.vue` → `<UiDialog>`,
`dialog/confirm.vue` → `<UiDialogConfirm>`, `table/index.vue` → `<UiTable>`, …).

**Styleless** means behaviour, accessibility and motion ship inside the component;
every visual (colour, border, padding, radius, sizing) is yours. A fresh install
renders unstyled until you add CSS.

## Styling hooks

Two attribute conventions, both stable API you can target from any stylesheet:

- **Structure** — `data-part="<name>"` on each element (`data-part="trigger"`,
  `data-part="option"`, `data-part="thumb"`). Values are unique, so they never clash.
- **State / variant** — namespaced per component as `data-<family>-<name>`
  (`data-button-variant="danger"`, `data-select-open`, `data-switch-checked`,
  `data-field-error`). Namespacing stops a bare `[data-open]` in your app or a
  third-party library from colliding with a component's state.

```css
[data-part="button"] {
  /* base */
}
[data-button-variant="danger"] {
  /* danger variant */
}
[data-part="trigger"][data-select-open] {
  /* an open select */
}
```

Standard ARIA (`aria-selected`, `aria-expanded`, `aria-checked`, `aria-disabled`,
`aria-invalid`) is present too and equally styleable.

## What lives inside vs. what's yours

Components ship **only** motion and the CSS they can't function without — popover
positioning, sticky headers, horizontal scroll, the dialog's open/close display and
centering, tooltip arrow geometry. Everything else is your CSS. Motion uses the shared
`--ease-out` / `--ease-in-out` tokens (`app/assets/styles/app.css`) and is
reduced-motion gated.

Field components (`UiInput`, `UiTextarea`, `UiSelect`) share a `field` family
(`data-part="field" | "field-label" | "field-message"`, plus `data-field-error` /
`data-field-tone`) so one set of rules skins all three.

Icons are slots — the kit has no icon dependency.

## Live examples

The `/components` page (`app/pages/components.vue`) renders every component with an
example skin you can copy from.

## Components

| Component                            | Source            | Docs                            |
| ------------------------------------ | ----------------- | ------------------------------- |
| `UiButton`                           | `button.vue`      | [button](./button.md)           |
| `UiInput`                            | `input.vue`       | [input](./input.md)             |
| `UiTextarea`                         | `textarea.vue`    | [textarea](./textarea.md)       |
| `UiCheckbox`                         | `checkbox.vue`    | [checkbox](./checkbox.md)       |
| `UiSwitch`                           | `switch.vue`      | [switch](./switch.md)           |
| `UiRadioGroup`                       | `radio-group.vue` | [radio-group](./radio-group.md) |
| `UiSelect`                           | `select.vue`      | [select](./select.md)           |
| `UiMenu`                             | `menu.vue`        | [menu](./menu.md)               |
| `UiTooltip`                          | `tooltip.vue`     | [tooltip](./tooltip.md)         |
| `UiDialog` / `UiDialogConfirm`       | `dialog/`         | [dialog](./dialog.md)           |
| `UiToast` (+ `useToast`)             | `toast/`          | [toast](./toast.md)             |
| `UiTable` (+ Header/Row/Cell/Footer) | `table/`          | [table](./table.md)             |
