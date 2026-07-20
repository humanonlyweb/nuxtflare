# UiCheckbox

Checkbox. Auto-imported as `<UiCheckbox>` from `app/components/ui/checkbox.vue`. Wraps a
native `<input type="checkbox">` (Space toggle, focus and form submission for free).

## Props

| Prop            | Type               | Default | Notes                                          |
| --------------- | ------------------ | ------- | ---------------------------------------------- |
| `label`         | `string`           | —       | Text label (or use the default slot)           |
| `value`         | `string \| number` | —       | Value contributed when `v-model` is an array   |
| `indeterminate` | `boolean`          | `false` | Visual mixed state (a DOM property, reflected) |
| `disabled`      | `boolean`          | `false` |                                                |
| `id`            | `string`           | auto    | Override the generated id                      |

`v-model` binds a `boolean` (single) or an array (checkbox group — native `v-model` adds
/ removes `value`). Unknown attributes (`name`, `required`, `true-value`…) fall through
to the input.

## Slots

| Slot        | Purpose                                   |
| ----------- | ----------------------------------------- |
| `default`   | Label content                             |
| `indicator` | Custom check glyph inside the control box |

## Styling hooks

`data-part="checkbox" | "checkbox-input" | "checkbox-control" | "checkbox-label"`; state
`data-checkbox-disabled` (label). Style the box from the input's native pseudo-classes —
`:checked`, `:indeterminate`, `:disabled`, `:focus-visible` — via the adjacent control:

```css
[data-part="checkbox-input"] { position: absolute; opacity: 0; width: 1px; height: 1px; }
[data-part="checkbox-input"]:checked + [data-part="checkbox-control"] { … }
[data-part="checkbox-input"]:indeterminate + [data-part="checkbox-control"] { … }
```

## Usage

```vue
<UiCheckbox v-model="accepted">I accept the terms</UiCheckbox>

<!-- Group + a “select all” with an indeterminate middle state -->
<UiCheckbox v-model="allChecked" :indeterminate="someChecked" label="Select all" />
<UiCheckbox v-for="o in options" :key="o" v-model="picked" :value="o" :label="o" />
```

## Notes

- `indeterminate` is a property, not an attribute, so it's reflected onto the element
  reactively — set it from a parent (e.g. a “select all” that's partially checked).
- For a single on/off toggle, [`UiSwitch`](./switch.md) is often the friendlier control.
