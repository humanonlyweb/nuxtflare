# UiButton

Polymorphic button. Auto-imported as `<UiButton>` from `app/components/ui/button.vue`.
Renders a `<button>`, or a link when you pass `to` (Nuxt `<NuxtLink>`) or `href` (`<a>`).

## Props

| Prop        | Type                                                        | Default     | Notes                                            |
| ----------- | ----------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `variant`   | `"primary" \| "secondary" \| "ghost" \| "danger" \| "link"` | `"primary"` | Exposed as `data-button-variant`                 |
| `size`      | `"small" \| "medium" \| "large"`                            | `"medium"`  | Exposed as `data-button-size`                    |
| `fullWidth` | `boolean`                                                   | `false`     | Exposed as `data-button-full-width`              |
| `loading`   | `boolean`                                                   | `false`     | Disables, sets `aria-busy`, renders spinner slot |
| `disabled`  | `boolean`                                                   | `false`     | Disables the button / link                       |
| `type`      | `"button" \| "submit" \| "reset"`                           | `"button"`  | Only when rendering a `<button>`                 |
| `to`        | `RouteLocationRaw`                                          | —           | Renders `<NuxtLink>`                             |
| `href`      | `string`                                                    | —           | Renders `<a>`                                    |
| `target`    | `"_blank" \| "_self" \| "_parent" \| "_top"`                | —           | With `href`                                      |

## Slots

| Slot       | Purpose                                             |
| ---------- | --------------------------------------------------- |
| `default`  | Label (wrapped in `data-part="button-label"`)       |
| `leading`  | Content before the label (e.g. an icon)             |
| `trailing` | Content after the label                             |
| `spinner`  | Shown when `loading` (`data-part="button-spinner"`) |

## Styling hooks

`data-part="button" | "button-label" | "button-spinner"`;
state `data-button-variant`, `data-button-size`, `data-button-full-width`,
`data-button-loading`, `data-button-disabled`.

## Usage

```vue
<UiButton type="submit" :loading="pending">Save</UiButton>
<UiButton variant="ghost" @click="cancel">Cancel</UiButton>
<UiButton variant="danger" aria-label="Delete" @click="remove(id)">Delete</UiButton>
<UiButton to="/dashboard">Dashboard</UiButton>
<UiButton href="https://example.com" target="_blank">Docs</UiButton>
```

## Notes

- `:loading` disables the button (prevents duplicate submits) and toggles `aria-busy`.
- Icon-only buttons must set an explicit `aria-label`.
- Built-in motion: press scales to `0.98` (full-width to a gentler `0.995`); reduced-motion disables it. All colour/padding/radius is your CSS.
