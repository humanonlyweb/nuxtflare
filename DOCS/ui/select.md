# UiSelect

Accessible listbox select. Generic over `T extends string | number`; `v-model` is a `T`,
or `T[]` when `multiple`.

## Props

| Prop          | Type                | Default              | Notes                                     |
| ------------- | ------------------- | -------------------- | ----------------------------------------- |
| `options`     | `SelectOption<T>[]` | `[]`                 | `{ label, value, disabled? }`             |
| `label`       | `string`            | —                    |                                           |
| `hint`        | `string`            | —                    | Helper text (hidden while an error shows) |
| `error`       | `string \| boolean` | —                    | String shows the message                  |
| `placeholder` | `string`            | `"Select an option"` | Shown when nothing is selected            |
| `multiple`    | `boolean`           | `false`              | `v-model` becomes `T[]`                   |
| `disabled`    | `boolean`           | `false`              |                                           |
| `maxHeight`   | `number`            | `288`                | Listbox max height (px), capped to 40vh   |
| `id`          | `string`            | auto                 | Override the generated id                 |

`SelectOption<T>` lives in `~/types/components.type`.

## Slots

| Slot      | Props                                          | Purpose                                                    |
| --------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `value`   | `{ selected: SelectOption<T>[], placeholder }` | Custom trigger content                                     |
| `option`  | `{ option, selected, active, index }`          | Custom option row                                          |
| `check`   | `{ selected }`                                 | Selected indicator (default `<UiIcon name="check" />`)     |
| `chevron` | —                                              | Trigger chevron (default `<UiIcon name="chevron-down" />`) |

## Styling hooks

`data-part="field" | "field-label" | "select-control" | "trigger" | "value" | "chevron" |
"listbox" | "option" | "option-check" | "option-label" | "field-message"`. State:
`data-field-error`, `data-select-open`, `data-select-error`, `data-select-placeholder`,
`data-select-drop-up="true|false"` (listbox), `data-select-active` (option). Plus
`aria-selected` / `aria-disabled` on options.

## Usage

```vue
<UiSelect v-model="fruit" label="Fruit" :options="fruitOptions" placeholder="Pick one" />
<UiSelect v-model="tags" label="Tags" multiple :options="tagOptions" />

<UiSelect v-model="status" :options="statusOptions">
  <template #value="{ selected }">…</template>
  <template #option="{ option, selected }">…</template>
</UiSelect>
```

## Notes

- Full keyboard support: arrows, Home/End, Enter/Space, Escape, Tab, type-ahead.
- The listbox is a manual popover in the top layer. It positions itself (flipping up when
  there's no room below) via inline styles — you supply the chrome. Motion is the
  `ui-select-pop` transition, reduced-motion gated.
- Picking actions rather than a value? Use [`UiMenu`](./menu.md).
