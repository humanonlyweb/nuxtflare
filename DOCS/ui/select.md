# UiSelect

Accessible listbox select. Auto-imported as `<UiSelect>` from
`app/components/ui/select.vue`. Generic over `T extends string | number`; two-way binds
with `v-model` (a `T`, or `T[]` when `multiple`).

## Props

| Prop          | Type                | Default              | Notes                                     |
| ------------- | ------------------- | -------------------- | ----------------------------------------- |
| `options`     | `SelectOption<T>[]` | `[]`                 | `{ label, value, disabled? }`             |
| `label`       | `string`            | —                    | Field label                               |
| `hint`        | `string`            | —                    | Helper text (hidden while an error shows) |
| `error`       | `string \| boolean` | —                    | String shows the message                  |
| `placeholder` | `string`            | `"Select an option"` | Shown when nothing is selected            |
| `multiple`    | `boolean`           | `false`              | Multi-select; `v-model` is `T[]`          |
| `disabled`    | `boolean`           | `false`              |                                           |
| `maxHeight`   | `number`            | `288`                | Max listbox height (px), capped to 40vh   |
| `id`          | `string`            | auto                 | Override the generated id                 |

`SelectOption<T>` and `SelectValue` come from `~/types/components.type`.

## Slots

| Slot      | Props                                          | Purpose                                                    |
| --------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `value`   | `{ selected: SelectOption<T>[], placeholder }` | Custom trigger content                                     |
| `option`  | `{ option, selected, active, index }`          | Custom option row                                          |
| `check`   | `{ selected }`                                 | Selected indicator (default `<UiIcon name="check" />`)     |
| `chevron` | —                                              | Trigger chevron (default `<UiIcon name="chevron-down" />`) |

## Styling hooks

`data-part="field" | "field-label" | "select-control" | "trigger" | "value" | "chevron"
| "listbox" | "option" | "option-check" | "option-label" | "field-message"`.
State: `data-field-error`, `data-select-open`, `data-select-error`,
`data-select-placeholder`, `data-select-drop-up="true|false"` (listbox),
`data-select-active` (option). Plus `aria-selected` / `aria-disabled` on options.

## Usage

```vue
<UiSelect v-model="fruit" label="Fruit" :options="fruitOptions" placeholder="Pick one" />
<UiSelect v-model="tags" label="Tags" multiple :options="tagOptions" />

<!-- Fully custom rendering via slots -->
<UiSelect v-model="status" :options="statusOptions">
  <template #value="{ selected }">…</template>
  <template #option="{ option, selected }">…</template>
</UiSelect>
```

## Notes

- Full keyboard support: arrows, Home/End, Enter/Space, Escape, Tab, and type-ahead.
- The listbox is a manual popover lifted into the top layer; it positions itself
  (including flipping up when there's no room below) via inline styles — you supply the
  chrome. Open/close motion is the `ui-select-pop` transition (reduced-motion gated).
