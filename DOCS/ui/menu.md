# UiMenu

Menu button (WAI-ARIA [menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
pattern): a button that opens a menu of actions. Auto-imported as `<UiMenu>` from
`app/components/ui/menu.vue`. Generic over the item value type `T extends string | number`.

## Props

| Prop        | Type                | Default  | Notes                                |
| ----------- | ------------------- | -------- | ------------------------------------ |
| `items`     | `SelectOption<T>[]` | `[]`     | `{ label, value, disabled? }`        |
| `label`     | `string`            | `"Menu"` | Default trigger text                 |
| `disabled`  | `boolean`           | `false`  | Disables the trigger                 |
| `maxHeight` | `number`            | `320`    | Max menu height (px), capped to 50vh |

Emits `select` with the chosen item's `value`. `SelectOption<T>` comes from
`~/types/components.type`.

## Slots

| Slot      | Props              | Purpose                                   |
| --------- | ------------------ | ----------------------------------------- |
| `trigger` | `{ isOpen }`       | Trigger content (the `<button>` is owned) |
| `item`    | `{ item, active }` | Custom item content                       |

## Styling hooks

`data-part="menu" | "menu-trigger" | "menu-list" | "menu-item"`. State:
`data-menu-open` (trigger), `data-menu-drop-up="true|false"` (list), `data-menu-active`
(item). Native `:disabled` is present on trigger and items.

## Usage

```vue
<UiMenu :items="actions" @select="run">
  <template #trigger>Actions <UiIcon name="chevron-down" /></template>
</UiMenu>

<!-- Custom trigger content -->
<UiMenu :items="actions" @select="run">
  <template #trigger="{ isOpen }">⋯</template>
</UiMenu>
```

## Notes

- Keyboard: Enter/Space/↓ open (focus first item), ↑ opens to the last; ↑/↓ + Home/End
  move; Enter/Space activate; Esc closes and returns focus to the trigger; Tab closes.
- The menu is a manual popover lifted into the top layer; it positions itself (flipping
  up when there's no room below) and animates via the `ui-menu-pop` transition.
- For a value picker (not actions), use [`UiSelect`](./select.md).
