# UiTextarea

Labelled multi-line input. Auto-imported as `<UiTextarea>` from
`app/components/ui/textarea.vue`. Two-way binds with `v-model`. For single-line input
use [`UiInput`](./input.md).

## Props

| Prop       | Type                | Default | Notes                                                |
| ---------- | ------------------- | ------- | ---------------------------------------------------- |
| `label`    | `string`            | —       | Wired to the textarea via `useId()`                  |
| `hint`     | `string`            | —       | Helper text (hidden while an error shows)            |
| `error`    | `string \| boolean` | —       | String shows the message; either sets `aria-invalid` |
| `optional` | `boolean`           | `false` | Appends an “(optional)” marker to the label          |
| `disabled` | `boolean`           | `false` |                                                      |
| `rows`     | `number`            | `4`     | Initial visible rows                                 |
| `id`       | `string`            | auto    | Override the generated id                            |

`v-model` binds a `string`. Unknown attributes (`name`, `placeholder`, `required`…)
fall through to the native `<textarea>`.

## Styling hooks

Shared field parts `data-part="field" | "field-label" | "field-optional" | "field-message"`
plus `data-part="textarea"`. State: `data-field-error`, `data-textarea-error`,
`data-field-tone="error|hint"` (message).

## Usage

```vue
<UiTextarea v-model="bio" label="Bio" :rows="3" :error="errors.bio" />
```

## Notes

- `defineExpose({ focus })` — call `textareaRef.value.focus()` from a parent.
- Set `resize`/`min-height` in your skin; the component leaves sizing to you.
