# UiButton

Polymorphic button. Renders a `<button>`, or a link when you pass `to` (`<NuxtLink>`) or
`href` (`<a>`).

## Props

| Prop        | Type                                                        | Default     | Notes                                            |
| ----------- | ----------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `variant`   | `"primary" \| "secondary" \| "ghost" \| "danger" \| "link"` | `"primary"` | → `data-button-variant`                          |
| `size`      | `"small" \| "medium" \| "large"`                            | `"medium"`  | → `data-button-size`                             |
| `fullWidth` | `boolean`                                                   | `false`     | → `data-button-full-width`                       |
| `loading`   | `boolean`                                                   | `false`     | Disables, sets `aria-busy`, renders spinner slot |
| `disabled`  | `boolean`                                                   | `false`     |                                                  |
| `type`      | `"button" \| "submit" \| "reset"`                           | `"button"`  | Only as a `<button>`                             |
| `to`        | `RouteLocationRaw`                                          | —           | Renders `<NuxtLink>`                             |
| `href`      | `string`                                                    | —           | Renders `<a>`                                    |
| `target`    | `"_blank" \| "_self" \| "_parent" \| "_top"`                | —           | With `href`                                      |

`to` / `href` / `type` are mutually exclusive at the type level.

## Slots

| Slot       | Purpose                                       |
| ---------- | --------------------------------------------- |
| `default`  | Label (wrapped in `data-part="button-label"`) |
| `leading`  | Before the label (an icon, say)               |
| `trailing` | After the label                               |
| `spinner`  | Shown while `loading`                         |

## Styling hooks

`data-part="button" | "button-label" | "button-spinner"`; state `data-button-variant`,
`data-button-size`, `data-button-full-width`, `data-button-loading`, `data-button-disabled`.

## Usage

```vue
<UiButton type="submit" :loading="pending">Save</UiButton>
<UiButton variant="ghost" @click="cancel">Cancel</UiButton>
<UiButton to="/dashboard">Dashboard</UiButton>
<UiButton href="https://example.com" target="_blank">Docs</UiButton>
```

## Notes

- `loading` disables the button (no double submits) and toggles `aria-busy`.
- Icon-only? Use [`UiIconButton`](./icon-button.md) — it makes the label required.
- Built-in motion: press scales to `0.98` (`0.995` full-width), reduced-motion off.
