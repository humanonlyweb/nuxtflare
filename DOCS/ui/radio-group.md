# UiRadioGroup

Single-choice radio group (WAI-ARIA [radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
pattern). Auto-imported as `<UiRadioGroup>` from `app/components/ui/radio-group.vue`.
Generic over `T extends string | number`; two-way binds the selected value with `v-model`.

## Props

| Prop          | Type                         | Default      | Notes                                     |
| ------------- | ---------------------------- | ------------ | ----------------------------------------- |
| `options`     | `SelectOption<T>[]`          | `[]`         | `{ label, value, disabled? }`             |
| `label`       | `string`                     | —            | Labels the group (`aria-labelledby`)      |
| `hint`        | `string`                     | —            | Helper text (hidden while an error shows) |
| `error`       | `string \| boolean`          | —            | String shows the message                  |
| `disabled`    | `boolean`                    | `false`      | Disables the whole group                  |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Exposed as `data-orientation`             |
| `id`          | `string`                     | auto         | Override the generated id                 |

`v-model` binds a `T`. `SelectOption<T>` comes from `~/types/components.type`.

## Slots

| Slot     | Props                 | Purpose                                                                                                                                         |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `option` | `{ option, checked }` | Replaces the whole radio content (default circle + label). Style the `[data-part="radio"][data-radio-checked]` button for card/segmented looks. |

## Styling hooks

Shared field parts `data-part="field" | "field-label" | "field-message"` plus
`data-part="radio-group" | "radio" | "radio-control" | "radio-label"`. State:
`data-orientation`, `data-field-error`, `data-radio-checked` (radio). Native `:disabled`
and `aria-checked` are present.

## Usage

```vue
<UiRadioGroup v-model="plan" label="Plan" :options="planOptions" :error="errors.plan" />
```

## Notes

- Roving tabindex: the group is one tab stop; arrows move between radios, selecting as
  they go (selection follows focus), and wrap at the ends. Home/End jump to first/last.
- Disabled options are skipped by keyboard navigation.
