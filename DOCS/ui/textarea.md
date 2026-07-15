# UiTextarea

Labelled multi-line text input. Auto-imported as `<UiTextarea>` from
`app/components/ui/textarea.vue`. Two-way binds with `v-model`. For single-line input
use [`UiTextField`](./text-field.md).

## Props

| Prop          | Type      | Default | Notes                                                   |
| ------------- | --------- | ------- | ------------------------------------------------------- |
| `label`       | `string`  | —       | Required. Clicking it focuses the field                 |
| `name`        | `string`  | —       | Native field name; `useForm` uses it for touch tracking |
| `placeholder` | `string`  | —       |                                                         |
| `required`    | `boolean` | `false` | Native HTML validation                                  |
| `error`       | `string`  | —       | Shows the message and sets `aria-invalid`               |
| `spellcheck`  | `boolean` | `true`  | On by default — textareas usually hold prose            |
| `rows`        | `number`  | `3`     | Initial visible rows (user can resize vertically)       |

`v-model` binds a `string`.

## Usage

```vue
<UiTextarea v-model="body" label="Note" placeholder="Write something…" :error="errors.body" />
```

## Notes

- Font size is clamped to ≥16px to stop iOS zooming on focus.
- The label is wired to the textarea via a generated `useId()`, so a click focuses it.
- Vertically resizable; `spellcheck` defaults on (unlike `UiTextField`).
