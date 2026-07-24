# UiSwitch

Toggle switch (`role="switch"`). Binds a boolean.

## Props

| Prop       | Type                  | Default    | Notes                |
| ---------- | --------------------- | ---------- | -------------------- |
| `label`    | `string`              | —          | Or use the slot      |
| `size`     | `"small" \| "medium"` | `"medium"` | → `data-switch-size` |
| `disabled` | `boolean`             | `false`    |                      |

The default slot overrides `label`. No `error` prop — render validation messages yourself.

## Styling hooks

`data-part="switch" | "track" | "thumb" | "switch-label"`; state `data-switch-size`,
`data-switch-checked`. Native `:disabled` and `aria-checked` are there too.

## Usage

```vue
<UiSwitch v-model="notifications" label="Email notifications" />
<UiSwitch v-model="compact" size="small">Compact mode</UiSwitch>
```

## Notes

- Your skin sets track/thumb size and the checked transform; the component only ships the
  thumb's `transition` (reduced-motion gated) so the move animates.
- Toggles on click and on Space/Enter — it's a native `<button>`.
