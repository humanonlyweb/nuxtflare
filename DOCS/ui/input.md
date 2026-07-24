# UiInput

Labelled single-line input. Multi-line → [`UiTextarea`](./textarea.md); picker →
[`UiSelect`](./select.md).

## Props

| Prop        | Type                                                                                  | Default    | Notes                                                |
| ----------- | ------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------- |
| `label`     | `string`                                                                              | —          | Wired via `useId()`; click focuses                   |
| `hint`      | `string`                                                                              | —          | Helper text (hidden while an error shows)            |
| `error`     | `string \| boolean`                                                                   | —          | String shows the message; either sets `aria-invalid` |
| `prefix`    | `string`                                                                              | —          | Leading affix (`$`)                                  |
| `suffix`    | `string`                                                                              | —          | Trailing affix (`USD`)                               |
| `optional`  | `boolean`                                                                             | `false`    | Appends an "(optional)" marker                       |
| `disabled`  | `boolean`                                                                             | `false`    |                                                      |
| `type`      | `"text" \| "email" \| "search" \| "url" \| "tel" \| "password" \| "number" \| "date"` | `"text"`   |                                                      |
| `size`      | `"small" \| "medium"`                                                                 | `"medium"` | → `data-field-size`                                  |
| `formatter` | `(value: string) => string`                                                           | —          | Normalises on blur and after paste                   |
| `id`        | `string`                                                                              | auto       | Override the generated id                            |

`v-model` binds `string | number`. Unknown attrs (`name`, `placeholder`, `required`,
`autocomplete`…) fall through to the native `<input>`.

## Styling hooks

Shared field parts `data-part="field" | "field-label" | "field-optional" | "field-message"`
plus `data-part="input-control" | "input" | "input-prefix" | "input-suffix"`. State:
`data-field-error`, `data-field-size`, `data-field-tone="error|hint"`, `data-input-error`,
`data-input-has-prefix`, `data-input-has-suffix`.

## Usage

```vue
<UiInput v-model="email" label="Email" type="email" required :error="errors.email" />
<UiInput v-model="price" label="Price" prefix="$" suffix="USD" type="number" />
```

## Notes

- Pass `error` straight from `useForm`'s `errors` — it covers both client and server messages.
- `defineExpose({ focus })` — call `inputRef.value.focus()` from a parent.
- Clamp font-size to ≥16px in your skin so iOS doesn't zoom on focus.
