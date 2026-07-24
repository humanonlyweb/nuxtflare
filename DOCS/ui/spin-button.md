# UiSpinButton

Numeric stepper, following the WAI-ARIA
[spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) pattern. Reach for it
over `<UiInput type="number">` when you want stepper buttons, clamping, or a formatted
display (units, currency).

## Props

| Prop        | Type                        | Default     | Notes                                       |
| ----------- | --------------------------- | ----------- | ------------------------------------------- |
| `min`       | `number`                    | `-Infinity` | Clamps; disables decrement at the edge      |
| `max`       | `number`                    | `Infinity`  | Clamps; disables increment at the edge      |
| `step`      | `number`                    | `1`         | Arrow key / button increment                |
| `largeStep` | `number`                    | `step * 10` | Page Up / Page Down increment               |
| `label`     | `string`                    | —           |                                             |
| `hint`      | `string`                    | —           | Helper text (hidden while an error shows)   |
| `error`     | `string \| boolean`         | —           | String shows the message                    |
| `disabled`  | `boolean`                   | `false`     |                                             |
| `readonly`  | `boolean`                   | `false`     |                                             |
| `format`    | `(value: number) => string` | —           | Display text, also used as `aria-valuetext` |
| `id`        | `string`                    | auto        | Override the generated id                   |

`v-model` binds `number | undefined` (undefined when empty). Unknown attrs fall through to
the input. Exposes `focus()`.

## Slots

| Slot        | Purpose                 |
| ----------- | ----------------------- |
| `decrement` | Decrement content (`−`) |
| `increment` | Increment content (`+`) |

## Styling hooks

Shared field parts `data-part="field" | "field-label" | "field-message"` plus
`data-part="spinbutton" | "spinbutton-input" | "spinbutton-decrement" | "spinbutton-increment"`.
State: `data-spinbutton-error`, `data-spinbutton-disabled`, `data-field-error`,
`data-field-tone`. The steppers carry native `:disabled` at the bounds.

## Usage

```vue
<UiSpinButton v-model="quantity" label="Quantity" :min="1" :max="99" />

<UiSpinButton
  v-model="temperature"
  label="Temperature"
  :min="-10"
  :max="40"
  :step="0.5"
  :format="(v) => `${v.toFixed(1)} °C`"
/>
```

## Notes

- Keyboard: ↑/↓ step, Page Up/Down by `largeStep`, Home/End jump to `min`/`max` (finite
  only). Typing is allowed and clamped on blur, so typing `1` on the way to `15` isn't
  yanked to a minimum mid-keystroke.
- Press-and-hold repeats after 400ms. The pointer is captured, so sliding off the button
  mid-hold doesn't stop it.
- The steppers are `tabindex="-1"`: one tab stop, arrows do the same job — same as native
  number inputs.
- `step`'s decimal precision is applied on every change, so `0.1 + 0.2` reads as `0.3`.
