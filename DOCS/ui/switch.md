# UiSwitch

Toggle switch (`role="switch"`). Auto-imported as `<UiSwitch>` from
`app/components/ui/switch.vue`. Two-way binds a boolean with `v-model`.

## Props

| Prop       | Type                  | Default    | Notes                         |
| ---------- | --------------------- | ---------- | ----------------------------- |
| `label`    | `string`              | —          | Text label (or use the slot)  |
| `size`     | `"small" \| "medium"` | `"medium"` | Exposed as `data-switch-size` |
| `disabled` | `boolean`             | `false`    |                               |

`v-model` binds a `boolean`. The default slot overrides `label`.

## Styling hooks

`data-part="switch" | "track" | "thumb" | "switch-label"`; state `data-switch-size`,
`data-switch-checked`. Native `:disabled` and `aria-checked` are also present.

## Usage

```vue
<UiSwitch v-model="notifications" label="Email notifications" />
<UiSwitch v-model="compact" size="small">Compact mode</UiSwitch>
```

## Notes

- Your skin sets the track/thumb size and the checked-state transform; the component
  only ships the thumb's `transition` (reduced-motion gated), so the move animates.
- Toggles on click and on Space/Enter (native `<button>`).
