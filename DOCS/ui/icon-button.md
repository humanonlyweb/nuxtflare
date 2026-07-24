# UiIconButton

A square, icon-only button. Thin wrapper over [`UiButton`](./button.md) — same
polymorphism, same variants, same styling hooks — that adds three things:

- **`label` is required** and becomes `aria-label`. An icon-only button has no text node,
  so without it screen readers announce nothing. Making it a prop turns that from a review
  comment into a type error.
- **`data-button-icon-only`**, for the square-padding rule in your skin.
- The icon renders into `UiButton`'s `leading` slot, so it's _not_ wrapped in
  `data-part="button-label"`.

## Props

| Prop       | Type                                                        | Default    | Notes                              |
| ---------- | ----------------------------------------------------------- | ---------- | ---------------------------------- |
| `label`    | `string`                                                    | —          | **Required.** Becomes `aria-label` |
| `variant`  | `"primary" \| "secondary" \| "ghost" \| "danger" \| "link"` | `"ghost"`  |                                    |
| `size`     | `"small" \| "medium" \| "large"`                            | `"medium"` |                                    |
| `loading`  | `boolean`                                                   | `false`    | Swaps icon → spinner               |
| `disabled` | `boolean`                                                   | `false`    |                                    |
| `type`     | `"button" \| "submit" \| "reset"`                           | `"button"` | Only as a `<button>`               |
| `to`       | `RouteLocationRaw`                                          | —          | Renders `<NuxtLink>`               |
| `href`     | `string`                                                    | —          | Renders `<a>`                      |
| `target`   | `"_blank" \| "_self" \| "_parent" \| "_top"`                | —          | With `href`                        |

No `fullWidth` — a full-width icon button isn't a thing. Default variant is `ghost`
because icon buttons usually sit in toolbars, table rows and dialog corners.

## Slots

| Slot      | Purpose                                     |
| --------- | ------------------------------------------- |
| `default` | The icon (goes into `UiButton`'s `leading`) |
| `spinner` | Shown while `loading`                       |

While loading the icon is _replaced_ by the spinner — the button is square, so there's no
room for both and no width to jump.

## Styling hooks

Everything `UiButton` exposes, plus `data-button-icon-only`. Your base button rules apply
as-is; you only add the square override:

```css
[data-button-icon-only] {
  padding: 0.55rem;
  aspect-ratio: 1;
}
[data-button-icon-only][data-button-size="small"] {
  padding: 0.4rem;
}
[data-button-icon-only][data-button-size="large"] {
  padding: 0.75rem;
}
```

## Usage

```vue
<UiIconButton label="Edit" @click="edit(row.id)">
  <UiIcon name="pencil" />
</UiIconButton>

<UiIconButton label="Delete" variant="danger" :loading="removing" @click="remove(row.id)">
  <UiIcon name="trash" />
</UiIconButton>
```

## Notes

- Don't label the inner `UiIcon` too — the button already names the control, and a labelled
  icon announces twice. Leave the icon decorative (the default).
- `label` describes the _action_: `"Delete note"`, not `"Trash icon"`.
- Pair with [`UiTooltip`](./tooltip.md) for a visible hint; `aria-label` still does the
  real work, since tooltips aren't reachable by touch or keyboard alone.
- Prop types are inline in the SFC rather than imported from
  `app/types/components.type.ts`. Deliberate: this project's SSR build runs the SFC
  compiler without filesystem access, so `defineProps<ImportedType>()` fails with
  `No fs option provided to compileScript`. `UiButton` does the same.
