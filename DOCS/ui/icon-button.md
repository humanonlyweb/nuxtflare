# UiIconButton

A square, icon-only button. Auto-imported as `<UiIconButton>` from
`app/components/ui/icon-button.vue`.

It's a thin wrapper over [`UiButton`](./button.md) — same element polymorphism, same
variants, same styling hooks — that adds three things:

- **`label` is required** and becomes `aria-label`. An icon-only button has no text node,
  so without it screen readers announce nothing. Making it a required prop turns that
  from a review comment into a type error.
- **`data-button-icon-only`** for the square-padding rule in your skin.
- The icon renders into `UiButton`'s `leading` slot, so it is _not_ wrapped in
  `data-part="button-label"`.

## Props

| Prop       | Type                                                        | Default    | Notes                                            |
| ---------- | ----------------------------------------------------------- | ---------- | ------------------------------------------------ |
| `label`    | `string`                                                    | —          | **Required.** Becomes `aria-label`               |
| `variant`  | `"primary" \| "secondary" \| "ghost" \| "danger" \| "link"` | `"ghost"`  | Exposed as `data-button-variant`                 |
| `size`     | `"small" \| "medium" \| "large"`                            | `"medium"` | Exposed as `data-button-size`                    |
| `loading`  | `boolean`                                                   | `false`    | Disables, sets `aria-busy`, swaps icon → spinner |
| `disabled` | `boolean`                                                   | `false`    | Disables the button / link                       |
| `type`     | `"button" \| "submit" \| "reset"`                           | `"button"` | Only when rendering a `<button>`                 |
| `to`       | `RouteLocationRaw`                                          | —          | Renders `<NuxtLink>`                             |
| `href`     | `string`                                                    | —          | Renders `<a>`                                    |
| `target`   | `"_blank" \| "_self" \| "_parent" \| "_top"`                | —          | With `href`                                      |

No `fullWidth` — a full-width icon button isn't a thing.

The default variant is `ghost` rather than `primary`: icon buttons are usually secondary
affordances sitting in toolbars, table rows and dialog corners. Pass `variant` to override.

## Slots

| Slot      | Purpose                                              |
| --------- | ---------------------------------------------------- |
| `default` | The icon (rendered into `UiButton`'s `leading` slot) |
| `spinner` | Shown when `loading` (`data-part="button-spinner"`)  |

While `loading`, the icon is replaced by the spinner rather than sitting beside it — the
button is square, so there is no room for both and no width to jump.

## Styling hooks

Everything `UiButton` exposes (`data-part="button"`, `data-button-variant`,
`data-button-size`, `data-button-loading`, `data-button-disabled`), plus
`data-button-icon-only`.

Because it reuses `data-part="button"`, your base button rules apply as-is — you only add
the square override:

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

<UiIconButton label="Documentation" href="https://example.com" target="_blank">
  <UiIcon name="arrow-down" />
</UiIconButton>
```

## Notes

- Don't put a `label` on the inner `UiIcon` too — the button already names the control, and
  a labelled icon makes it announce twice. Leave the icon decorative (the default).
- `label` should describe the _action_, not the glyph: `"Delete note"`, not `"Trash icon"`.
- Pair it with [`UiTooltip`](./tooltip.md) for a visible hint; the `aria-label` still does
  the work for assistive tech, since tooltips aren't reachable by touch or keyboard alone.
- Prop types are declared inline in the SFC rather than imported from
  `app/types/components.type.ts`. That's deliberate: this project's SSR build runs the SFC
  compiler without filesystem access, so `defineProps<ImportedType>()` fails the build with
  `No fs option provided to compileScript`. `UiButton` does the same.
