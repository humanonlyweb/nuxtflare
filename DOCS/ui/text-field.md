# UiTextField

Labelled single-line text input. Auto-imported as `<UiTextField>` from
`app/components/ui/text-field.vue`. Two-way binds with `v-model`. For multi-line input
use [`UiTextarea`](./textarea.md).

## Props

| Prop           | Type      | Default  | Notes                                                   |
| -------------- | --------- | -------- | ------------------------------------------------------- |
| `label`        | `string`  | —        | Required. Clicking it focuses the field                 |
| `name`         | `string`  | —        | Native field name; `useForm` uses it for touch tracking |
| `type`         | `string`  | `"text"` | Input type (`email`, `password`, …)                     |
| `placeholder`  | `string`  | —        |                                                         |
| `required`     | `boolean` | `false`  | Native HTML validation                                  |
| `error`        | `string`  | —        | Shows the message and sets `aria-invalid`               |
| `autocomplete` | `string`  | `"off"`  |                                                         |
| `spellcheck`   | `boolean` | `false`  |                                                         |

`v-model` binds a `string`.

## Usage

```vue
<UiTextField v-model="email" label="Email" type="email" required :error="errors.email" />
```

## Notes

- Font size is clamped to ≥16px to stop iOS zooming on focus.
- The label is wired to the input via a generated `useId()`, so a click focuses it.
- Pass `error` from your Zod `safeParse` result to surface field-level messages.
