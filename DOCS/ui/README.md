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

Icons are slots. A few components (`UiSelect`, `UiAccordionItem`, `UiDialog`, `UiToast`)
default those slots to `UiIcon` so they look right out of the box — override the slot to
use your own markup, or swap the sprite in `public/assets/icon-sprite.svg`. See
[icon](./icon.md).

## Live examples

The `/components` page (`app/pages/components.vue`) renders every component with an
example skin you can copy from.

## Components

- [`UiButton`](./button.md)
- [`UiIconButton`](./icon-button.md)
- [`UiIcon`](./icon.md)
- [`UiInput`](./input.md)
- [`UiTextarea`](./textarea.md)
- [`UiCheckbox`](./checkbox.md)
- [`UiSwitch`](./switch.md)
- [`UiRadioGroup`](./radio-group.md)
- [`UiSpinButton`](./spin-button.md)
- [`UiSelect`](./select.md)
- [`UiMenu`](./menu.md)
- [`UiAccordion`](./accordion.md) (+ `UiAccordionItem`)
- [`UiTooltip`](./tooltip.md)
- [`UiDialog`](./dialog.md) (+ `UiDialogConfirm`)
- [`UiToast`](./toast.md) (+ `useToast`)
- [`UiTable`](./table.md) (+ Header/Row/Cell/Footer)
