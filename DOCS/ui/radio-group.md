# UiRadioGroup

Single-choice radio group, following the WAI-ARIA
[radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) pattern. Generic over
`T extends string | number`.

## Props

| Prop          | Type                         | Default      | Notes                                     |
| ------------- | ---------------------------- | ------------ | ----------------------------------------- |
| `options`     | `SelectOption<T>[]`          | `[]`         | `{ label, value, disabled? }`             |
| `label`       | `string`                     | —            | Labels the group (`aria-labelledby`)      |
| `hint`        | `string`                     | —            | Helper text (hidden while an error shows) |
| `error`       | `string \| boolean`          | —            | String shows the message                  |
| `disabled`    | `boolean`                    | `false`      | Disables the whole group                  |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | → `data-orientation`                      |
| `id`          | `string`                     | auto         | Override the generated id                 |

## Slots

| Slot     | Props                 | Purpose                                                                                               |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| `option` | `{ option, checked }` | Replaces the radio content. Style `[data-part="radio"][data-radio-checked]` for card/segmented looks. |

## Styling hooks

Shared field parts `data-part="field" | "field-label" | "field-message"` plus
`data-part="radio-group" | "radio" | "radio-control" | "radio-label"`. State:
`data-orientation`, `data-field-error`, `data-radio-checked`. Native `:disabled` and
`aria-checked` are present.

## Usage

```vue
<UiRadioGroup v-model="plan" label="Plan" :options="planOptions" :error="errors.plan" />
```

## Notes

- Roving tabindex: the group is one tab stop. Arrows move between radios and select as they
  go (selection follows focus), wrapping at the ends; Home/End jump to first/last.
- Disabled options are skipped by the keyboard.
