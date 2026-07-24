# UiMenu

A button that opens a menu of actions
([menu button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) pattern). Generic
over `T extends string | number`.

## Props

| Prop        | Type                | Default  | Notes                          |
| ----------- | ------------------- | -------- | ------------------------------ |
| `items`     | `SelectOption<T>[]` | `[]`     | `{ label, value, disabled? }`  |
| `label`     | `string`            | `"Menu"` | Default trigger text           |
| `disabled`  | `boolean`           | `false`  | Disables the trigger           |
| `maxHeight` | `number`            | `320`    | Menu max height (px), 50vh cap |

Emits `select` with the chosen item's `value`.

## Slots

| Slot      | Props              | Purpose                                   |
| --------- | ------------------ | ----------------------------------------- |
| `trigger` | `{ isOpen }`       | Trigger content (the `<button>` is owned) |
| `item`    | `{ item, active }` | Custom item content                       |

## Styling hooks

`data-part="menu" | "menu-trigger" | "menu-list" | "menu-item"`. State: `data-menu-open`
(trigger), `data-menu-drop-up="true|false"` (list), `data-menu-active` (item). Native
`:disabled` on trigger and items.

## Usage

```vue
<UiMenu :items="actions" @select="run">
  <template #trigger>Actions <UiIcon name="chevron-down" /></template>
</UiMenu>
```

## Notes

- Keyboard: Enter/Space/↓ open (focus first item), ↑ opens to the last; ↑/↓ + Home/End
  move; Enter/Space activate; Esc closes and returns focus; Tab closes.
- Manual popover in the top layer — positions itself (flipping up when there's no room)
  and animates via `ui-menu-pop`.
- Picking a value rather than an action? Use [`UiSelect`](./select.md).
