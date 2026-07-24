# UI kit

Styleless base components in `app/components/ui/`, auto-imported with the `Ui` prefix
(`button.vue` → `<UiButton>`, `dialog/index.vue` → `<UiDialog>`, `dialog/confirm.vue` →
`<UiDialogConfirm>`, …).

**Styleless** means behaviour, accessibility and motion ship inside; every visual (colour,
border, padding, radius, sizing) is yours. A fresh install renders unstyled until you add
CSS.

## Styling hooks

Two attribute conventions, both stable API:

- **Structure** — `data-part="<name>"` on each element (`trigger`, `option`, `thumb`).
  Values are unique, so they never clash.
- **State / variant** — namespaced per component as `data-<family>-<name>`
  (`data-button-variant="danger"`, `data-select-open`, `data-switch-checked`). Namespacing
  stops a bare `[data-open]` elsewhere in your app from colliding.

```css
[data-part="button"] {
  /* base */
}
[data-button-variant="danger"] {
  /* danger */
}
[data-part="trigger"][data-select-open] {
  /* an open select */
}
```

Standard ARIA (`aria-selected`, `aria-expanded`, `aria-checked`, `aria-invalid`) is there
too, and just as styleable.

## What's inside vs. what's yours

Components ship only motion and the CSS they can't work without — popover positioning,
sticky headers, horizontal scroll, the dialog's open/close and centering, tooltip arrow
geometry. Everything else is your CSS. Motion uses the shared `--ease-out` /
`--ease-in-out` tokens (`app/assets/styles/app.css`) and is reduced-motion gated.

The field components (`UiInput`, `UiTextarea`, `UiSelect`, `UiRadioGroup`, `UiSpinButton`)
share a `field` family — `data-part="field" | "field-label" | "field-message"`, plus
`data-field-error` / `data-field-tone` — so one set of rules skins all five. They also
share `label` / `hint` / `error` / `id` and the `aria-invalid` + `aria-describedby` wiring
via `useField`. `UiCheckbox` and `UiSwitch` aren't in that family: no `error` prop, so
render your own messages.

Icons are slots. `UiSelect`, `UiAccordionItem`, `UiDialog` and `UiToast` default theirs to
`UiIcon` so they look right untouched — override the slot for your own markup, or swap the
sprite in `public/assets/icon-sprite.svg`. See [icon](./icon.md).

## Live examples

`/components` (`app/pages/components.vue`) renders every component with an example skin
you can copy.

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
