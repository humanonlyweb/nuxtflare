# UiInput

Labelled single-line input. Auto-imported as `<UiInput>` from
`app/components/ui/input.vue`. Two-way binds with `v-model`. For multi-line input use
[`UiTextarea`](./textarea.md); for a picker use [`UiSelect`](./select.md).

## Props

| Prop        | Type                                                                                  | Default    | Notes                                                |
| ----------- | ------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------- |
| `label`     | `string`                                                                              | —          | Wired to the input via `useId()`; click focuses      |
| `hint`      | `string`                                                                              | —          | Helper text (hidden while an error shows)            |
| `error`     | `string \| boolean`                                                                   | —          | String shows the message; either sets `aria-invalid` |
| `prefix`    | `string`                                                                              | —          | Leading affix (e.g. `$`)                             |
| `suffix`    | `string`                                                                              | —          | Trailing affix (e.g. `USD`)                          |
| `optional`  | `boolean`                                                                             | `false`    | Appends an “(optional)” marker to the label          |
| `disabled`  | `boolean`                                                                             | `false`    |                                                      |
| `type`      | `"text" \| "email" \| "search" \| "url" \| "tel" \| "password" \| "number" \| "date"` | `"text"`   | Input type                                           |
| `size`      | `"small" \| "medium"`                                                                 | `"medium"` | Exposed as `data-field-size`                         |
| `formatter` | `(value: string) => string`                                                           | —          | Normalises the value on blur and after paste         |
| `id`        | `string`                                                                              | auto       | Override the generated id                            |

`v-model` binds `string | number`. Unknown attributes (`name`, `placeholder`,
`required`, `autocomplete`…) fall through to the native `<input>`.

## Styling hooks

Shared field parts `data-part="field" | "field-label" | "field-optional" | "field-message"`
plus `data-part="input-control" | "input" | "input-prefix" | "input-suffix"`.
State: `data-field-error`, `data-field-size`, `data-field-tone="error|hint"` (message),
`data-input-error`, `data-input-has-prefix`, `data-input-has-suffix`.

## Usage

```vue
<UiInput v-model="email" label="Email" type="email" required :error="errors.email" />
<UiInput v-model="price" label="Price" prefix="$" suffix="USD" type="number" />
```

## Notes

- Pass `error` straight from a Zod `safeParse` result to surface field-level messages.
- `defineExpose({ focus })` — call `inputRef.value.focus()` from a parent.
- Clamp the font-size to ≥16px in your skin to stop iOS zooming on focus.
