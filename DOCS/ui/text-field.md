# UiTextField

Labelled text input (or textarea). Auto-imported as `<UiTextField>` from
`app/components/ui/text-field.vue`. Two-way binds with `v-model`.

## Props

| Prop           | Type      | Default  | Notes                                     |
| -------------- | --------- | -------- | ----------------------------------------- |
| `label`        | `string`  | —        | Required. Clicking it focuses the field   |
| `multiline`    | `boolean` | `false`  | Renders a `<textarea>`                    |
| `type`         | `string`  | `"text"` | Input type (`email`, `password`, …)       |
| `placeholder`  | `string`  | —        |                                           |
| `required`     | `boolean` | `false`  | Native HTML validation                    |
| `error`        | `string`  | —        | Shows the message and sets `aria-invalid` |
| `autocomplete` | `string`  | `"off"`  |                                           |
| `spellcheck`   | `boolean` | `false`  |                                           |
| `rows`         | `number`  | `3`      | Textarea rows                             |

`v-model` binds a `string`.

## Usage

```vue
<UiTextField v-model="email" label="Email" type="email" required :error="errors.email" />
<UiTextField v-model="body" label="Note" multiline :spellcheck="true" />
```

## Notes

- Font size is clamped to ≥16px to stop iOS zooming on focus.
- The label is wired to the input via a generated `useId()`, so a click focuses it.
- Pass `error` from your Zod `safeParse` result to surface field-level messages.
